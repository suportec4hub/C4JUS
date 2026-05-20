import { useState, useMemo } from "react";
import { L } from "../constants/theme";
import { Fade, Card, Row, Grid, PBtn, IBtn, SearchBar, StatusBadge, Tag, EmptyState } from "../components/ui";
import Modal, { Field, Input, Select, ModalFooter } from "../components/Modal";
import { mockDocumentos, mockTemplates } from "../constants/mockData";

const TIPOS = ["peticao","contestacao","recurso","contrato","acordo","laudo","procuracao","outros"];
const TIPO_L = {peticao:"Petição",contestacao:"Contestação",recurso:"Recurso",contrato:"Contrato",acordo:"Acordo",laudo:"Laudo",procuracao:"Procuração",outros:"Outros"};
const TIPO_ICON = {peticao:"📄",contestacao:"📝",recurso:"⚖️",contrato:"📃",acordo:"🤝",laudo:"🔬",procuracao:"✍️",outros:"📁"};
const STATUS_OPTS = ["rascunho","em_analise","finalizado","assinado"];

const EMPTY = { nome:"", tipo:"peticao", processo_id:"", cliente:"", status:"rascunho", formato:"PDF" };

export default function PageDocumentos({ user }) {
  const [docs, setDocs]     = useState(mockDocumentos);
  const [aba, setAba]       = useState("Documentos");
  const [busca, setBusca]   = useState("");
  const [filtroTipo, setFiltroTipo]   = useState("Todos");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [modal, setModal]   = useState(null);
  const [form, setForm]     = useState(EMPTY);

  const filtered = useMemo(() => {
    let r = docs;
    if (busca) r = r.filter(d => d.nome.toLowerCase().includes(busca.toLowerCase()) || d.cliente?.toLowerCase().includes(busca.toLowerCase()));
    if (filtroTipo !== "Todos") r = r.filter(d => d.tipo === filtroTipo);
    if (filtroStatus !== "Todos") r = r.filter(d => d.status === filtroStatus);
    return r.sort((a,b) => new Date(b.data) - new Date(a.data));
  }, [docs, busca, filtroTipo, filtroStatus]);

  function salvar() {
    if (!form.nome) return alert("Nome do documento é obrigatório.");
    if (modal === "novo") {
      setDocs(ds => [...ds, {...form, id:Date.now(), data:new Date().toISOString().slice(0,10), tamanho:"—"}]);
    } else {
      setDocs(ds => ds.map(d => d.id===modal.id ? {...form,id:d.id,data:d.data,tamanho:d.tamanho} : d));
    }
    setModal(null);
  }

  function excluir(id) {
    if (!confirm("Excluir este documento?")) return;
    setDocs(ds => ds.filter(d => d.id !== id));
  }

  const f = (k,v) => setForm(p=>({...p,[k]:v}));
  const fmtD = s => { if (!s) return "—"; return new Date(s+"T00:00:00").toLocaleDateString("pt-BR"); };

  return (
    <Fade>
      <Row between mb={16} wrap>
        <div>
          <div style={{fontSize:18,fontWeight:700,color:L.t1,fontFamily:"'Outfit',sans-serif"}}>Documentos</div>
          <div style={{fontSize:11,color:L.t3,marginTop:2}}>{docs.length} documentos cadastrados</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <div style={{display:"flex",background:L.surface,borderRadius:9,border:`1px solid ${L.line}`,padding:3}}>
            {["Documentos","Templates"].map(a=>(
              <button key={a} onClick={()=>setAba(a)}
                style={{padding:"5px 14px",borderRadius:7,fontSize:12,fontWeight:aba===a?600:400,cursor:"pointer",fontFamily:"inherit",background:aba===a?L.white:L.surface,color:aba===a?L.accent:L.t3,border:"none",transition:"all .12s"}}>
                {a}
              </button>
            ))}
          </div>
          {aba==="Documentos" && <PBtn onClick={()=>{setForm(EMPTY);setModal("novo");}}>+ Novo Documento</PBtn>}
        </div>
      </Row>

      {aba === "Documentos" ? (
        <>
          {/* Filtros */}
          <Card style={{marginBottom:16}}>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
              <SearchBar value={busca} onChange={setBusca} placeholder="Buscar por nome ou cliente..."/>
              <select value={filtroTipo} onChange={e=>setFiltroTipo(e.target.value)}
                style={{background:L.surface,border:`1px solid ${L.line}`,borderRadius:9,padding:"7px 12px",color:L.t2,fontSize:12,fontFamily:"inherit",outline:"none",cursor:"pointer"}}>
                <option>Todos</option>
                {TIPOS.map(t=><option key={t} value={t}>{TIPO_L[t]}</option>)}
              </select>
              <select value={filtroStatus} onChange={e=>setFiltroStatus(e.target.value)}
                style={{background:L.surface,border:`1px solid ${L.line}`,borderRadius:9,padding:"7px 12px",color:L.t2,fontSize:12,fontFamily:"inherit",outline:"none",cursor:"pointer"}}>
                <option>Todos</option>
                {STATUS_OPTS.map(s=><option key={s} value={s}>{s[0].toUpperCase()+s.slice(1).replace("_"," ")}</option>)}
              </select>
            </div>
          </Card>

          {/* Grid de documentos */}
          {filtered.length === 0 ? (
            <div style={{background:L.white,borderRadius:12,border:`1px solid ${L.line}`}}>
              <EmptyState icon="📁" title="Nenhum documento encontrado" desc="Adicione documentos para mantê-los organizados por processo e cliente"/>
            </div>
          ) : (
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
              {filtered.map(doc => (
                <div key={doc.id}
                  style={{background:L.white,borderRadius:12,border:`1px solid ${L.line}`,padding:"16px",boxShadow:"0 1px 4px rgba(0,0,0,0.05)",transition:"all .15s"}}
                  onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 4px 16px rgba(0,0,0,0.1)`;e.currentTarget.style.transform="translateY(-2px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.05)";e.currentTarget.style.transform="none";}}
                >
                  <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:12}}>
                    <div style={{width:40,height:40,borderRadius:9,background:L.tealBg,border:`1px solid ${L.tealA}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>
                      {TIPO_ICON[doc.tipo]||"📄"}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12.5,fontWeight:700,color:L.t1,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{doc.nome}</div>
                      <div style={{fontSize:10.5,color:L.t3}}>{doc.cliente}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
                    <Tag color={L.copper} small>{TIPO_L[doc.tipo]||doc.tipo}</Tag>
                    <StatusBadge status={doc.status}/>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:10,color:L.t4,marginBottom:12}}>
                    <span>{doc.formato} · {doc.tamanho}</span>
                    <span>{fmtD(doc.data)}</span>
                  </div>
                  <div style={{display:"flex",gap:6,paddingTop:10,borderTop:`1px solid ${L.lineSoft}`}}>
                    <button style={{flex:1,padding:"6px 0",borderRadius:7,fontSize:11,fontWeight:600,cursor:"pointer",background:L.accent,color:"white",border:"none"}}>
                      📥 Download
                    </button>
                    <IBtn c={L.blue} onClick={()=>{setForm({nome:doc.nome,tipo:doc.tipo,processo_id:doc.processo_id||"",cliente:doc.cliente,status:doc.status,formato:doc.formato});setModal(doc);}} small>Editar</IBtn>
                    <IBtn c={L.red}  onClick={()=>excluir(doc.id)} small>✕</IBtn>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* Templates */
        <div>
          <Card style={{marginBottom:16}} title="Templates de Documentos" sub="Modelos prontos para geração de peças processuais">
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:10,marginTop:4}}>
              {mockTemplates.map(t => (
                <div key={t.id}
                  style={{background:L.surface,borderRadius:10,border:`1px solid ${L.line}`,padding:"14px",cursor:"pointer",transition:"all .15s"}}
                  onMouseEnter={e=>{e.currentTarget.style.background=L.tealBg;e.currentTarget.style.borderColor=L.tealA2;}}
                  onMouseLeave={e=>{e.currentTarget.style.background=L.surface;e.currentTarget.style.borderColor=L.line;}}
                >
                  <div style={{fontSize:20,marginBottom:8}}>📄</div>
                  <div style={{fontSize:12,fontWeight:700,color:L.t1,marginBottom:4}}>{t.nome}</div>
                  <div style={{fontSize:10,color:L.t3,marginBottom:10}}>{t.categoria}</div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:10,color:L.t4}}>{t.usos} usos</span>
                    <button style={{padding:"4px 10px",borderRadius:6,fontSize:10,fontWeight:600,cursor:"pointer",background:L.accent,color:"white",border:"none"}}>
                      Usar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <div style={{padding:"16px 20px",borderRadius:12,background:`linear-gradient(135deg,${L.tealBg},${L.copperBg})`,border:`1px solid ${L.tealA}`,display:"flex",gap:12,alignItems:"flex-start"}}>
            <div style={{fontSize:24,flexShrink:0}}>✨</div>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:L.t1,marginBottom:4}}>IA Jurídica — Geração Automática</div>
              <div style={{fontSize:12,color:L.t3}}>Use o módulo <b>C4 IA Jurídica</b> para gerar peças processuais automaticamente com base nos dados do processo. A IA sugere o documento completo e você faz a revisão final antes de assinar.</div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {modal !== null && (
        <Modal title={modal==="novo"?"Novo Documento":"Editar Documento"} onClose={()=>setModal(null)}>
          <Field label="Nome do Documento" required><Input value={form.nome} onChange={v=>f("nome",v)} placeholder="Ex: Petição Inicial — Danos Morais"/></Field>
          <div className="form-grid">
            <Field label="Tipo"><Select value={form.tipo} onChange={v=>f("tipo",v)}>{TIPOS.map(t=><option key={t} value={t}>{TIPO_L[t]}</option>)}</Select></Field>
            <Field label="Status"><Select value={form.status} onChange={v=>f("status",v)}>{STATUS_OPTS.map(s=><option key={s} value={s}>{s[0].toUpperCase()+s.slice(1).replace("_"," ")}</option>)}</Select></Field>
            <Field label="Cliente"><Input value={form.cliente} onChange={v=>f("cliente",v)} placeholder="Nome do cliente"/></Field>
            <Field label="Formato"><Select value={form.formato} onChange={v=>f("formato",v)}><option>PDF</option><option>DOCX</option><option>ODT</option></Select></Field>
          </div>
          <ModalFooter onClose={()=>setModal(null)} onSave={salvar} label={modal==="novo"?"Cadastrar":"Salvar"}/>
        </Modal>
      )}
    </Fade>
  );
}
