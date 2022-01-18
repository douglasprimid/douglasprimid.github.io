const formulario = document.querySelector("form");

function formularioEnviado(resposta) {
  if (resposta.ok) {
    formulario.innerHTML =
      "<p class='font-2-l' style='grid-column:1/-1; padding:1rem; border-radius:4px; background:#c9c9c9;'><span style='color:#317a00;'>Mensagem enviada com sucesso, nosso prazo de contato é de 24h</span></p>";
  } else {
    formulario.innerHTML =
      "<p class='font-2-l' style='grid-column:1/-1; padding:1rem; border-radius:4px; background:#c9c9c9;'><span style='color:#e00;'>Erro ao enviar, tente diretamente via nosso email: contato@bikcraft.com</span></p>";
  }
}

function enviarFormular(event) {
  event.preventDefault();

  const botao = document.querySelector("form button");

  botao.disabled = true;
  botao.innerText = "Enviando...";
  0;

  const data = new FormData(formulario);

  fetch("./enviar.php", {
    method: "POST",
    body: data,
  }).then(formularioEnviado);
}

formulario.addEventListener("submit", enviarFormular);
