class CabecalhoPage {
  elements = {
    textoUsuarioLogado: () => cy.get("span[data-qa='texto-usuario-logado']"),
    linkSair: () => cy.get("span[data-qa='btn-sair']"),
  };

  //Validação
  validarLogado(primeiroNome) {
    this.elements
      .textoUsuarioLogado()
      .should("contain", `Olá, ${primeiroNome}`);
    this.elements.linkSair().should("be.visible");
    return this;
  }

  //Ação
  clickSair() {
    this.elements.linkSair().click();
    return this;
  }
}

module.exports = new CabecalhoPage();
