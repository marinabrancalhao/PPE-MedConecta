document.querySelector("#formCadastro").addEventListener("submit", function (e) {
  e.preventDefault();
  document.querySelector('[data-erro-de="email"]').textContent = "";

  let nome = document.querySelector("#nome").value.trim();
  let dataNascimento = document.querySelector("#dataNascimento").value;
  let telefone = document.querySelector("#telefone").value.trim();
  let email = document.querySelector("#email").value.trim().toLowerCase();
  let senha = document.querySelector("#senha").value;

  if (getUsuarioPorEmail(email)) {
    document.querySelector('[data-erro-de="email"]').textContent = "Já existe uma conta com este e-mail.";
    return;
  }

  let usuario = addUsuario({ nome: nome, email: email, senha: senha, tipo: "Paciente" });
  addPaciente({ usuarioId: usuario.id, dataNascimento: dataNascimento, telefone: telefone });

  localStorage.setItem("sessaoUsuarioId", usuario.id);
  mostrarAlerta("Cadastro realizado com sucesso!");

  setTimeout(function () {
    window.location.href = "buscar-medicos.html";
  }, 1000);
});
