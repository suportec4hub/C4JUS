import { useState, useRef, useEffect, useCallback } from "react";
import { L } from "../constants/theme";
import { Fade, Card, Row } from "../components/ui";
import { askClaude, getDemoResponse } from "../lib/claude";

const HAS_KEY = !!import.meta.env.VITE_ANTHROPIC_API_KEY;

const SUGESTOES = [
  { ico:"⏱", txt:"Qual o prazo para contestação em ação ordinária?" },
  { ico:"💰", txt:"Como calcular honorários sucumbenciais?" },
  { ico:"⚖️", txt:"Quais as hipóteses de prescrição no direito do trabalho?" },
  { ico:"📋", txt:"Elabore uma minuta de contrato de honorários advocatícios" },
  { ico:"🏛️", txt:"Explique o princípio da sucumbência recíproca" },
  { ico:"📄", txt:"O que é tutela de urgência antecipada e seus requisitos?" },
  { ico:"🔍", txt:"Quais os recursos cabíveis após uma sentença civil?" },
  { ico:"👨‍⚖️", txt:"Diferença entre dano moral, material e estético" },
  { ico:"📜", txt:"Quais os requisitos da petição inicial no CPC/2015?" },
  { ico:"🏢", txt:"Como funciona a desconsideração da personalidade jurídica?" },
];

function MarkdownText({ text }) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  const renderInline = (t) => {
    if (t.startsWith("**") && t.endsWith("**")) return <strong style={{fontWeight:700,color:L.t1}}>{t.slice(2,-2)}</strong>;
    if (t.startsWith("*") && t.endsWith("*"))   return <em>{t.slice(1,-1)}</em>;
    if (t.startsWith("`") && t.endsWith("`"))   return <code style={{background:L.surface,padding:"1px 5px",borderRadius:4,fontFamily:"'JetBrains Mono',monospace",fontSize:11}}>{t.slice(1,-1)}</code>;
    return t;
  };

  return (
    <div style={{fontSize:12.5,lineHeight:1.85,color:L.t2}}>
      {text.split("\n").map((line, i) => {
        if (!line.trim()) return <div key={i} style={{height:6}}/>;

        const isBullet  = /^[•\-*]\s/.test(line);
        const isNum     = /^\d+\.\s/.test(line);
        const isH2      = line.startsWith("## ");
        const isH3      = line.startsWith("### ");
        const isWarn    = line.startsWith("⚠️") || line.startsWith("*Ref");
        const cleanLine = line.replace(/^[•\-*]\s|^\d+\.\s|^##+ /, "");

        if (isH2) return (
          <div key={i} style={{fontSize:13.5,fontWeight:700,color:L.t1,marginTop:14,marginBottom:6,paddingBottom:4,borderBottom:`1px solid ${L.line}`,fontFamily:"'Outfit',sans-serif"}}>
            {parts.map(renderInline)}
          </div>
        );
        if (isH3) return (
          <div key={i} style={{fontSize:12.5,fontWeight:700,color:L.t1,marginTop:10,marginBottom:4}}>
            {cleanLine.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).map(renderInline)}
          </div>
        );
        if (isWarn) return (
          <div key={i} style={{fontSize:11,color:L.t3,fontStyle:"italic",marginTop:8,padding:"6px 10px",background:L.surface,borderRadius:6,borderLeft:`2px solid var(--c-gold)`}}>
            {cleanLine.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).map(renderInline)}
          </div>
        );
        if (isBullet || isNum) return (
          <div key={i} style={{display:"flex",gap:8,marginBottom:2,paddingLeft:4}}>
            <span style={{color:"#c9a430",flexShrink:0,fontWeight:700,marginTop:1,fontSize:11}}>{isNum ? line.match(/^\d+/)[0]+"." : "•"}</span>
            <span>{cleanLine.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).map(renderInline)}</span>
          </div>
        );
        return (
          <div key={i} style={{marginBottom:2}}>
            {line.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).map(renderInline)}
          </div>
        );
      })}
    </div>
  );
}

function MsgBubble({ msg }) {
  const isUser = msg.role === "user";
  const fmtTs  = d => d.toLocaleTimeString("pt-BR", {hour:"2-digit",minute:"2-digit"});
  return (
    <div style={{display:"flex",gap:10,flexDirection:isUser?"row-reverse":"row",alignItems:"flex-start",animation:"up .25s ease"}}>
      {/* Avatar */}
      <div style={{
        width:34,height:34,borderRadius:9,flexShrink:0,
        background: isUser ? "#0b1630" : "rgba(201,164,48,0.15)",
        border:`1px solid ${isUser ? "#162340" : "rgba(201,164,48,0.3)"}`,
        display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,
      }}>
        {isUser ? "👤" : "⚖️"}
      </div>
      {/* Conteúdo */}
      <div style={{maxWidth:"78%"}}>
        <div style={{
          padding:"12px 16px",
          borderRadius: isUser ? "12px 4px 12px 12px" : "4px 12px 12px 12px",
          background: isUser ? "#0b1630" : L.white,
          border:`1px solid ${isUser ? "#162340" : L.line}`,
          boxShadow:"0 2px 8px rgba(0,0,0,0.07)",
        }}>
          {isUser
            ? <div style={{fontSize:12.5,color:"rgba(255,255,255,0.92)",lineHeight:1.65}}>{msg.text}</div>
            : <MarkdownText text={msg.text}/>
          }
          {msg.error && (
            <div style={{fontSize:11,color:L.red,marginTop:8,padding:"6px 10px",background:L.redBg,borderRadius:6}}>
              ⚠️ {msg.error}
            </div>
          )}
        </div>
        <div style={{fontSize:9,color:L.t4,marginTop:3,textAlign:isUser?"right":"left",fontFamily:"'JetBrains Mono',monospace"}}>
          {fmtTs(msg.ts)}
          {!HAS_KEY && !isUser && <span style={{marginLeft:6,opacity:.7}}>· DEMO</span>}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
      <div style={{width:34,height:34,borderRadius:9,background:"rgba(201,164,48,0.12)",border:"1px solid rgba(201,164,48,0.28)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>⚖️</div>
      <div style={{padding:"13px 16px",borderRadius:"4px 12px 12px 12px",background:L.white,border:`1px solid ${L.line}`,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
        <div style={{display:"flex",gap:5,alignItems:"center"}}>
          {[0,1,2].map(j => (
            <div key={j} style={{width:7,height:7,borderRadius:"50%",background:"#c9a430",animation:`blink 1.3s ease ${j*.28}s infinite`}}/>
          ))}
          <span style={{fontSize:10,color:L.t4,marginLeft:4,fontFamily:"'JetBrains Mono',monospace"}}>analisando...</span>
        </div>
      </div>
    </div>
  );
}

const BOAS_VINDAS = (nome) =>
`Olá, **${nome}**! Sou o **C4 IA Jurídica**, seu assistente especializado em Direito brasileiro.

**Posso ajudar com:**
• Prazos processuais e contagem (CPC, CLT, CTN, CPP)
• Legislação federal, estadual e jurisprudência atualizada
• Estratégia processual e análise de risco
• STF, STJ, TST — súmulas, teses e julgados
• Geração de minutas de peças processuais (com revisão obrigatória)
• Interpretação de contratos e documentos

Como posso auxiliar hoje?`;

export default function PageIA({ user }) {
  const [msgs, setMsgs]     = useState([{role:"assistant", text:BOAS_VINDAS(user.nome.split(" ")[0]), ts:new Date()}]);
  const [input, setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [abortCtrl, setAbortCtrl] = useState(null);
  const endRef   = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({behavior:"smooth"}); }, [msgs, loading]);

  const enviar = useCallback(async (texto) => {
    const msg = (texto || input).trim();
    if (!msg || loading) return;
    setInput("");

    const userMsg = {role:"user", text:msg, ts:new Date()};
    setMsgs(ms => [...ms, userMsg]);
    setLoading(true);

    const ctrl = new AbortController();
    setAbortCtrl(ctrl);

    try {
      // Monta histórico para contexto (últimas 10 trocas)
      const history = [...msgs, userMsg]
        .filter(m => !m.error)
        .slice(-20)
        .map(m => ({role: m.role, content: m.text}));

      let resposta;
      if (HAS_KEY) {
        resposta = await askClaude(history, ctrl.signal);
      } else {
        await new Promise(r => setTimeout(r, 900 + Math.random()*600));
        resposta = getDemoResponse(msg);
      }
      setMsgs(ms => [...ms, {role:"assistant", text:resposta, ts:new Date()}]);
    } catch (err) {
      if (err.name === "AbortError") return;
      const isNoKey = err.message === "API_KEY_MISSING";
      setMsgs(ms => [...ms, {
        role:"assistant",
        text: isNoKey
          ? "⚠️ API Key não configurada. Adicione `VITE_ANTHROPIC_API_KEY` no arquivo `.env` para usar a IA real."
          : "Ocorreu um erro ao processar sua consulta.",
        error: isNoKey ? null : err.message,
        ts: new Date(),
      }]);
    } finally {
      setLoading(false);
      setAbortCtrl(null);
      inputRef.current?.focus();
    }
  }, [input, loading, msgs]);

  function cancelar() {
    abortCtrl?.abort();
    setLoading(false);
  }

  function limpar() {
    setMsgs([{role:"assistant", text:BOAS_VINDAS(user.nome.split(" ")[0]), ts:new Date()}]);
    setInput("");
  }

  return (
    <Fade>
      <Row between mb={16} wrap>
        <div>
          <div style={{fontSize:18,fontWeight:700,color:L.t1,fontFamily:"'Outfit',sans-serif",display:"flex",alignItems:"center",gap:10}}>
            C4 IA Jurídica
            <span style={{background:"rgba(201,164,48,0.14)",color:"#c9a430",borderRadius:6,padding:"2px 10px",fontSize:9,fontWeight:700,letterSpacing:"1.5px",fontFamily:"'JetBrains Mono',monospace",border:"1px solid rgba(201,164,48,0.32)"}}>
              {HAS_KEY ? "ATIVA" : "DEMO"}
            </span>
          </div>
          <div style={{fontSize:11,color:L.t3,marginTop:2}}>
            Assistente jurídico especializado em Direito brasileiro · {HAS_KEY ? "Powered by Claude AI (Anthropic)" : "Configure VITE_ANTHROPIC_API_KEY para ativar"}
          </div>
        </div>
        <button onClick={limpar}
          style={{background:L.surface,border:`1px solid ${L.line}`,borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:11,color:L.t3,fontFamily:"inherit",transition:"all .12s",display:"flex",alignItems:"center",gap:5}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=L.red;e.currentTarget.style.color=L.red;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=L.line;e.currentTarget.style.color=L.t3;}}
        >
          🗑 Nova conversa
        </button>
      </Row>

      <div style={{display:"grid",gridTemplateColumns:"1fr 270px",gap:16,height:"calc(100vh - 190px)",minHeight:420}} className="rg-auto">

        {/* ── Painel do chat ── */}
        <div style={{display:"flex",flexDirection:"column",background:L.white,borderRadius:14,border:`1px solid ${L.line}`,overflow:"hidden",boxShadow:"0 2px 16px rgba(0,0,0,0.07)"}}>

          {/* Header do chat */}
          <div style={{padding:"12px 18px",borderBottom:`1px solid ${L.line}`,background:L.surface,display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <div style={{width:9,height:9,borderRadius:"50%",background:HAS_KEY?"#1a7438":"#c9a430",boxShadow:`0 0 6px ${HAS_KEY?"#1a7438":"#c9a430"}`}}/>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:600,color:L.t1}}>C4 IA Jurídica</div>
              <div style={{fontSize:9,color:L.t4,fontFamily:"'JetBrains Mono',monospace"}}>{HAS_KEY ? "Claude AI (Anthropic) · Ativo" : "Modo demonstração · Configure a API Key"}</div>
            </div>
            <div style={{fontSize:10,color:L.t4}}>{msgs.length - 1} mensagens</div>
          </div>

          {/* Mensagens */}
          <div style={{flex:1,overflowY:"auto",padding:"20px 18px",display:"flex",flexDirection:"column",gap:16}}>
            {msgs.map((m,i) => <MsgBubble key={i} msg={m}/>)}
            {loading && <TypingIndicator/>}
            <div ref={endRef}/>
          </div>

          {/* Input */}
          <div style={{borderTop:`1px solid ${L.line}`,padding:"12px 16px",background:L.surface,flexShrink:0}}>
            <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
              <div style={{flex:1,position:"relative"}}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); enviar(); }}}
                  placeholder="Digite sua consulta jurídica... (Enter para enviar, Shift+Enter para nova linha)"
                  rows={2}
                  disabled={loading}
                  style={{
                    width:"100%",background:L.white,
                    border:`1.5px solid ${input.trim() ? "#c9a430" : L.line}`,
                    borderRadius:10,padding:"10px 14px",color:L.t1,
                    fontSize:12.5,fontFamily:"'Instrument Sans',sans-serif",
                    outline:"none",resize:"none",lineHeight:1.65,
                    transition:"border-color .15s",
                    opacity: loading ? .6 : 1,
                  }}
                  onFocus={e => e.target.style.borderColor="#c9a430"}
                  onBlur={e => e.target.style.borderColor=input.trim()?"#c9a430":L.line}
                />
              </div>
              {loading ? (
                <button onClick={cancelar}
                  style={{padding:"10px 14px",borderRadius:10,background:L.redBg,color:L.red,border:`1px solid ${L.redA}`,cursor:"pointer",fontSize:13,flexShrink:0,height:44,transition:"all .12s"}}
                  title="Cancelar">
                  ✕
                </button>
              ) : (
                <button onClick={() => enviar()} disabled={!input.trim()}
                  style={{
                    padding:"10px 16px",borderRadius:10,height:44,flexShrink:0,
                    background: input.trim() ? "#0b1630" : L.surface,
                    color: input.trim() ? "white" : L.t4,
                    border:`1px solid ${input.trim() ? "#162340" : L.line}`,
                    cursor: input.trim() ? "pointer" : "not-allowed",
                    fontSize:14,fontWeight:700,transition:"all .15s",
                    boxShadow: input.trim() ? "0 2px 8px rgba(11,22,48,.25)" : "none",
                  }}>
                  ➤
                </button>
              )}
            </div>
            <div style={{fontSize:9,color:L.t4,marginTop:6,fontFamily:"'JetBrains Mono',monospace",display:"flex",alignItems:"center",gap:6}}>
              <span style={{color:"#c9a430",opacity:.7}}>⚠</span>
              Respostas de IA não substituem orientação jurídica profissional. Sempre revise antes de usar em processos reais.
            </div>
          </div>
        </div>

        {/* ── Painel lateral ── */}
        <div style={{display:"flex",flexDirection:"column",gap:12,overflowY:"auto"}}>

          {/* Consultas rápidas */}
          <Card title="Consultas Rápidas" sub="clique para enviar">
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {SUGESTOES.map((s,i) => (
                <button key={i} onClick={() => enviar(s.txt)} disabled={loading}
                  style={{
                    width:"100%",textAlign:"left",
                    background:L.surface,border:`1px solid ${L.line}`,
                    borderRadius:8,padding:"7px 10px",
                    cursor:loading?"not-allowed":"pointer",
                    fontSize:11.5,color:L.t2,fontFamily:"inherit",
                    transition:"all .12s",lineHeight:1.4,
                    display:"flex",alignItems:"flex-start",gap:7,
                    opacity:loading?.6:1,
                  }}
                  onMouseEnter={e=>{if(!loading){e.currentTarget.style.background="rgba(201,164,48,0.08)";e.currentTarget.style.borderColor="rgba(201,164,48,0.35)";e.currentTarget.style.color=L.t1;}}}
                  onMouseLeave={e=>{e.currentTarget.style.background=L.surface;e.currentTarget.style.borderColor=L.line;e.currentTarget.style.color=L.t2;}}
                >
                  <span style={{flexShrink:0,fontSize:13}}>{s.ico}</span>
                  <span>{s.txt}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Status da IA */}
          <div style={{
            padding:"14px 16px",borderRadius:12,
            background: HAS_KEY
              ? "linear-gradient(135deg,#071428,#0c1e40)"
              : "linear-gradient(135deg,#1a1408,#251d0a)",
            border:`1px solid ${HAS_KEY ? "#1a2d50" : "rgba(201,164,48,0.25)"}`,
          }}>
            <div style={{fontSize:12,fontWeight:700,color:HAS_KEY?"#5590ff":"#c9a430",marginBottom:6,display:"flex",alignItems:"center",gap:6}}>
              {HAS_KEY ? "✅ IA Conectada" : "⚙️ Configurar IA"}
            </div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.65)",lineHeight:1.65}}>
              {HAS_KEY
                ? "Claude AI (Anthropic) ativo. Consultas jurídicas reais com legislação e jurisprudência atualizada."
                : <>Adicione no arquivo <code style={{background:"rgba(201,164,48,0.15)",padding:"1px 5px",borderRadius:4,fontSize:10,fontFamily:"'JetBrains Mono',monospace"}}>.env</code>:<br/><br/><code style={{background:"rgba(201,164,48,0.1)",padding:"4px 8px",borderRadius:5,fontSize:9.5,fontFamily:"'JetBrains Mono',monospace",display:"block",marginTop:2,lineHeight:1.8,color:"#c9a430"}}>VITE_ANTHROPIC_API_KEY=<br/>sk-ant-...</code></>
              }
            </div>
          </div>

          {/* Aviso ético */}
          <div style={{padding:"12px 14px",borderRadius:10,background:L.surface,border:`1px solid ${L.line}`,fontSize:10.5,color:L.t3,lineHeight:1.65}}>
            <div style={{fontWeight:700,color:L.t2,marginBottom:4,fontSize:11}}>📋 Aviso Legal</div>
            Respostas geradas por IA têm caráter informativo e de apoio à pesquisa jurídica. Não substituem a análise do profissional habilitado nem constituem orientação jurídica formal. Peças processuais geradas devem ser obrigatoriamente revisadas pelo advogado responsável.
          </div>
        </div>
      </div>
    </Fade>
  );
}
