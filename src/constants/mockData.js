// ── Mock Data — C4JUS ──────────────────────────────────────────

export const mockUser = {
  id: 1,
  nome: "Dr. Carlos Mendes",
  cargo: "Advogado Sócio",
  email: "carlos@mendesadvocacia.com.br",
  escritorio: "Mendes & Associados Advocacia",
  oab: "OAB/SP 123.456",
  cor: "#1a3a6b",
  foto_url: null,
  role: "admin",
};

// ── Clientes ─────────────────────────────────────────────────
export const mockClientes = [
  { id:1, nome:"João Paulo Silva", cpf:"123.456.789-00", email:"joao.silva@email.com", telefone:"(11) 99999-0001", tipo:"PF", status:"ativo", area:"Cível", processos:3, valor_total:85000, created_at:"2024-01-15", cidade:"São Paulo", estado:"SP" },
  { id:2, nome:"Maria Santos Ferreira", cpf:"987.654.321-00", email:"maria.santos@email.com", telefone:"(11) 99999-0002", tipo:"PF", status:"ativo", area:"Trabalhista", processos:1, valor_total:22000, created_at:"2024-02-20", cidade:"Campinas", estado:"SP" },
  { id:3, nome:"Tech Solutions Ltda", cnpj:"12.345.678/0001-00", email:"contato@techsolutions.com.br", telefone:"(11) 3333-4444", tipo:"PJ", status:"ativo", area:"Empresarial", processos:5, valor_total:340000, created_at:"2024-03-10", cidade:"São Paulo", estado:"SP" },
  { id:4, nome:"Roberto Alves Costa", cpf:"456.789.123-00", email:"roberto.costa@email.com", telefone:"(21) 99888-7777", tipo:"PF", status:"ativo", area:"Criminal", processos:1, valor_total:45000, created_at:"2024-03-22", cidade:"Rio de Janeiro", estado:"RJ" },
  { id:5, nome:"Ana Claudia Rocha", cpf:"321.654.987-00", email:"ana.rocha@email.com", telefone:"(11) 97777-6666", tipo:"PF", status:"ativo", area:"Família", processos:2, valor_total:18000, created_at:"2024-04-05", cidade:"Santos", estado:"SP" },
  { id:6, nome:"Construtora Prime S.A.", cnpj:"98.765.432/0001-11", email:"juridico@prime.com.br", telefone:"(11) 2222-3333", tipo:"PJ", status:"ativo", area:"Imobiliário", processos:7, valor_total:620000, created_at:"2024-04-18", cidade:"São Paulo", estado:"SP" },
  { id:7, nome:"Fernanda Lima Souza", cpf:"654.321.098-00", email:"fernanda.lima@email.com", telefone:"(11) 96666-5555", tipo:"PF", status:"inativo", area:"Previdenciário", processos:1, valor_total:12000, created_at:"2024-05-01", cidade:"Guarulhos", estado:"SP" },
  { id:8, nome:"Indústria Metais Belo Horizonte", cnpj:"55.444.333/0001-22", email:"direito@metaisbh.com.br", telefone:"(31) 3333-9999", tipo:"PJ", status:"ativo", area:"Tributário", processos:4, valor_total:280000, created_at:"2024-05-14", cidade:"Belo Horizonte", estado:"MG" },
];

// ── Processos ─────────────────────────────────────────────────
export const mockProcessos = [
  { id:1, numero:"1234567-89.2024.8.26.0100", cliente:"João Paulo Silva", cliente_id:1, area:"Cível", vara:"2ª Vara Cível de São Paulo", tribunal:"TJSP", status:"em_andamento", fase:"Instrução", valor_causa:50000, honorarios:8500, inicio:"2024-01-10", ultima_movimentacao:"2024-05-18", proxima_audiencia:"2024-06-15", advogado:"Dr. Carlos Mendes", parte_contraria:"Banco Nacional S.A.", tipo:"Indenização por Danos Morais", prioridade:"alta" },
  { id:2, numero:"9876543-21.2024.5.02.0001", cliente:"Maria Santos Ferreira", cliente_id:2, area:"Trabalhista", vara:"1ª Vara do Trabalho de São Paulo", tribunal:"TRT-2", status:"em_andamento", fase:"Audiência", valor_causa:22000, honorarios:4400, inicio:"2024-02-01", ultima_movimentacao:"2024-05-17", proxima_audiencia:"2024-06-10", advogado:"Dr. Carlos Mendes", parte_contraria:"Empresa ABC Ltda", tipo:"Rescisão Indireta", prioridade:"alta" },
  { id:3, numero:"1122334-55.2024.8.26.0050", cliente:"Tech Solutions Ltda", cliente_id:3, area:"Empresarial", vara:"5ª Vara Empresarial de São Paulo", tribunal:"TJSP", status:"em_andamento", fase:"Defesa", valor_causa:180000, honorarios:28000, inicio:"2024-03-05", ultima_movimentacao:"2024-05-15", proxima_audiencia:"2024-07-20", advogado:"Dr. Carlos Mendes", parte_contraria:"Software House BR Ltda", tipo:"Dissolução de Sociedade", prioridade:"media" },
  { id:4, numero:"5544332-11.2024.4.03.6100", cliente:"Indústria Metais Belo Horizonte", cliente_id:8, area:"Tributário", vara:"3ª Vara Federal de São Paulo", tribunal:"TRF3", status:"em_andamento", fase:"Recurso", valor_causa:250000, honorarios:40000, inicio:"2024-01-22", ultima_movimentacao:"2024-05-16", proxima_audiencia:null, advogado:"Dr. Carlos Mendes", parte_contraria:"Receita Federal", tipo:"Recuperação de Crédito Tributário", prioridade:"alta" },
  { id:5, numero:"3322115-44.2024.8.26.0200", cliente:"Ana Claudia Rocha", cliente_id:5, area:"Família", vara:"1ª Vara de Família de Santos", tribunal:"TJSP", status:"em_andamento", fase:"Instrução", valor_causa:85000, honorarios:12000, inicio:"2024-04-10", ultima_movimentacao:"2024-05-14", proxima_audiencia:"2024-06-28", advogado:"Dr. Carlos Mendes", parte_contraria:"Paulo Rocha", tipo:"Divórcio Litigioso", prioridade:"media" },
  { id:6, numero:"7788990-33.2024.8.26.0100", cliente:"Construtora Prime S.A.", cliente_id:6, area:"Imobiliário", vara:"8ª Vara Cível de São Paulo", tribunal:"TJSP", status:"suspenso", fase:"Perícia", valor_causa:420000, honorarios:65000, inicio:"2024-02-28", ultima_movimentacao:"2024-05-10", proxima_audiencia:null, advogado:"Dr. Carlos Mendes", parte_contraria:"Condomínio Residencial das Flores", tipo:"Ação de Cobrança", prioridade:"media" },
  { id:7, numero:"4455667-88.2023.8.26.0100", cliente:"Roberto Alves Costa", cliente_id:4, area:"Criminal", vara:"3ª Vara Criminal de São Paulo", tribunal:"TJSP", status:"em_andamento", fase:"Instrução", valor_causa:0, honorarios:25000, inicio:"2023-11-15", ultima_movimentacao:"2024-05-19", proxima_audiencia:"2024-06-05", advogado:"Dr. Carlos Mendes", parte_contraria:"Ministério Público", tipo:"Defesa Criminal", prioridade:"urgente" },
  { id:8, numero:"2233445-66.2023.8.26.0500", cliente:"Tech Solutions Ltda", cliente_id:3, area:"Empresarial", vara:"2ª Vara Empresarial de São Paulo", tribunal:"TJSP", status:"encerrado", fase:"Trânsito em Julgado", valor_causa:95000, honorarios:15000, inicio:"2023-06-01", ultima_movimentacao:"2024-03-20", proxima_audiencia:null, advogado:"Dr. Carlos Mendes", parte_contraria:"Parceiro Comercial XYZ", tipo:"Cobrança Contratual", prioridade:"baixa" },
  { id:9, numero:"9988776-55.2024.8.26.0100", cliente:"Construtora Prime S.A.", cliente_id:6, area:"Imobiliário", vara:"4ª Vara Cível de São Paulo", tribunal:"TJSP", status:"em_andamento", fase:"Inicial", valor_causa:200000, honorarios:32000, inicio:"2024-05-01", ultima_movimentacao:"2024-05-20", proxima_audiencia:"2024-08-10", advogado:"Dr. Carlos Mendes", parte_contraria:"Incorporadora Norte Ltda", tipo:"Rescisão Contratual", prioridade:"media" },
  { id:10, numero:"6677889-00.2024.8.26.0200", cliente:"Fernanda Lima Souza", cliente_id:7, area:"Previdenciário", vara:"1ª Vara Federal Previdenciária", tribunal:"TRF3", status:"aguardando", fase:"Sentença", valor_causa:48000, honorarios:8000, inicio:"2024-03-01", ultima_movimentacao:"2024-05-05", proxima_audiencia:null, advogado:"Dr. Carlos Mendes", parte_contraria:"INSS", tipo:"Aposentadoria por Invalidez", prioridade:"baixa" },
];

// ── Agenda / Prazos ───────────────────────────────────────────
export const mockAgenda = [
  { id:1, tipo:"audiencia", titulo:"Audiência de Instrução e Julgamento", processo_id:1, processo:"1234567-89.2024.8.26.0100", cliente:"João Paulo Silva", data:"2024-06-15", hora:"09:00", local:"TJSP — 2ª Vara Cível, Sala 203", status:"confirmada", prioridade:"alta" },
  { id:2, tipo:"audiencia", titulo:"Audiência de Conciliação Trabalhista", processo_id:2, processo:"9876543-21.2024.5.02.0001", cliente:"Maria Santos Ferreira", data:"2024-06-10", hora:"14:00", local:"TRT-2 — 1ª Vara, Sala 105", status:"confirmada", prioridade:"alta" },
  { id:3, tipo:"prazo", titulo:"Prazo para Contrarrazões de Apelação", processo_id:4, processo:"5544332-11.2024.4.03.6100", cliente:"Ind. Metais Belo Horizonte", data:"2024-06-08", hora:null, local:null, status:"pendente", prioridade:"urgente" },
  { id:4, tipo:"audiencia", titulo:"Audiência Penal — Oitiva de Testemunhas", processo_id:7, processo:"4455667-88.2023.8.26.0100", cliente:"Roberto Alves Costa", data:"2024-06-05", hora:"10:30", local:"TJSP — 3ª Vara Criminal, Sala 401", status:"confirmada", prioridade:"urgente" },
  { id:5, tipo:"prazo", titulo:"Manifestação sobre Laudo Pericial", processo_id:6, processo:"7788990-33.2024.8.26.0100", cliente:"Construtora Prime S.A.", data:"2024-06-18", hora:null, local:null, status:"pendente", prioridade:"media" },
  { id:6, tipo:"reuniao", titulo:"Reunião com Cliente — Orientação Processual", processo_id:3, processo:"1122334-55.2024.8.26.0050", cliente:"Tech Solutions Ltda", data:"2024-06-03", hora:"16:00", local:"Escritório — Sala de Reuniões", status:"confirmada", prioridade:"media" },
  { id:7, tipo:"prazo", titulo:"Prazo para Petição Inicial — Ação Imobiliária", processo_id:9, processo:"9988776-55.2024.8.26.0100", cliente:"Construtora Prime S.A.", data:"2024-06-25", hora:null, local:null, status:"pendente", prioridade:"alta" },
  { id:8, tipo:"audiencia", titulo:"Audiência de Divórcio — Acordo de Partilha", processo_id:5, processo:"3322115-44.2024.8.26.0200", cliente:"Ana Claudia Rocha", data:"2024-06-28", hora:"11:00", local:"TJSP — 1ª Vara de Família Santos", status:"confirmada", prioridade:"media" },
  { id:9, tipo:"prazo", titulo:"Recurso de Apelação — Prazo Fatal", processo_id:1, processo:"1234567-89.2024.8.26.0100", cliente:"João Paulo Silva", data:"2024-06-02", hora:null, local:null, status:"concluido", prioridade:"alta" },
  { id:10, tipo:"reuniao", titulo:"Reunião de Estratégia — Caso Tributário", processo_id:4, processo:"5544332-11.2024.4.03.6100", cliente:"Ind. Metais Belo Horizonte", data:"2024-05-30", hora:"15:00", local:"Videoconferência", status:"confirmada", prioridade:"alta" },
  { id:11, tipo:"prazo", titulo:"Prazo para Contestação", processo_id:5, processo:"3322115-44.2024.8.26.0200", cliente:"Ana Claudia Rocha", data:"2024-07-05", hora:null, local:null, status:"pendente", prioridade:"media" },
  { id:12, tipo:"audiencia", titulo:"Audiência de Sustentação Oral — TRF3", processo_id:4, processo:"5544332-11.2024.4.03.6100", cliente:"Ind. Metais Belo Horizonte", data:"2024-07-20", hora:"09:30", local:"TRF3 — Plenário", status:"confirmada", prioridade:"urgente" },
];

// ── Financeiro / Honorários ───────────────────────────────────
export const mockHonorarios = [
  { id:1, cliente:"João Paulo Silva", cliente_id:1, processo:"1234567-89.2024.8.26.0100", descricao:"Honorários — Fase Inicial e Instrução", valor:8500, status:"pago", parcelas:3, parcela_atual:3, data_vencimento:"2024-04-01", data_pagamento:"2024-04-03", forma:"PIX" },
  { id:2, cliente:"Maria Santos Ferreira", cliente_id:2, processo:"9876543-21.2024.5.02.0001", descricao:"Honorários — Ação Trabalhista", valor:4400, status:"pago", parcelas:2, parcela_atual:2, data_vencimento:"2024-03-15", data_pagamento:"2024-03-18", forma:"Transferência" },
  { id:3, cliente:"Tech Solutions Ltda", cliente_id:3, processo:"1122334-55.2024.8.26.0050", descricao:"Honorários — Dissolução de Sociedade (1ª parcela)", valor:14000, status:"pago", parcelas:2, parcela_atual:1, data_vencimento:"2024-04-01", data_pagamento:"2024-04-05", forma:"PIX" },
  { id:4, cliente:"Tech Solutions Ltda", cliente_id:3, processo:"1122334-55.2024.8.26.0050", descricao:"Honorários — Dissolução de Sociedade (2ª parcela)", valor:14000, status:"pendente", parcelas:2, parcela_atual:2, data_vencimento:"2024-07-01", data_pagamento:null, forma:"PIX" },
  { id:5, cliente:"Ind. Metais Belo Horizonte", cliente_id:8, processo:"5544332-11.2024.4.03.6100", descricao:"Honorários — Ação Tributária (1ª parcela)", valor:20000, status:"pago", parcelas:2, parcela_atual:1, data_vencimento:"2024-02-01", data_pagamento:"2024-02-02", forma:"Transferência" },
  { id:6, cliente:"Ind. Metais Belo Horizonte", cliente_id:8, processo:"5544332-11.2024.4.03.6100", descricao:"Honorários — Ação Tributária (2ª parcela)", valor:20000, status:"pendente", parcelas:2, parcela_atual:2, data_vencimento:"2024-08-01", data_pagamento:null, forma:"Transferência" },
  { id:7, cliente:"Ana Claudia Rocha", cliente_id:5, processo:"3322115-44.2024.8.26.0200", descricao:"Honorários — Divórcio Litigioso", valor:12000, status:"pago", parcelas:1, parcela_atual:1, data_vencimento:"2024-04-15", data_pagamento:"2024-04-16", forma:"PIX" },
  { id:8, cliente:"Construtora Prime S.A.", cliente_id:6, processo:"7788990-33.2024.8.26.0100", descricao:"Honorários — Ação de Cobrança Imobiliária", valor:32500, status:"pago", parcelas:2, parcela_atual:2, data_vencimento:"2024-03-01", data_pagamento:"2024-03-04", forma:"Boleto" },
  { id:9, cliente:"Construtora Prime S.A.", cliente_id:6, processo:"9988776-55.2024.8.26.0100", descricao:"Honorários — Rescisão Contratual", valor:32000, status:"pendente", parcelas:2, parcela_atual:1, data_vencimento:"2024-06-01", data_pagamento:null, forma:"PIX" },
  { id:10, cliente:"Roberto Alves Costa", cliente_id:4, processo:"4455667-88.2023.8.26.0100", descricao:"Honorários — Defesa Criminal (adiantamento)", valor:12500, status:"pago", parcelas:2, parcela_atual:1, data_vencimento:"2023-12-01", data_pagamento:"2023-12-03", forma:"PIX" },
  { id:11, cliente:"Roberto Alves Costa", cliente_id:4, processo:"4455667-88.2023.8.26.0100", descricao:"Honorários — Defesa Criminal (2ª parcela)", valor:12500, status:"atrasado", parcelas:2, parcela_atual:2, data_vencimento:"2024-05-01", data_pagamento:null, forma:"PIX" },
  { id:12, cliente:"Fernanda Lima Souza", cliente_id:7, processo:"6677889-00.2024.8.26.0200", descricao:"Honorários — Previdenciário", valor:4000, status:"pago", parcelas:2, parcela_atual:2, data_vencimento:"2024-04-01", data_pagamento:"2024-04-08", forma:"Transferência" },
];

// ── Documentos ────────────────────────────────────────────────
export const mockDocumentos = [
  { id:1, nome:"Petição Inicial — Indenização Moral", tipo:"peticao", processo_id:1, cliente:"João Paulo Silva", data:"2024-01-10", status:"finalizado", tamanho:"45 KB", formato:"PDF" },
  { id:2, nome:"Contestação — Ação Trabalhista", tipo:"contestacao", processo_id:2, cliente:"Maria Santos Ferreira", data:"2024-02-15", status:"finalizado", tamanho:"32 KB", formato:"PDF" },
  { id:3, nome:"Contrato de Honorários — Tech Solutions", tipo:"contrato", processo_id:3, cliente:"Tech Solutions Ltda", data:"2024-03-05", status:"assinado", tamanho:"28 KB", formato:"PDF" },
  { id:4, nome:"Memorial de Cálculos Tributários", tipo:"laudo", processo_id:4, cliente:"Ind. Metais Belo Horizonte", data:"2024-03-20", status:"finalizado", tamanho:"156 KB", formato:"PDF" },
  { id:5, nome:"Acordo de Divórcio — Minuta", tipo:"acordo", processo_id:5, cliente:"Ana Claudia Rocha", data:"2024-04-12", status:"rascunho", tamanho:"22 KB", formato:"DOCX" },
  { id:6, nome:"Recurso de Apelação", tipo:"recurso", processo_id:4, cliente:"Ind. Metais Belo Horizonte", data:"2024-04-28", status:"finalizado", tamanho:"88 KB", formato:"PDF" },
  { id:7, nome:"Procuração Ad Judicia — Roberto Costa", tipo:"procuracao", processo_id:7, cliente:"Roberto Alves Costa", data:"2023-11-15", status:"assinado", tamanho:"12 KB", formato:"PDF" },
  { id:8, nome:"Laudo Pericial — Avaliação Imóvel", tipo:"laudo", processo_id:6, cliente:"Construtora Prime S.A.", data:"2024-05-02", status:"em_analise", tamanho:"2.4 MB", formato:"PDF" },
  { id:9, nome:"Proposta de Acordo — Cobrança", tipo:"acordo", processo_id:6, cliente:"Construtora Prime S.A.", data:"2024-05-10", status:"rascunho", tamanho:"18 KB", formato:"DOCX" },
  { id:10, nome:"Petição de Aposentadoria por Invalidez", tipo:"peticao", processo_id:10, cliente:"Fernanda Lima Souza", data:"2024-03-01", status:"finalizado", tamanho:"38 KB", formato:"PDF" },
];

// ── Templates de documentos ───────────────────────────────────
export const mockTemplates = [
  { id:1, nome:"Petição Inicial — Cível", categoria:"Cível", usos:47 },
  { id:2, nome:"Contrato de Honorários", categoria:"Administrativo", usos:89 },
  { id:3, nome:"Procuração Ad Judicia", categoria:"Administrativo", usos:124 },
  { id:4, nome:"Recurso de Apelação — Trabalhista", categoria:"Trabalhista", usos:23 },
  { id:5, nome:"Acordo de Divórcio Consensual", categoria:"Família", usos:31 },
  { id:6, nome:"Defesa Prévia — Criminal", categoria:"Criminal", usos:18 },
  { id:7, nome:"Impugnação ao Valor da Causa", categoria:"Cível", usos:55 },
  { id:8, nome:"Carta de Preposição", categoria:"Trabalhista", usos:41 },
];

// ── Equipe ────────────────────────────────────────────────────
export const mockEquipe = [
  { id:1, nome:"Dr. Carlos Mendes", cargo:"Sócio-Fundador", oab:"OAB/SP 123.456", email:"carlos@mendesadvocacia.com.br", telefone:"(11) 99999-1111", area:"Cível / Empresarial", processos_ativos:12, status:"ativo", cor:"#1a3a6b" },
  { id:2, nome:"Dra. Patrícia Lima", cargo:"Advogada Associada", oab:"OAB/SP 234.567", email:"patricia@mendesadvocacia.com.br", telefone:"(11) 99999-2222", area:"Trabalhista / Previdenciário", processos_ativos:8, status:"ativo", cor:"#7c3aed" },
  { id:3, nome:"Dr. Rafael Torres", cargo:"Advogado Associado", oab:"OAB/SP 345.678", email:"rafael@mendesadvocacia.com.br", telefone:"(11) 99999-3333", area:"Criminal / Tributário", processos_ativos:6, status:"ativo", cor:"#b8860b" },
  { id:4, nome:"Camila Souza", cargo:"Paralegal Sênior", oab:null, email:"camila@mendesadvocacia.com.br", telefone:"(11) 99999-4444", area:"Suporte Geral", processos_ativos:0, status:"ativo", cor:"#16a34a" },
  { id:5, nome:"Bruno Martins", cargo:"Estagiário", oab:null, email:"bruno@mendesadvocacia.com.br", telefone:"(11) 99999-5555", area:"Cível", processos_ativos:0, status:"ativo", cor:"#dc2626" },
];

// ── Mensagens IA ──────────────────────────────────────────────
export const mockIARespostas = [
  { pergunta: "Qual é o prazo para contestação em ação ordinária?", resposta: "Em ação ordinária pelo rito comum, o prazo para contestação é de **15 dias úteis** a partir da juntada do mandado de citação cumprido, conforme art. 335 do CPC/2015. Para pessoas jurídicas de direito público, o prazo é em dobro (30 dias úteis). Atenção: verifique se há prazo diferenciado na ação específica." },
  { pergunta: "Como calcular os honorários sucumbenciais?", resposta: "Os honorários sucumbenciais são fixados entre **10% e 20%** sobre o valor da condenação, do proveito econômico obtido ou do valor atualizado da causa (art. 85, §2º do CPC). O juiz deve considerar: (1) grau de zelo do profissional; (2) lugar da prestação do serviço; (3) natureza e importância da causa; (4) trabalho realizado e tempo exigido." },
];

// ── Faturamento mensal (para charts) ─────────────────────────
export const mockFaturamentoMensal = [
  { mes:"Jan", honorarios:42000, despesas:8200, liquido:33800 },
  { mes:"Fev", honorarios:38000, despesas:7100, liquido:30900 },
  { mes:"Mar", honorarios:55000, despesas:9800, liquido:45200 },
  { mes:"Abr", honorarios:48000, despesas:8600, liquido:39400 },
  { mes:"Mai", honorarios:61000, despesas:10200, liquido:50800 },
  { mes:"Jun", honorarios:52000, despesas:9100, liquido:42900 },
];

// ── Processos por área (para chart) ──────────────────────────
export const mockProcessosPorArea = [
  { area:"Cível", total:12, ativos:8, c:"#1a3a6b" },
  { area:"Trabalhista", total:7, ativos:5, c:"#b8860b" },
  { area:"Empresarial", total:9, ativos:6, c:"#16a34a" },
  { area:"Criminal", total:3, ativos:3, c:"#dc2626" },
  { area:"Tributário", total:5, ativos:4, c:"#2563eb" },
  { area:"Família", total:4, ativos:3, c:"#7c3aed" },
  { area:"Imobiliário", total:8, ativos:6, c:"#ca8a04" },
  { area:"Previdenciário", total:3, ativos:1, c:"#0891b2" },
];
