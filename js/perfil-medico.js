exigirSessao("Medico");
renderCabecalho();

let usuarioLogado = getUsuarioLogado();
let medicoLogado = getMedicoPorUsuarioId(usuarioLogado.id);
let novaFotoBase64 = null;

if (medicoLogado.fotoUrl) {
  document.querySelector("#previewFoto").src = medicoLogado.fotoUrl;
}

//Lê o arquivo escolhido e guarda como base64, pra mostrar no preview e salvar depois
document.querySelector("#fotoPerfil").addEventListener("change", function (e) {
  let arquivo = e.target.files[0];
  if (!arquivo) return;

  // FileReader traduz a imagem escolhida em texto (base64), porque o
  // localStorage só sabe guardar texto - não dá pra salvar uma imagem "crua"
  let leitor = new FileReader();
  leitor.onload = function (evento) {
    novaFotoBase64 = evento.target.result;
    document.querySelector("#previewFoto").src = novaFotoBase64;
  };
  leitor.readAsDataURL(arquivo);
});

document.querySelector("#nome").value = usuarioLogado.nome;
document.querySelector("#sexo").value = medicoLogado.sexo || "M";
document.querySelector("#email").value = usuarioLogado.email;
document.querySelector("#crm").value = medicoLogado.crm;
document.querySelector("#especialidade").value = medicoLogado.especialidade;
document.querySelector("#cep").value = medicoLogado.cep || "";
document.querySelector("#endereco").value = medicoLogado.endereco || "";
document.querySelector("#cidade").value = medicoLogado.cidade;
document.querySelector("#telefone").value = medicoLogado.telefone;
document.querySelector("#valorConsulta").value = medicoLogado.valorConsulta;
document.querySelector("#horaInicio").value = medicoLogado.horaInicio;
document.querySelector("#horaFim").value = medicoLogado.horaFim;

for (let i = 0; i < medicoLogado.diasAtendimento.length; i++) {
  let checkbox = document.querySelector("#dia-" + medicoLogado.diasAtendimento[i]);
  if (checkbox) checkbox.checked = true;
}

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
      document.querySelector("#endereco").value = (dados.street || "") + ", " + (dados.neighborhood || "");
      document.querySelector("#cidade").value = dados.city + " - " + dados.state;
    })
    .catch(function () {
      mostrarAlerta("Não foi possível localizar esse CEP.");
    });
});

document.querySelector("#formPerfil").addEventListener("submit", function (e) {
  e.preventDefault();
  document.querySelector("#erroDias").textContent = "";
  document.querySelector('[data-erro-de="email"]').textContent = "";

  let nome = document.querySelector("#nome").value.trim();
  let sexo = document.querySelector("#sexo").value;
  let email = document.querySelector("#email").value.trim().toLowerCase();
  let crm = document.querySelector("#crm").value.trim();
  let especialidade = document.querySelector("#especialidade").value;
  let cep = document.querySelector("#cep").value.trim();
  let endereco = document.querySelector("#endereco").value.trim();
  let cidade = document.querySelector("#cidade").value.trim();
  let telefone = document.querySelector("#telefone").value.trim();
  let valorConsulta = Number(document.querySelector("#valorConsulta").value);
  let horaInicio = document.querySelector("#horaInicio").value;
  let horaFim = document.querySelector("#horaFim").value;

  let checkboxesDias = document.querySelectorAll('.weekday-picker input[type="checkbox"]:checked');
  let diasAtendimento = [];
  for (let i = 0; i < checkboxesDias.length; i++) {
    diasAtendimento.push(checkboxesDias[i].value);
  }

  let outroUsuario = getUsuarioPorEmail(email);
  if (outroUsuario && outroUsuario.id !== usuarioLogado.id) {
    document.querySelector('[data-erro-de="email"]').textContent = "Este e-mail já está em uso.";
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

  updateUsuario(usuarioLogado.id, { nome: nome, email: email });
  updateMedico(medicoLogado.id, {
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
    fotoUrl: novaFotoBase64 || medicoLogado.fotoUrl || "",
  });

  mostrarAlerta("Perfil atualizado com sucesso!");
});
