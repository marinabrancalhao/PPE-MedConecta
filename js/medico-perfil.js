exigirSessao("Paciente");
renderCabecalho();

let LABEL_DIAS = { seg: "Seg", ter: "Ter", qua: "Qua", qui: "Qui", sex: "Sex", sab: "Sáb", dom: "Dom" };

// Pega o id do médico que veio na URL (ex: medico-perfil.html?id=id3),
// escrito lá no link do card em buscar-medicos.js
let params = new URLSearchParams(window.location.search);
let medicoId = params.get("id");
let medico = getMedicoPorId(medicoId);

if (medico === null) {
  document.querySelector("main").innerHTML =
    '<p class="text-empty">Médico não encontrado. <a href="buscar-medicos.html">Voltar</a></p>';
  throw new Error("Médico não encontrado");
}

let usuarioMedico = getUsuarioPorId(medico.usuarioId);
let nomeCompletoExibido = nomeExibicaoMedico(usuarioMedico, medico);

let fotoHtml = medico.fotoUrl
  ? '<img src="' + medico.fotoUrl + '" alt="Foto de ' + nomeCompletoExibido + '" class="profile-summary__avatar profile-summary__avatar--foto" />'
  : '<img src="img/icons/user.png" alt="Foto padrão" class="profile-summary__avatar profile-summary__avatar--foto" />';

document.querySelector("#perfilMedico").innerHTML =
  fotoHtml +
  "<div>" +
  '<h3 style="margin:0 0 4px;">' + nomeCompletoExibido + "</h3>" +
  '<p style="margin:0;color:var(--text-muted);">' + medico.especialidade + " · " + medico.crm + "</p>" +
  "</div>";

document.querySelector("#cidadeMedico").textContent = medico.cidade;
document.querySelector("#enderecoMedico").textContent = medico.endereco || "Endereço não informado";
document.querySelector("#telefoneMedico").textContent = medico.telefone;
document.querySelector("#valorMedico").textContent = "R$ " + medico.valorConsulta.toFixed(2) + " por consulta";

//Gera as opções de horário de 1 em 1 hora, dentro do expediente do médico.
//Para uma hora ANTES do horaFim de propósito, pra consulta (45min) não
//passar do expediente
function gerarOpcoesDeHorario(horaInicio, horaFim) {
  let selectHora = document.querySelector("#horaConsulta");
  let horaAtual = Number(horaInicio.split(":")[0]);
  let horaLimite = Number(horaFim.split(":")[0]);
  let html = '<option value="">Selecione um horário</option>';

  while (horaAtual < horaLimite) {
    let horaFormatada = String(horaAtual).padStart(2, "0") + ":00";
    html += '<option value="' + horaFormatada + '">' + horaFormatada + "</option>";
    horaAtual++;
  }

  selectHora.innerHTML = html;
}

gerarOpcoesDeHorario(medico.horaInicio, medico.horaFim);

let diasFormatados = [];
for (let i = 0; i < medico.diasAtendimento.length; i++) {
  diasFormatados.push(LABEL_DIAS[medico.diasAtendimento[i]]);
}
document.querySelector("#disponibilidadeMedico").textContent =
  diasFormatados.join(", ") + " · " + medico.horaInicio + " às " + medico.horaFim;

document.querySelector("#formSolicitacao").addEventListener("submit", function (e) {
  e.preventDefault();
  let erroEl = document.querySelector("#erroSolicitacao");
  erroEl.textContent = "";

  let data = document.querySelector("#dataConsulta").value;
  let hora = document.querySelector("#horaConsulta").value;

  if (data === "" || hora === "") {
    erroEl.textContent = "Selecione a data e a hora da consulta.";
    return;
  }

  let dataHoraISO = new Date(data + "T" + hora).toISOString();
  let queixaPrincipal = document.querySelector("#queixaPrincipal").value.trim();
  let usuario = getUsuarioLogado();
  let paciente = getPacientePorUsuarioId(usuario.id);

  try {
    solicitarConsulta({
      pacienteId: paciente.id,
      medicoId: medico.id,
      dataHora: dataHoraISO,
      queixaPrincipal: queixaPrincipal,
    });
    mostrarAlerta("Solicitação enviada! Aguarde a confirmação do médico.");
    setTimeout(function () {
      window.location.href = "minhas-consultas.html";
    }, 1200);
  } catch (erro) {
    erroEl.textContent = erro.message;
  }
});
