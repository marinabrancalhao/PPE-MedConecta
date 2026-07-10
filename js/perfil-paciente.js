exigirSessao("Paciente");
renderCabecalho();

let usuarioLogado = getUsuarioLogado();
let pacienteLogado = getPacientePorUsuarioId(usuarioLogado.id);

document.querySelector("#nome").value = usuarioLogado.nome;
document.querySelector("#email").value = usuarioLogado.email;
document.querySelector("#dataNascimento").value = pacienteLogado.dataNascimento;
document.querySelector("#telefone").value = pacienteLogado.telefone;

document.querySelector("#formPerfil").addEventListener("submit", function (e) {
  e.preventDefault();
  document.querySelector('[data-erro-de="email"]').textContent = "";

  let nome = document.querySelector("#nome").value.trim();
  let email = document.querySelector("#email").value.trim().toLowerCase();
  let dataNascimento = document.querySelector("#dataNascimento").value;
  let telefone = document.querySelector("#telefone").value.trim();

  let outroUsuario = getUsuarioPorEmail(email);
  if (outroUsuario && outroUsuario.id !== usuarioLogado.id) {
    document.querySelector('[data-erro-de="email"]').textContent = "Este e-mail já está em uso.";
    return;
  }

  updateUsuario(usuarioLogado.id, { nome: nome, email: email });
  updatePaciente(pacienteLogado.id, { dataNascimento: dataNascimento, telefone: telefone });

  mostrarAlerta("Perfil atualizado com sucesso!");
});
