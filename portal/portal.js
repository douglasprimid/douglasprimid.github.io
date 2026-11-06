/**
 * portal.js - Lógica e Dados do Portal do Cliente Advestor
 */

const ADVESTOR_DATA = {
  client: {
    name: "João Exemplo",
    email: "joao.exemplo@email.com",
    advisor: {
      name: "Carlos Drummond",
      phone: "21999886160",
      formattedPhone: "21 99988-6160"
    },
    searchProfile: {
      neighborhoods: "Flamengo, Botafogo, Copacabana, Laranjeiras, Catete",
      priceRange: "R$ 350k - 900k",
      specs: "25 a 90 m² · 1 a 2 quartos"
    }
  },
  summary: {
    analyzed: 12,
    visits: 4,
    proposalsInProgress: 2
  },
  notifications: [
    {
      id: 1,
      propertyId: 1,
      date: "04/11/2026",
      title: "Aguardando sua decisão",
      text: "Proposta aceita no Flamengo! Precisamos da sua decisão até 06/11/2026.",
      requiresAction: true,
      read: false
    },
    {
      id: 2,
      propertyId: 2,
      date: "03/11/2026",
      title: "Visita agendada",
      text: "Visita confirmada em Botafogo para sábado 07/11 às 10h com o assessor.",
      requiresAction: false,
      read: false
    },
    {
      id: 3,
      propertyId: 5,
      date: "01/11/2026",
      title: "Contraproposta recebida",
      text: "Proprietário no Catete respondeu com valor de R$ 410.000.",
      requiresAction: true,
      read: true
    }
  ],
  properties: [
    {
      id: 1,
      code: "ADV-FLA26",
      neighborhood: "Flamengo",
      street: "Rua Marquês de Abrantes",
      area: 26,
      status: "Aguardando sua decisão",
      stageCategory: "Em negociação",
      askingPrice: 370000,
      proposedPrice: 365000,
      sqmPrice: 14230,
      avgRegionSqm: 11692,
      bedrooms: 1,
      garage: 0,
      floor: "3º Andar",
      position: "Fundos",
      condoFee: 650,
      tax: 1200,
      builtYear: 1965,
      updatedAt: "04/11/2026",
      deadlineDate: "06/11/2026",
      nextStep: "Aprovar ou recusar a proposta formal de R$ 365.000 até 06/11",
      discardReason: null,
      requiresAction: true,
      actionNotice: "O vendedor aceitou sua proposta de R$ 365.000. Precisamos da sua decisão até 06/11/2026.",
      analysis: {
        pros: [
          "Localização a uma quadra do metrô Flamengo;",
          "Valor negociado abaixo da maior venda do prédio nos últimos 2 anos (R$ 370 mil);",
          "Prédio bem administrado com portaria 24 horas e elevadores reformados."
        ],
        cons: [
          "Apartamento de fundos com vista interna;",
          "Necessidade de reforma geral em elétrica e hidráulica;",
          "Preço do m² acima da média do bairro devido à metragem compacta."
        ]
      },
      timeline: [
        { date: "04/11/2026", text: "Vendedor aceitou a proposta formalizada de R$ 365.000." },
        { date: "31/10/2026", text: "Contraproposta de R$ 365.000 enviada ao proprietário." },
        { date: "28/10/2026", text: "Proposta inicial enviada no valor de R$ 355.000." },
        { date: "25/10/2026", text: "Visita técnica realizada com engenheiro parceiro Advestor." },
        { date: "20/10/2026", text: "Imóvel selecionado e incluído no dossiê de busca do cliente." }
      ],
      documents: [
        { name: "Matrícula do imóvel (RGI)", date: "03/11/2026", size: "2.4 MB" },
        { name: "Certidões fiscais do vendedor", date: "02/11/2026", size: "1.1 MB" },
        { name: "Laudo de vistoria técnica preliminar", date: "26/10/2026", size: "4.8 MB" }
      ],
      photos: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      id: 2,
      code: "ADV-BOT55",
      neighborhood: "Botafogo",
      street: "Rua Álvaro Ramos",
      area: 55,
      status: "Visita agendada",
      stageCategory: "Visitas agendadas",
      askingPrice: 680000,
      proposedPrice: null,
      sqmPrice: 12363,
      avgRegionSqm: 12800,
      bedrooms: 2,
      garage: 1,
      floor: "5º Andar",
      position: "Frente",
      condoFee: 890,
      tax: 1850,
      builtYear: 1978,
      updatedAt: "03/11/2026",
      deadlineDate: "07/11/2026",
      nextStep: "Visita presencial agendada para sábado 07/11 às 10h",
      discardReason: null,
      requiresAction: false,
      actionNotice: "Visita confirmada para sábado 07/11 às 10h. O assessor Carlos Drummond acompanhará você no local.",
      analysis: {
        pros: [
          "Apartamento claro de frente com sol da manhã;",
          "Vaga de garagem garantida na escritura;",
          "Planta permite integração da cozinha com a sala."
        ],
        cons: [
          "Rua com fluxo moderado de ônibus em horários de pico;",
          "Condomínio com cota extra prevista para impermeabilização."
        ]
      },
      timeline: [
        { date: "03/11/2026", text: "Visita presencial agendada com o proprietário para 07/11 às 10h." },
        { date: "29/10/2026", text: "Análise prévia de preço favorável em relação aos vizinhos." },
        { date: "27/10/2026", text: "Imóvel aprovado no filtro inicial de busca." }
      ],
      documents: [],
      photos: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1502005229762-ee1b2b8ab00f?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      id: 3,
      code: "ADV-COP45",
      neighborhood: "Copacabana",
      street: "Av. N. Sra. de Copacabana",
      area: 45,
      status: "Em análise",
      stageCategory: "Em análise",
      askingPrice: 510000,
      proposedPrice: null,
      sqmPrice: 11333,
      avgRegionSqm: 11950,
      bedrooms: 1,
      garage: 0,
      floor: "8º Andar",
      position: "Fundos",
      condoFee: 720,
      tax: 1400,
      builtYear: 1960,
      updatedAt: "02/11/2026",
      deadlineDate: null,
      nextStep: "Análise de certidões e vistoria técnica em andamento",
      discardReason: null,
      requiresAction: false,
      actionNotice: "Estamos conferindo a certidão de ônus reais e histórico condominial antes de sugerir a visita.",
      analysis: {
        pros: [
          "Andar alto e silencioso, mesmo em avenida movimentada;",
          "Muito próximo ao metrô Cantagalo e praia."
        ],
        cons: [
          "Prédio misto com muitas unidades por andar;",
          "Sem possibilidade de locação de vaga no edifício."
        ]
      },
      timeline: [
        { date: "02/11/2026", text: "Solicitação de certidões de regularidade condominial." },
        { date: "30/10/2026", text: "Imóvel pré-selecionado pela equipe Advestor." }
      ],
      documents: [],
      photos: [
        "https://images.unsplash.com/photo-151295922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      id: 4,
      code: "ADV-LAR80",
      neighborhood: "Laranjeiras",
      street: "Rua Pinheiro Machado",
      area: 80,
      status: "Descartado",
      stageCategory: "Encerrados",
      askingPrice: 900000,
      proposedPrice: null,
      sqmPrice: 11250,
      avgRegionSqm: 11400,
      bedrooms: 3,
      garage: 1,
      floor: "2º Andar",
      position: "Frente",
      condoFee: 1100,
      tax: 2200,
      builtYear: 1972,
      updatedAt: "28/10/2026",
      deadlineDate: null,
      nextStep: null,
      discardReason: "Apartamento de fundos, sem luz natural e muito úmido.",
      requiresAction: false,
      actionNotice: "Imóvel arquivado conforme decisão conjunta após constatação de umidade excessiva e falta de insolação.",
      analysis: {
        pros: [
          "Metragem ampla para a região com 3 quartos bem dimensionados."
        ],
        cons: [
          "Problemas crônicos de ventilação constatados na vistoria.",
          "Custo estimado de retrofit inviabilizaria o teto de investimento."
        ]
      },
      timeline: [
        { date: "28/10/2026", text: "Imóvel descartado formalmente pelo cliente com nosso suporte." },
        { date: "27/10/2026", text: "Vistoria apontou umidade nas paredes do prisma de ventilação." },
        { date: "24/10/2026", text: "Visita realizada." }
      ],
      documents: [],
      photos: [
        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      id: 5,
      code: "ADV-CAT38",
      neighborhood: "Catete",
      street: "Rua Bento Lisboa",
      area: 38,
      status: "Contraproposta",
      stageCategory: "Em negociação",
      askingPrice: 420000,
      proposedPrice: 405000,
      sqmPrice: 11052,
      avgRegionSqm: 10800,
      bedrooms: 1,
      garage: 0,
      floor: "4º Andar",
      position: "Frente",
      condoFee: 580,
      tax: 950,
      builtYear: 1982,
      updatedAt: "01/11/2026",
      deadlineDate: "05/11/2026",
      nextStep: "Aguardando definição sobre contraproposta de R$ 410.000",
      discardReason: null,
      requiresAction: true,
      actionNotice: "Vendedor contrapropôs R$ 410.000 (pedida era R$ 420k, ofertamos R$ 400k). Recomendamos aceitar.",
      analysis: {
        pros: [
          "Excelente custo-benefício e condomínio barato;",
          "Metrô a 3 minutos a pé e farto comércio no entorno."
        ],
        cons: [
          "Edifício sem garagem e sem infraestrutura de lazer."
        ]
      },
      timeline: [
        { date: "01/11/2026", text: "Contraproposta formal do proprietário em R$ 410.000." },
        { date: "29/10/2026", text: "Proposta inicial de R$ 400.000 transmitida." },
        { date: "26/10/2026", text: "Visita realizada e aprovada." }
      ],
      documents: [
        { name: "Certidão de Situação Fiscal e Enfitêutica", date: "30/10/2026", size: "850 KB" }
      ],
      photos: [
        "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80"
      ]
    }
  ]
};

let currentFilter = 'Todos';
let currentPropertyId = 1;
let currentPhotoIndex = 0;
let isTimelineExpanded = false;

const STATUS_CONFIG = {
  "Aguardando sua decisão": { bg: "bg-[#B5652B]", text: "text-white", border: "border-[#B5652B]" },
  "Visita agendada": { bg: "bg-[#13495C]", text: "text-white", border: "border-[#13495C]" },
  "Em análise": { bg: "bg-slate-500", text: "text-white", border: "border-slate-500" },
  "Contraproposta": { bg: "bg-amber-600", text: "text-white", border: "border-amber-600" },
  "Proposta enviada": { bg: "bg-indigo-600", text: "text-white", border: "border-indigo-600" },
  "Fechado": { bg: "bg-emerald-600", text: "text-white", border: "border-emerald-600" },
  "Descartado": { bg: "bg-red-700", text: "text-white", border: "border-red-700" }
};

window.onload = function() {
  renderSummaryCounters();
  renderFilterButtons();
  renderPropertyCards();
  renderNotifications();
  renderCalendar();
};

function renderSummaryCounters() {
  document.getElementById('metric-analyzed').innerText = ADVESTOR_DATA.summary.analyzed;
  document.getElementById('metric-visits').innerText = ADVESTOR_DATA.summary.visits;
  document.getElementById('metric-proposals').innerText = ADVESTOR_DATA.summary.proposalsInProgress;
  
  document.getElementById('profile-neighborhoods').innerText = ADVESTOR_DATA.client.searchProfile.neighborhoods;
  document.getElementById('profile-price').innerText = ADVESTOR_DATA.client.searchProfile.priceRange;
  document.getElementById('profile-area').innerText = ADVESTOR_DATA.client.searchProfile.specs;
}

function renderFilterButtons() {
  const categories = [
    { key: 'Todos', label: 'Todos' },
    { key: 'Em negociação', label: 'Em negociação' },
    { key: 'Em análise', label: 'Em análise' },
    { key: 'Visitas agendadas', label: 'Visitas agendadas' },
    { key: 'Encerrados', label: 'Encerrados' }
  ];

  const container = document.getElementById('filter-buttons-container');
  container.innerHTML = '';

  categories.forEach(cat => {
    const count = cat.key === 'Todos' 
      ? ADVESTOR_DATA.properties.length 
      : ADVESTOR_DATA.properties.filter(p => p.stageCategory === cat.key).length;

    const isActive = currentFilter === cat.key;
    const btn = document.createElement('button');
    btn.onclick = () => setFilter(cat.key);
    btn.className = `w-full px-4 py-2.5 flex items-center justify-between text-left transition font-medium ${
      isActive ? 'bg-slate-200 text-[#13495C] font-bold' : 'hover:bg-slate-50 text-slate-700'
    }`;
    
    btn.innerHTML = `
      <span>${cat.label}</span>
      <span class="text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-[#13495C] text-white' : 'bg-slate-100 text-slate-600'} font-semibold">${count}</span>
    `;
    container.appendChild(btn);
  });
}

function setFilter(filterKey) {
  currentFilter = filterKey;
  renderFilterButtons();
  renderPropertyCards();
}

function formatCurrency(val) {
  if (!val) return 'R$ --';
  return 'R$ ' + val.toLocaleString('pt-BR');
}

function renderPropertyCards() {
  const container = document.getElementById('property-cards-container');
  container.innerHTML = '';

  const filtered = currentFilter === 'Todos'
    ? ADVESTOR_DATA.properties
    : ADVESTOR_DATA.properties.filter(p => p.stageCategory === currentFilter);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
        <p class="text-sm font-semibold">Nenhum imóvel nesta etapa no momento.</p>
        <button onclick="setFilter('Todos')" class="mt-2 text-xs text-[#13495C] underline font-bold">Ver todos os imóveis</button>
      </div>
    `;
    return;
  }

  filtered.forEach(p => {
    const statusStyle = STATUS_CONFIG[p.status] || { bg: "bg-slate-600", text: "text-white" };
    const card = document.createElement('div');
    
    card.className = "bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition cursor-pointer flex flex-col md:flex-row h-auto md:h-44 overflow-hidden group";
    card.onclick = () => openPropertyDetail(p.id);

    const bottomLineHtml = p.status === 'Descartado'
      ? `<p class="single-line-truncate text-red-700 font-medium text-xs">
          <strong class="font-bold">Motivo:</strong> ${p.discardReason || 'Imóvel descartado após avaliação técnica.'}
         </p>`
      : `<p class="single-line-truncate text-slate-500 text-xs">
          Atualizado em ${p.updatedAt} · <span class="font-semibold text-slate-700">Próximo passo:</span> ${p.nextStep || 'Aguardando novas informações'}
         </p>`;

    const garageText = p.garage > 0 ? `${p.garage} Vaga${p.garage > 1 ? 's' : ''}` : 'Sem vaga';
    const bedroomText = `${p.bedrooms} Qto${p.bedrooms > 1 ? 's' : ''}`;

    card.innerHTML = `
      <div class="w-full md:w-56 lg:w-64 h-48 md:h-full shrink-0 relative overflow-hidden bg-slate-100">
        <img src="${p.photos[0]}" alt="${p.neighborhood}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
        <span class="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs font-semibold">
          ${p.photos.length} fotos
        </span>
      </div>

      <div class="flex-1 p-4 md:py-3.5 md:px-5 flex flex-col justify-between overflow-hidden">
        <div class="flex items-start justify-between gap-2">
          <h2 class="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#13495C] transition single-line-truncate">
            ${p.neighborhood} · ${p.street} · ${p.area} m²
          </h2>
          <span class="shrink-0 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${statusStyle.bg} ${statusStyle.text}">
            ${p.status}
          </span>
        </div>

        <div class="text-xs text-slate-700 font-medium py-1">
          <span class="font-bold text-slate-900">Pedido: ${formatCurrency(p.askingPrice)}</span>
          <span class="text-slate-400 mx-1.5">·</span>
          <span>R$/m²: <strong>R$ ${p.sqmPrice.toLocaleString('pt-BR')}</strong></span>
          <span class="text-slate-400 mx-1.5">·</span>
          <span>${bedroomText}</span>
          <span class="text-slate-400 mx-1.5">·</span>
          <span>${garageText}</span>
          <span class="text-slate-400 mx-1.5">·</span>
          <span>${p.floor}</span>
          <span class="text-slate-400 mx-1.5">·</span>
          <span>${p.position}</span>
        </div>

        <div class="pt-2 border-t border-slate-100">
          ${bottomLineHtml}
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

function showListScreen() {
  document.getElementById('screen-detail').classList.add('hidden');
  document.getElementById('screen-list').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openPropertyDetail(id) {
  currentPropertyId = id;
  currentPhotoIndex = 0;
  isTimelineExpanded = false;

  const p = ADVESTOR_DATA.properties.find(item => item.id === id);
  if (!p) return;

  document.getElementById('detail-title').innerText = `${p.neighborhood} · ${p.street} · ${p.area} m²`;
  document.getElementById('detail-code').innerText = p.code;
  
  const badge = document.getElementById('detail-status-badge');
  const st = STATUS_CONFIG[p.status] || { bg: "bg-slate-600", text: "text-white" };
  badge.className = `px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${st.bg} ${st.text}`;
  badge.innerText = p.status;

  renderGallery(p);
  renderNextStepCard(p);
  renderValuesCard(p);
  renderAnalysisCard(p);
  renderTimelineCard(p);
  renderSpecsGrid(p);
  renderDocumentsCard(p);

  document.getElementById('screen-list').classList.add('hidden');
  document.getElementById('screen-detail').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderGallery(p) {
  const mainPhoto = document.getElementById('detail-main-photo');
  mainPhoto.src = p.photos[currentPhotoIndex] || p.photos[0];
  
  document.getElementById('gallery-counter').innerText = `${currentPhotoIndex + 1} / ${p.photos.length}`;

  const thumbsContainer = document.getElementById('detail-thumbnails');
  thumbsContainer.innerHTML = '';

  p.photos.forEach((photoUrl, idx) => {
    const thumb = document.createElement('button');
    thumb.onclick = () => selectPhoto(idx);
    thumb.className = `aspect-[4/3] rounded-lg overflow-hidden border-2 transition ${
      idx === currentPhotoIndex ? 'border-[#B5652B] ring-2 ring-[#B5652B]/30' : 'border-transparent opacity-75 hover:opacity-100'
    }`;
    thumb.innerHTML = `<img src="${photoUrl}" class="w-full h-full object-cover">`;
    thumbsContainer.appendChild(thumb);
  });
}

function selectPhoto(index) {
  const p = ADVESTOR_DATA.properties.find(item => item.id === currentPropertyId);
  if (!p) return;
  currentPhotoIndex = index;
  renderGallery(p);
}

function nextPhoto() {
  const p = ADVESTOR_DATA.properties.find(item => item.id === currentPropertyId);
  if (!p) return;
  currentPhotoIndex = (currentPhotoIndex + 1) % p.photos.length;
  renderGallery(p);
  updateLightboxPhoto();
}

function prevPhoto() {
  const p = ADVESTOR_DATA.properties.find(item => item.id === currentPropertyId);
  if (!p) return;
  currentPhotoIndex = (currentPhotoIndex - 1 + p.photos.length) % p.photos.length;
  renderGallery(p);
  updateLightboxPhoto();
}

function openLightbox() {
  const p = ADVESTOR_DATA.properties.find(item => item.id === currentPropertyId);
  if (!p) return;
  document.getElementById('modal-lightbox').classList.remove('hidden');
  updateLightboxPhoto();
}

function closeLightbox() {
  document.getElementById('modal-lightbox').classList.add('hidden');
}

function updateLightboxPhoto() {
  const p = ADVESTOR_DATA.properties.find(item => item.id === currentPropertyId);
  if (!p) return;
  document.getElementById('lightbox-img').src = p.photos[currentPhotoIndex];
  document.getElementById('lightbox-counter').innerText = `${currentPhotoIndex + 1} / ${p.photos.length}`;
}

function renderNextStepCard(p) {
  const card = document.getElementById('detail-nextstep-card');
  const whatsappMsg = encodeURIComponent(
    `Olá ${ADVESTOR_DATA.client.advisor.name}, estou no portal da Advestor acompanhando o imóvel ${p.code} (${p.neighborhood} - ${p.street}) e gostaria de tirar uma dúvida sobre os próximos passos.`
  );
  const whatsappUrl = `https://wa.me/55${ADVESTOR_DATA.client.advisor.phone}?text=${whatsappMsg}`;

  if (p.status === "Aguardando sua decisão") {
    card.className = "bg-[#FFF5EE] border-2 border-[#B5652B] rounded-xl p-5 shadow-sm space-y-3.5";
    card.innerHTML = `
      <div class="flex items-center gap-2 text-[#B5652B] font-bold text-xs uppercase tracking-wider">
        <span class="w-2.5 h-2.5 rounded-full bg-[#B5652B] animate-ping"></span>
        Próximo passo · Requer sua ação
      </div>
      <p class="text-sm font-semibold text-slate-800 leading-snug">
        ${p.actionNotice}
      </p>
      <div class="flex flex-col sm:flex-row gap-2.5 pt-1">
        <button onclick="promptApprovalConfirmation(${p.id})" class="flex-1 bg-[#13495C] hover:bg-[#0E3645] text-white font-bold py-2.5 px-4 rounded-lg text-xs shadow-sm transition flex items-center justify-center gap-2">
          <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          Aprovar proposta
        </button>
        <a href="${whatsappUrl}" target="_blank" class="flex-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold py-2.5 px-4 rounded-lg text-xs transition flex items-center justify-center gap-2">
          <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
          Falar com meu assessor
        </a>
      </div>
    `;
  } else if (p.status === "Descartado") {
    card.className = "bg-slate-100 border border-slate-300 rounded-xl p-5 shadow-sm space-y-2";
    card.innerHTML = `
      <div class="flex items-center gap-2 text-red-700 font-bold text-xs uppercase tracking-wider">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>
        Imóvel Descartado
      </div>
      <p class="text-xs text-slate-700 leading-relaxed font-semibold">
        Motivo do descarte: ${p.discardReason}
      </p>
      <p class="text-[11px] text-slate-500">
        Nossa busca continua ativa para encontrar opções superiores no mesmo perfil de orçamento.
      </p>
    `;
  } else {
    card.className = "bg-sky-50 border border-sky-200 rounded-xl p-5 shadow-sm space-y-2";
    card.innerHTML = `
      <div class="flex items-center gap-2 text-[#13495C] font-bold text-xs uppercase tracking-wider">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        Próximo passo em andamento
      </div>
      <p class="text-xs text-slate-800 font-medium">
        ${p.actionNotice || p.nextStep}
      </p>
      <div class="pt-1">
        <a href="${whatsappUrl}" target="_blank" class="inline-flex items-center gap-1.5 text-xs text-[#13495C] font-bold hover:underline">
          Conversar com o assessor pelo WhatsApp →
        </a>
      </div>
    `;
  }
}

function renderValuesCard(p) {
  document.getElementById('detail-val-asking').innerText = formatCurrency(p.askingPrice);
  document.getElementById('detail-val-sqm').innerText = `R$ ${p.sqmPrice.toLocaleString('pt-BR')}/m²`;
  document.getElementById('detail-val-sqm-avg').innerText = `R$ ${p.avgRegionSqm.toLocaleString('pt-BR')}/m²`;

  const proposalRow = document.getElementById('detail-proposal-row');
  if (p.proposedPrice) {
    proposalRow.classList.remove('hidden');
    document.getElementById('detail-val-proposed').innerText = formatCurrency(p.proposedPrice);
    const diff = p.askingPrice - p.proposedPrice;
    const discountBadge = document.getElementById('detail-val-discount');
    if (diff > 0) {
      discountBadge.innerText = `R$ ${diff.toLocaleString('pt-BR')} abaixo do pedido`;
      discountBadge.className = "text-[10px] bg-emerald-200 text-emerald-900 font-bold px-1.5 py-0.5 rounded";
    } else {
      discountBadge.innerText = "Valor de contraproposta";
      discountBadge.className = "text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.5 rounded";
    }
  } else {
    proposalRow.classList.add('hidden');
  }
}

function renderAnalysisCard(p) {
  const prosList = document.getElementById('detail-pros-list');
  prosList.innerHTML = '';
  p.analysis.pros.forEach(item => {
    const li = document.createElement('li');
    li.className = "flex items-start gap-2";
    li.innerHTML = `
      <svg class="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
      <span>${item}</span>
    `;
    prosList.appendChild(li);
  });

  const consList = document.getElementById('detail-cons-list');
  consList.innerHTML = '';
  p.analysis.cons.forEach(item => {
    const li = document.createElement('li');
    li.className = "flex items-start gap-2";
    li.innerHTML = `
      <svg class="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
      <span>${item}</span>
    `;
    consList.appendChild(li);
  });
}

function renderTimelineCard(p) {
  const container = document.getElementById('detail-timeline-container');
  container.innerHTML = '';

  const itemsToShow = isTimelineExpanded ? p.timeline : p.timeline.slice(0, 3);

  itemsToShow.forEach((item, index) => {
    const isLatest = index === 0;
    const node = document.createElement('div');
    node.className = "relative";
    node.innerHTML = `
      <div class="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${isLatest ? 'bg-[#13495C] ring-2 ring-[#13495C]/30' : 'bg-slate-400'}"></div>
      <span class="font-bold ${isLatest ? 'text-[#13495C]' : 'text-slate-600'}">${item.date}</span>
      <p class="text-slate-700 mt-0.5">${item.text}</p>
    `;
    container.appendChild(node);
  });

  const toggleBtn = document.getElementById('btn-toggle-timeline');
  if (p.timeline.length <= 3) {
    toggleBtn.classList.add('hidden');
  } else {
    toggleBtn.classList.remove('hidden');
    toggleBtn.innerText = isTimelineExpanded 
      ? "← Recolher histórico" 
      : `Ver histórico completo (${p.timeline.length} eventos) →`;
  }
}

function toggleFullTimeline() {
  isTimelineExpanded = !isTimelineExpanded;
  const p = ADVESTOR_DATA.properties.find(item => item.id === currentPropertyId);
  if (p) renderTimelineCard(p);
}

function renderSpecsGrid(p) {
  const grid = document.getElementById('detail-specs-grid');
  const specs = [
    { label: "Área Útil", val: `${p.area} m²`, icon: "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" },
    { label: "Quartos", val: `${p.bedrooms} Qto${p.bedrooms > 1 ? 's' : ''}`, icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { label: "Garagem", val: p.garage > 0 ? `${p.garage} Vaga` : "Sem vaga", icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" },
    { label: "Andar", val: p.floor, icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" },
    { label: "Posição", val: p.position, icon: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" },
    { label: "Condomínio", val: formatCurrency(p.condoFee), icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" },
    { label: "IPTU / ano", val: formatCurrency(p.tax), icon: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" },
    { label: "Ano Prédio", val: p.builtYear.toString(), icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }
  ];

  grid.innerHTML = '';
  specs.forEach(s => {
    const item = document.createElement('div');
    item.className = "bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex flex-col justify-between";
    item.innerHTML = `
      <div class="flex items-center gap-1.5 text-slate-400 mb-1">
        <svg class="w-3.5 h-3.5 text-[#13495C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${s.icon}"/></svg>
        <span class="text-[10px] uppercase font-bold tracking-wider">${s.label}</span>
      </div>
      <span class="font-bold text-slate-800 text-xs">${s.val}</span>
    `;
    grid.appendChild(item);
  });
}

function renderDocumentsCard(p) {
  const container = document.getElementById('detail-documents-list');
  container.innerHTML = '';

  if (!p.documents || p.documents.length === 0) {
    container.innerHTML = `
      <div class="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-slate-500 text-center">
        Documentos serão adicionados após a aprovação da proposta e avanço das certidões.
      </div>
    `;
    return;
  }

  p.documents.forEach(doc => {
    const item = document.createElement('div');
    item.className = "flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition";
    item.innerHTML = `
      <div class="flex items-center gap-2.5 single-line-truncate">
        <div class="w-7 h-7 rounded bg-red-100 text-red-700 flex items-center justify-center shrink-0 font-bold text-[10px]">
          PDF
        </div>
        <div class="single-line-truncate">
          <span class="font-semibold text-slate-800 block single-line-truncate">${doc.name}</span>
          <span class="text-[10px] text-slate-400">Atualizado em ${doc.date} · ${doc.size}</span>
        </div>
      </div>
      <button onclick="downloadMockDocument('${doc.name}')" class="shrink-0 p-1.5 text-[#13495C] hover:text-[#B5652B] transition" title="Baixar documento">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
      </button>
    `;
    container.appendChild(item);
  });
}

function downloadMockDocument(name) {
  showToast(`Iniciando download seguro: ${name}`);
}

function toggleNotifications() {
  const dropdown = document.getElementById('notif-dropdown');
  dropdown.classList.toggle('hidden');
}

function renderNotifications() {
  const list = document.getElementById('notif-list');
  list.innerHTML = '';

  const unreadCount = ADVESTOR_DATA.notifications.filter(n => !n.read).length;
  const badge = document.getElementById('notif-badge');
  const countText = document.getElementById('notif-count-text');

  if (unreadCount > 0) {
    badge.innerText = unreadCount;
    badge.classList.remove('hidden');
    countText.innerText = `${unreadCount} nova${unreadCount > 1 ? 's' : ''}`;
  } else {
    badge.classList.add('hidden');
    countText.innerText = "0 não lidas";
  }

  ADVESTOR_DATA.notifications.forEach(n => {
    const item = document.createElement('div');
    const bgClass = n.requiresAction 
      ? "bg-orange-50/80 hover:bg-orange-100/70 border-l-4 border-[#B5652B]" 
      : "hover:bg-slate-50";

    item.className = `p-3 cursor-pointer transition ${bgClass} ${n.read ? 'opacity-80' : 'font-medium'}`;
    item.onclick = () => {
      n.read = true;
      renderNotifications();
      toggleNotifications();
      openPropertyDetail(n.propertyId);
    };

    item.innerHTML = `
      <div class="flex items-center justify-between gap-1 mb-1">
        <span class="font-bold ${n.requiresAction ? 'text-[#B5652B]' : 'text-[#13495C]'}">${n.title}</span>
        <span class="text-[10px] text-slate-400">${n.date}</span>
      </div>
      <p class="text-slate-600 text-[11px] leading-tight">${n.text}</p>
    `;
    list.appendChild(item);
  });
}

function markAllNotificationsAsRead() {
  ADVESTOR_DATA.notifications.forEach(n => n.read = true);
  renderNotifications();
  showToast('Todas as notificações foram marcadas como lidas.');
}

document.addEventListener('click', function(event) {
  const notifBtn = document.getElementById('notif-btn');
  const notifDropdown = document.getElementById('notif-dropdown');
  if (notifBtn && notifDropdown && !notifBtn.contains(event.target) && !notifDropdown.contains(event.target)) {
    notifDropdown.classList.add('hidden');
  }
});

function renderCalendar() {
  const grid = document.getElementById('calendar-days-grid');
  grid.innerHTML = '';

  const totalDays = 30;
  const startDayOffset = 0;

  const events = {
    6: { type: 'deadline', label: 'Prazo Proposta (Flamengo)' },
    7: { type: 'visit', label: 'Visita Botafogo (10h)' }
  };

  for (let i = 0; i < startDayOffset; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = "h-9";
    grid.appendChild(emptyCell);
  }

  for (let day = 1; day <= totalDays; day++) {
    const cell = document.createElement('div');
    const ev = events[day];
    let extraClasses = "border border-slate-100 hover:bg-slate-100 text-slate-700";
    let dot = "";

    if (ev) {
      if (ev.type === 'deadline') {
        extraClasses = "bg-orange-100 border-[#B5652B] font-bold text-[#B5652B]";
        dot = `<span class="w-1.5 h-1.5 rounded-full bg-[#B5652B] block mx-auto mt-0.5"></span>`;
      } else {
        extraClasses = "bg-sky-100 border-[#13495C] font-bold text-[#13495C]";
        dot = `<span class="w-1.5 h-1.5 rounded-full bg-[#13495C] block mx-auto mt-0.5"></span>`;
      }
    }

    cell.className = `h-9 flex flex-col items-center justify-center rounded transition cursor-pointer ${extraClasses}`;
    cell.innerHTML = `<span>${day}</span>${dot}`;
    cell.onclick = () => {
      if (ev) {
        showToast(`${day}/11/2026: ${ev.label}`);
      }
    };
    grid.appendChild(cell);
  }

  const eventsList = document.getElementById('calendar-events-list');
  eventsList.innerHTML = `
    <div class="p-2.5 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-between">
      <div>
        <span class="font-bold text-[#B5652B] block">06/11/2026 (Sexta-feira) · Limite de Decisão</span>
        <span class="text-slate-600">Aprovação da proposta de R$ 365.000 no Flamengo</span>
      </div>
      <button onclick="closeModal('modal-calendar'); openPropertyDetail(1);" class="text-[11px] font-bold text-[#13495C] underline">Ver Imóvel</button>
    </div>
    <div class="p-2.5 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-between">
      <div>
        <span class="font-bold text-[#13495C] block">07/11/2026 (Sábado) às 10:00 · Visita Presencial</span>
        <span class="text-slate-600">Rua Álvaro Ramos, Botafogo com o assessor Carlos</span>
      </div>
      <button onclick="closeModal('modal-calendar'); openPropertyDetail(2);" class="text-[11px] font-bold text-[#13495C] underline">Ver Imóvel</button>
    </div>
  `;
}

function promptApprovalConfirmation(propertyId) {
  const p = ADVESTOR_DATA.properties.find(item => item.id === propertyId);
  if (!p) return;
  document.getElementById('modal-approval-price').innerText = formatCurrency(p.proposedPrice);
  document.getElementById('modal-approval-place').innerText = `${p.neighborhood} (${p.street})`;
  openModal('modal-confirm-approval');
}

function executeProposalApproval() {
  closeModal('modal-confirm-approval');
  
  const p = ADVESTOR_DATA.properties.find(item => item.id === currentPropertyId);
  if (p) {
    p.status = "Fechado";
    p.stageCategory = "Encerrados";
    p.requiresAction = false;
    p.actionNotice = "Proposta aprovada com sucesso! A assessoria jurídica já iniciou a coleta da documentação para lavratura.";
    p.timeline.unshift({
      date: "04/11/2026",
      text: "Proposta formal de compra aprovada pelo cliente através do Portal."
    });
  }

  openPropertyDetail(currentPropertyId);
  renderFilterButtons();
  renderPropertyCards();
  showToast('🎉 Parabéns! Proposta aprovada com sucesso. Seu assessor foi notificado.');
}

function handleRecommendSubmit(event) {
  event.preventDefault();
  const url = document.getElementById('recommend-url').value;
  const notes = document.getElementById('recommend-notes').value;

  closeModal('modal-recommend');
  document.getElementById('recommend-url').value = '';
  document.getElementById('recommend-notes').value = '';

  ADVESTOR_DATA.summary.analyzed += 1;
  renderSummaryCounters();
  showToast('Imóvel indicado com sucesso! Nossa equipe técnica já iniciou a triagem.');
}

function openModal(modalId) {
  document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.add('hidden');
}

let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  toastMsg.innerText = message;

  clearTimeout(toastTimer);
  toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
  
  toastTimer = setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
  }, 4000);
}

document.addEventListener('keydown', function(e) {
  if (e.key === "Escape") {
    closeModal('modal-calendar');
    closeModal('modal-recommend');
    closeModal('modal-confirm-approval');
    closeLightbox();
  }
});
