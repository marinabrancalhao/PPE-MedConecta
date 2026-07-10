class BuscarMedicoPage {
  elements = {
    tituloPagina: () => cy.contains("h1", /buscar médicos/i),
    inputBusca: () => cy.get("input[data-qa='input-busca']"),
    cardsMedico: () => cy.get("a[data-qa='card-medico']"),
  };

  //Ação
  buscarPorNome(nome) {
    this.elements.inputBusca().clear().type(nome);
    return this;
  }

  acessarPerfilDoMedico(nomeMedico) {
    this.elements.cardsMedico().contains("h3", nomeMedico).click();
    return this;
  }

  //Validação
  validarPagina() {
    this.elements.tituloPagina().should("be.visible");
  }

  validarMedico(nomeDigitado) {
    this.elements
      .cardsMedico()
      .first()
      .find("h3")
      .should("contain", nomeDigitado);
    return this;
  }
}

module.exports = new BuscarMedicoPage();
