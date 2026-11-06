// esqueci-senha.js - Lógica de Recuperação de Senha Advestor

function handleRecovery(event) {
  event.preventDefault();

  const emailInput = document.getElementById('recovery-email');
  const email = emailInput.value.trim().toLowerCase();
  const alertSuccess = document.getElementById('alert-success');
  const alertError = document.getElementById('alert-error');
  const btn = document.getElementById('btn-submit');

  alertSuccess.classList.add('hidden');
  alertError.classList.add('hidden');

  if (!email || !email.includes('@')) {
    alertError.classList.remove('hidden');
    document.getElementById('error-message').innerText = 'Por favor, insira um e-mail válido.';
    return;
  }

  // Estado de carregamento no botão
  btn.disabled = true;
  btn.innerHTML = `
    <svg class="animate-spin h-4 w-4 text-white inline mr-2" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
    </svg>
    <span>Verificando cadastro...</span>
  `;

  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = `
      <span>Enviar Instruções de Acesso</span>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
    `;

    // Verifica no registro de clientes cadastrados no navegador
    let foundClient = null;
    const reg = localStorage.getItem('advestor_clients_registry');
    if (reg) {
      try {
        const clients = JSON.parse(reg);
        foundClient = clients.find(c => c.email && c.email.toLowerCase() === email);
      } catch(e) {}
    }

    // Se for o cliente padrão
    if (!foundClient && email === 'joao.exemplo@email.com') {
      foundClient = { nome: 'João Exemplo', senhaTemporaria: 'ADV-2026' };
    }

    alertSuccess.classList.remove('hidden');
    
    if (foundClient) {
      document.getElementById('success-message').innerHTML = `
        Identificamos o cadastro de <strong>${foundClient.nome}</strong>.<br>
        Sua senha provisória de acesso é: <strong class="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-mono text-xs">${foundClient.senhaTemporaria || 'ADV-2026'}</strong>.<br>
        Use-a para acessar sua conta na tela de login.
      `;
    } else {
      document.getElementById('success-message').innerHTML = `
        Se o e-mail <strong>${email}</strong> estiver registrado em nossa assessoria, enviamos as instruções de recuperação. Caso não receba, fale diretamente com seu assessor.
      `;
    }

    emailInput.value = '';
  }, 800);
}