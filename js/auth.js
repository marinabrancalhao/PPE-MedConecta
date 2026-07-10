// Autenticação simulada (sem backend real).
// A "senha" fica salva em texto puro no localStorage apenas para
// fins de demonstração acadêmica - não é uma prática segura de verdade.

let SESSAO_KEY = "sessaoUsuarioId";

function login(email, senha) {
  let usuario = getUsuarioPorEmail(email);

  // Mensagem igual nos dois casos de propósito: não revela se o problema
  // foi o e-mail não existir ou a senha estar errada
  if (usuario === null) {
    throw new Error("E-mail ou senha inválidos.");
  }

  if (usuario.senha !== senha) {
    throw new Error("E-mail ou senha inválidos.");
  }

  localStorage.setItem(SESSAO_KEY, usuario.id);
  return usuario;
}

function logout() {
  localStorage.removeItem(SESSAO_KEY);
  window.location.href = "index.html";
}

function getUsuarioLogado() {
  let id = localStorage.getItem(SESSAO_KEY);

  if (id === null) {
    return null;
  }

  return getUsuarioPorId(id);
}

//Redireciona para o login correto caso não haja sessão válida do tipo esperado
function exigirSessao(tipoEsperado) {
  let usuario = getUsuarioLogado();

  if (usuario === null || usuario.tipo !== tipoEsperado) {
    if (tipoEsperado === "Medico") {
      window.location.href = "login-medico.html";
    } else {
      window.location.href = "login-paciente.html";
    }
    return null;
  }

  return usuario;
}
