let usuarioJaLogado = getUsuarioLogado();
if (usuarioJaLogado && usuarioJaLogado.tipo === "Medico") {
  window.location.href = "minhas-consultas-medico.html";
}

document.querySelector("#formLogin").addEventListener("submit", function (e) {
  e.preventDefault();
  let erroEl = document.querySelector("#erroLogin");
  erroEl.textContent = "";

  let email = document.querySelector("#email").value.trim().toLowerCase();
  let senha = document.querySelector("#senha").value;

  try {
    let usuario = login(email, senha);

    if (usuario.tipo !== "Medico") {
      localStorage.removeItem("sessaoUsuarioId");
      erroEl.textContent = "Este e-mail está cadastrado como paciente.";
      return;
    }

    window.location.href = "minhas-consultas-medico.html";
  } catch (erro) {
    erroEl.textContent = erro.message;
  }
});
