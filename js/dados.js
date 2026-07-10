// Camada de dados (localStorage), simulando um banco relacional
// Tabelas: usuarios, pacientes, medicos (com sexo, usado pra montar Dr./Dra. automaticamente), consultas (com queixaPrincipal)

//Gera um id sequencial simples (id1, id2, id3...), guardando o próximo
//número livre no próprio localStorage
function proximoId() {
  let numero = Number(localStorage.getItem("proximoId")) || 1;
  localStorage.setItem("proximoId", numero + 1);
  return "id" + numero;
}

//O localStorage só guarda texto. JSON.parse traduz esse texto de volta
//pra uma lista de verdade (com JSON.stringify fazendo o caminho inverso
//lá na função salvar, abaixo)
function ler(chave) {
  let dados = localStorage.getItem(chave);
  return dados ? JSON.parse(dados) : [];
}

function salvar(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor));
}

//Popula o localStorage com dados de exemplo (roda uma única vez)
function seedDados() {
  if (localStorage.getItem("jaTemDados")) return;

  let usuarios = [
    { id: proximoId(), nome: "Carlos Mendes", email: "carlos.mendes@medconecta.com", senha: "123456", tipo: "Medico" },
    { id: proximoId(), nome: "Juliana Paiva", email: "juliana.paiva@medconecta.com", senha: "123456", tipo: "Medico" },
    { id: proximoId(), nome: "Marina Brancalhão", email: "marina.brancalhao@email.com", senha: "123456", tipo: "Paciente" },
  ];
  salvar("usuarios", usuarios);

  let medicos = [
    {
      id: proximoId(),
      usuarioId: usuarios[0].id,
      sexo: "M",
      crm: "CRM-SP 123456",
      especialidade: "Cardiologia",
      cidade: "São Paulo - SP",
      cep: "01310-100",
      endereco: "Av. Paulista, 1500, Bela Vista",
      telefone: "(11) 98888-1234",
      valorConsulta: 250,
      diasAtendimento: ["seg", "ter", "qua", "qui", "sex"],
      horaInicio: "08:00",
      horaFim: "18:00",
      fotoUrl: "",
    },
    {
      id: proximoId(),
      usuarioId: usuarios[1].id,
      sexo: "F",
      crm: "CRM-RJ 654321",
      especialidade: "Dermatologia",
      cidade: "Rio de Janeiro - RJ",
      cep: "22041-011",
      endereco: "Av. Atlântica, 500, Copacabana",
      telefone: "(21) 97777-5678",
      valorConsulta: 220,
      diasAtendimento: ["seg", "qua", "sex"],
      horaInicio: "09:00",
      horaFim: "17:00",
      fotoUrl: "",
    },
  ];
  salvar("medicos", medicos);

  let pacientes = [
    {
      id: proximoId(),
      usuarioId: usuarios[2].id,
      dataNascimento: "1996-04-12",
      telefone: "(11) 91234-5678",
    },
  ];
  salvar("pacientes", pacientes);

  salvar("consultas", []);
  localStorage.setItem("jaTemDados", "true");
}

//USUÁRIOS
//Guarda só o que é comum a login (nome, email, senha, tipo). Os dados
//específicos de paciente ou médico ficam em tabelas separadas abaixo,
//ligadas pelo campo usuarioId - assim não duplica nada em comum entre os dois
function getUsuarios() {
  return ler("usuarios");
}

function getUsuarioPorEmail(email) {
  let usuarios = getUsuarios();

  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email === email) {
      return usuarios[i];
    }
  }
  return null;
}

function getUsuarioPorId(id) {
  let usuarios = getUsuarios();

  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].id === id) {
      return usuarios[i];
    }
  }
  return null;
}

function addUsuario(usuario) {
  let usuarios = getUsuarios();
  usuario.id = proximoId();
  usuarios.push(usuario);
  salvar("usuarios", usuarios);
  return usuario;
}

function updateUsuario(id, dados) {
  let usuarios = getUsuarios();

  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].id === id) {
      for (let campo in dados) {
        usuarios[i][campo] = dados[campo];
      }
    }
  }
  salvar("usuarios", usuarios);
}

//PACIENTES
//Usada logo após o login: a sessão só guarda o id do usuário, então
//essa função "traduz" isso pro id de paciente correspondente
function getPacientes() {
  return ler("pacientes");
}

function getPacientePorUsuarioId(usuarioId) {
  let pacientes = getPacientes();

  for (let i = 0; i < pacientes.length; i++) {
    if (pacientes[i].usuarioId === usuarioId) {
      return pacientes[i];
    }
  }
  return null;
}

function getPacientePorId(id) {
  let pacientes = getPacientes();

  for (let i = 0; i < pacientes.length; i++) {
    if (pacientes[i].id === id) {
      return pacientes[i];
    }
  }
  return null;
}

function addPaciente(paciente) {
  let pacientes = getPacientes();
  paciente.id = proximoId();
  pacientes.push(paciente);
  salvar("pacientes", pacientes);
  return paciente;
}

function updatePaciente(id, dados) {
  let pacientes = getPacientes();

  for (let i = 0; i < pacientes.length; i++) {
    if (pacientes[i].id === id) {
      for (let campo in dados) {
        pacientes[i][campo] = dados[campo];
      }
    }
  }
  salvar("pacientes", pacientes);
}

//MÉDICOS
function getMedicos() {
  return ler("medicos");
}

function getMedicoPorUsuarioId(usuarioId) {
  let medicos = getMedicos();

  for (let i = 0; i < medicos.length; i++) {
    if (medicos[i].usuarioId === usuarioId) {
      return medicos[i];
    }
  }
  return null;
}

function getMedicoPorId(id) {
  let medicos = getMedicos();

  for (let i = 0; i < medicos.length; i++) {
    if (medicos[i].id === id) {
      return medicos[i];
    }
  }
  return null;
}

function addMedico(medico) {
  let medicos = getMedicos();
  medico.id = proximoId();
  medicos.push(medico);
  salvar("medicos", medicos);
  return medico;
}

function updateMedico(id, dados) {
  let medicos = getMedicos();

  for (let i = 0; i < medicos.length; i++) {
    if (medicos[i].id === id) {
      for (let campo in dados) {
        medicos[i][campo] = dados[campo];
      }
    }
  }
  salvar("medicos", medicos);
}

//CONSULTAS
function getConsultas() {
  return ler("consultas");
}

function getConsultasDoPaciente(pacienteId) {
  let consultas = getConsultas();
  let resultado = [];

  for (let i = 0; i < consultas.length; i++) {
    if (consultas[i].pacienteId === pacienteId) {
      resultado.push(consultas[i]);
    }
  }
  return resultado;
}

function getConsultasDoMedico(medicoId) {
  let consultas = getConsultas();
  let resultado = [];

  for (let i = 0; i < consultas.length; i++) {
    if (consultas[i].medicoId === medicoId) {
      resultado.push(consultas[i]);
    }
  }
  return resultado;
}

function getConsultasDoMedicoPorStatus(medicoId, status) {
  let consultas = getConsultas();
  let resultado = [];

  for (let i = 0; i < consultas.length; i++) {
    if (consultas[i].medicoId === medicoId && consultas[i].status === status) {
      resultado.push(consultas[i]);
    }
  }
  return resultado;
}

//Verifica se o médico atende no dia da semana e dentro do horário configurado
function horarioDentroDoAtendimento(medico, dataHora) {
  let data = new Date(dataHora);
  // getDay() começa do zero (domingo = 0), por isso essa lista também começa em "dom"
  let diasSemana = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];
  let diaAbrev = diasSemana[data.getDay()];

  if (medico.diasAtendimento.indexOf(diaAbrev) === -1) {
    return false;
  }

  // Compara hora como texto (ex: "14:00" >= "08:00") - só funciona porque
  // todo horário no projeto sempre tem 2 dígitos, nunca "9:00" sem o zero
  let hora = data.toTimeString().slice(0, 5);
  return hora >= medico.horaInicio && hora < medico.horaFim;
}

//Verifica se já existe consulta ativa (não recusada/cancelada) nesse horário
function horarioLivre(medicoId, dataHora) {
  let consultas = getConsultas();

  for (let i = 0; i < consultas.length; i++) {
    let c = consultas[i];
    let mesmoHorario = c.medicoId === medicoId && c.dataHora === dataHora;
    // Consulta recusada ou cancelada libera o horário pra outra pessoa
    let ativa = c.status === "Solicitada" || c.status === "Confirmada";

    if (mesmoHorario && ativa) {
      return false;
    }
  }
  return true;
}

//Cria a consulta, ou "avisa" o problema com throw se algo não bater.
//Quem chama essa função (nas telas) usa try/catch pra pegar esse aviso
//e mostrar a mensagem certa pro paciente
function solicitarConsulta(dadosConsulta) {
  let medico = getMedicoPorId(dadosConsulta.medicoId);

  if (!horarioDentroDoAtendimento(medico, dadosConsulta.dataHora)) {
    throw new Error("O médico não atende nesse dia/horário.");
  }

  if (!horarioLivre(dadosConsulta.medicoId, dadosConsulta.dataHora)) {
    throw new Error("Este horário já está reservado.");
  }

  let consultas = getConsultas();
  let nova = {
    id: proximoId(),
    pacienteId: dadosConsulta.pacienteId,
    medicoId: dadosConsulta.medicoId,
    dataHora: dadosConsulta.dataHora,
    queixaPrincipal: dadosConsulta.queixaPrincipal || "",
    status: "Solicitada",
  };

  consultas.push(nova);
  salvar("consultas", consultas);
  return nova;
}

function updateConsulta(id, dados) {
  let consultas = getConsultas();

  for (let i = 0; i < consultas.length; i++) {
    if (consultas[i].id === id) {
      // Copia só os campos que vieram em "dados", um por um -
      // os outros campos da consulta continuam como estavam
      for (let campo in dados) {
        consultas[i][campo] = dados[campo];
      }
    }
  }
  salvar("consultas", consultas);
}

function responderSolicitacao(id, aceitar) {
  if (aceitar) {
    updateConsulta(id, { status: "Confirmada" });
  } else {
    updateConsulta(id, { status: "Recusada" });
  }
}

function cancelarConsulta(id) {
  updateConsulta(id, { status: "Cancelada" });
}

seedDados();
