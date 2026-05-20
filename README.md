# ⚖️ C4JUS — CRM Jurídico Inteligente

> CRM completo para advogados, juízes, promotores e profissionais do Direito, desenvolvido pela C4HUB.

---

## 📋 Visão Geral

O **C4JUS** é um sistema de gestão jurídica (CRM) projetado para escritórios de advocacia, departamentos jurídicos e profissionais do Direito. Inspirado nos melhores CRMs jurídicos do mercado — como Clio, Lawmatics, ADVBOX e Astrea — o C4JUS centraliza clientes, processos, prazos, documentos e financeiro em uma única plataforma inteligente com integração de IA.

### Por que o C4JUS?

| Problema | Solução C4JUS |
|---|---|
| Prazos perdidos | Controle de prazos com alertas automáticos |
| Processos dispersos | Painel unificado de todos os processos |
| Clientes sem acompanhamento | CRM com histórico completo |
| Faturamento desorganizado | Gestão de honorários e inadimplência |
| Documentos espalhados | Repositório digital centralizado |
| Decisões sem dados | Relatórios e BI jurídico |
| Pesquisa jurídica lenta | IA Jurídica integrada (Claude AI) |

---

## 🏗️ Arquitetura e Stack

```
c4jus/
├── public/
│   ├── favicon.svg
│   └── logo.svg
├── src/
│   ├── components/
│   │   ├── Shell.jsx        # Layout principal (sidebar + header)
│   │   ├── Modal.jsx        # Modal genérico + Field, Input, Select
│   │   ├── Logo.jsx         # Logo SVG do C4JUS
│   │   └── ui.jsx           # Componentes reutilizáveis (Card, Grid, Tag, etc.)
│   ├── constants/
│   │   ├── theme.js         # Sistema de temas (light/dark) via CSS variables
│   │   └── mockData.js      # Dados mock para MVP (substituir por Supabase)
│   ├── hooks/
│   │   └── useBreakpoint.js # Hook responsivo (mobile/tablet/desktop)
│   ├── lib/
│   │   └── supabase.js      # Cliente Supabase (configurar com credenciais)
│   ├── pages/
│   │   ├── PageDashboard.jsx   # Dashboard com KPIs e gráficos
│   │   ├── PageProcessos.jsx   # Gestão de processos judiciais
│   │   ├── PageClientes.jsx    # CRM de clientes
│   │   ├── PageAgenda.jsx      # Agenda e calendário
│   │   ├── PagePrazos.jsx      # Controle de prazos
│   │   ├── PageDocumentos.jsx  # Documentos e templates
│   │   ├── PageFinanceiro.jsx  # Honorários e financeiro
│   │   ├── PageIA.jsx          # IA Jurídica (Claude AI)
│   │   ├── PageRelatorios.jsx  # Relatórios e analytics
│   │   ├── PageEquipe.jsx      # Gestão da equipe
│   │   └── PageEscritorio.jsx  # Configurações do escritório
│   ├── App.jsx              # Raiz da aplicação
│   └── main.jsx             # Entry point React
├── index.html
├── package.json
└── vite.config.js
```

### Tecnologias

| Categoria | Tecnologia |
|---|---|
| Framework | React 18 + Vite |
| Estilização | CSS Variables (sistema de temas) + Inline Styles |
| Gráficos | Recharts |
| Banco de Dados | Supabase (PostgreSQL) — pendente configuração |
| Storage | Supabase Storage — pendente configuração |
| IA | Claude API (Anthropic) — pendente configuração |
| Fontes | Outfit, JetBrains Mono, Instrument Sans |
| Deploy | Vercel |

---

## 🧩 Módulos do Sistema

### 1. Dashboard
- KPIs: Processos ativos, Audiências do mês, Honorários em aberto, Prazos urgentes
- Gráfico de faturamento mensal vs. meta
- Gráfico de processos por área do Direito
- Calendário de próximas audiências e prazos
- Funil de status dos processos

### 2. Processos
- Cadastro completo de processos judiciais (número CNJ, vara, tribunal)
- Áreas: Cível, Trabalhista, Criminal, Tributário, Empresarial, Família, Imobiliário, Previdenciário
- Status: Em andamento, Aguardando, Suspenso, Encerrado, Arquivado
- Fases: Inicial, Citação, Defesa, Instrução, Sentença, Recurso, Execução
- Prioridade: Urgente, Alta, Média, Baixa
- Vinculação com clientes, advogados e documentos

### 3. Clientes
- Cadastro de PF (CPF) e PJ (CNPJ)
- Histórico completo de processos por cliente
- Valor total em causa por cliente
- Intake jurídico: formulário de captação de novos casos
- Status: Ativo, Inativo, Prospecto
- Segmentação por área do Direito e localidade

### 4. Agenda
- Calendário mensal com visualização de audiências, prazos e reuniões
- Lista de próximos compromissos com prioridade
- Tipos: Audiência, Prazo processual, Reunião, Diligência
- Integração com processos e clientes

### 5. Prazos
- Dashboard de prazos com semáforo de urgência
- Alertas visuais para prazos críticos (vencidos, hoje, 3 dias, 7 dias)
- Prazos vinculados a processos específicos

### 6. Documentos
- Repositório de documentos por processo e cliente
- Templates: petição inicial, contestação, recurso, contrato de honorários, procuração
- Status: Rascunho, Em análise, Finalizado, Assinado

### 7. Financeiro
- Gestão de honorários por processo e cliente
- Status: Pago, Pendente, Atrasado
- Parcelamento e formas de pagamento
- Gráfico de faturamento x despesas
- Relatório de inadimplência

### 8. IA Jurídica (C4 IA)
- Chat com IA especializada em Direito brasileiro
- Consultas sobre prazos, legislação, jurisprudência
- Análise de documentos processuais
- Powered by Claude AI (Anthropic)

### 9. Relatórios
- Faturamento mensal e anual
- Taxa de sucesso por área e advogado
- Volume de processos por tribunal
- Produtividade da equipe

### 10. Equipe
- Cadastro de advogados, paralegais e estagiários
- OAB e área de atuação
- Processos atribuídos por membro

### 11. Escritório
- Dados cadastrais do escritório
- Configurações de notificações
- Configurações de honorários padrão

---

## 🚀 Instalação e Uso

### Pré-requisitos
- Node.js 18+
- npm 9+

### Desenvolvimento
```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

### Configuração do Supabase (quando disponível)
Crie o arquivo `.env` na raiz do projeto:
```env
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
```

---

## 🗄️ Banco de Dados — Schema Planejado (Supabase)

```sql
-- Escritórios
CREATE TABLE escritorios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  email TEXT,
  telefone TEXT,
  logotipo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Usuários / Advogados
CREATE TABLE usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users,
  escritorio_id UUID REFERENCES escritorios,
  nome TEXT NOT NULL,
  cargo TEXT,
  oab TEXT,
  area TEXT,
  role TEXT DEFAULT 'advogado',
  cor TEXT,
  foto_url TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Clientes
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  escritorio_id UUID REFERENCES escritorios,
  nome TEXT NOT NULL,
  tipo TEXT DEFAULT 'PF',
  cpf TEXT,
  cnpj TEXT,
  email TEXT,
  telefone TEXT,
  cidade TEXT,
  estado TEXT,
  area TEXT,
  status TEXT DEFAULT 'ativo',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Processos
CREATE TABLE processos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  escritorio_id UUID REFERENCES escritorios,
  numero TEXT NOT NULL,
  cliente_id UUID REFERENCES clientes,
  advogado_id UUID REFERENCES usuarios,
  area TEXT NOT NULL,
  vara TEXT,
  tribunal TEXT,
  status TEXT DEFAULT 'em_andamento',
  fase TEXT,
  prioridade TEXT DEFAULT 'media',
  valor_causa NUMERIC,
  honorarios NUMERIC,
  parte_contraria TEXT,
  tipo TEXT,
  inicio DATE,
  proxima_audiencia DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Agenda
CREATE TABLE agenda (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  escritorio_id UUID REFERENCES escritorios,
  processo_id UUID REFERENCES processos,
  tipo TEXT NOT NULL,
  titulo TEXT NOT NULL,
  data DATE NOT NULL,
  hora TIME,
  local TEXT,
  status TEXT DEFAULT 'pendente',
  prioridade TEXT DEFAULT 'media',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Honorários
CREATE TABLE honorarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  escritorio_id UUID REFERENCES escritorios,
  processo_id UUID REFERENCES processos,
  cliente_id UUID REFERENCES clientes,
  descricao TEXT,
  valor NUMERIC NOT NULL,
  parcelas INT DEFAULT 1,
  parcela_atual INT DEFAULT 1,
  status TEXT DEFAULT 'pendente',
  forma TEXT,
  data_vencimento DATE,
  data_pagamento DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Documentos
CREATE TABLE documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  escritorio_id UUID REFERENCES escritorios,
  processo_id UUID REFERENCES processos,
  nome TEXT NOT NULL,
  tipo TEXT,
  status TEXT DEFAULT 'rascunho',
  arquivo_url TEXT,
  tamanho TEXT,
  formato TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 🔐 Controle de Acesso

| Role | Dashboard | Processos | Clientes | Financeiro | Equipe | Config |
|---|---|---|---|---|---|---|
| Admin | Total | Total | Total | Total | Total | Total |
| Sócio | Total | Total | Total | Total | Leitura | Não |
| Associado | Total | Próprios | Total | Leitura | Não | Não |
| Paralegal | Total | Leitura | Leitura | Não | Não | Não |
| Estagiário | Leitura | Leitura | Não | Não | Não | Não |

---

## 🗺️ Roadmap

### MVP (Atual) — Dados mock, sem banco de dados
- [x] Layout e sistema de temas (light/dark)
- [x] Dashboard com KPIs e gráficos
- [x] Gestão de processos (CRUD local)
- [x] CRM de clientes (CRUD local)
- [x] Agenda e prazos
- [x] Documentos e templates
- [x] Financeiro e honorários
- [x] IA Jurídica (interface)
- [x] Relatórios
- [x] Gestão de equipe

### Fase 2 — Supabase e Autenticação
- [ ] Configurar Supabase (credenciais)
- [ ] Autenticação (login/logout/recuperação)
- [ ] CRUD real com PostgreSQL
- [ ] Upload de documentos (Supabase Storage)
- [ ] Multi-tenant (múltiplos escritórios)
- [ ] Notificações de prazo por e-mail

### Fase 3 — IA e Integrações
- [ ] IA Jurídica real (Claude API)
- [ ] Análise automática de documentos
- [ ] Geração de peças processuais
- [ ] Integração com tribunais (CNJ API)
- [ ] Captura automática de intimações (DJe)
- [ ] Integração WhatsApp

### Fase 4 — Mobile e Avançado
- [ ] App mobile (React Native)
- [ ] Assinatura digital
- [ ] Portal do cliente
- [ ] BI avançado com previsões

---

## 🏆 Benchmarks Analisados

| CRM | País | Destaque |
|---|---|---|
| Clio | EUA | Líder mundial, $5B valuation |
| Lawmatics | EUA | Melhor intake e IA |
| Filevine | EUA | Texting integrado |
| ADVBOX | Brasil | Mais completo do BR |
| Astrea | Brasil | 110k advogados |
| EasyJur | Brasil | Machine learning |
| JUScrm | Brasil | Focado em CRM |

---

## 👨‍💻 Desenvolvido por

**C4HUB** — Soluções Tecnológicas para o Mercado Jurídico

*C4JUS © 2025 C4HUB — Todos os direitos reservados*
