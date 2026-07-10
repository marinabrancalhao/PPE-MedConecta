import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";

const HomePage = require("../Pages/HomePage.cy");
const CadastroPage = require("../Pages/CadastroPage.cy");
const BuscarMedicoPage = require("../Pages/BuscarMedicoPage.cy");
const SolicitarConsultaPage = require("../Pages/SolicitarConsultaPage.cy");
const ConsultasPacientePage = require("../Pages/ConsultasPacientePage.cy");
const LoginPage = require("../Pages/LoginPage.cy");
const ConsultasMedicoPage = require("../Pages/ConsultasMedicoPage.cy");
const SolicitacoesMedicoPage = require("../Pages/SolicitacoesMedicoPage.cy");

let pacienteCriado;

Given("que estou na tela de cadastro de paciente", () => {
  HomePage.visitHome();
  HomePage.selecionaPaciente();
  CadastroPage.acessarCadastro();
});

When("eu preencho o formulário com dados válidos", () => {
  cy.fixture("novoPaciente").then((novoPaciente) => {
    novoPaciente.email = `rafael.teste.${Date.now()}@email.com`;
    CadastroPage.preencherCadastro(novoPaciente);
    pacienteCriado = novoPaciente;
  });
});

Then(
  "devo ver a saudação com meu primeiro nome na página Buscar Médicos",
  () => {
    LoginPage.validarLogin();
  },
);

When("eu pesquiso pelo nome do médico", () => {
  cy.fixture("medico").then((medico) => {
    BuscarMedicoPage.buscarPorNome(medico.nome);
  });
});

Then("devo ver esse médico no resultado da busca", () => {
  cy.fixture("medico").then((medico) => {
    BuscarMedicoPage.validarMedico(medico.nome);
  });
});

When("eu acesso a página de perfil do médico", () => {
  cy.fixture("medico").then((medico) => {
    BuscarMedicoPage.acessarPerfilDoMedico(medico.nome);
  });
});
When("eu solicito uma consulta com dados válidos", () => {
  SolicitarConsultaPage.validarPerfilMedico();
  cy.fixture("novoPaciente").then(() => {
    SolicitarConsultaPage.preencherSolicitacao(pacienteCriado);
  });
});

When("eu clico em Enviar solicitação", () => {
  SolicitarConsultaPage.clickEnviar();
});

Then("devo ser redirecionada para a tela Minhas Consultas", () => {
  cy.url().should("include", "minhas-consultas");
});

Given("que estou logada como médico", () => {
  cy.fixture("medico").then((medico) => {
    HomePage.visitHome();
    HomePage.selecionaMedico();
    LoginPage.preencherLogin(medico);
  });
});

When("eu acesso a tela Minhas Solicitações", () => {
  ConsultasMedicoPage.clickMinhasSolicitacoes();
});

When("eu clico em Aceitar solicitação do paciente", () => {
  SolicitacoesMedicoPage.aceitarConsulta();
});

Then("o status da consulta deve mudar para Confirmada", () => {
  ConsultasMedicoPage.clickMinhasConsultas();
  cy.fixture("medico").then((medico) => {
    ConsultasMedicoPage.validarConsultaMarcada(pacienteCriado.nome);
  });
});

Given("que estou logada novamente como o paciente", () => {
  HomePage.visitHome();
  HomePage.selecionaPaciente();
  LoginPage.preencherLogin(pacienteCriado);
});

When("eu acesso a tela Minhas Consultas", () => {
  ConsultasPacientePage.clickMinhasConsultas();
});

Then("devo ver a consulta com o médico na seção Próximas consultas", () => {
  cy.fixture("medico").then((medico) => {
    ConsultasPacientePage.validarConsultaMarcada(medico.nome);
  });
});
