import { useState, useRef, useEffect } from "react";
import { L } from "../constants/theme";
import { Fade, Card, Row, Tag, IBtn } from "../components/ui";

const SUGESTOES = [
  "Qual o prazo para contestação em ação ordinária?",
  "Como calcular honorários sucumbenciais?",
  "Quais são as hipóteses de prescrição no direito do trabalho?",
  "Explique o princípio da sucumbência recíproca",
  "Quais documentos são necessários para uma ação de divórcio?",
  "Diferença entre dano moral e dano material",
  "O que é tutela de urgência antecipada?",
  "Prazos para recursos no processo civil",
];

const RESPOSTAS_MOCK = {
  "prazo para contestação": `**Prazo para Contestação — Ação Ordinária (Rito Comum)**\n\nCom base no **art. 335 do CPC/2015**, o prazo para apresentação da contestação é:\n\n• **15 dias úteis** — regra geral para partes privadas\n• **30 dias úteis** — pessoas jurídicas de direito público (art. 183 CPC)\n• **Litisconsórcio passivo** com diferentes procuradores de escritórios distintos: prazo em dobro (30 dias úteis)\n\n**Contagem do prazo:**\nO prazo inicia-se da data de juntada do mandado de citação cumprido aos autos ou da data da citação por edital/carta.\n\n⚠️ **Atenção:** Verifique se há disposição especial para a ação específica, como prazo diferenciado em ações de família ou procedimentos especiais.\n\n*Referência: CPC/2015, arts. 335, 180, 183, 229*`,
  "honorários sucumbenciais": `**Honorários Sucumbenciais — Art. 85 do CPC/2015**\n\nO juiz fixará os honorários de sucumbência observando:\n\n**Percentual (§2º):**\n• Mínimo de **10%** e máximo de **20%** sobre:\n  - Valor da condenação\n  - Proveito econômico obtido\n  - Valor atualizado da causa\n\n**Critérios de fixação (§2º, I-IV):**\n1. Grau de zelo do profissional\n2. Lugar da prestação do serviço\n3. Natureza e importância da causa\n4. Trabalho realizado pelo advogado e tempo exigido\n\n**Causas sem condenação em dinheiro (§8º):**\nO valor será apreciado equitativamente pelo juiz.\n\n**Fazenda Pública (§3º):**\nEscalona progressivamente de 10% até 1% conforme o valor da condenação.\n\n⚖️ Os honorários são direito autônomo do advogado e não podem ser compensados.\n\n*Referência: CPC/2015, art. 85; Súmula 306 STJ*`,
  default: `Estou processando sua consulta jurídica...\n\n**Aviso importante:** Esta é uma demonstração do sistema C4 IA Jurídica. Para funcionalidade completa com IA real (Claude AI da Anthropic), será necessário configurar a integração após o setup do Supabase.\n\nNo modo de produção, responderei consultas sobre:\n• Prazos processuais (CPC, CLT, CTN)\n• Legislação federal, estadual e municipal\n• Jurisprudência dos tribunais superiores\n• Estratégia processual\n• Geração de minutas e peças processuais\n• Análise de documentos jurídicos\n\n*C4 IA Jurídica — Powered by Claude AI (Anthropic)*`,
};

function getRespostaMock(msg) {
  const m = msg.toLowerCase();
  if (m.includes("contest") || m.includes("prazo")) return RESPOSTAS_MOCK["prazo para contestação"];
  if (m.includes("sucumb") || m.includes("honorár")) return RESPOSTAS_MOCK["honorários sucumbenciais"];
  return RESPOSTAS_MOCK["default"];
}

function MarkdownText({ text }) {
  const lines = text.split("\n");
  return (
    <div style={{fontSize:12.5,lineHeight:1.8,color:L.t1}}>
      {lines.map((line,i) => {
        if (!line.trim()) return <div key={i} style={{height:8}}/>;
        let content = line
          .replace(/\*\*(.+?)\*\*/g, (_, m) => `<strong style="color:${L.t1};font-weight:700">${m}</strong>`)
          .replace(/^• /, '');
        const isBullet = line.startsWith("•");
        const isTitle  = line.startsWith("#");
        return (
          <div key={i} style={{marginBottom:2,paddingLeft:isBullet?12:0,display:"flex",gap:isBullet?6:0}}>
            {isBullet && <span style={{color:L.accent,flexShrink:0,marginTop:1}}>•</span>}
            <span
              style={{fontWeight:isTitle?700:400,fontSize:isTitle?13:12.5,color:isTitle?L.t1:L.t2}}
              dangerouslySetInnerHTML={{__html:content}}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function PageIA({ user }) {
  const [msgs, setMsgs]   = useState([
    { role:"assistant", text:`Olá, **${user.nome}**! Sou o **C4 IA Jurídica**, seu assistente de inteligência artificial especializado em Direito brasileiro.\n\nPosso ajudar com:\n• Prazos processuais e procedimentos\n• Legislação e jurisprudência\n• Estratégia e análise processual\n• Geração de minutas de peças\n• Interpretação de documentos jurídicos\n\n⚠️ *Modo demo — respostas simuladas. Configure a integração com Claude AI para respostas reais.*\n\nComo posso ajudar hoje?`, ts:new Date() },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({behavior:"smooth"}); }, [msgs]);

  function enviar(texto) {
    const msg = texto || input.trim();
    if (!msg) return;
    setInput("");
    setMsgs(ms => [...ms, {role:"user", text:msg, ts:new Date()}]);
    setLoading(true);
    setTimeout(() => {
      setMsgs(ms => [...ms, {role:"assistant", text:getRespostaMock(msg), ts:new Date()}]);
      setLoading(false);
    }, 1200 + Math.random()*800);
  }

  const fmtTs = d => d.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});

  return (
    <Fade>
      <Row between mb={16} wrap>
        <div>
          <div style={{fontSize:18,fontWeight:700,color:L.t1,fontFamily:"'Outfit',sans-serif",display:"flex",alignItems:"center",gap:10}}>
            C4 IA Jurídica
            <span style={{background:L.tealBg,color:L.accent,borderRadius:6,padding:"2px 10px",fontSize:10,fontWeight:700,letterSpacing:"1px",fontFamily:"'JetBrains Mono',monospace",border:`1px solid ${L.tealA2}`}}>IA</span>
          </div>
          <div style={{fontSize:11,color:L.t3,marginTop:2}}>Assistente jurídico especializado em Direito brasileiro • Powered by Claude AI</div>
        </div>
        <button onClick={()=>setMsgs([msgs[0]])}
          style={{background:L.surface,border:`1px solid ${L.line}`,borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:11,color:L.t3,fontFamily:"inherit",transition:"all .12s"}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=L.red;e.currentTarget.style.color=L.red;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=L.line;e.currentTarget.style.color=L.t3;}}
        >
          Limpar conversa
        </button>
      </Row>

      <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:16,height:"calc(100vh - 200px)",minHeight:400}} className="rg-auto">
        {/* Chat */}
        <div style={{display:"flex",flexDirection:"column",background:L.white,borderRadius:14,border:`1px solid ${L.line}`,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
          {/* Messages */}
          <div style={{flex:1,overflowY:"auto",padding:"20px",display:"flex",flexDirection:"column",gap:16}}>
            {msgs.map((m,i) => (
              <div key={i} style={{display:"flex",gap:10,flexDirection:m.role==="user"?"row-reverse":"row",alignItems:"flex-start"}}>
                {/* Avatar */}
                <div style={{width:32,height:32,borderRadius:9,background:m.role==="user"?L.accent:L.tealBg,border:`1px solid ${m.role==="user"?L.accent:L.tealA}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>
                  {m.role==="user"?"👤":"⚖️"}
                </div>
                {/* Bubble */}
                <div style={{maxWidth:"78%"}}>
                  <div style={{padding:"12px 16px",borderRadius:m.role==="user"?"12px 4px 12px 12px":"4px 12px 12px 12px",background:m.role==="user"?L.accent:L.surface,border:`1px solid ${m.role==="user"?L.accent:L.line}`,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
                    {m.role==="user"
                      ? <div style={{fontSize:12.5,color:"white",lineHeight:1.6}}>{m.text}</div>
                      : <MarkdownText text={m.text}/>
                    }
                  </div>
                  <div style={{fontSize:9,color:L.t4,marginTop:4,textAlign:m.role==="user"?"right":"left",fontFamily:"'JetBrains Mono',monospace"}}>{fmtTs(m.ts)}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                <div style={{width:32,height:32,borderRadius:9,background:L.tealBg,border:`1px solid ${L.tealA}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>⚖️</div>
                <div style={{padding:"12px 16px",borderRadius:"4px 12px 12px 12px",background:L.surface,border:`1px solid ${L.line}`}}>
                  <div style={{display:"flex",gap:4,alignItems:"center",height:20}}>
                    {[0,1,2].map(j=>(
                      <div key={j} style={{width:6,height:6,borderRadius:"50%",background:L.accent,animation:`blink 1.2s ease ${j*.3}s infinite`}}/>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef}/>
          </div>

          {/* Input */}
          <div style={{borderTop:`1px solid ${L.line}`,padding:"14px 16px",background:L.surface}}>
            <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
              <textarea
                value={input}
                onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();enviar();}}}
                placeholder="Digite sua consulta jurídica... (Enter para enviar, Shift+Enter para nova linha)"
                rows={2}
                style={{flex:1,background:L.white,border:`1.5px solid ${L.line}`,borderRadius:10,padding:"10px 14px",color:L.t1,fontSize:12.5,fontFamily:"'Instrument Sans',sans-serif",outline:"none",resize:"none",lineHeight:1.6,transition:"border-color .12s"}}
                onFocus={e=>{e.target.style.borderColor=L.accent;}}
                onBlur={e=>{e.target.style.borderColor=L.line;}}
              />
              <button onClick={()=>enviar()} disabled={!input.trim()||loading}
                style={{padding:"10px 18px",borderRadius:10,background:input.trim()&&!loading?L.accent:L.surface,color:input.trim()&&!loading?"white":L.t4,border:`1px solid ${input.trim()&&!loading?L.accent:L.line}`,cursor:input.trim()&&!loading?"pointer":"not-allowed",fontSize:13,fontWeight:700,transition:"all .15s",flexShrink:0,height:44}}>
                ➤
              </button>
            </div>
            <div style={{fontSize:9,color:L.t4,marginTop:6,fontFamily:"'JetBrains Mono',monospace"}}>
              ⚠️ DEMO — Respostas simuladas. Configure Claude API para IA real. Sempre revise com profissional habilitado.
            </div>
          </div>
        </div>

        {/* Sugestões */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Card title="Consultas Rápidas" sub="clique para enviar">
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {SUGESTOES.map((s,i) => (
                <button key={i} onClick={()=>enviar(s)}
                  style={{width:"100%",textAlign:"left",background:L.surface,border:`1px solid ${L.line}`,borderRadius:8,padding:"8px 12px",cursor:"pointer",fontSize:11.5,color:L.t2,fontFamily:"inherit",transition:"all .12s",lineHeight:1.4}}
                  onMouseEnter={e=>{e.currentTarget.style.background=L.tealBg;e.currentTarget.style.borderColor=L.tealA2;e.currentTarget.style.color=L.accent;}}
                  onMouseLeave={e=>{e.currentTarget.style.background=L.surface;e.currentTarget.style.borderColor=L.line;e.currentTarget.style.color=L.t2;}}
                >
                  ⚖️ {s}
                </button>
              ))}
            </div>
          </Card>

          <div style={{padding:"14px 16px",borderRadius:12,background:`linear-gradient(135deg,#0d2b55,#1a4a8a)`,color:"white"}}>
            <div style={{fontSize:12,fontWeight:700,marginBottom:6}}>✨ IA Real (Em breve)</div>
            <div style={{fontSize:11,opacity:.85,lineHeight:1.6}}>Configure a integração com o Claude AI da Anthropic para respostas jurídicas reais, análise de documentos e geração de peças processuais.</div>
          </div>
        </div>
      </div>
    </Fade>
  );
}
