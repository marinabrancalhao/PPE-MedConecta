exigirSessao("Paciente");
renderCabecalho();

let filtroEspecialidade = "Todas";
let termoBusca = "";

function especialidadesDisponiveis() {
  let medicos = getMedicos();
  let especialidades = ["Todas"];

  for (let i = 0; i < medicos.length; i++) {
    if (especialidades.indexOf(medicos[i].especialidade) === -1) {
      especialidades.push(medicos[i].especialidade);
    }
  }
  return especialidades;
}

function renderizarFiltros() {
  let container = document.querySelector("#filtrosEspecialidade");
  let especialidades = especialidadesDisponiveis();
  let html = "";

  for (let i = 0; i < especialidades.length; i++) {
    let esp = especialidades[i];
    let pressionado = esp === filtroEspecialidade ? "true" : "false";
    html +=
      '<button class="botao-filtro" aria-pressed="' + pressionado + '" data-esp="' + esp + '" data-qa="filtro-especialidade-' + esp + '">' +
      esp +
      "</button>";
  }

  container.innerHTML = html;

  let botoesFiltro = container.querySelectorAll(".botao-filtro");
  for (let i = 0; i < botoesFiltro.length; i++) {
    botoesFiltro[i].addEventListener("click", function () {
      filtroEspecialidade = this.dataset.esp;
      renderizarFiltros();
      renderizarLista();
    });
  }
}

function renderizarLista() {
  let container = document.querySelector("#listaMedicos");
  let medicos = getMedicos();

  if (filtroEspecialidade !== "Todas") {
    let filtrados = [];
    for (let i = 0; i < medicos.length; i++) {
      if (medicos[i].especialidade === filtroEspecialidade) {
        filtrados.push(medicos[i]);
      }
    }
    medicos = filtrados;
  }

  if (termoBusca.trim()) {
    let termo = termoBusca.trim().toLowerCase();
    let filtrados = [];
    for (let i = 0; i < medicos.length; i++) {
      let nomeMedico = getUsuarioPorId(medicos[i].usuarioId).nome.toLowerCase();
      if (
        nomeMedico.indexOf(termo) !== -1 ||
        medicos[i].especialidade.toLowerCase().indexOf(termo) !== -1 ||
        medicos[i].cidade.toLowerCase().indexOf(termo) !== -1
      ) {
        filtrados.push(medicos[i]);
      }
    }
    medicos = filtrados;
  }

  if (medicos.length === 0) {
    container.innerHTML = '<p class="text-empty">Nenhum médico encontrado.</p>';
    return;
  }

  let html = "";
  for (let i = 0; i < medicos.length; i++) {
    let m = medicos[i];
    let usuario = getUsuarioPorId(m.usuarioId);
    html +=
      '<a class="card card--doctor" href="medico-perfil.html?id=' + m.id + '" data-qa="card-medico" data-medico-id="' + m.id + '">' +
      "<div>" +
      "<h3>" + nomeExibicaoMedico(usuario, m) + "</h3>" +
      "<p>" + m.especialidade + " · " + m.cidade + "</p>" +
      "<p>R$ " + m.valorConsulta.toFixed(2) + "</p>" +
      "</div>" +
      '<span class="card__arrow" aria-hidden="true">›</span>' +
      "</a>";
  }
  container.innerHTML = html;
}

document.querySelector("#campoBusca").addEventListener("input", function (e) {
  termoBusca = e.target.value;
  renderizarLista();
});

renderizarFiltros();
renderizarLista();
