const EXTENSION_ID = "jligoclfehhgnloojkcjpnaokocgccne";

const urlParams = new URLSearchParams(window.location.search);
const currentClientId = parseInt(urlParams.get('client_id')) || 1;
const STORAGE_KEY = `advestor_portal_data_${currentClientId}`;

// VARIÁVEIS DE ESTADO DO MODAL DE EDIÇÃO
let currentEditingProperty = null;
let currentPhotos = [];
let currentPontosFortes = [];
let currentPontosAtencao = [];
let currentHistorico = [];
let currentDocumentos = [];
let isFormDirty = false;

// DADOS DE RESERVA PADRÃO ADVESTOR
const DEFAULT_DATA = {
  cliente: {
    nome: "João Exemplo",
    criterios: "Flamengo, Botafogo, Copacabana, Laranjeiras, Catete · R$ 350k - R$ 900k · 25 a 90 m²"
  },
  imoveis: [
    {
      id: 1,
      codigo: "ADV-FLA26",
      bairro: "Flamengo",
      rua: "Rua Marquês de Abrantes",
      area: 26,
      precoPedido: 370000,
      propostaAceita: 365000,
      precoM2Regiao: 11692,
      status: "Aguardando sua decisão",
      alerta: "REQUER SUA AÇÃO",
      proximoPasso: "O vendedor aceitou sua proposta de R$ 365.000. Precisamos da sua decisão até 06/11/2026.",
      motivoDescarte: "",
      quartos: "1 Qto",
      vagas: "Sem vaga",
      andar: "3º Andar",
      posicao: "Fundos",
      condominio: "R$ 650",
      iptu: "R$ 1.200",
      anoPredio: "1965",
      fotos: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80"
      ],
      pontosFortes: [
        "Localização a uma quadra do metrô Flamengo;",
        "Valor negociado abaixo da maior venda do prédio nos últimos 2 anos (R$ 370 mil);",
        "Prédio bem administrado com portaria 24 horas e elevadores reformados."
      ],
      pontosAtencao: [
        "Apartamento de fundos com vista interna;",
        "Necessidade de reforma geral em elétrica e hidráulica;",
        "Preço do m² acima da média do bairro devido à metragem compacta."
      ],
      historico: [
        { data: "04/11/2026", descricao: "Vendedor aceitou a proposta formalizada de R$ 365.000." },
        { data: "31/10/2026", descricao: "Contraproposta de R$ 365.000 enviada ao proprietário." },
        { data: "28/10/2026", descricao: "Proposta inicial enviada no valor de R$ 355.000." }
      ],
      documentos: [
        { id: 1, tipo: "PDF", nome: "Matrícula do imóvel (RGI)", data: "03/11/2026", tamanho: "2.4 MB", url: "#" },
        { id: 2, tipo: "PDF", nome: "Certidões fiscais do vendedor", data: "02/11/2026", tamanho: "1.1 MB", url: "#" },
        { id: 3, tipo: "PDF", nome: "Laudo de vistoria técnica preliminar", data: "26/10/2026", tamanho: "4.8 MB", url: "#" }
      ]
    }
  ]
};

// ==========================================
// 1. GESTÃO DO LOCALSTORAGE
// ==========================================
function getStoredData() {
  const specificData = localStorage.getItem(STORAGE_KEY);
  if (specificData) {
    try { return JSON.parse(specificData); } catch(e) {}
  }
  
  if (currentClientId === 1) {
    const legacy = localStorage.getItem('advestor_portal_data');
    if (legacy) {
      try { return JSON.parse(legacy); } catch(e) {}
    }
  }

  return DEFAULT_DATA;
}

function saveStoredData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  if (currentClientId === 1) {
    localStorage.setItem('advestor_portal_data', JSON.stringify(data));
  }
  updateClientTotalPropertiesCount(data.imoveis.length);
  renderTable();
}

function updateClientTotalPropertiesCount(count) {
  const reg = localStorage.getItem('advestor_clients_registry');
  if (reg) {
    try {
      const clients = JSON.parse(reg);
      const c = clients.find(item => item.id === currentClientId);
      if (c) {
        c.totalImoveis = count;
        localStorage.setItem('advestor_clients_registry', JSON.stringify(clients));
      }
    } catch(e) {}
  }
}

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
  loadActiveClientInfo();
  renderTable();
  setupDragAndDrop();
});

function loadActiveClientInfo() {
  const reg = localStorage.getItem('advestor_clients_registry');
  if (reg) {
    try {
      const clients = JSON.parse(reg);
      const client = clients.find(item => item.id === currentClientId);
      if (client) {
        const nameEl = document.getElementById('client-name');
        const critEl = document.getElementById('client-criteria');
        if (nameEl) nameEl.innerText = client.nome;
        if (critEl) critEl.innerText = `${client.bairros} · ${client.orcamento || ''} · ${client.especificacoes || ''}`;
        return;
      }
    } catch(e) {}
  }
}

// ==========================================
// 2. RENDERIZAÇÃO DA TABELA PRINCIPAL (ADMIN)
// ==========================================
function renderTable() {
  const data = getStoredData();
  const tbody = document.getElementById('properties-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  const countEl = document.getElementById('total-count');
  if (countEl) countEl.innerText = data.imoveis.length;

  if (data.imoveis.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="px-6 py-12 text-center text-gray-400 text-xs">
          Nenhum imóvel em acompanhamento cadastrado para este cliente.
        </td>
      </tr>
    `;
    return;
  }

  data.imoveis.forEach(prop => {
    const tr = document.createElement('tr');
    tr.className = "hover:bg-gray-50/80 transition border-b";

    let statusColor = "bg-gray-100 text-gray-700";
    if (prop.status === "Aguardando sua decisão") statusColor = "bg-amber-100 text-amber-900 border border-amber-300";
    if (prop.status === "Visita agendada") statusColor = "bg-sky-100 text-sky-800";
    if (prop.status === "Proposta enviada") statusColor = "bg-blue-100 text-blue-800";
    if (prop.status === "Contraproposta") statusColor = "bg-orange-100 text-orange-800";
    if (prop.status === "Em análise") statusColor = "bg-slate-200 text-slate-800";
    if (prop.status === "Descartado") statusColor = "bg-red-100 text-red-800";
    if (prop.status === "Fechado") statusColor = "bg-emerald-100 text-emerald-800";

    const precoNum = typeof prop.precoPedido === 'number' ? prop.precoPedido : parseFloat(prop.precoPedido) || 0;
    const valorFormatado = precoNum > 0 ? ("R$ " + Math.round(precoNum).toLocaleString('pt-BR')) : "—";
    
    let propostaFormatada = "";
    if (prop.propostaAceita) {
      const propNum = typeof prop.propostaAceita === 'number' ? prop.propostaAceita : parseFloat(prop.propostaAceita) || 0;
      if (propNum > 0) {
        propostaFormatada = `<div class="text-[11px] text-emerald-700 font-bold mt-0.5">Proposta: R$ ${Math.round(propNum).toLocaleString('pt-BR')}</div>`;
      }
    }

    const firstMedia = (prop.fotos && prop.fotos.length > 0) ? prop.fotos[0] : '';
    const parsed = parseMediaItem(firstMedia);

    tr.innerHTML = `
      <td class="px-6 py-4">
        <div class="flex items-center gap-3">
          ${parsed.thumb ? `
            <img 
              src="${parsed.thumb}" 
              alt="${prop.bairro || 'Imóvel'}" 
              class="w-12 h-12 rounded-lg object-cover shrink-0 border border-gray-200 bg-gray-100"
              onerror="this.style.display='none'"
            >
          ` : `
            <div class="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center text-gray-400">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/></svg>
            </div>
          `}
          <div>
            <div class="font-bold text-gray-900 text-sm">${prop.bairro || 'Sem bairro'}</div>
            <div class="text-xs text-gray-500">${prop.rua || 'Endereço não informado'} · ${prop.area ? prop.area + ' m²' : '—'}</div>
          </div>
        </div>
      </td>

      <td class="px-6 py-4">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${statusColor}">
          ${prop.status}
        </span>
      </td>

      <td class="px-6 py-4">
        <div class="text-xs font-bold text-gray-800">${valorFormatado}</div>
        ${propostaFormatada}
      </td>

      <td class="px-6 py-4 text-xs text-gray-600 max-w-xs">
        ${prop.status === 'Descartado' 
          ? `<span class="text-red-600 font-bold">Descartado:</span> <span class="text-red-700">${prop.motivoDescarte || 'Critérios não atendidos'}</span>` 
          : `<span class="line-clamp-2">${prop.proximoPasso || '—'}</span>`
        }
      </td>

      <td class="px-6 py-4 text-right space-x-2 whitespace-nowrap">
        <button onclick="editProperty(${prop.id})" class="text-xs font-bold text-advestor-teal hover:underline cursor-pointer">Editar</button>
        <button onclick="deleteProperty(${prop.id})" class="text-xs font-bold text-red-600 hover:underline cursor-pointer">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ==========================================
// 3. ESTADO DINÂMICO DO BOTÃO "SALVAR"
// ==========================================
function markFormDirty() {
  isFormDirty = true;
  updateSaveButtonsState();
}

function markFormClean() {
  isFormDirty = false;
  updateSaveButtonsState();
}

function updateSaveButtonsState() {
  const btnHeader = document.getElementById('btn-save-header');
  const btnFicha = document.getElementById('btn-save-ficha');
  const btnFooter = document.getElementById('btn-save-footer');

  const buttons = [btnHeader, btnFicha, btnFooter].filter(Boolean);

  buttons.forEach(btn => {
    if (isFormDirty) {
      btn.classList.remove('bg-gray-300', 'hover:bg-gray-400', 'text-gray-700');
      btn.classList.add('bg-emerald-600', 'hover:bg-emerald-700', 'text-white', 'shadow-md');
    } else {
      btn.classList.remove('bg-emerald-600', 'hover:bg-emerald-700', 'text-white', 'shadow-md');
      btn.classList.add('bg-gray-300', 'hover:bg-gray-400', 'text-gray-700');
    }
  });
}

// ==========================================
// 4. ABERTURA E PREENCHIMENTO DO MODAL EDITOR
// ==========================================
function openModalProperty(prop = null) {
  currentEditingProperty = prop;

  // CORREÇÃO: Quando for Novo Imóvel (prop === null), inicializa 100% LIMPO sem mockups!
  currentPhotos = prop && prop.fotos ? [...prop.fotos] : [];
  currentPontosFortes = prop && prop.pontosFortes ? [...prop.pontosFortes] : [];
  currentPontosAtencao = prop && prop.pontosAtencao ? [...prop.pontosAtencao] : [];
  currentHistorico = prop && prop.historico ? JSON.parse(JSON.stringify(prop.historico)) : [];
  currentDocumentos = prop && prop.documentos ? JSON.parse(JSON.stringify(prop.documentos)) : [];

  // Limpa campos da importação
  document.getElementById('import-url').value = "";
  const importStatus = document.getElementById('import-status');
  if (importStatus) {
    importStatus.classList.add('hidden');
    importStatus.innerText = "";
  }

  // Preenchimento dos Campos Básicos - Totalmente limpos se for novo
  document.getElementById('prop-id').value = prop ? prop.id : "";
  document.getElementById('prop-codigo').value = prop && prop.codigo ? prop.codigo : `ADV-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  document.getElementById('prop-bairro').value = prop && prop.bairro ? prop.bairro : "";
  document.getElementById('prop-rua').value = prop && prop.rua ? prop.rua : "";
  document.getElementById('prop-area').value = prop && prop.area ? prop.area : ""; // SEM O 26!
  
  // Título e Status no Topo
  updateModalHeaderTitle();
  const statusVal = prop ? prop.status : "Em análise";
  document.getElementById('prop-status').value = statusVal;
  updateModalStatusBadge(statusVal);
  document.getElementById('prop-alerta').value = prop && prop.alerta ? prop.alerta : "";
  document.getElementById('prop-proximopasso').value = prop && prop.proximoPasso ? prop.proximoPasso : "";
  document.getElementById('prop-motivo').value = prop && prop.motivoDescarte ? prop.motivoDescarte : "";

  // Ficha Técnica (8 Cards) - VAZIOS para Novo Imóvel
  document.getElementById('card-area').value = prop && prop.area ? prop.area : "";
  document.getElementById('card-quartos').value = prop && prop.quartos ? prop.quartos : "";
  document.getElementById('card-garagem').value = prop && prop.vagas ? prop.vagas : "";
  document.getElementById('card-andar').value = prop && prop.andar ? prop.andar : "";
  document.getElementById('card-posicao').value = prop && prop.posicao ? prop.posicao : "";
  document.getElementById('card-condominio').value = prop && prop.condominio ? prop.condominio : "";
  document.getElementById('card-iptu').value = prop && prop.iptu ? prop.iptu : "";
  document.getElementById('card-ano').value = prop && prop.anoPredio ? prop.anoPredio : "";

  // Valores & Negociação - VAZIOS para Novo Imóvel
  document.getElementById('prop-preco').value = prop && prop.precoPedido ? formatCurrencyBRL(prop.precoPedido) : "";
  document.getElementById('prop-proposta').value = prop && prop.propostaAceita ? formatCurrencyBRL(prop.propostaAceita) : "";
  document.getElementById('prop-m2-regiao').value = prop && prop.precoM2Regiao ? formatCurrencyBRL(prop.precoM2Regiao) : "";
  recalcValues();

  // Esconde caixas de inserção
  hideInlineMediaInput();
  hideInputNewPoint('forte');
  hideInputNewPoint('atencao');
  hideInputNewHistory();

  // Renderização das Listas
  renderMediaGallery();
  renderPontosFortes();
  renderPontosAtencao();
  renderHistoricoList();
  renderDocumentosList();

  // Inicia com o botão cinza (já salvo)
  markFormClean();

  // Exibe o modal
  document.getElementById('modal-property').classList.remove('hidden');
}

function closeModalProperty() {
  document.getElementById('modal-property').classList.add('hidden');
}

function updateModalHeaderTitle() {
  const bairro = document.getElementById('prop-bairro').value.trim();
  const rua = document.getElementById('prop-rua').value.trim();
  const area = document.getElementById('prop-area').value.trim();
  
  if (!bairro && !rua && !area) {
    document.getElementById('modal-header-title').innerText = currentEditingProperty ? "Editar Imóvel" : "Novo Imóvel";
    return;
  }
  
  let fullTitle = bairro || "Imóvel";
  if (rua) fullTitle += ` · ${rua}`;
  if (area) fullTitle += ` · ${area} m²`;
  document.getElementById('modal-header-title').innerText = fullTitle;
}

function updateModalStatusBadge(status) {
  const badge = document.getElementById('modal-badge-status');
  const boxDescarte = document.getElementById('box-motivo-descarte');
  if (!badge) return;
  badge.innerText = status.toUpperCase();

  let colorClass = "bg-gray-100 text-gray-700 border border-gray-300";
  if (status === "Aguardando sua decisão") colorClass = "bg-amber-100 text-amber-900 border border-amber-300";
  if (status === "Visita agendada") colorClass = "bg-sky-100 text-sky-800 border border-sky-300";
  if (status === "Proposta enviada") colorClass = "bg-blue-100 text-blue-800 border border-blue-300";
  if (status === "Contraproposta") colorClass = "bg-orange-100 text-orange-800 border border-orange-300";
  if (status === "Em análise") colorClass = "bg-slate-200 text-slate-800 border border-slate-300";
  if (status === "Fechado") colorClass = "bg-emerald-100 text-emerald-800 border border-emerald-300";
  if (status === "Descartado") colorClass = "bg-red-100 text-red-800 border border-red-300";

  badge.className = `${colorClass} px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider`;

  if (status === "Descartado") {
    boxDescarte.classList.remove('hidden');
  } else {
    boxDescarte.classList.add('hidden');
  }
}

function syncCardArea(val) {
  document.getElementById('prop-area').value = val;
  updateModalHeaderTitle();
  recalcValues();
}

function recalcValues() {
  const preco = parseCurrencyBRL(document.getElementById('prop-preco').value);
  const proposta = parseCurrencyBRL(document.getElementById('prop-proposta').value);
  const area = parseFloat(document.getElementById('prop-area').value) || 0;

  // Preço do m²
  const m2Input = document.getElementById('prop-m2-imovel');
  if (m2Input) {
    if (area > 0 && preco > 0) {
      m2Input.value = "R$ " + Math.round(preco / area).toLocaleString('pt-BR') + "/m²";
    } else {
      m2Input.value = "";
    }
  }

  // Desconto / Diferença
  const badgeDesconto = document.getElementById('prop-desconto-badge');
  if (badgeDesconto) {
    if (preco > 0 && proposta > 0) {
      const diff = preco - proposta;
      if (diff > 0) {
        badgeDesconto.innerText = `R$ ${Math.round(diff).toLocaleString('pt-BR')} abaixo do pedido`;
        badgeDesconto.className = "text-[11px] font-bold text-emerald-700 mt-1";
      } else if (diff < 0) {
        badgeDesconto.innerText = `R$ ${Math.round(Math.abs(diff)).toLocaleString('pt-BR')} acima do pedido`;
        badgeDesconto.className = "text-[11px] font-bold text-amber-700 mt-1";
      } else {
        badgeDesconto.innerText = `Igual ao preço pedido`;
        badgeDesconto.className = "text-[11px] font-bold text-gray-500 mt-1";
      }
    } else {
      badgeDesconto.innerText = "";
    }
  }
}

// ==========================================
// 5. PARSER DE MÍDIA (FOTOS E VÍDEOS YOUTUBE)
// ==========================================
function parseMediaItem(url) {
  if (!url) {
    return {
      type: 'empty',
      thumb: '',
      original: ''
    };
  }

  const ytRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(ytRegex);

  if (match) {
    const videoId = match[1];
    return {
      type: 'youtube',
      videoId: videoId,
      thumb: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`,
      original: url
    };
  }

  return {
    type: 'image',
    thumb: url,
    original: url
  };
}

// ==========================================
// 6. GALERIA DE MÍDIA
// ==========================================
function renderMediaGallery() {
  const heroContainer = document.getElementById('modal-hero-container');
  const thumbsContainer = document.getElementById('modal-media-thumbnails');

  if (currentPhotos.length === 0) {
    heroContainer.innerHTML = `
      <div class="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100">
        <svg class="w-12 h-12 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        <span class="text-xs font-semibold">Nenhuma foto ou vídeo cadastrado</span>
        <span class="text-[11px] text-gray-400 mt-0.5">Use o botão acima para adicionar fotos ou importar via link</span>
      </div>
      <div class="absolute bottom-3 left-3 bg-black/70 text-white text-xs font-bold px-3 py-1.5 rounded-lg backdrop-blur-xs flex items-center gap-1.5 shadow-sm">
        <span>0 mídias cadastradas</span>
      </div>
    `;
    thumbsContainer.innerHTML = '<p class="text-xs text-gray-400 col-span-6 text-center py-4">Nenhuma miniatura disponível.</p>';
    return;
  }

  const heroMedia = parseMediaItem(currentPhotos[0]);

  if (heroMedia.type === 'youtube') {
    heroContainer.innerHTML = `
      <iframe 
        src="${heroMedia.embedUrl}" 
        class="w-full h-full border-0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen
      ></iframe>
      <div class="absolute bottom-3 left-3 bg-red-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg backdrop-blur-xs flex items-center gap-1.5 shadow-sm pointer-events-none">
        <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
        <span>Vídeo do YouTube (${currentPhotos.length} ${currentPhotos.length === 1 ? 'mídia' : 'mídias'})</span>
      </div>
    `;
  } else {
    heroContainer.innerHTML = `
      <img src="${heroMedia.thumb}" alt="Destaque" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'">
      <div class="absolute bottom-3 left-3 bg-black/70 text-white text-xs font-bold px-3 py-1.5 rounded-lg backdrop-blur-xs flex items-center gap-1.5 shadow-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/></svg>
        <span>${currentPhotos.length} ${currentPhotos.length === 1 ? 'mídia' : 'mídias'} cadastradas</span>
      </div>
    `;
  }

  thumbsContainer.innerHTML = '';

  currentPhotos.forEach((item, idx) => {
    const parsed = parseMediaItem(item);
    const thumbDiv = document.createElement('div');
    thumbDiv.className = `relative group h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition ${idx === 0 ? 'border-advestor-teal shadow-xs' : 'border-gray-200 hover:border-gray-400'}`;

    thumbDiv.innerHTML = `
      <img src="${parsed.thumb}" class="w-full h-full object-cover bg-gray-100" onclick="setPrimaryPhoto(${idx})" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=200&q=80'">
      
      <!-- BOTÃO "X" PARA EXCLUIR MÍDIA -->
      <button 
        type="button" 
        onclick="removeMedia(${idx})" 
        class="absolute top-1 right-1 w-5 h-5 bg-black/70 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition shadow-sm cursor-pointer z-10"
        title="Remover mídia"
      >
        &times;
      </button>

      <!-- BADGE SE FOR VÍDEO DO YOUTUBE -->
      ${parsed.type === 'youtube' ? `
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/25">
          <svg class="w-6 h-6 text-red-600 fill-current drop-shadow" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
        </div>
      ` : ''}

      ${idx === 0 ? '<span class="absolute bottom-1 left-1 bg-advestor-teal text-white text-[9px] font-bold px-1.5 py-0.2 rounded shadow-xs z-10">Capa</span>' : ''}
    `;

    thumbsContainer.appendChild(thumbDiv);
  });
}

function setPrimaryPhoto(idx) {
  if (idx > 0 && idx < currentPhotos.length) {
    const item = currentPhotos.splice(idx, 1)[0];
    currentPhotos.unshift(item);
    renderMediaGallery();
    markFormDirty();
  }
}

function removeMedia(idx) {
  currentPhotos.splice(idx, 1);
  renderMediaGallery();
  markFormDirty();
}

function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(evt) {
    currentPhotos.push(evt.target.result);
    renderMediaGallery();
    markFormDirty();
  };
  reader.readAsDataURL(file);
}

function showInlineMediaInput() {
  const box = document.getElementById('inline-media-box');
  if (box) {
    box.classList.remove('hidden');
    const inp = document.getElementById('input-inline-media-url');
    inp.value = "";
    inp.focus();
  }
}

function hideInlineMediaInput() {
  const box = document.getElementById('inline-media-box');
  if (box) {
    box.classList.add('hidden');
    document.getElementById('input-inline-media-url').value = "";
  }
}

function confirmAddMediaUrl() {
  const inp = document.getElementById('input-inline-media-url');
  const url = inp ? inp.value.trim() : "";
  if (!url) return;

  currentPhotos.push(url);
  renderMediaGallery();
  markFormDirty();
  hideInlineMediaInput();
}

// ==========================================
// 7. ANÁLISE ADVESTOR: PONTOS FORTES E ATENÇÃO COM "X" VERMELHO
// ==========================================
function renderPontosFortes() {
  const ul = document.getElementById('list-pontos-fortes');
  if (!ul) return;
  ul.innerHTML = '';

  currentPontosFortes.forEach((pt, idx) => {
    const li = document.createElement('li');
    li.className = "flex items-start justify-between gap-3 p-2 rounded-lg hover:bg-emerald-50/50 transition border border-transparent hover:border-emerald-100 group";
    li.innerHTML = `
      <div class="flex items-start gap-2 flex-grow">
        <span class="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
        <span class="text-gray-700">${pt}</span>
      </div>
      <div class="w-6 h-6 shrink-0 flex items-center justify-center">
        <button 
          type="button" 
          onclick="removePonto('forte', ${idx})" 
          class="w-6 h-6 flex items-center justify-center text-red-500 hover:text-red-700 font-bold text-sm cursor-pointer transition opacity-90 hover:opacity-100 hover:scale-110" 
          title="Excluir ponto"
        >
          ✕
        </button>
      </div>
    `;
    ul.appendChild(li);
  });
}

function renderPontosAtencao() {
  const ul = document.getElementById('list-pontos-atencao');
  if (!ul) return;
  ul.innerHTML = '';

  currentPontosAtencao.forEach((pt, idx) => {
    const li = document.createElement('li');
    li.className = "flex items-start justify-between gap-3 p-2 rounded-lg hover:bg-amber-50/50 transition border border-transparent hover:border-amber-100 group";
    li.innerHTML = `
      <div class="flex items-start gap-2 flex-grow">
        <span class="text-amber-600 font-bold shrink-0 mt-0.5">⚠</span>
        <span class="text-gray-700">${pt}</span>
      </div>
      <div class="w-6 h-6 shrink-0 flex items-center justify-center">
        <button 
          type="button" 
          onclick="removePonto('atencao', ${idx})" 
          class="w-6 h-6 flex items-center justify-center text-red-500 hover:text-red-700 font-bold text-sm cursor-pointer transition opacity-90 hover:opacity-100 hover:scale-110" 
          title="Excluir ponto"
        >
          ✕
        </button>
      </div>
    `;
    ul.appendChild(li);
  });
}

function showInputNewPoint(tipo) {
  const box = document.getElementById(`input-box-${tipo}`);
  if (box) {
    box.classList.remove('hidden');
    const input = document.getElementById(`text-new-${tipo}`);
    input.value = '';
    input.focus();
  }
}

function hideInputNewPoint(tipo) {
  const box = document.getElementById(`input-box-${tipo}`);
  if (box) {
    box.classList.add('hidden');
    document.getElementById(`text-new-${tipo}`).value = '';
  }
}

function confirmAddPoint(tipo) {
  const input = document.getElementById(`text-new-${tipo}`);
  const val = input ? input.value.trim() : '';
  if (!val) return;

  if (tipo === 'forte') {
    currentPontosFortes.push(val);
    renderPontosFortes();
  } else {
    currentPontosAtencao.push(val);
    renderPontosAtencao();
  }

  markFormDirty();
  hideInputNewPoint(tipo);
}

function removePonto(tipo, idx) {
  if (tipo === 'forte') {
    currentPontosFortes.splice(idx, 1);
    renderPontosFortes();
  } else {
    currentPontosAtencao.splice(idx, 1);
    renderPontosAtencao();
  }
  markFormDirty();
}

// ==========================================
// 8. HISTÓRICO DO IMÓVEL COM TIMELINE E BOTÃO "X"
// ==========================================
function renderHistoricoList() {
  const container = document.getElementById('list-historico');
  if (!container) return;
  container.innerHTML = '';

  if (currentHistorico.length === 0) {
    container.innerHTML = '<p class="text-xs text-gray-400 py-2">Nenhum evento registrado no histórico.</p>';
    return;
  }

  currentHistorico.forEach((ev, idx) => {
    const item = document.createElement('div');
    item.className = "flex items-start justify-between gap-3 p-3 bg-gray-50/70 hover:bg-gray-100 rounded-xl border border-gray-200 transition group";
    item.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="w-2.5 h-2.5 rounded-full bg-advestor-teal mt-1 shrink-0"></div>
        <div>
          <span class="text-[11px] font-mono font-bold text-gray-500 block">${ev.data}</span>
          <p class="text-xs font-medium text-gray-800 mt-0.5">${ev.descricao}</p>
        </div>
      </div>
      <button type="button" onclick="removeHistoryItem(${idx})" class="text-gray-400 hover:text-red-600 font-bold text-sm px-1.5 opacity-60 group-hover:opacity-100 transition cursor-pointer" title="Remover evento">
        &times;
      </button>
    `;
    container.appendChild(item);
  });
}

function showInputNewHistory() {
  document.getElementById('input-box-history').classList.remove('hidden');
  document.getElementById('text-new-history-date').value = new Date().toLocaleDateString('pt-BR');
  document.getElementById('text-new-history-desc').focus();
}

function hideInputNewHistory() {
  document.getElementById('input-box-history').classList.add('hidden');
}

function confirmAddHistory() {
  const dt = document.getElementById('text-new-history-date').value.trim() || new Date().toLocaleDateString('pt-BR');
  const desc = document.getElementById('text-new-history-desc').value.trim();
  if (!desc) return;

  currentHistorico.unshift({ data: dt, descricao: desc });
  renderHistoricoList();
  markFormDirty();
  hideInputNewHistory();
}

function removeHistoryItem(idx) {
  currentHistorico.splice(idx, 1);
  renderHistoricoList();
  markFormDirty();
}

// MINI-MODAL: NOVA PROPOSTA QUE ATUALIZA VALOR E HISTÓRICO SIMULTANEAMENTE
function openNewOfferModal() {
  document.getElementById('modal-offer').classList.remove('hidden');
  document.getElementById('offer-date').value = new Date().toLocaleDateString('pt-BR');
  document.getElementById('offer-amount').value = document.getElementById('prop-proposta').value || "";
  document.getElementById('offer-desc').value = "";
}

function closeNewOfferModal() {
  document.getElementById('modal-offer').classList.add('hidden');
}

function confirmNewOffer() {
  const tipo = document.getElementById('offer-type').value;
  const valor = document.getElementById('offer-amount').value.trim();
  const dt = document.getElementById('offer-date').value.trim() || new Date().toLocaleDateString('pt-BR');
  let desc = document.getElementById('offer-desc').value.trim();

  if (!desc) {
    desc = valor ? `${tipo} no valor de ${valor}.` : `${tipo}.`;
  }

  if (valor) {
    document.getElementById('prop-proposta').value = valor;
    recalcValues();
  }

  currentHistorico.unshift({ data: dt, descricao: desc });
  renderHistoricoList();
  markFormDirty();

  closeNewOfferModal();
}

// ==========================================
// 9. DOCUMENTOS E CERTIDÕES (UPLOAD + DRAG & DROP + "X")
// ==========================================
function renderDocumentosList() {
  const container = document.getElementById('list-documentos');
  if (!container) return;
  container.innerHTML = '';

  if (currentDocumentos.length === 0) {
    container.innerHTML = '<p class="text-xs text-gray-400 py-3 text-center">Nenhum documento anexado a este imóvel.</p>';
    return;
  }

  currentDocumentos.forEach((doc, idx) => {
    const card = document.createElement('div');
    card.className = "flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition group";

    card.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="bg-red-100 text-red-700 font-bold text-[10px] px-2 py-1 rounded">
          ${doc.tipo || 'PDF'}
        </span>
        <div>
          <div class="text-xs font-bold text-gray-800">${doc.nome}</div>
          <div class="text-[11px] text-gray-400">Atualizado em ${doc.data} · ${doc.tamanho}</div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <a href="${doc.url || '#'}" download="${doc.nome}" class="text-gray-400 hover:text-advestor-teal p-1.5 transition" title="Baixar documento">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
        </a>
        
        <button 
          type="button" 
          onclick="removeDocument(${idx})" 
          class="text-gray-400 hover:text-red-600 font-bold text-base px-2 cursor-pointer transition"
          title="Excluir documento"
        >
          &times;
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

function handleDocFiles(e) {
  const files = e.target.files;
  if (!files || files.length === 0) return;
  processUploadedDocs(files);
}

function setupDragAndDrop() {
  const dropZone = document.getElementById('drop-zone-docs');
  if (!dropZone) return;

  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add('drag-over');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('drag-over');
    }, false);
  });

  dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    processUploadedDocs(files);
  }, false);
}

function processUploadedDocs(files) {
  Array.from(files).forEach(file => {
    const sizeKB = (file.size / 1024).toFixed(1);
    const sizeStr = file.size > 1048576 ? (file.size / 1048576).toFixed(1) + " MB" : sizeKB + " KB";
    const ext = file.name.split('.').pop().toUpperCase();

    const newDoc = {
      id: Date.now() + Math.random(),
      tipo: ext.length <= 4 ? ext : "DOC",
      nome: file.name,
      data: new Date().toLocaleDateString('pt-BR'),
      tamanho: sizeStr,
      url: URL.createObjectURL(file)
    };

    currentDocumentos.push(newDoc);
  });

  renderDocumentosList();
  markFormDirty();
}

function removeDocument(idx) {
  currentDocumentos.splice(idx, 1);
  renderDocumentosList();
  markFormDirty();
}

// ==========================================
// 10. INTEGRAÇÃO COM EXTENSÃO DO CHROME (COM DETECÇÃO FORA DO AR)
// ==========================================
function importFromExtension() {
  const urlInput = document.getElementById('import-url');
  const url = urlInput.value.trim();
  const statusEl = document.getElementById('import-status');
  const btn = document.getElementById('btn-import');

  if (!url) {
    alert("Por favor, cole o link do anúncio do imóvel.");
    return;
  }

  if (!EXTENSION_ID || EXTENSION_ID === "SEU_ID_DA_EXTENSAO_AQUI") {
    statusEl.classList.remove('hidden', 'text-advestor-teal', 'text-emerald-600');
    statusEl.classList.add('text-red-600');
    statusEl.innerHTML = "⚠️ <b>ID da Extensão não configurado:</b> Cole o ID de 32 letras da sua extensão na primeira linha do <code>admin.js</code>.";
    return;
  }

  statusEl.classList.remove('hidden', 'text-red-600', 'text-emerald-600');
  statusEl.classList.add('text-advestor-teal');
  statusEl.innerText = "Conectando à extensão e extraindo dados...";
  btn.disabled = true;

  if (typeof chrome === "undefined" || !chrome.runtime || !chrome.runtime.sendMessage) {
    statusEl.classList.remove('text-advestor-teal');
    statusEl.classList.add('text-red-600');
    statusEl.innerText = "Extensão não detectada. Certifique-se de que está usando o Google Chrome no computador.";
    btn.disabled = false;
    return;
  }

  let responseReceived = false;

  const timeoutId = setTimeout(() => {
    if (!responseReceived) {
      btn.disabled = false;
      statusEl.classList.remove('text-advestor-teal');
      statusEl.classList.add('text-red-600');
      statusEl.innerHTML = "⚠️ A extensão não respondeu em 7 segundos. Verifique se ela está ativada em <code>chrome://extensions</code>.";
    }
  }, 7000);

  chrome.runtime.sendMessage(EXTENSION_ID, { action: "EXTRACT_PROPERTY", url: url }, response => {
    responseReceived = true;
    clearTimeout(timeoutId);
    btn.disabled = false;
    
    if (chrome.runtime.lastError) {
      statusEl.classList.remove('text-advestor-teal');
      statusEl.classList.add('text-red-600');
      statusEl.innerText = "Erro ao comunicar com a extensão: " + chrome.runtime.lastError.message;
      return;
    }

    // DETECÇÃO AUTOMÁTICA DE ANÚNCIO FORA DO AR / VENDIDO / INDISPONÍVEL
    if (response && (response.offline || (response.data && response.data.offline))) {
      statusEl.classList.remove('hidden', 'text-advestor-teal', 'text-emerald-600');
      statusEl.classList.add('text-red-600');
      statusEl.innerHTML = `⚠️ <b>Anúncio Indisponível / Fora do Ar:</b> O imóvel nesta página foi vendido, alugado ou está indisponível no site de origem.`;
      
      if (confirm("⚠️ O portal de origem informa que este imóvel foi VENDIDO, ALUGADO ou ESTÁ INDISPONÍVEL.\n\nDeseja marcar o status como 'Descartado' com essa justificativa?")) {
        document.getElementById('prop-status').value = 'Descartado';
        updateModalStatusBadge('Descartado');
        document.getElementById('prop-motivo').value = 'Imóvel indisponível ou vendido no portal de origem';
        markFormDirty();
      }
      return;
    }

    if (response && response.success && response.data) {
      const d = response.data;
      if (d.bairro) document.getElementById('prop-bairro').value = d.bairro;
      if (d.rua) document.getElementById('prop-rua').value = d.rua;
      if (d.area) {
        document.getElementById('prop-area').value = d.area;
        document.getElementById('card-area').value = d.area;
      }
      if (d.precoPedido) document.getElementById('prop-preco').value = formatCurrencyBRL(d.precoPedido);
      if (d.quartos) document.getElementById('card-quartos').value = d.quartos;
      if (d.vagas) document.getElementById('card-garagem').value = d.vagas;
      if (d.andar) document.getElementById('card-andar').value = d.andar;
      if (d.posicao) document.getElementById('card-posicao').value = d.posicao;
      if (d.condominio) document.getElementById('card-condominio').value = formatCurrencyBRL(d.condominio);
      if (d.iptu) document.getElementById('card-iptu').value = formatCurrencyBRL(d.iptu);
      if (d.anoPredio) document.getElementById('card-ano').value = d.anoPredio;

      // RESOLUÇÃO DE FOTOS REAIS
      if (d.fotos && Array.isArray(d.fotos) && d.fotos.length > 0) {
        currentPhotos = d.fotos.filter(f => f && typeof f === 'string' && !f.includes('blank.gif') && !f.includes('placeholder')).map(f => {
          if (f.startsWith('//')) return 'https:' + f;
          if (f.startsWith('/')) {
            try {
              const u = new URL(url);
              return u.origin + f;
            } catch(e) { return f; }
          }
          return f;
        });
        renderMediaGallery();
      }

      updateModalHeaderTitle();
      recalcValues();
      markFormDirty();

      statusEl.classList.remove('text-red-600');
      statusEl.classList.add('text-emerald-600');
      statusEl.innerText = "✓ Dados e fotos importados com sucesso! Revise e clique em Salvar.";
    } else {
      statusEl.classList.remove('text-advestor-teal');
      statusEl.classList.add('text-red-600');
      statusEl.innerText = "Erro ao importar: " + (response ? response.error : "Resposta inválida.");
    }
  });
}

// ==========================================
// 11. SALVAMENTO GERAL (BOTÃO DINÂMICO SALVAR)
// ==========================================
function submitPropertyForm() {
  const form = document.getElementById('form-property');
  if (form) {
    if (typeof form.requestSubmit === 'function') {
      form.requestSubmit();
    } else {
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  }
}

function saveProperty(e) {
  e.preventDefault();
  const data = getStoredData();
  const idVal = document.getElementById('prop-id').value;

  const propArea = parseFloat(document.getElementById('card-area').value) || parseFloat(document.getElementById('prop-area').value) || 0;

  const propData = {
    id: idVal ? parseInt(idVal) : Date.now(),
    codigo: document.getElementById('prop-codigo').value.trim() || `ADV-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    bairro: document.getElementById('prop-bairro').value.trim(),
    rua: document.getElementById('prop-rua').value.trim(),
    area: propArea,
    precoPedido: parseCurrencyBRL(document.getElementById('prop-preco').value),
    propostaAceita: document.getElementById('prop-proposta').value ? parseCurrencyBRL(document.getElementById('prop-proposta').value) : null,
    precoM2Regiao: parseCurrencyBRL(document.getElementById('prop-m2-regiao').value) || 11692,
    status: document.getElementById('prop-status').value,
    alerta: document.getElementById('prop-alerta').value.trim() || "REQUER SUA AÇÃO",
    proximoPasso: document.getElementById('prop-proximopasso').value.trim(),
    motivoDescarte: document.getElementById('prop-motivo').value.trim(),
    
    // Ficha Técnica
    quartos: document.getElementById('card-quartos').value.trim(),
    vagas: document.getElementById('card-garagem').value.trim(),
    andar: document.getElementById('card-andar').value.trim(),
    posicao: document.getElementById('card-posicao').value.trim(),
    condominio: document.getElementById('card-condominio').value.trim(),
    iptu: document.getElementById('card-iptu').value.trim(),
    anoPredio: document.getElementById('card-ano').value.trim(),

    // Listas Gerenciadas
    fotos: currentPhotos,
    pontosFortes: currentPontosFortes,
    pontosAtencao: currentPontosAtencao,
    historico: currentHistorico,
    documentos: currentDocumentos,
    dataAtualizacao: new Date().toLocaleDateString('pt-BR')
  };

  if (idVal) {
    const index = data.imoveis.findIndex(p => p.id === parseInt(idVal));
    if (index !== -1) {
      data.imoveis[index] = propData;
    }
  } else {
    data.imoveis.push(propData);
  }

  saveStoredData(data);
  markFormClean();
  alert("✓ Imóvel e especificações salvas com sucesso!");
}

function editProperty(id) {
  const data = getStoredData();
  const prop = data.imoveis.find(p => p.id === id);
  if (prop) {
    openModalProperty(prop);
  }
}

function deleteProperty(id) {
  if (!confirm("Tem certeza que deseja remover este imóvel deste cliente?")) return;
  const data = getStoredData();
  data.imoveis = data.imoveis.filter(p => p.id !== id);
  saveStoredData(data);
}

// ==========================================
// 12. FUNÇÕES UTILITÁRIAS E MÁSCARAS
// ==========================================
function formatCurrencyBRL(val) {
  if (val === null || val === undefined || val === '') return '';
  const num = typeof val === 'number' ? val : parseFloat(val);
  if (isNaN(num)) return '';
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function parseCurrencyBRL(val) {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const digits = String(val).replace(/\D/g, '');
  if (!digits) return 0;
  return String(val).includes(',') ? (parseInt(digits, 10) / 100) : (parseFloat(digits) || 0);
}

function maskCurrency(input) {
  const digits = input.value.replace(/\D/g, '');
  if (!digits) {
    input.value = '';
    return;
  }
  const num = parseInt(digits, 10) / 100;
  input.value = num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function exportJSON() {
  const data = getStoredData();
  document.getElementById('json-output').value = JSON.stringify(data, null, 2);
  document.getElementById('modal-export').classList.remove('hidden');
}

function closeExportModal() {
  document.getElementById('modal-export').classList.add('hidden');
}

function copyJSON() {
  const copyText = document.getElementById("json-output");
  copyText.select();
  document.execCommand("copy");
  alert("JSON copiado para a área de transferência!");
}