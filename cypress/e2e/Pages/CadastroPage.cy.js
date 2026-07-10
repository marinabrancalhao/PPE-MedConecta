class CadastroPage {
  elements = {
    linkCadastrarSe: () => cy.get("a[data-qa='link-cadastro-paciente']"),
    inputNome: () => cy.get("input[data-qa='input-nome']"),
    inputDataNascimento: () => cy.get("input[data-qa='input-data-nascimento']"),
    inputTelefone: () => cy.get("input[data-qa='input-telefone']"),
    inputEmail: () => cy.get("input[data-qa='input-email']"),
    inputSenha: () => cy.get("input[data-qa='input-senha']"),
    botaoCadastrar: () => cy.get("button[data-qa='btn-cadastrar']"),
  };

  //Ações
  acessarCadastro() {
    this.elements.linkCadastrarSe().click();
    return this;
  }

  preencherCadastro(novoUsuario) {
    this.elements.inputNome().clear().type(novoUsuario.nome);
    this.elements
      .inputDataNascimento()
      .clear()
      .type(novoUsuario.dataNascimento);
    this.elements.inputTelefone().clear().type(novoUsuario.telefone);
    this.elements.inputEmail().clear().type(novoUsuario.email);
    this.elements.inputSenha().clear().type(novoUsuario.senha);
    this.elements.botaoCadastrar().click();
    return this;
  }

  //Validação
  validarCadastro() {
    cy.url().should("include", "buscar-medicos.html");
    cy.get('[data-qa="texto-usuario-logado"]').should("be.visible");
    cy.get('[data-qa="btn-sair"]').should("be.visible");
    return this;
  }
}

module.exports = new CadastroPage();
