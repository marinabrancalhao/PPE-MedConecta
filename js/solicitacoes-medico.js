exigirSessao("Medico");
renderCabecalho();

let usuarioMedico = getUsuarioLogado();
let medicoLogado = getMedicoPorUsuarioId(usuarioMedico.id);

function renderizarSolicitacoes() {
  let container = document.querySelector("#listaSolicitacoes");
  let solicitacoes = getConsultasDoMedicoPorStatus(medicoLogado.id, "Solicitada");

  solicitacoes.sort(function (a, b) {
    return new Date(a.dataHora) - new Date(b.dataHora);
  });

  if (solicitacoes.length === 0) {
    container.innerHTML = '<p class="text-empty">Nenhuma solicitação pendente no momento.</p>';
    return;
  }

  let html = "";
  for (let i = 0; i < solicitacoes.length; i++) {
    let c = solicitacoes[i];
    let paciente = getPacientePorId(c.pacienteId);
    let usuarioPaciente = paciente ? getUsuarioPorId(paciente.usuarioId) : null;

    html +=
      '<div class="card">' +
      '<div class="action-row" style="justify-content:space-between;">' +
      "<div>" +
      '<h3 style="margin:0 0 4px;">' + (usuarioPaciente ? usuarioPaciente.nome : "Paciente removido") + "</h3>" +
      '<p style="margin:0;color:var(--text-muted);">' + formatarDataHora(c.dataHora) + "</p>";

    if (c.queixaPrincipal) {
      html += '<p style="margin:6px 0 0;color:var(--text-muted);"><strong>Queixa principal:</strong> ' + c.queixaPrincipal + "</p>";
    }

    html +=
      "</div>" +
      '<div class="action-row">' +
      '<button class="btn btn--primary" style="width:auto;padding:8px 16px;" data-aceitar="' + c.id + '">Aceitar</button>' +
      '<button class="btn btn--danger" style="padding:8px 16px;" data-recusar="' + c.id + '">Recusar</button>' +
      "</div></div></div>";
  }
  container.innerHTML = html;

  let botoesAceitar = container.querySelectorAll("[data-aceitar]");
  for (let i = 0; i < botoesAceitar.length; i++) {
    botoesAceitar[i].addEventListener("click", function () {
      responderSolicitacao(this.dataset.aceitar, true);
      mostrarAlerta("Consulta confirmada!");
      renderizarSolicitacoes();
    });
  }

  let botoesRecusar = container.querySelectorAll("[data-recusar]");
  for (let i = 0; i < botoesRecusar.length; i++) {
    botoesRecusar[i].addEventListener("click", function () {
      // Só ações negativas/difíceis de desfazer (recusar, cancelar) pedem confirmação.
      // Aceitar não pede, porque errar não prejudica ninguém - dá pra ajustar depois.
      if (confirm("Deseja realmente recusar esta solicitação?")) {
        responderSolicitacao(this.dataset.recusar, false);
        mostrarAlerta("Solicitação recusada.");
        renderizarSolicitacoes();
      }
    });
  }
}

renderizarSolicitacoes();
