// importer.js - Comunicação com a extensão do Chrome

// Substitua pelo ID gerado na tela chrome://extensions
const EXTENSION_ID = "bigegeefhihmfagkokencoplpdbammli";

function importFromExtension() {
  const urlInput = document.getElementById('import-url');
  const url = urlInput.value.trim();
  const statusEl = document.getElementById('import-status');
  const btn = document.getElementById('btn-import');

  if (!url) {
    alert('Por favor, cole o link do anúncio do imóvel.');
    return;
  }

  // Feedback visual no botão
  btn.disabled = true;
  btn.innerHTML = `
    <svg class="animate-spin h-3.5 w-3.5 text-white inline mr-1" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
    </svg>
    <span>Buscando...</span>
  `;

  if (statusEl) {
    statusEl.classList.remove('hidden');
    statusEl.className = "text-[11px] text-advestor-teal font-medium mt-2";
    statusEl.innerText = "A extensão está abrindo a página e coletando os dados do anúncio...";
  }

  // Verifica se o navegador tem suporte à API de extensões do Chrome
  if (typeof chrome === "undefined" || !chrome.runtime || !chrome.runtime.sendMessage) {
    alert('A extensão Advestor Importer não foi detectada neste navegador.\n\nCertifique-se de que está usando o Google Chrome com a extensão instalada.');
    resetButton(btn);
    if (statusEl) statusEl.innerText = "Extensão não encontrada no navegador.";
    return;
  }

  // Envia requisição externa para a extensão
  chrome.runtime.sendMessage(EXTENSION_ID, { action: 'EXTRACT_PROPERTY', url }, (response) => {
    resetButton(btn);

    if (chrome.runtime.lastError || !response || !response.success) {
      const errMsg = (response && response.error) || (chrome.runtime.lastError && chrome.runtime.lastError.message) || 'Falha na comunicação com a extensão.';
      alert('Erro ao importar: ' + errMsg + '\n\nVerifique se o ID da extensão em importer.js está correto e se ela está ativada.');
      if (statusEl) {
        statusEl.className = "text-[11px] text-red-600 font-medium mt-2";
        statusEl.innerText = "Erro ao importar: " + errMsg;
      }
      return;
    }

    const d = response.data;

    // Preenchimento automático dos campos do formulário
    if (d.bairro) document.getElementById('prop-bairro').value = d.bairro;
    if (d.rua) document.getElementById('prop-rua').value = d.rua;
    if (d.area) document.getElementById('prop-area').value = d.area;
    if (d.precoPedido) document.getElementById('prop-preco').value = d.precoPedido;
    if (d.quartos) document.getElementById('prop-quartos').value = d.quartos;
    if (d.vagas) document.getElementById('prop-vagas').value = d.vagas;
    if (d.andar) document.getElementById('prop-andar').value = d.andar;
    if (d.posicao) document.getElementById('prop-posicao').value = d.posicao;

    // Fotos (uma URL por linha no textarea)
    if (d.fotos && d.fotos.length > 0) {
      document.getElementById('prop-fotos').value = d.fotos.join('\n');
    }

    if (statusEl) {
      statusEl.className = "text-[11px] text-emerald-700 font-bold mt-2";
      statusEl.innerText = "✓ Dados e fotos importados com sucesso! Revise e clique em Salvar Imóvel.";
    }
  });
}

function resetButton(btn) {
  btn.disabled = false;
  btn.innerHTML = `
    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
    </svg>
    <span>Importar Dados</span>
  `};