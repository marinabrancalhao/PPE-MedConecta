class ConsultasPacientePage {
  elements = {
    cardsConsulta: () => cy.get("div[data-qa='card-consulta']"),
    tagStatus: () => cy.get(".tag-status"),
    linkMinhasConsultas: () => cy.get("a[data-qa='nav-minhas-consultas']"),
  };

  //Ação
  clickMinhasConsultas() {
    this.elements.linkMinhasConsultas().click();
  }

  //Validação
  validarConsultaMarcada(nomeMedico) {
    this.elements
      .cardsConsulta()
      .contains(nomeMedico)
      .parents('[data-qa="card-consulta"]')
      .within(() => {
        this.elements.tagStatus().should("contain", "Confirmada");
      });
    return this;
  }
}

module.exports = new ConsultasPacientePage();
