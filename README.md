# MedConecta

Sistema de agendamento médico, migrado de um protótipo no-code (Bubble) pra HTML, CSS e JavaScript puro, como projeto acadêmico.

## O que o sistema faz

O MedConecta conecta paciente e médico numa plataforma só:

- Paciente busca médico por nome, especialidade ou cidade, e solicita consulta
- Médico recebe a solicitação e decide se aceita ou recusa
- Cada um tem seu próprio login e sua própria área (paciente não vê tela de médico, e vice-versa)

## Como rodar

Não precisa instalar nada nem configurar servidor. É só abrir o `index.html` no navegador.

## Contas pra testar

O sistema já vem com alguns dados de exemplo, então dá pra testar sem precisar cadastrar do zero:

| Perfil                | E-mail                       | Senha  |
| --------------------- | ---------------------------- | ------ |
| Médico (Cardiologia)  | carlos.mendes@medconecta.com | 123456 |
| Médico (Dermatologia) | juliana.paiva@medconecta.com | 123456 |
| Paciente              | marina.brancalhao@email.com  | 123456 |

## Estrutura de pastas

```
medconecta/
├── index.html              → tela inicial (escolher se é paciente ou médico)
├── login-paciente.html     → login do paciente
├── login-medico.html       → login do médico
├── cadastro-paciente.html  → cadastro de paciente
├── cadastro-medico.html    → cadastro de médico (foto é obrigatória aqui)
├── buscar-medicos.html     → busca e filtro de médico (paciente)
├── medico-perfil.html      → perfil do médico + pedir consulta
├── minhas-consultas.html   → consultas do paciente
├── minhas-consultas-medico.html → consultas do médico, com filtro por dia/mês
├── solicitacoes-medico.html → pedidos de consulta pendentes (médico aceita/recusa)
├── perfil-paciente.html    → editar dados do paciente
├── perfil-medico.html      → editar dados do médico
├── css/
│   ├── global.css          → o que é usado em várias páginas (cor, botão, card...)
│   └── <pagina>.css        → um CSS pra cada página, só com o que é exclusivo dela
├── js/
│   ├── dados.js            → guarda e busca tudo no localStorage (é tipo o "banco de dados")
│   ├── auth.js             → login, logout e checagem de sessão
│   ├── interface.js        → funções repetidas em várias telas (alerta, cabeçalho...)
│   └── <pagina>.js         → lógica específica de cada página
├── img/
│   ├── icons/               → ícones utilizados
│   └── (logo e imagem da tela inicial)
├── cypress/
│   ├── e2e/
│   │   ├── Pages/           → Page Objects dos testes automatizados
│   │   └── Steps/           → Step definitions (Gherkin/BDD)
│   ├── fixtures/
│   └── support/
├── cypress.config.js
├── package.json
├── package-lock.json
└── .github/
    └── workflows/           → configuração do GitHub Actions (CI)
```

## Tecnologias usadas

- HTML, CSS e JavaScript puro (sem framework, sem TypeScript)
- Metodologia BEM pra nomear as classes CSS
- localStorage do navegador como "banco de dados" (não tem back-end de verdade)
- API externa: [BrasilAPI](https://brasilapi.com.br/) pra preencher endereço a partir do CEP
- **Cypress** — automação de testes end-to-end (E2E)
- **Cucumber / Gherkin** — testes escritos em BDD (Behavior Driven Development)
- **Allure Report** — geração de relatórios visuais dos testes

## Como os dados são guardados

Não tem servidor nem banco de dados de verdade por trás. Tudo fica salvo no localStorage do próprio navegador, em formato parecido com um banco relacional (tabelas de usuário, paciente, médico e consulta, ligadas por id). Isso significa duas coisas importantes:

- Os dados **não somem** se você fechar e abrir o navegador de novo
- Os dados **só existem nesse navegador específico** - se abrir em outro computador ou limpar o cache, os cadastros extras que você fez se perdem (só volta o que já vem de exemplo)

Se quiser resetar tudo e voltar pros dados de exemplo originais, é só abrir o Console do navegador (F12) e rodar:

```js
localStorage.clear();
```

e recarregar a página.

## Funcionalidades

**Paciente:**

- Cadastro e login
- Buscar médico por nome, especialidade ou cidade
- Ver perfil do médico (endereço, telefone, valor, dias/horário de atendimento)
- Solicitar consulta, com queixa principal opcional
- Acompanhar consultas em três grupos: Próximas, Anteriores e Canceladas/Recusadas
- Cancelar consulta
- Editar o próprio perfil

**Médico:**

- Cadastro (com foto obrigatória) e login
- Ver e responder solicitações de consulta (aceitar ou recusar)
- Ver a própria agenda, com filtro por Hoje, Por dia ou Por mês
- Editar o próprio perfil, incluindo dias e horário de atendimento

## Testes automatizados

O fluxo de agendamento de consulta (do lado do paciente até a resposta do médico) tem cobertura de testes end-to-end com **Cypress**, escritos no formato **BDD/Gherkin**, e organizados seguindo o padrão **Page Object**.

### Rodando os testes

Diferente do site em si, os testes precisam de Node.js instalado e das dependências do projeto. Pra rodar:

```bash
git clone https://github.com/<seu-usuario>/PPE-MedConecta.git
cd PPE-MedConecta
npm ci
```

> `npm ci` instala exatamente as versões travadas no `package-lock.json`, garantindo o mesmo ambiente usado no desenvolvimento e no GitHub Actions.

**Interface gráfica (modo interativo):**

```bash
npx cypress open
```

**Modo headless (linha de comando):**

```bash
npx cypress run
```

**Com relatório Allure:**

```bash
npm run test:allure
```

Gera os resultados em `allure-results`. Para visualizar o relatório em HTML:

```bash
npx allure generate --clean allure-results -o allure-report
npx allure open allure-report
```

## Limitações conhecidas (de propósito, por ser um projeto acadêmico)

- Sem back-end de verdade - login e senha não são seguros como seriam num sistema real
- Sem recuperação de senha
- Dados presos ao navegador (não sincroniza entre dispositivos)
