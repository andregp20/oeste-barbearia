/**
 * SISTEMA DE AGENDAMENTOS - OESTE BARBEARIA
 * Gerencia disponibilidades independentes de cada barbeiro
 */

// 📋 BASE DE DADOS DOS BARBEIROS
const BARBEIROS = {
  jhonnatan: {
    id: 'jhonnatan',
    nome: 'JHONNATAN',
    foto: 'https://cdn.trinks.com.br/pessoas/fotos/p_foto_000724379.jpg?v=20260209162300',
    diasTrabalho: ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
    horarioInicio: '09:00',
    horarioFim: '20:00',
    intervalo: { inicio: '12:00', fim: '13:00' },
    duracaoAtendimento: 40, // minutos
  },
  fabricio: {
    id: 'fabricio',
    nome: 'FABRICIO',
    foto: 'https://cdn.trinks.com.br/pessoas/fotos/p_foto_000738014.jpg?v=20250514143600',
    diasTrabalho: ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
    horarioInicio: '09:00',
    horarioFim: '20:00',
    intervalo: { inicio: '12:00', fim: '13:00' },
    duracaoAtendimento: 40,
  },
  romario: {
    id: 'romario',
    nome: 'ROMARIO',
    foto: 'https://cdn.trinks.com.br/pessoas/fotos/p_foto_000195943.jpg?v=20190801134800',
    diasTrabalho: ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
    horarioInicio: '09:00',
    horarioFim: '20:00',
    intervalo: { inicio: '12:00', fim: '13:00' },
    duracaoAtendimento: 40,
  },
  yannick: {
    id: 'yannick',
    nome: 'YANNICK',
    foto: 'https://cdn.trinks.com.br/pessoas/fotos/p_foto_000724825.jpg?v=20260211140900',
    diasTrabalho: ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
    horarioInicio: '09:00',
    horarioFim: '20:00',
    intervalo: { inicio: '12:00', fim: '13:00' },
    duracaoAtendimento: 40,
  },
  willian: {
    id: 'willian',
    nome: 'WILLIAN',
    foto: 'https://cdn.trinks.com.br/pessoas/fotos/p_foto_000195941.jpg?v=20250529183800',
    diasTrabalho: ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
    horarioInicio: '09:00',
    horarioFim: '20:00',
    intervalo: { inicio: '12:00', fim: '13:00' },
    duracaoAtendimento: 40,
  },
  alanyfer: {
    id: 'alanyfer',
    nome: 'ALANYFER',
    foto: 'https://cdn.trinks.com.br/pessoas/fotos/p_foto_000617661.jpg?v=20240809172300',
    diasTrabalho: ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
    horarioInicio: '09:00',
    horarioFim: '20:00',
    intervalo: { inicio: '12:00', fim: '13:00' },
    duracaoAtendimento: 40,
  },
  frank: {
    id: 'frank',
    nome: 'FRANK',
    foto: 'https://cdn.trinks.com.br/pessoas/fotos/p_foto_000590242.jpg?v=20260311151300',
    diasTrabalho: ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
    horarioInicio: '09:00',
    horarioFim: '20:00',
    intervalo: { inicio: '12:00', fim: '13:00' },
    duracaoAtendimento: 40,
  },
};

// Carregar barbeiros customizados
function carregarBarbeirosCustomizados() {
  const barbeirosCustom = JSON.parse(localStorage.getItem('barbeiros_customizados') || '{}');
  Object.assign(BARBEIROS, barbeirosCustom);
}

// 🔐 SENHAS DOS BARBEIROS (USAR EM PRODUÇÃO COM HASH SEGURO!)
let SENHAS_BARBEIROS = {
  jhonnatan: 'J12345',
  fabricio: 'F12345',
  romario: 'R12345',
  yannick: 'Y12345',
  willian: 'W12345',
  alanyfer: 'A12345',
  frank: 'FR12345',
};

// Carregar senhas customizadas
function carregarSenhasCustomizadas() {
  const senhasCustom = JSON.parse(localStorage.getItem('senhas_barbeiros_custom') || '{}');
  SENHAS_BARBEIROS = { ...SENHAS_BARBEIROS, ...senhasCustom };
}

// 📅 CLASSE PRINCIPAL DO SISTEMA
class SistemaAgendamentos {
  constructor() {
    this.agendamentos = this.carregarAgendamentos();
    this.inicializarAgendamentos();
  }

  // 💾 Carregar agendamentos do localStorage
  carregarAgendamentos() {
    const dados = localStorage.getItem('agendamentos_oeste');
    return dados ? JSON.parse(dados) : [];
  }

  // 💾 Salvar agendamentos no localStorage
  salvarAgendamentos() {
    localStorage.setItem('agendamentos_oeste', JSON.stringify(this.agendamentos));
  }

  // 🔧 Inicializar com dados padrão (se vazio)
  inicializarAgendamentos() {
    if (this.agendamentos.length === 0) {
      // Adicionar alguns agendamentos de exemplo para hoje
      const hoje = this.obterDataFormatada(new Date());
      // deixar vazio inicialmente
    }
  }

  // 📝 Formatar data YYYY-MM-DD
  obterDataFormatada(data) {
    return data.toISOString().split('T')[0];
  }

  // 🗓️ Obter nome do dia da semana
  obterDiaSemana(data) {
    const dias = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
    return dias[data.getDay()];
  }

  // ✅ Verificar se barbeiro trabalha naquele dia
  barbeiroTrabalhaEmData(idBarbeiro, data) {
    const barbeiro = BARBEIROS[idBarbeiro];
    if (!barbeiro) return false;
    const diaSemana = this.obterDiaSemana(new Date(data + 'T00:00:00'));
    return barbeiro.diasTrabalho.includes(diaSemana);
  }

  // ⏰ Gerar horários disponíveis para um barbeiro em uma data
  gerarHorariosDisponiveis(idBarbeiro, data) {
    const barbeiro = BARBEIROS[idBarbeiro];
    if (!barbeiro) return [];

    // Verificar se trabalha neste dia
    if (!this.barbeiroTrabalhaEmData(idBarbeiro, data)) {
      return [];
    }

    const horarios = [];
    const [horaInicio] = barbeiro.horarioInicio.split(':');
    const [horaFim] = barbeiro.horarioFim.split(':');
    const [horaIntervaloInicio] = barbeiro.intervalo.inicio.split(':');
    const [horaIntervaloFim] = barbeiro.intervalo.fim.split(':');
    const duracao = barbeiro.duracaoAtendimento;

    let horaAtual = parseInt(horaInicio);
    let minutoAtual = 0;

    while (
      horaAtual < parseInt(horaFim) ||
      (horaAtual === parseInt(horaFim) && minutoAtual === 0)
    ) {
      const horaFormatada = String(horaAtual).padStart(2, '0');
      const minutoFormatado = String(minutoAtual).padStart(2, '0');
      const horario = `${horaFormatada}:${minutoFormatado}`;

      // Verificar se está no intervalo
      const estaNoIntervalo =
        horaAtual >= parseInt(horaIntervaloInicio) &&
        horaAtual < parseInt(horaIntervaloFim);

      if (!estaNoIntervalo) {
        horarios.push(horario);
      }

      // Adicionar duração
      minutoAtual += duracao;
      if (minutoAtual >= 60) {
        horaAtual += Math.floor(minutoAtual / 60);
        minutoAtual = minutoAtual % 60;
      }
    }

    return horarios;
  }

  // 🚫 Verificar se horário está ocupado
  horarioOcupado(idBarbeiro, data, horario) {
    return this.agendamentos.some(
      (ag) =>
        ag.idBarbeiro === idBarbeiro &&
        ag.data === data &&
        ag.horario === horario
    );
  }

  // 📍 Obter horários disponíveis (sem os ocupados)
  obterHorariosDisponiveis(idBarbeiro, data) {
    const todos = this.gerarHorariosDisponiveis(idBarbeiro, data);
    return todos.filter((h) => !this.horarioOcupado(idBarbeiro, data, h));
  }

  // ➕ Criar agendamento
  criarAgendamento(dados) {
    // Validações
    if (!BARBEIROS[dados.idBarbeiro]) {
      return { sucesso: false, erro: 'Barbeiro inválido' };
    }

    if (!this.barbeiroTrabalhaEmData(dados.idBarbeiro, dados.data)) {
      return { sucesso: false, erro: 'Barbeiro não trabalha neste dia' };
    }

    if (this.horarioOcupado(dados.idBarbeiro, dados.data, dados.horario)) {
      return { sucesso: false, erro: 'Horário já ocupado' };
    }

    const agendamento = {
      id: Date.now().toString(),
      idBarbeiro: dados.idBarbeiro,
      nomeBarbeiro: BARBEIROS[dados.idBarbeiro].nome,
      nomeCliente: dados.nomeCliente,
      telefone: dados.telefone,
      data: dados.data,
      horario: dados.horario,
      servico: dados.servico || 'Serviço não especificado',
      criadoEm: new Date().toISOString(),
      status: 'confirmado',
    };

    this.agendamentos.push(agendamento);
    this.salvarAgendamentos();

    return { sucesso: true, agendamento };
  }

  // 📋 Obter agenda de um barbeiro em uma data
  obterAgendaBarbeiro(idBarbeiro, data) {
    const agendamentosData = this.agendamentos.filter(
      (ag) => ag.idBarbeiro === idBarbeiro && ag.data === data
    );

    const barbeiro = BARBEIROS[idBarbeiro];
    if (!barbeiro) return [];

    // Ordenar por horário
    return agendamentosData.sort((a, b) => a.horario.localeCompare(b.horario));
  }

  // 🗑️ Cancelar agendamento
  cancelarAgendamento(id) {
    const index = this.agendamentos.findIndex((ag) => ag.id === id);
    if (index === -1) {
      return { sucesso: false, erro: 'Agendamento não encontrado' };
    }

    this.agendamentos.splice(index, 1);
    this.salvarAgendamentos();
    return { sucesso: true };
  }

  // 🔍 Buscar agendamento por ID
  obterAgendamento(id) {
    return this.agendamentos.find((ag) => ag.id === id);
  }

  // 📅 Obter próximas datas disponíveis para um barbeiro
  obterProximasDataDisponivel(idBarbeiro, dataInicial = null) {
    const barbeiro = BARBEIROS[idBarbeiro];
    if (!barbeiro) return [];

    const inicio = dataInicial ? new Date(dataInicial + 'T00:00:00') : new Date();
    const proximas = [];

    for (let i = 0; i < 30; i++) {
      const data = new Date(inicio);
      data.setDate(data.getDate() + i);
      const dataStr = this.obterDataFormatada(data);

      if (this.barbeiroTrabalhaEmData(idBarbeiro, dataStr)) {
        proximas.push({
          data: dataStr,
          diaSemana: this.obterDiaSemana(data),
          totalHorarios: this.obterHorariosDisponiveis(idBarbeiro, dataStr).length,
        });
      }
    }

    return proximas;
  }
}

// 🌍 Carregar dados customizados e exportar para uso global
carregarBarbeirosCustomizados();
carregarSenhasCustomizadas();
const sistemaAgendamentos = new SistemaAgendamentos();
