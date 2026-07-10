class HomePage {
  elements = {
    botaoSouPaciente: () => cy.get("button[data-qa='btn-sou-paciente']"),
    botaoSouMedico: () => cy.get("button[data-qa='btn-sou-medico']"),
  };

  //Ações
  visitHome() {
    cy.visit("https://marinabrancalhao.github.io/PPE-MedConecta/");
    return this;
  }

  selecionaPaciente() {
    this.elements.botaoSouPaciente().click();
    return this;
  }

  selecionaMedico() {
    this.elements.botaoSouMedico().click();
    return this;
  }
}

module.exports = new HomePage();
