exigirSessao("Paciente");
renderCabecalho();

//Monta o HTML de um card de consulta (reaproveitado nas três seções)
function construirCardConsulta(c) {
  let medico = getMedicoPorId(c.medicoId);
  let usuarioMedico = medico ? getUsuarioPorId(medico.usuarioId) : null;
  let podeCancelar = c.status === "Solicitada" || c.status === "Confirmada";
  let nomeMedicoExibido = usuarioMedico
    ? nomeExibicaoMedico(usuarioMedico, medico)
    : "Médico removido";

  let html =
    '<div class="card" data-qa="card-consulta" data-consulta-id="' +
    c.id +
    '">' +
    '<div class="action-row" style="justify-content:space-between;">' +
    "<div>" +
    '<h3 style="margin:0 0 4px;">' +
    nomeMedicoExibido +
    "</h3>" +
    '<p style="margin:0;color:var(--text-muted);">' +
    (medico ? medico.especialidade : "") +
    "</p>" +
    '<p style="margin:6px 0 0;color:var(--text-muted);">' +
    formatarDataHora(c.dataHora) +
    "</p>" +
    "</div>" +
    '<div style="text-align:right;">' +
    tagStatus(c.status);

  if (podeCancelar) {
    html +=
      '<div style="margin-top:8px;"><button class="btn btn--danger" data-id="' +
      c.id +
      '" data-qa="btn-cancelar-consulta" style="padding:6px 12px;font-size:0.8rem;">Cancelar</button></div>';
  }

  html += "</div></div></div>";
  return html;
}

function renderizarConsultas() {
  let usuario = getUsuarioLogado();
  let paciente = getPacientePorUsuarioId(usuario.id);
  let container = document.querySelector("#listaConsultas");

  let consultas = getConsultasDoPaciente(paciente.id);

  if (consultas.length === 0) {
    container.innerHTML =
      '<p class="text-empty">Você ainda não tem consultas. <a href="buscar-medicos.html">Buscar médico</a></p>';
    return;
  }

  let agora = new Date();
  let futuras = [];
  let passadas = [];
  let canceladas = [];

  for (let i = 0; i < consultas.length; i++) {
    let c = consultas[i];

    if (c.status === "Cancelada" || c.status === "Recusada") {
      canceladas.push(c);
    } else if (new Date(c.dataHora) >= agora) {
      futuras.push(c);
    } else {
      passadas.push(c);
    }
  }

  // próximas: a mais próxima primeiro / anteriores e canceladas: a mais recente primeiro
  futuras.sort(function (a, b) {
    return new Date(a.dataHora) - new Date(b.dataHora);
  });
  passadas.sort(function (a, b) {
    return new Date(b.dataHora) - new Date(a.dataHora);
  });
  canceladas.sort(function (a, b) {
    return new Date(b.dataHora) - new Date(a.dataHora);
  });

  let html = "";

  html +=
    '<h2 class="page__title" style="font-size:1.1rem;">Próximas consultas</h2>';
  if (futuras.length === 0) {
    html += '<p class="text-empty">Nenhuma consulta futura.</p>';
  } else {
    for (let i = 0; i < futuras.length; i++) {
      html += construirCardConsulta(futuras[i]);
    }
  }

  html +=
    '<h2 class="page__title mt-section" style="font-size:1.1rem;">Consultas anteriores</h2>';
  if (passadas.length === 0) {
    html += '<p class="text-empty">Nenhuma consulta anterior.</p>';
  } else {
    for (let i = 0; i < passadas.length; i++) {
      html += construirCardConsulta(passadas[i]);
    }
  }

  html +=
    '<h2 class="page__title mt-section" style="font-size:1.1rem;">Canceladas / Recusadas</h2>';
  if (canceladas.length === 0) {
    html += '<p class="text-empty">Nenhuma consulta cancelada ou recusada.</p>';
  } else {
    for (let i = 0; i < canceladas.length; i++) {
      html += construirCardConsulta(canceladas[i]);
    }
  }

  container.innerHTML = html;

  let botoesCancelar = container.querySelectorAll("button[data-id]");
  for (let i = 0; i < botoesCancelar.length; i++) {
    botoesCancelar[i].addEventListener("click", function () {
      if (confirm("Deseja realmente cancelar esta consulta?")) {
        cancelarConsulta(this.dataset.id);
        mostrarAlerta("Consulta cancelada.");
        renderizarConsultas();
      }
    });
  }
}

renderizarConsultas();
