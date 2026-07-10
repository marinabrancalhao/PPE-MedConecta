class SolicitarConsultaPage {
  elements = {
    cardMedico: () => cy.get("div[data-qa='perfil-medico-info']"),
    inputData: () => cy.get("input[data-qa='input-data-consulta']"),
    selectHora: () => cy.get("select[data-qa='input-hora-consulta']"),
    inputQueixaPrincipal: () =>
      cy.get("textarea[data-qa='input-queixa-principal']"),
    botaoEnviar: () => cy.get("button[data-qa='btn-enviar-solicitacao']"),
  };

  //Ação
  preencherSolicitacao(consulta) {
    this.elements.inputData().clear().type(consulta.data);
    this.elements.selectHora().select(consulta.hora);
    this.elements.inputQueixaPrincipal().clear().type(consulta.queixaPrincipal);
    this.elements.botaoEnviar().click();
    return this;
  }

  clickEnviar() {
    this.elements.botaoEnviar();
  }

  //Validação
  validarPerfilMedico() {
    this.elements.cardMedico().should("be.visible");
    return this;
  }
}

module.exports = new SolicitarConsultaPage();
