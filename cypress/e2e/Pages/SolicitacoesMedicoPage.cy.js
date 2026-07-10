class SolicitacoesMedicoPage {
  elements = {
    botaoAceitar: () => cy.get("[data-aceitar]"),
  };

  //Ação
  aceitarConsulta() {
    this.elements.botaoAceitar().click();
    return this;
  }
}

module.exports = new SolicitacoesMedicoPage();
