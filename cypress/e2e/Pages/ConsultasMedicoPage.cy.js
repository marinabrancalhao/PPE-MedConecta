class ConsultasMedicoPage {
  elements = {
    linkMinhasConsultas: () =>
      cy.get("a[data-qa='nav-minhas-consultas-medico']"),
    linkMinhasSolicitacoes: () =>
      cy.get("a[data-qa='nav-solicitacoes-medico']"),
    cardsConsulta: () => cy.get("div[data-qa='card-consulta-medico']"),
  };

  //Ações
  clickMinhasConsultas() {
    this.elements.linkMinhasConsultas().click();
    return this;
  }

  clickMinhasSolicitacoes() {
    this.elements.linkMinhasSolicitacoes().click();
    return this;
  }

  //Validação
  validarConsultaMarcada(nomePaciente) {
    this.elements.cardsConsulta().should("contain", nomePaciente);
  }
}

module.exports = new ConsultasMedicoPage();
