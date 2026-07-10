let fotoBase64 = null;

//Lê o arquivo escolhido e guarda como base64, pra mostrar no preview e salvar depois
document.querySelector("#fotoPerfil").addEventListener("change", function (e) {
  let arquivo = e.target.files[0];
  if (!arquivo) return;

  // FileReader traduz a imagem escolhida em texto (base64), porque o
  // localStorage só sabe guardar texto - não dá pra salvar uma imagem "crua"
  let leitor = new FileReader();
  leitor.onload = function (evento) {
    fotoBase64 = evento.target.result;
    document.querySelector("#previewFoto").src = fotoBase64;
  };
  leitor.readAsDataURL(arquivo);
});

//Busca de endereço via BrasilAPI ao sair do campo de CEP
let inputCep = document.querySelector("#cep");

inputCep.addEventListener("blur", function () {
  let cepDigitado = inputCep.value.replace(/\D/g, "");

  if (cepDigitado.length !== 8) return;

  let url = "https://brasilapi.com.br/api/cep/v1/" + cepDigitado;

  fetch(url)
    .then(function (response) {
      if (!response.ok) throw new Error("CEP não encontrado");
      return response.json();
    })
    .then(function (dados) {
      mostrarEndereco(dados);
    })
    .catch(function () {
      mostrarAlerta("Não foi possível localizar esse CEP.");
    });
});

function mostrarEndereco(dados) {
  document.querySelector("#endereco").value = (dados.street || "") + ", " + (dados.neighborhood || "");
  document.querySelector("#cidade").value = dados.city + " - " + dados.state;
}

document.querySelector("#formCadastro").addEventListener("submit", function (e) {
  e.preventDefault();
  document.querySelector("#erroDias").textContent = "";
  document.querySelector("#erroFoto").textContent = "";
  document.querySelector('[data-erro-de="email"]').textContent = "";

  let nome = document.querySelector("#nome").value.trim();
  let sexo = document.querySelector("#sexo").value;
  let crm = document.querySelector("#crm").value.trim();
  let especialidade = document.querySelector("#especialidade").value;
  let cep = document.querySelector("#cep").value.trim();
  let endereco = document.querySelector("#endereco").value.trim();
  let cidade = document.querySelector("#cidade").value.trim();
  let telefone = document.querySelector("#telefone").value.trim();
  let valorConsulta = Number(document.querySelector("#valorConsulta").value);
  let horaInicio = document.querySelector("#horaInicio").value;
  let horaFim = document.querySelector("#horaFim").value;
  let email = document.querySelector("#email").value.trim().toLowerCase();
  let senha = document.querySelector("#senha").value;

  let checkboxesDias = document.querySelectorAll('.weekday-picker input[type="checkbox"]:checked');
  let diasAtendimento = [];
  for (let i = 0; i < checkboxesDias.length; i++) {
    diasAtendimento.push(checkboxesDias[i].value);
  }

  if (fotoBase64 === null) {
    document.querySelector("#erroFoto").textContent = "Envie uma foto de perfil.";
    return;
  }

  if (getUsuarioPorEmail(email)) {
    document.querySelector('[data-erro-de="email"]').textContent = "Já existe uma conta com este e-mail.";
    return;
  }

  if (diasAtendimento.length === 0) {
    document.querySelector("#erroDias").textContent = "Selecione ao menos um dia de atendimento.";
    return;
  }

  if (horaInicio >= horaFim) {
    document.querySelector("#erroDias").textContent = "O horário final deve ser depois do inicial.";
    return;
  }

  let usuario = addUsuario({ nome: nome, email: email, senha: senha, tipo: "Medico" });
  addMedico({
    usuarioId: usuario.id,
    sexo: sexo,
    crm: crm,
    especialidade: especialidade,
    cidade: cidade,
    cep: cep,
    endereco: endereco,
    telefone: telefone,
    valorConsulta: valorConsulta,
    diasAtendimento: diasAtendimento,
    horaInicio: horaInicio,
    horaFim: horaFim,
    fotoUrl: fotoBase64,
  });

  localStorage.setItem("sessaoUsuarioId", usuario.id);
  mostrarAlerta("Cadastro realizado com sucesso!");

  setTimeout(function () {
    window.location.href = "minhas-consultas-medico.html";
  }, 1000);
});
