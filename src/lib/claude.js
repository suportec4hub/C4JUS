// C4 IA Jurídica — Powered by Groq AI
// Modelo: llama-3.3-70b-versatile (mais capaz da Groq)

const SYSTEM_PROMPT = `Você é o C4 IA Jurídica, assistente de inteligência artificial especializado em Direito brasileiro, integrado ao CRM C4JUS desenvolvido pela C4HUB.

Você é um parceiro jurídico confiável para advogados, promotores, juízes e profissionais do Direito. Responda sempre de forma técnica, precisa e fundamentada.

## Suas competências principais:

### Legislação e Normas
- Constituição Federal de 1988
- Códigos: CPC/2015, CLT, CP, CPP, CDC, CTN, CC/2002, CDB, ECA, Lei de Falências, LGPD
- Legislação federal, estadual e municipal
- Medidas provisórias, resoluções e portarias relevantes

### Jurisprudência
- STF: controle de constitucionalidade, repercussão geral, súmulas vinculantes
- STJ: recursos especiais, súmulas, jurisprudência em teses
- TST: SDI-1 e SDI-2, OJs, súmulas trabalhistas
- TRFs, TJs estaduais, TRTs
- Cite sempre o número do julgado, relator e data quando relevante

### Procedimento e Prazos
- Prazos processuais (CPC, CLT, CPP) com artigos específicos
- Contagem de prazos úteis vs. corridos
- Intimações, publicações e início dos prazos
- Procedimentos ordinário, sumário, sumaríssimo, especiais

### Estratégia Processual
- Análise de chances de êxito
- Escolha de recursos adequados
- Teses jurídicas aplicáveis ao caso
- Riscos e pontos de atenção

### Geração de Peças Processuais
- Petições iniciais, contestações, recursos, memoriais, habeas corpus
- Contratos de honorários, procurações, cartas de preposição
- SEMPRE inclua aviso: "⚠️ Esta minuta foi gerada por IA e deve ser revisada pelo advogado responsável antes do uso."

## Regras de comportamento:
1. **Cite sempre as fontes**: artigos de lei, súmulas, julgados
2. **Seja preciso**: prazos, percentuais, procedimentos têm valores exatos
3. **Admita incertezas**: se não souber, diga claramente
4. **Linguagem técnica**: use terminologia jurídica correta
5. **Atualizações**: alerte quando uma norma pode ter sido alterada após seu conhecimento
6. **Ética**: não auxilie práticas ilegais, antiéticas ou contrárias ao Código de Ética da OAB

Responda em português brasileiro, com clareza e objetividade.`;

export async function askAI(messages, signal) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    signal,
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      max_tokens: 2048,
      temperature: 0.65,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const msg = err?.error?.message || `Erro HTTP ${response.status}`;
    throw new Error(msg);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

/* Respostas demo quando não há API key configurada */
const DEMO = {
  default: `**Modo Demo** — Configure \`VITE_GROQ_API_KEY\` no arquivo \`.env\` para ativar a IA real.

No modo produção, responderei consultas sobre:
• Prazos processuais (CPC, CLT, CTN, CPP)
• Legislação federal e jurisprudência atualizada
• STF, STJ, TST — súmulas e julgados
• Estratégia processual e análise de risco
• Geração de minutas de peças processuais
• Interpretação de contratos e documentos

*C4 IA Jurídica — Powered by Groq AI (LLaMA 3.3 70B)*`,

  contestacao: `**Prazo para Contestação — Rito Comum (CPC/2015)**

Com base no **art. 335 do CPC/2015**, o prazo para contestação é:

• **15 dias úteis** — regra geral para partes privadas
• **30 dias úteis** — Fazenda Pública, MP e Defensoria (arts. 183 e 186)
• **30 dias úteis** — litisconsortes com diferentes procuradores de escritórios distintos (art. 229)

**Início da contagem:**
O prazo corre da data da juntada do mandado de citação cumprido (pessoal), da publicação no DJe (citação por edital) ou do aviso de recebimento (carta).

⚠️ Verifique sempre se há prazo especial para o procedimento específico (inventário, mandado de segurança, ação popular, etc.)

*Ref.: CPC/2015, arts. 335, 183, 186, 229, 231*`,

  honorarios: `**Honorários Advocatícios Sucumbenciais — art. 85 CPC/2015**

**Fixação (§2°):**
O juiz fixará entre **10% e 20%** sobre:
- Valor da condenação
- Proveito econômico obtido
- Valor atualizado da causa (se não houver condenação)

**Critérios (§2°, I a IV):**
1. Grau de zelo do advogado
2. Lugar da prestação do serviço
3. Natureza e importância da causa
4. Trabalho realizado e tempo exigido

**Fazenda Pública (§3°):**
Escalonamento: 10% até R$200k → 8% de R$200k a R$2M → 5% de R$2M a R$20M → 3% de R$20M a R$100M → 1% acima de R$100M

**Pontos importantes:**
• Honorários são direito autônomo do advogado — não podem ser compensados (§14)
• Honorários recursais: cabimento automático (§11) — STJ Tese 1177
• Interesse da Fazenda não implica honorários irrisórios

*Ref.: CPC/2015, art. 85; Súmulas 306 e 453/STJ*`,
};

export function getDemoResponse(msg) {
  const m = msg.toLowerCase();
  if (m.includes("contest") || m.includes("prazo") || m.includes("citar") || m.includes("citaç")) return DEMO.contestacao;
  if (m.includes("sucumb") || m.includes("honorár") || m.includes("honorarios")) return DEMO.honorarios;
  return DEMO.default;
}
