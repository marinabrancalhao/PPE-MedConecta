// Se já estiver logado como paciente, pula direto pro dashboard
let usuarioJaLogado = getUsuarioLogado();
if (usuarioJaLogado && usuarioJaLogado.tipo === "Paciente") {
  window.location.href = "buscar-medicos.html";
}

document.querySelector("#formLogin").addEventListener("submit", function (e) {
  e.preventDefault();
  let erroEl = document.querySelector("#erroLogin");
  erroEl.textContent = "";

  let email = document.querySelector("#email").value.trim().toLowerCase();
  let senha = document.querySelector("#senha").value;

  try {
    let usuario = login(email, senha);

    if (usuario.tipo !== "Paciente") {
      localStorage.removeItem("sessaoUsuarioId");
      erroEl.textContent = "Este e-mail está cadastrado como médico.";
      return;
    }

    window.location.href = "buscar-medicos.html";
  } catch (erro) {
    erroEl.textContent = erro.message;
  }
});
