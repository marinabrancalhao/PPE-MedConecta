Feature: Agendar consulta no MedConecta

  Como paciente
  Eu quero buscar um médico e solicitar uma consulta
  Para que eu possa ser atendida sem precisar ligar ou ir presencialmente marcar

  Como médico
  Eu quero receber e confirmar as solicitações de consulta
  Para que eu possa organizar minha agenda de atendimentos

  Scenario: Agendar consulta com sucesso (Caminho Feliz)
    Given que estou na tela de cadastro de paciente
    When eu preencho o formulário com dados válidos
    Then devo ver a saudação com meu primeiro nome na página Buscar Médicos

    When eu pesquiso pelo nome do médico
    Then devo ver esse médico no resultado da busca

    When eu acesso a página de perfil do médico
    And eu solicito uma consulta com dados válidos
    And eu clico em Enviar solicitação
    Then devo ser redirecionada para a tela Minhas Consultas

    Given que estou logada como médico
    When eu acesso a tela Minhas Solicitações
    And eu clico em Aceitar solicitação do paciente
    Then o status da consulta deve mudar para Confirmada

    Given que estou logada novamente como o paciente
    When eu acesso a tela Minhas Consultas
    Then devo ver a consulta com o médico na seção Próximas consultas