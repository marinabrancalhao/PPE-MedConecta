exigirSessao("Medico");
renderCabecalho();

let usuarioMedico = getUsuarioLogado();
let medicoLogado = getMedicoPorUsuarioId(usuarioMedico.id);
let filtroAtivo = "todas";

let campoData = document.querySelector("#campoData");
let campoMes = document.querySelector("#campoMes");
let inputData = document.querySelector("#dataFiltro");
let inputMes = document.querySelector("#mesFiltro");

// valores padrão: hoje e mês atual
let hoje = new Date();
inputData.value = hoje.toISOString().slice(0, 10);
inputMes.value = hoje.toISOString().slice(0, 7);

let botoesFiltro = document.querySelectorAll("#filtrosConsulta .botao-filtro");
for (let i = 0; i < botoesFiltro.length; i++) {
  botoesFiltro[i].addEventListener("click", function () {
    filtroAtivo = this.dataset.filtro;

    for (let j = 0; j < botoesFiltro.length; j++) {
      botoesFiltro[j].setAttribute("aria-pressed", botoesFiltro[j] === this ? "true" : "false");
    }

    campoData.style.display = filtroAtivo === "dia" ? "block" : "none";
    campoMes.style.display = filtroAtivo === "mes" ? "block" : "none";

    renderizarConsultas();
  });
}

inputData.addEventListener("change", renderizarConsultas);
inputMes.addEventListener("change", renderizarConsultas);

function ehMesmoDia(dataISO, dataComparar) {
  let data = new Date(dataISO);
  // Compara Date com Date - os dois usam a mesma contagem de mês
  // (começando do zero), então não precisa de nenhum ajuste aqui
  return (
    data.getFullYear() === dataComparar.getFullYear() &&
    data.getMonth() === dataComparar.getMonth() &&
    data.getDate() === dataComparar.getDate()
  );
}

function ehMesmoMes(dataISO, anoMes) {
  let data = new Date(dataISO);
  // getMonth() começa do zero (jan=0), mas o campo <input type="month">
  // conta "normal" (jan=1) - por isso o +1 aqui, só nessa comparação
  // com texto vindo do formulário
  let anoMesData = data.getFullYear() + "-" + String(data.getMonth() + 1).padStart(2, "0");
  return anoMesData === anoMes;
}

//Monta o HTML de um card de consulta (reaproveitado nas duas seções)
function construirCardConsultaMedico(c) {
  let paciente = getPacientePorId(c.pacienteId);
  let usuarioPaciente = paciente ? getUsuarioPorId(paciente.usuarioId) : null;

  let html =
    '<div class="card" data-qa="card-consulta-medico">' +
    "<h3 style='margin:0 0 4px;'>" + (usuarioPaciente ? usuarioPaciente.nome : "Paciente removido") + "</h3>" +
    "<p style='margin:0;color:var(--text-muted);'>" + formatarDataHora(c.dataHora) + "</p>";

  if (c.queixaPrincipal) {
    html +=
      "<p style='margin:8px 0 0;color:var(--text-muted);'><strong>Queixa principal:</strong> " + c.queixaPrincipal + "</p>";
  }

  html += "</div>";
  return html;
}

function renderizarConsultas() {
  let container = document.querySelector("#listaConsultas");
  let consultas = getConsultasDoMedicoPorStatus(medicoLogado.id, "Confirmada");
  let filtradas = [];

  for (let i = 0; i < consultas.length; i++) {
    let c = consultas[i];

    if (filtroAtivo === "todas") {
      filtradas.push(c);
    } else if (filtroAtivo === "hoje" && ehMesmoDia(c.dataHora, new Date())) {
      filtradas.push(c);
    } else if (filtroAtivo === "dia" && inputData.value && ehMesmoDia(c.dataHora, new Date(inputData.value + "T00:00:00"))) {
      filtradas.push(c);
    } else if (filtroAtivo === "mes" && inputMes.value && ehMesmoMes(c.dataHora, inputMes.value)) {
      filtradas.push(c);
    }
  }

  if (filtradas.length === 0) {
    container.innerHTML = '<p class="text-empty">Nenhuma consulta confirmada para esse período.</p>';
    return;
  }

  let agora = new Date();
  let futuras = [];
  let passadas = [];

  for (let i = 0; i < filtradas.length; i++) {
    if (new Date(filtradas[i].dataHora) >= agora) {
      futuras.push(filtradas[i]);
    } else {
      passadas.push(filtradas[i]);
    }
  }

  futuras.sort(function (a, b) {
    return new Date(a.dataHora) - new Date(b.dataHora);
  });
  passadas.sort(function (a, b) {
    return new Date(b.dataHora) - new Date(a.dataHora);
  });

  let html = "";

  html += '<h2 class="page__title" style="font-size:1.1rem;">Próximas consultas</h2>';
  if (futuras.length === 0) {
    html += '<p class="text-empty">Nenhuma consulta futura para esse período.</p>';
  } else {
    for (let i = 0; i < futuras.length; i++) {
      html += construirCardConsultaMedico(futuras[i]);
    }
  }

  html += '<h2 class="page__title mt-section" style="font-size:1.1rem;">Consultas anteriores</h2>';
  if (passadas.length === 0) {
    html += '<p class="text-empty">Nenhuma consulta anterior nesse período.</p>';
  } else {
    for (let i = 0; i < passadas.length; i++) {
      html += construirCardConsultaMedico(passadas[i]);
    }
  }

  container.innerHTML = html;
}

renderizarConsultas();
