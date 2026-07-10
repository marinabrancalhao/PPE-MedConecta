class LoginPage {
  elements = {
    inputEmail: () => cy.get("input[data-qa='input-email']"),
    inputSenha: () => cy.get("input[data-qa='input-senha']"),
    botaoEntrar: () => cy.get("button[data-qa='btn-entrar']"),
  };

  //Ação
  preencherLogin(usuario) {
    this.elements.inputEmail().clear().type(usuario.email);
    this.elements.inputSenha().clear().type(usuario.senha);
    this.elements.botaoEntrar().click();
    return this;
  }

  //Validação
  validarLogin() {
    cy.url().should("include", "buscar-medicos.html");
    cy.get('[data-qa="texto-usuario-logado"]').should("be.visible");
    cy.get('[data-qa="btn-sair"]').should("be.visible");
    return this;
  }
}

module.exports = new LoginPage();
