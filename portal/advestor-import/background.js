// background.js - Extensão Advestor Importer
// Todos os dados são lidos do HTML renderizado da página do anúncio
// (texto visível, atributos dos elementos e dados estruturados embutidos no HTML).
// A URL é usada apenas para abrir a página; nenhuma informação é extraída dela.

const CONFIG = {
  // Origens do sistema que podem chamar a extensão. Vazio = aceita qualquer origem.
  // Ex.: ['https://app.advestor.com.br']
  origensPermitidas: [],
  timeoutMs: 30000,
  // true = a extensão baixa as fotos e devolve cada uma como data URL (data:image/...;base64,...).
  // Use se as URLs chegam no sistema mas as imagens aparecem quebradas (bloqueio de hotlink do portal).
  fotosEmBase64: false,
  maxFotos: 20
};

// ==========================================================
// 1. RECEBIMENTO DA REQUISIÇÃO
// ==========================================================
chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  if (!request || request.action !== 'EXTRACT_PROPERTY') return;

  if (CONFIG.origensPermitidas.length && !CONFIG.origensPermitidas.includes(sender.origin)) {
    sendResponse({ success: false, offline: false, error: 'Origem não autorizada.' });
    return;
  }
  if (!/^https?:\/\//i.test(request.url || '')) {
    sendResponse({ success: false, offline: false, error: 'URL inválida.' });
    return;
  }

  extrairAnuncio(request.url)
    .then(data => sendResponse({ success: true, data }))
    .catch(err => sendResponse({
      success: false,
      offline: !!err.offline,
      error: err.message || 'Erro ao extrair dados do anúncio.'
    }));

  return true; // resposta assíncrona
});

// ==========================================================
// 2. ABERTURA DA ABA E INJEÇÃO DO EXTRATOR
// ==========================================================
function extrairAnuncio(url) {
  return new Promise((resolve, reject) => {
    let tabId = null;
    let encerrado = false;
    let injetando = false;

    // Listener registrado ANTES de criar a aba, para não perder o evento "complete"
    const aoAtualizar = (id, info) => {
      if (id === tabId && info.status === 'complete') injetar();
    };
    chrome.tabs.onUpdated.addListener(aoAtualizar);

    const timer = setTimeout(
      () => finalizar(new Error('Tempo limite excedido ao carregar a página.')),
      CONFIG.timeoutMs
    );

    chrome.tabs.create({ url, active: false })
      .then(tab => {
        tabId = tab.id;
        injetar(); // cobre o caso de a página já ter carregado (cache)
      })
      .catch(err => finalizar(err));

    async function injetar() {
      if (injetando || encerrado || tabId === null) return;

      let tab;
      try { tab = await chrome.tabs.get(tabId); } catch (e) { return; }
      if (tab.status !== 'complete' || !/^https?:/i.test(tab.url || '')) return;

      injetando = true;
      try {
        const [res] = await chrome.scripting.executeScript({
          target: { tabId },
          func: extrairDoHTML
        });
        const data = res && res.result;
        if (!data) throw new Error('Não foi possível ler o HTML da página.');
        if (data.offline) {
          const e = new Error(data.error);
          e.offline = true;
          throw e;
        }
        if (CONFIG.fotosEmBase64 && Array.isArray(data.fotos)) {
          data.fotos = await baixarFotos(data.fotos.slice(0, CONFIG.maxFotos));
        }
        finalizar(null, data);
      } catch (e) {
        // A página redirecionou durante a leitura: espera o próximo "complete"
        if (/frame|removed|navigat|no tab/i.test(e.message || '') && !e.offline) {
          injetando = false;
          return;
        }
        finalizar(e);
      }
    }

    async function finalizar(err, data) {
      if (encerrado) return;
      encerrado = true;
      clearTimeout(timer);
      chrome.tabs.onUpdated.removeListener(aoAtualizar);
      if (tabId !== null) {
        try { await chrome.tabs.remove(tabId); } catch (e) {}
      }
      if (err) reject(err);
      else resolve(data);
    }
  });
}

// Baixa as fotos pela própria extensão (exige host_permissions do servidor de imagens)
async function baixarFotos(urls) {
  const saida = [];
  for (const u of urls) {
    try {
      const resp = await fetch(u, { credentials: 'omit' });
      if (!resp.ok) continue;
      const tipo = resp.headers.get('content-type') || 'image/jpeg';
      if (!tipo.startsWith('image/')) continue;
      const bytes = new Uint8Array(await resp.arrayBuffer());
      let bin = '';
      for (let i = 0; i < bytes.length; i += 0x8000) {
        bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
      }
      saida.push(`data:${tipo};base64,${btoa(bin)}`);
    } catch (e) {}
  }
  return saida;
}

// ==========================================================
// 3. EXTRATOR — EXECUTADO DENTRO DA PÁGINA DO ANÚNCIO
// (função autocontida: não pode usar nada definido fora dela)
// ==========================================================
async function extrairDoHTML() {
  const esperar = ms => new Promise(r => setTimeout(r, ms));
  const limpar = s => String(s || '').replace(/\s+/g, ' ').trim();

  function paraNumero(v) {
    if (typeof v === 'number') return isFinite(v) ? v : 0;
    let s = String(v || '').replace(/[^\d.,]/g, '');
    if (!s) return 0;
    if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');      // 1.500.000,00
    else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');     // 1.500.000
    const n = parseFloat(s);
    return isFinite(n) ? n : 0;
  }

  function visivel(el) {
    return !!(el && (el.offsetWidth || el.offsetHeight || el.getClientRects().length));
  }

  // ---------- 3.1 Espera o conteúdo principal renderizar ----------
  const inicio = Date.now();
  while (Date.now() - inicio < 12000) {
    const texto = document.body ? document.body.innerText : '';
    if (document.querySelector('h1') && /R\$\s*\d/.test(texto)) break;
    await esperar(400);
  }

  // Rola a página para disparar o carregamento de imagens lazy
  try {
    const passo = Math.max(window.innerHeight, 600);
    const altura = Math.min(document.body.scrollHeight, passo * 15);
    for (let y = 0; y < altura; y += passo) {
      window.scrollTo(0, y);
      await esperar(150);
    }
    window.scrollTo(0, 0);
    await esperar(600);
  } catch (e) {}

  // ---------- 3.2 Detecção de anúncio fora do ar ----------
  const TERMOS_OFFLINE = [
    'vendido/alugado ou está indisponível',
    'este imóvel não está mais disponível',
    'imóvel indisponível',
    'anúncio desativado',
    'anúncio pausado',
    'anúncio finalizado',
    'ops! não encontramos o imóvel',
    'imóvel já foi alugado',
    'imóvel já foi vendido',
    'página não encontrada'
  ];
  const cabecalho = (
    document.title + ' ' +
    Array.from(document.querySelectorAll('h1, h2, [role="alert"]'))
      .slice(0, 6).map(e => e.innerText).join(' ')
  ).toLowerCase();
  const offlineNoCabecalho = TERMOS_OFFLINE.some(t => cabecalho.includes(t));

  // ---------- 3.3 Isola o anúncio principal ----------
  // Esconde blocos que não pertencem ao anúncio (menus, rodapé, similares, cards de outros imóveis).
  // A aba é descartável, então alterar o DOM aqui não tem efeito colateral.
  const raiz = document.querySelector('main') || document.body;
  const ocultar = el => {
    if (!el || !el.style) return;
    el.setAttribute('data-advestor-fora', '1'); // marca para não usar as fotos desse bloco
    el.style.setProperty('display', 'none', 'important');
  };

  document.querySelectorAll(
    'header, footer, nav, aside, [role="dialog"], ' +
    '[class*="similar" i], [class*="recommend" i], [data-testid*="similar" i], [data-testid*="recommend" i]'
  ).forEach(el => {
    if (el === raiz || el.contains(raiz)) return;
    // header e aside saem do texto, mas as fotos deles continuam valendo (alguns portais põem a galeria ali)
    const manterFotos = el.matches('header, aside');
    ocultar(el);
    if (manterFotos) el.removeAttribute('data-advestor-fora');
  });

  document.querySelectorAll('h2, h3, h4').forEach(h => {
    if (/similares|semelhantes|voc[êe] tamb[ée]m|recomendad|outros im[óo]veis|im[óo]veis (pr[óo]ximos|parecidos)|veja tamb[ée]m/i.test(h.innerText)) {
      const sec = h.closest('section') || h.parentElement;
      if (sec && sec !== raiz && sec !== document.body) ocultar(sec);
    }
  });

  // Cards de outros anúncios: links com imagem e preço que não contêm o título principal
  document.querySelectorAll('a[href]').forEach(a => {
    if (a.querySelector('img') && /R\$\s*\d/.test(a.innerText) && !a.querySelector('h1')) ocultar(a);
  });

  const textoPrincipal = raiz.innerText || '';
  const linhas = textoPrincipal.split('\n').map(limpar).filter(Boolean);
  const curtas = linhas.filter(l => l.length <= 40);

  // ---------- 3.4 Funções de leitura do texto visível ----------
  function valorAposRotulo(rotulo, distancia = 2) {
    for (let i = 0; i < linhas.length; i++) {
      if (linhas[i].length > 60 || !rotulo.test(linhas[i])) continue;
      for (let j = i; j <= Math.min(i + distancia, linhas.length - 1); j++) {
        const m = linhas[j].match(/R\$\s*([\d.]+(?:,\d{1,2})?)/);
        if (m) return paraNumero(m[1]);
      }
    }
    return 0;
  }

  function primeiroMatch(lista, regexes) {
    for (const re of regexes) {
      for (const l of lista) {
        const m = l.match(re);
        if (m) return m;
      }
    }
    return null;
  }

  function primeiroVisivel(seletor) {
    return Array.from(document.querySelectorAll(seletor)).find(visivel) || null;
  }

  function parseEndereco(txt) {
    txt = limpar(txt).replace(/^endere[çc]o:?\s*/i, '');
    // "Rua X, 123 - Bairro, Cidade - UF"  ou  "Rua X - Bairro, Cidade - UF"
    let m = txt.match(/^(.+?)(?:,\s*\d+[\w/-]*)?\s+-\s+([^,]+),\s*[^,]+?\s*-\s*[A-Z]{2}\b/);
    if (m) return { rua: limpar(m[1]), bairro: limpar(m[2]) };
    // "Bairro, Cidade - UF"
    m = txt.match(/^([^,]+),\s*[^,]+?\s*-\s*[A-Z]{2}\b/);
    if (m && !/^(rua|r\.|avenida|av\.?|estrada|travessa|pra[çc]a|largo|alameda|ladeira|rodovia)\s/i.test(m[1])) {
      return { rua: '', bairro: limpar(m[1]) };
    }
    // "Rua X, 123 - Bairro"  (sem cidade)
    m = txt.match(/^(.+?)(?:,\s*\d+[\w/-]*)?\s+-\s+([^,\d][^,]*)$/);
    if (m) return { rua: limpar(m[1]), bairro: limpar(m[2]) };
    // "Rua X, Bairro, Cidade"  ou  "Rua X, 123, Bairro, Cidade"
    m = txt.match(/^((?:rua|r\.|avenida|av\.?|estrada|travessa|pra[çc]a|largo|alameda|ladeira|rodovia)\s[^,]+)(?:,\s*\d+[\w/-]*)?,\s*([^,\d][^,]*),/i);
    if (m) return { rua: limpar(m[1]), bairro: limpar(m[2]) };
    return null;
  }

  const result = {
    offline: false,
    bairro: '',
    rua: '',
    area: 0,
    precoPedido: 0,
    quartos: '',
    vagas: '',
    andar: '',
    posicao: '',
    condominio: 0,
    iptu: 0,
    anoPredio: '',
    fotos: []
  };

  // ---------- 3.5 Endereço (rua e bairro) ----------
  const elEndereco = primeiroVisivel(
    '[itemprop="address"], [data-testid*="address" i], [class*="address" i], [class*="location-info" i], .property-address'
  );
  let endereco = elEndereco ? parseEndereco(elEndereco.innerText) : null;

  if (!endereco) {
    const linhaRua = linhas.find(l =>
      l.length < 160 &&
      /^(rua|r\.|avenida|av\.?|estrada|travessa|tv\.|pra[çc]a|largo|alameda|ladeira|rodovia|via)\s/i.test(l) &&
      /-\s*[A-Z]{2}\b/.test(l)
    );
    if (linhaRua) endereco = parseEndereco(linhaRua);
  }
  if (endereco) {
    result.rua = endereco.rua;
    result.bairro = endereco.bairro;
  }

  // Bairro pelo título do anúncio (<h1>) ou <title>: "... à venda em Copacabana, Rio de Janeiro"
  if (!result.bairro) {
    const h1 = document.querySelector('h1');
    const fontes = [h1 ? h1.innerText : '', document.title];
    for (const f of fontes) {
      const m = limpar(f).match(/\b(?:em|no|na)\s+([A-ZÀ-Ú][^,|]+?),\s*[A-ZÀ-Ú]/);
      if (m) { result.bairro = limpar(m[1]); break; }
    }
  }

  // ---------- 3.6 Valores (preço, condomínio, IPTU) ----------
  result.precoPedido = valorAposRotulo(/^(venda|valor de venda|pre[çc]o( de venda)?|valor)\b/i);
  result.condominio = valorAposRotulo(/^condom[íi]nio\b/i);
  result.iptu = valorAposRotulo(/^iptu\b/i);

  if (!result.precoPedido) {
    for (let i = 0; i < linhas.length; i++) {
      const l = linhas[i];
      if (!/^R\$\s*\d/.test(l) || /\/\s*m[êe]s/i.test(l)) continue;
      const anterior = (linhas[i - 1] || '').toLowerCase();
      if (/condom|iptu|aluguel|m[êe]s|taxa|seguro/.test(anterior)) continue;
      const m = l.match(/R\$\s*([\d.]+(?:,\d{1,2})?)/);
      if (m) { result.precoPedido = paraNumero(m[1]); break; }
    }
  }

  // ---------- 3.7 Características (área, quartos, vagas, andar, ano, posição) ----------
  const elArea = primeiroVisivel('[itemprop="floorSize"]');
  if (elArea) result.area = paraNumero((elArea.innerText.match(/[\d.,]+/) || [])[0]);
  if (!result.area) {
    const m = textoPrincipal.match(/[áa]rea (?:[úu]til|privativa)\D{0,15}([\d.]+(?:,\d+)?)\s*m/i)
      || primeiroMatch(curtas, [/^([\d.]+(?:,\d+)?)\s*m[²2]\b/i, /^[áa]rea[^:]*:?\s*([\d.]+(?:,\d+)?)\s*m/i]);
    if (m) result.area = paraNumero(m[1]);
  }

  const elQuartos = primeiroVisivel('[itemprop="numberOfRooms"], [itemprop="numberOfBedrooms"]');
  let mQ = elQuartos ? elQuartos.innerText.match(/(\d+)/) : null;
  if (!mQ) mQ = primeiroMatch(curtas, [/^(\d+)\s*(?:quartos?|dormit[óo]rios?|qts?)\b/i, /^(?:quartos|dormit[óo]rios)\s*:?\s*(\d+)/i]);
  if (mQ) result.quartos = `${mQ[1]} Qts`;

  const elVagas = primeiroVisivel('[itemprop="numberOfParkingSpaces"]');
  let mV = elVagas ? elVagas.innerText.match(/(\d+)/) : null;
  if (!mV) mV = primeiroMatch(curtas, [/^(\d+)\s*vagas?\b/i, /^vagas?\s*:?\s*(\d+)/i]);
  if (mV) result.vagas = `${mV[1]} Vagas`;
  else if (curtas.some(l => /^(sem vaga|n[ãa]o (possui|tem) vaga)/i.test(l))) result.vagas = 'Sem vaga';

  const elAndar = primeiroVisivel('[itemprop="floorLevel"]');
  let mA = elAndar ? elAndar.innerText.match(/(\d+)/) : null;
  if (!mA) mA = primeiroMatch(curtas, [/^(\d+)\s*[ºo°]?\s*andar\b/i, /^andar\s*:?\s*(\d+)/i]);
  if (mA) result.andar = `${mA[1]}º Andar`;
  else if (curtas.some(l => /^t[ée]rreo$/i.test(l))) result.andar = 'Térreo';

  const mAno = textoPrincipal.match(/(?:ano de constru[çc][ãa]o|constru[íi]do em|ano do pr[ée]dio|ano de entrega)\D{0,15}((?:19|20)\d{2})/i);
  if (mAno) result.anoPredio = mAno[1];

  const mPos = textoPrincipal.match(/posi[çc][ãa]o\s*:?\s*(frente|fundos|lateral|meio)/i)
    || textoPrincipal.match(/\b(?:de|para a)\s+(frente|fundos)\b/i);
  if (mPos) result.posicao = mPos[1].charAt(0).toUpperCase() + mPos[1].slice(1).toLowerCase();

  // ---------- 3.8 Dados estruturados embutidos no HTML (preenchem só o que faltou) ----------
  const preencher = (campo, valor) => {
    if (valor === undefined || valor === null || valor === '') return;
    if (!result[campo]) result[campo] = valor;
  };
  const fotosEstruturadas = [];

  // JSON-LD (Schema.org)
  document.querySelectorAll('script[type="application/ld+json"]').forEach(sc => {
    try {
      const parsed = JSON.parse(sc.textContent);
      const itens = Array.isArray(parsed) ? parsed : (parsed['@graph'] || [parsed]);
      itens.forEach(it => {
        if (!it || typeof it !== 'object') return;
        const ad = it.address || {};
        preencher('rua', ad.streetAddress && limpar(ad.streetAddress).split(',')[0]);
        preencher('bairro', ad.addressNeighborhood);
        if (it.floorSize) preencher('area', paraNumero(it.floorSize.value ?? it.floorSize));
        if (it.numberOfRooms || it.numberOfBedrooms) preencher('quartos', `${paraNumero(it.numberOfBedrooms || it.numberOfRooms)} Qts`);
        if (it.offers && it.offers.price) preencher('precoPedido', paraNumero(it.offers.price));
        if (it.yearBuilt) preencher('anoPredio', String(it.yearBuilt));
        [].concat(it.image || []).forEach(im => {
          const u = typeof im === 'string' ? im : (im && (im.url || im.contentUrl));
          if (u) fotosEstruturadas.push(u);
        });
      });
    } catch (e) {}
  });

  // __NEXT_DATA__ (ZAP, VivaReal, QuintoAndar e outros sites em Next.js)
  try {
    const nextEl = document.getElementById('__NEXT_DATA__');
    if (nextEl) {
      const json = JSON.parse(nextEl.textContent);
      const candidatos = [];
      (function varrer(obj, prof) {
        if (!obj || typeof obj !== 'object' || prof > 10) return;
        if (!Array.isArray(obj) && (obj.usableAreas || obj.pricingInfos || obj.salePrice)) {
          candidatos.push({ obj, prof });
        }
        for (const k in obj) varrer(obj[k], prof + 1);
      })(json, 0);

      const precoVenda = c => {
        const pi = Array.isArray(c.pricingInfos) ? c.pricingInfos : [];
        const venda = pi.find(p => p.businessType === 'SALE') || pi[0] || {};
        return { venda, preco: paraNumero(venda.price || c.salePrice || 0) };
      };

      // Escolhe o anúncio cujo preço bate com o preço visível; senão, o mais raso na árvore
      let principal = null;
      if (result.precoPedido) {
        principal = candidatos.find(c => precoVenda(c.obj).preco === result.precoPedido);
      }
      if (!principal && candidatos.length) {
        principal = candidatos.sort((a, b) => a.prof - b.prof)[0];
      }

      if (principal) {
        const l = principal.obj;
        const { venda, preco } = precoVenda(l);
        const ad = l.address || {};
        preencher('rua', ad.street);
        preencher('bairro', ad.neighborhood);
        preencher('area', paraNumero((l.usableAreas || [])[0] || (l.totalAreas || [])[0] || l.area || 0));
        preencher('precoPedido', preco);
        preencher('condominio', paraNumero(venda.monthlyCondoFee || venda.condoFee || l.condoFee || 0));
        preencher('iptu', paraNumero(venda.yearlyIptu || venda.iptu || l.iptu || 0));

        const q = Array.isArray(l.bedrooms) ? l.bedrooms[0] : l.bedrooms;
        if (q !== undefined && q !== null) preencher('quartos', `${q} Qts`);
        const v = Array.isArray(l.parkingSpaces) ? l.parkingSpaces[0] : l.parkingSpaces;
        if (v !== undefined && v !== null) preencher('vagas', v === 0 ? 'Sem vaga' : `${v} Vagas`);
        const an = l.unitFloor ?? l.floor;
        if (an !== undefined && an !== null && an !== '') preencher('andar', Number(an) === 0 ? 'Térreo' : `${an}º Andar`);
        preencher('anoPredio', l.constructionYear || l.yearBuilt ? String(l.constructionYear || l.yearBuilt) : '');

        (l.medias || l.images || l.photos || []).forEach(im => {
          if (im && typeof im === 'object' && /video/i.test(im.type || '')) return;
          const u = typeof im === 'string' ? im : (im && (im.url || im.imageUrl));
          if (u) fotosEstruturadas.push(u);
        });
      }
    }
  } catch (e) {}

  // ---------- 3.9 Fotos ----------
  // As fotos são lidas de três lugares do HTML, em ordem de confiança:
  //   1) galeria/carrossel do anúncio e dados estruturados;
  //   2) demais imagens do anúncio (fora dos blocos de similares);
  //   3) URLs de imagem escritas no código-fonte HTML (pega fotos que ainda não foram renderizadas).
  const ehLixo = u => /logo|icon|avatar|pixel|blank|spinner|badge|sprite|placeholder|tracking|banner|favicon|selo|marca-dagua/i.test(u);
  const pareceFoto = u => /\.(jpe?g|webp|png|avif)(\?|#|$)|resizedimgs|\/(crop|fit-in)\/\d+x\d+\//i.test(u);
  const absoluta = u => { try { return new URL(String(u).trim(), location.href).href; } catch (e) { return ''; } };
  const maiorDoSrcset = s => {
    const op = String(s).split(',').map(p => p.trim().split(/\s+/)).filter(p => p[0]);
    op.sort((a, b) => (parseFloat(b[1]) || 0) - (parseFloat(a[1]) || 0));
    return op.length ? op[0][0] : '';
  };
  // Mantém a URL exatamente como está no HTML do anúncio.
  // Só completa os modelos "{action}/{width}x{height}" que vêm nos dados estruturados,
  // porque esses não são URLs válidas até receberem um tamanho.
  const altaResolucao = u => u
    .replace('{action}/{width}x{height}', 'crop/800x600')
    .replace('{action}', 'crop')
    .replace('{width}x{height}', '800x600');

  const SEL_GALERIA = '[class*="carousel" i], [class*="gallery" i], [class*="galeria" i], [class*="slider" i], ' +
    '[class*="swiper" i], [class*="photo" i], [class*="foto" i], [class*="media" i], ' +
    '[data-testid*="gallery" i], [data-testid*="carousel" i], [data-testid*="photo" i], [data-testid*="media" i]';
  const ATRIBUTOS = ['src', 'data-src', 'data-lazy', 'data-lazy-src', 'data-original', 'data-url',
    'data-image', 'data-full', 'data-zoom-image', 'data-bg', 'data-background', 'href'];

  const daGaleria = [];
  const doDom = [];
  const doCodigo = [];

  document.querySelectorAll('img, picture source, [style*="background"], a[href$=".jpg" i], a[href$=".jpeg" i], a[href$=".webp" i]').forEach(el => {
    if (el.closest('[data-advestor-fora]')) return; // similares, cards, menus
    if (el.tagName === 'IMG' && el.complete && el.naturalWidth > 0 && el.naturalWidth < 120) return; // ícones

    const urls = [];
    ATRIBUTOS.forEach(a => { const v = el.getAttribute(a); if (v && !v.startsWith('data:')) urls.push(v); });
    ['srcset', 'data-srcset'].forEach(a => { const v = el.getAttribute(a); if (v) urls.push(maiorDoSrcset(v)); });
    if (el.tagName === 'IMG' && el.currentSrc && !el.currentSrc.startsWith('data:')) urls.push(el.currentSrc);
    const bg = (el.getAttribute('style') || '').match(/url\(\s*["']?([^"')]+)["']?\s*\)/i);
    if (bg) urls.push(bg[1]);

    (el.closest(SEL_GALERIA) ? daGaleria : doDom).push(...urls);
  });

  document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"], link[rel="image_src"], link[rel="preload"][as="image"]')
    .forEach(el => { const v = el.getAttribute('content') || el.getAttribute('href'); if (v) doDom.unshift(v); });

  try {
    const fonte = document.documentElement.innerHTML
      .replace(/\\u002F/gi, '/')
      .replace(/\\\//g, '/')
      .replace(/&amp;/g, '&');
    const reUrl = /https?:\/\/[^\s"'<>()\\,]+?\.(?:jpe?g|webp|png|avif)(?:\?[^\s"'<>()\\]*)?|https?:\/\/resizedimgs\.[^\s"'<>()\\,]+/gi;
    (fonte.match(reUrl) || []).forEach(u => doCodigo.push(u));
  } catch (e) {}

  const normalizar = lista => lista
    .map(absoluta)
    .filter(u => /^https?:/.test(u) && !ehLixo(u) && pareceFoto(u))
    .map(altaResolucao);

  let todas = normalizar(fotosEstruturadas.concat(daGaleria));
  if (todas.length < 3) todas = todas.concat(normalizar(doDom));
  if (todas.length < 3) todas = todas.concat(normalizar(doCodigo));

  // Mantém só o servidor de imagens mais usado (o CDN das fotos do anúncio)
  const contagem = {};
  todas.forEach(u => { const h = new URL(u).hostname; contagem[h] = (contagem[h] || 0) + 1; });
  const hostPrincipal = Object.keys(contagem).sort((a, b) => contagem[b] - contagem[a])[0];
  if (hostPrincipal && contagem[hostPrincipal] >= 3) {
    todas = todas.filter(u => new URL(u).hostname === hostPrincipal);
  }

  // Remove duplicadas (mesma foto em tamanhos diferentes), mantendo a primeira URL encontrada
  const vistas = new Set();
  result.fotos = todas.filter(u => {
    const chave = u.replace(/\/(crop|fit-in)\/\d+x\d+\//, '/').split(/[?#]/)[0];
    if (vistas.has(chave)) return false;
    vistas.add(chave);
    return true;
  }).slice(0, 30);

  const diagFotos = {
    estruturadas: fotosEstruturadas.length,
    galeria: daGaleria.length,
    restoDoAnuncio: doDom.length,
    codigoFonte: doCodigo.length,
    servidor: hostPrincipal || '',
    final: result.fotos.length
  };

  // ---------- 3.10 Validação do bairro ----------
  const NAO_BAIRRO = /^(com|br|www|net|org|rj|sp|im[óo]vel|im[óo]veis|venda|aluguel|apartamento|casa|cobertura|kitnet|studio|quartos?|rio de janeiro|s[ãa]o paulo|brasil|zona \w+)$/i;
  const bairroInvalido = b => !b || b.length < 3 || NAO_BAIRRO.test(b) || /^\d/.test(b) || /^com\s/i.test(b) || /\.(com|br)\b/i.test(b);

  if (bairroInvalido(result.bairro)) {
    result.bairro = '';
    // Última tentativa: linha do tipo "Flamengo, Rio de Janeiro"
    const m = primeiroMatch(linhas.filter(l => l.length < 80), [
      /^([A-ZÀ-Ú][A-Za-zÀ-ú' .]+?),\s*(?:Rio de Janeiro|Niter[óo]i|S[ãa]o Paulo)\b/
    ]);
    if (m && !bairroInvalido(m[1])) result.bairro = limpar(m[1]);
  }

  // Diagnóstico: mostra de onde o endereço foi lido (pode remover depois de validar)
  const h1Diag = document.querySelector('h1');
  result._debug = {
    enderecoBruto: elEndereco ? limpar(elEndereco.innerText) : '',
    h1: h1Diag ? limpar(h1Diag.innerText) : '',
    titulo: document.title,
    fotos: diagFotos
  };

  // ---------- 3.11 Confirmação de anúncio fora do ar ----------
  const semDados = !result.precoPedido && !result.area;
  if (offlineNoCabecalho || (semDados && TERMOS_OFFLINE.some(t => textoPrincipal.toLowerCase().includes(t)))) {
    return {
      offline: true,
      error: 'O imóvel desta página foi vendido, alugado ou está indisponível no portal de origem.'
    };
  }

  return result;
}
