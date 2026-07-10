// Funções utilitárias de interface, usadas em várias páginas

function mostrarAlerta(mensagem) {
  let alerta = document.querySelector(".alerta");

  // Cria a div só na primeira vez - da segunda chamada em diante,
  // reaproveita a mesma, senão iam se acumular várias na tela
  if (!alerta) {
    alerta = document.createElement("div");
    alerta.className = "alerta";
    document.body.appendChild(alerta);
  }

  alerta.textContent = mensagem;
  alerta.classList.add("alerta--visivel");

  // Some sozinho depois de 2.5 segundos
  setTimeout(function () {
    alerta.classList.remove("alerta--visivel");
  }, 2500);
}

//Função para formatar data e hora no padrão brasileiro
function formatarDataHora(dataHora) {
  let data = new Date(dataHora);
  let dataFormatada = data.toLocaleDateString("pt-BR");
  let horaFormatada = data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return dataFormatada + ", " + horaFormatada;
}

//Monta a barra de sessão (saudação + sair) no topo das páginas logadas.
//O menu de navegação e a logo já vêm fixos no HTML de cada página.
function renderCabecalho() {
  let usuario = getUsuarioLogado();
  let primeiroNome = usuario ? usuario.nome.split(" ")[0] : "";

  let html =
    '<div class="header__session">' +
    '<span class="header__session-user" data-qa="texto-usuario-logado">Olá, ' + primeiroNome + "</span>" +
    '<span class="header__session-logout" data-qa="btn-sair" onclick="logout()">Sair</span>' +
    "</div>";

  document.querySelector("#barraSessao").innerHTML = html;
}

//Monta "Dr. Nome" ou "Dra. Nome" automaticamente a partir do sexo cadastrado
function nomeExibicaoMedico(usuarioMedico, medico) {
  let titulo = "Dr.";
  // "medico &&" protege contra tentar ler .sexo de algo vazio/null
  if (medico && medico.sexo === "F") {
    titulo = "Dra.";
  }
  return titulo + " " + usuarioMedico.nome;
}

//Retorna o HTML da tag de status da consulta
function tagStatus(status) {
  // Já começa com o valor de "Solicitada" - se nenhum if abaixo bater,
  // essa é a classe que fica
  let classe = "tag-status--solicitada";

  if (status === "Confirmada") {
    classe = "tag-status--confirmada";
  } else if (status === "Cancelada" || status === "Recusada") {
    classe = "tag-status--cancelada";
  }

  return '<span class="tag-status ' + classe + '">' + status + "</span>";
}
