// dashboard.js - Lógica Completa do Dashboard do Administrador Advestor

const CLIENTS_STORAGE_KEY = 'advestor_clients_registry';
const MIN_AREA_LIMIT = 20;
const MAX_AREA_LIMIT = 600;

// DADOS INICIAIS
const INITIAL_CLIENTS = [
  {
    id: 1,
    nome: "João Exemplo",
    email: "joao.exemplo@email.com",
    telefone: "(21) 99988-6160",
    assessor: "Carlos Drummond",
    bairros: "Flamengo, Botafogo, Copacabana, Laranjeiras, Catete",
    orcamento: "R$ 900.000,00",
    areaMin: 25,
    areaMax: 90,
    quartos: "1 a 2 quartos",
    especificacoes: "25 a 90 m² · 1 a 2 quartos",
    status: "Ativo",
    senhaTemporaria: "ADV-2026",
    dataCadastro: "04/11/2026",
    totalImoveis: 5
  }
];

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
  ensureInitialClients();
  renderDashboardMetrics();
  renderClientsTable();
  updateSliderTrack(30, 150);
});

function getClients() {
  const data = localStorage.getItem(CLIENTS_STORAGE_KEY);
  return data ? JSON.parse(data) : INITIAL_CLIENTS;
}

function saveClients(clients) {
  localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
  renderDashboardMetrics();
  renderClientsTable();
}

function ensureInitialClients() {
  if (!localStorage.getItem(CLIENTS_STORAGE_KEY)) {
    localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(INITIAL_CLIENTS));
  }
}

// 1. MÁSCARA INTELIGENTE DE TELEFONE: Suporta "+DDI (DDD) número" e "(DDD) número"
function maskDualPhone(input) {
  let val = input.value;
  const isInternational = val.trim().startsWith('+');
  let digits = val.replace(/\D/g, '');

  if (isInternational) {
    if (digits.length === 0) {
      input.value = '+';
      return;
    }
    let formatted = '+';
    if (digits.length <= 2) {
      formatted += digits;
    } else if (digits.length <= 4) {
      formatted += `${digits.slice(0, 2)} (${digits.slice(2)}`;
    } else if (digits.length <= 8) {
      formatted += `${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4)}`;
    } else if (digits.length <= 12) {
      formatted += `${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, 8)}-${digits.slice(8)}`;
    } else {
      formatted += `${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9, 13)}`;
    }
    input.value = formatted;
  } else {
    if (digits.length === 0) {
      input.value = '';
      return;
    }
    let formatted = '(';
    if (digits.length <= 2) {
      formatted += digits;
    } else if (digits.length <= 6) {
      formatted += `${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else if (digits.length <= 10) {
      formatted += `${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    } else {
      formatted += `${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    }
    input.value = formatted;
  }
}

// 2. AVISO TEMPORÁRIO DE "SEPARE POR VÍRGULA" (2 SEGUNDOS)
function showNeighborhoodTip() {
  const tip = document.getElementById('tip-neighborhoods');
  if (!tip) return;
  tip.classList.remove('hidden');
  setTimeout(() => tip.classList.add('opacity-100'), 10);

  clearTimeout(window.neighborhoodTipTimer);
  window.neighborhoodTipTimer = setTimeout(() => {
    tip.classList.remove('opacity-100');
    tip.classList.add('opacity-0');
    setTimeout(() => tip.classList.add('hidden'), 300);
  }, 2000);
}

// 3. MÁSCARA DE MOEDA BRL (R$ X.XXX.XXX,XX)
function maskCurrencyBRL(input) {
  let digits = input.value.replace(/\D/g, '');
  if (!digits) {
    input.value = '';
    return;
  }
  let num = parseInt(digits, 10) / 100;
  input.value = num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// 4. CONTROLE LINEAR DUPLO DE METRAGEM (SLIDER COM 2 PONTOS)
function syncSliderToInputs(changed) {
  let sMin = parseInt(document.getElementById('slider-min').value, 10);
  let sMax = parseInt(document.getElementById('slider-max').value, 10);

  if (changed === 'min' && sMin > sMax - 5) {
    sMin = sMax - 5;
    document.getElementById('slider-min').value = sMin;
  } else if (changed === 'max' && sMax < sMin + 5) {
    sMax = sMin + 5;
    document.getElementById('slider-max').value = sMax;
  }

  document.getElementById('input-area-min').value = sMin;
  document.getElementById('input-area-max').value = sMax;

  updateSliderTrack(sMin, sMax);
}

function syncInputsToSlider() {
  let inMin = parseInt(document.getElementById('input-area-min').value, 10) || MIN_AREA_LIMIT;
  let inMax = parseInt(document.getElementById('input-area-max').value, 10) || MAX_AREA_LIMIT;

  if (inMin < MIN_AREA_LIMIT) inMin = MIN_AREA_LIMIT;
  if (inMax > MAX_AREA_LIMIT) inMax = MAX_AREA_LIMIT;
  if (inMin > inMax - 5) inMin = inMax - 5;

  document.getElementById('slider-min').value = inMin;
  document.getElementById('slider-max').value = inMax;

  updateSliderTrack(inMin, inMax);
}

function updateSliderTrack(minVal, maxVal) {
  const track = document.getElementById('slider-track');
  if (!track) return;
  const leftPct = ((minVal - MIN_AREA_LIMIT) / (MAX_AREA_LIMIT - MIN_AREA_LIMIT)) * 100;
  const rightPct = 100 - (((maxVal - MIN_AREA_LIMIT) / (MAX_AREA_LIMIT - MIN_AREA_LIMIT)) * 100);
  track.style.left = `${Math.max(0, leftPct)}%`;
  track.style.right = `${Math.max(0, rightPct)}%`;
}

// RENDERIZAÇÃO DAS MÉTRICAS DO TOPO
function renderDashboardMetrics() {
  const clients = getClients();
  
  const metricClientsEl = document.getElementById('metric-total-clients');
  if (metricClientsEl) metricClientsEl.innerText = clients.length;

  const portalDataRaw = localStorage.getItem('advestor_portal_data');
  if (portalDataRaw) {
    try {
      const portalData = JSON.parse(portalDataRaw);
      const imoveis = portalData.imoveis || [];
      const propEl = document.getElementById('metric-total-properties');
      if (propEl) propEl.innerText = imoveis.length;
      
      const propostas = imoveis.filter(i => i.status === "Aguardando sua decisão" || i.status === "Contraproposta" || i.status === "Proposta enviada").length;
      const propActEl = document.getElementById('metric-active-proposals');
      if (propActEl) propActEl.innerText = propostas;

      const visitas = imoveis.filter(i => i.status === "Visita agendada").length;
      const visEl = document.getElementById('metric-scheduled-visits');
      if (visEl) visEl.innerText = visitas;
    } catch(e) {}
  } else {
    const propEl = document.getElementById('metric-total-properties');
    if (propEl) propEl.innerText = "5";
    const propActEl = document.getElementById('metric-active-proposals');
    if (propActEl) propActEl.innerText = "2";
    const visEl = document.getElementById('metric-scheduled-visits');
    if (visEl) visEl.innerText = "1";
  }
}

// RENDERIZAÇÃO DA TABELA DE CLIENTES
function renderClientsTable(filterText = '') {
  const clients = getClients();
  const tbody = document.getElementById('clients-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  const filtered = clients.filter(c => {
    const q = filterText.toLowerCase();
    return c.nome.toLowerCase().includes(q) || 
           c.email.toLowerCase().includes(q) || 
           c.bairros.toLowerCase().includes(q);
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="px-6 py-8 text-center text-gray-400 text-xs">
          Nenhum cliente encontrado com os termos pesquisados.
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach(client => {
    const tr = document.createElement('tr');
    tr.className = "hover:bg-gray-50/80 transition border-b";

    tr.innerHTML = `
      <td class="px-6 py-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-[#13495C] text-white flex items-center justify-center font-bold text-xs">
            ${getInitials(client.nome)}
          </div>
          <div>
            <div class="font-bold text-gray-900">${client.nome}</div>
            <div class="text-xs text-gray-500">${client.email} · ${client.telefone}</div>
          </div>
        </div>
      </td>
      <td class="px-6 py-4">
        <div class="text-xs font-semibold text-gray-800">${client.bairros}</div>
        <div class="text-[11px] text-gray-500">${client.orcamento || 'Sem faixa definida'} · ${client.especificacoes || ''}</div>
      </td>
      <td class="px-6 py-4">
        <div class="flex items-center gap-2">
          <span class="font-mono text-xs font-bold bg-amber-50 border border-amber-200 text-amber-900 px-2 py-0.5 rounded">
            ${client.senhaTemporaria || 'ADV-2026'}
          </span>
          <button type="button" onclick="copyToClipboard('${client.senhaTemporaria || 'ADV-2026'}', 'Senha provisória copiada!')" class="text-gray-400 hover:text-[#13495C] transition cursor-pointer" title="Copiar Senha">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
          </button>
        </div>
        <button type="button" onclick="openInviteModal(${client.id})" class="text-[11px] text-emerald-700 font-bold hover:underline mt-1 block cursor-pointer">
          Gerar mensagem WhatsApp
        </button>
      </td>
      <td class="px-6 py-4 text-center">
        <span class="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#E8F1F4] text-[#13495C]">
          ${client.totalImoveis || 0} imóveis
        </span>
      </td>
      <td class="px-6 py-4 text-right space-x-2">
        <a 
          href="admin.php?client_id=${client.id}" 
          class="bg-[#13495C] hover:bg-[#0E3644] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition inline-flex items-center gap-1 shadow-xs"
        >
          <span>Gerenciar Imóveis</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </a>
        <button type="button" onclick="editClient(${client.id})" class="text-xs font-bold text-gray-500 hover:text-gray-800 transition cursor-pointer" title="Editar dados">
          Editar
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function filterClientsTable() {
  const inputEl = document.getElementById('search-client');
  const text = inputEl ? inputEl.value : '';
  renderClientsTable(text);
}

function getInitials(name) {
  if (!name) return 'CL';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// MODAL NOVO CLIENTE
function openModalNewClient() {
  const modal = document.getElementById('modal-client');
  if (modal) modal.classList.remove('hidden');

  const titleEl = document.getElementById('modal-client-title');
  if (titleEl) titleEl.innerText = "Cadastrar Novo Cliente";

  document.getElementById('client-id').value = "";
  document.getElementById('input-client-name').value = "";
  document.getElementById('input-client-email').value = "";
  document.getElementById('input-client-phone').value = "";
  document.getElementById('input-client-neighborhoods').value = "";
  document.getElementById('input-client-budget').value = "";
  
  // Reseta Metragem e Slider
  document.getElementById('input-area-min').value = "30";
  document.getElementById('input-area-max').value = "150";
  document.getElementById('slider-min').value = "30";
  document.getElementById('slider-max').value = "150";
  updateSliderTrack(30, 150);

  document.getElementById('input-client-bedrooms').value = "";
  
  generateTemporaryPassword();
}

function closeModalClient() {
  const modal = document.getElementById('modal-client');
  if (modal) modal.classList.add('hidden');
}

function generateTemporaryPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let randomCode = "";
  for (let i = 0; i < 4; i++) {
    randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const pass = `ADV-${randomCode}`;
  const inputEl = document.getElementById('input-client-temp-password');
  if (inputEl) inputEl.value = pass;
  return pass;
}

function copyTemporaryPassword() {
  const inputEl = document.getElementById('input-client-temp-password');
  const val = inputEl ? inputEl.value : '';
  copyToClipboard(val, "Senha temporária copiada!");
}

function saveClient(event) {
  event.preventDefault();
  const clients = getClients();
  const idVal = document.getElementById('client-id').value;

  const budgetVal = document.getElementById('input-client-budget').value.trim();
  const orcamentoStr = budgetVal ? `Até ${budgetVal}` : '';

  const aMin = parseInt(document.getElementById('input-area-min').value, 10) || 30;
  const aMax = parseInt(document.getElementById('input-area-max').value, 10) || 150;
  const bedrooms = document.getElementById('input-client-bedrooms').value.trim();
  const especificacoesStr = `${aMin} a ${aMax} m² · ${bedrooms}`;

  const newClientData = {
    id: idVal ? parseInt(idVal) : Date.now(),
    nome: document.getElementById('input-client-name').value.trim(),
    email: document.getElementById('input-client-email').value.trim(),
    telefone: document.getElementById('input-client-phone').value.trim(),
    assessor: document.getElementById('input-client-advisor').value.trim() || "Carlos Drummond",
    bairros: document.getElementById('input-client-neighborhoods').value.trim(),
    orcamento: orcamentoStr,
    areaMin: aMin,
    areaMax: aMax,
    quartos: bedrooms,
    especificacoes: especificacoesStr,
    status: "Ativo",
    senhaTemporaria: document.getElementById('input-client-temp-password').value,
    dataCadastro: new Date().toLocaleDateString('pt-BR'),
    totalImoveis: 0
  };

  if (idVal) {
    const idx = clients.findIndex(c => c.id === parseInt(idVal));
    if (idx !== -1) {
      newClientData.totalImoveis = clients[idx].totalImoveis || 0;
      clients[idx] = newClientData;
    }
  } else {
    clients.push(newClientData);
  }

  saveClients(clients);
  closeModalClient();
  
  openInviteModal(newClientData.id);
}

function editClient(id) {
  const clients = getClients();
  const c = clients.find(item => item.id === id);
  if (!c) return;

  const modal = document.getElementById('modal-client');
  if (modal) modal.classList.remove('hidden');

  const titleEl = document.getElementById('modal-client-title');
  if (titleEl) titleEl.innerText = "Editar Cliente";

  document.getElementById('client-id').value = c.id;
  document.getElementById('input-client-name').value = c.nome;
  document.getElementById('input-client-email').value = c.email;
  document.getElementById('input-client-phone').value = c.telefone;
  document.getElementById('input-client-neighborhoods').value = c.bairros;
  document.getElementById('input-client-budget').value = (c.orcamento || "").replace(/^Até\s*/i, '');

  const aMin = c.areaMin || 30;
  const aMax = c.areaMax || 150;
  document.getElementById('input-area-min').value = aMin;
  document.getElementById('input-area-max').value = aMax;
  document.getElementById('slider-min').value = aMin;
  document.getElementById('slider-max').value = aMax;
  updateSliderTrack(aMin, aMax);

  document.getElementById('input-client-bedrooms').value = c.quartos || "";
  document.getElementById('input-client-temp-password').value = c.senhaTemporaria || "ADV-2026";
}

// CONVITE AUTOMÁTICO WHATSAPP
function openInviteModal(clientId) {
  const clients = getClients();
  const c = clients.find(item => item.id === clientId);
  if (!c) return;

  const currentHost = window.location.origin + window.location.pathname.replace('dashboard.php', 'index.php');
  const msg = `Olá, ${c.nome}! 👋\n\nO seu dossiê exclusivo e personalizado de busca de imóveis já está disponível no Portal do Cliente Advestor.\n\nAcesse pelo link:\n🔗 ${currentHost}\n\nSeus dados de acesso:\n👤 Login: ${c.email}\n🔑 Senha provisória: ${c.senhaTemporaria}\n\nQualquer dúvida estou à disposição!\nAtenciosamente,\n${c.assessor} · Advestor Real Estate`;

  const outputEl = document.getElementById('invite-text-output');
  if (outputEl) outputEl.value = msg.replace(/\\n/g, '\n');

  const modalInvite = document.getElementById('modal-whatsapp-invite');
  if (modalInvite) modalInvite.classList.remove('hidden');
}

function closeModalInvite() {
  const modalInvite = document.getElementById('modal-whatsapp-invite');
  if (modalInvite) modalInvite.classList.add('hidden');
}

function copyInviteText() {
  const textEl = document.getElementById('invite-text-output');
  if (!textEl) return;
  textEl.select();
  document.execCommand('copy');
  alert('Mensagem copiada! Basta colar no WhatsApp do cliente.');
}

function copyToClipboard(text, alertMsg) {
  navigator.clipboard.writeText(text).then(() => {
    alert(alertMsg || 'Copiado para a área de transferência!');
  }).catch(() => {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    alert(alertMsg || 'Copiado para a área de transferência!');
  });
}