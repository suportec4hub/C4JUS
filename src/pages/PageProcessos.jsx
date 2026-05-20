import { useState, useMemo } from "react";
import { L } from "../constants/theme";
import { Fade, Card, Row, DataTable, EmptyRow, PBtn, IBtn, SearchBar, StatusBadge, PrioridadeBadge, AreaBadge, TabPills, Tag } from "../components/ui";
import Modal, { Field, Input, Select, ModalFooter, Textarea } from "../components/Modal";
import { mockProcessos } from "../constants/mockData";

const AREAS = ["Cível","Trabalhista","Criminal","Tributário","Empresarial","Família","Imobiliário","Previdenciário","Administrativo","Ambiental"];
const STATUS = ["em_andamento","aguardando","suspenso","encerrado","arquivado"];
const STATUS_L = {em_andamento:"Em Andamento",aguardando:"Aguardando",suspenso:"Suspenso",encerrado:"Encerrado",arquivado:"Arquivado"};
const FASES = ["Inicial","Citação","Defesa","Instrução","Sentença","Recurso","Execução","Trânsito em Julgado"];
const PRIOS = ["urgente","alta","media","baixa"];
const TRIB = ["TJSP","TJRJ","TJMG","TRT-2","TRT-15","TRF1","TRF3","STJ","STF","CARF"];

const fmt = v => v ? `R$ ${Number(v).toLocaleString("pt-BR")}` : "—";
const fmtD = s => { if (!s) return "—"; const d = new Date(s+"T00:00:00"); return d.toLocaleDateString("pt-BR"); };

function diasAte(data) {
  if (!data) return null;
  const hoje = new Date(); hoje.setHours(0,0,0,0);
  const alvo = new Date(data+"T00:00:00");
  return Math.round((alvo-hoje)/86400000);
}

const EMPTY = { numero:"", cliente:"", area:"Cível", vara:"", tribunal:"TJSP", status:"em_andamento", fase:"Inicial", prioridade:"media", valor_causa:"", honorarios:"", parte_contraria:"", tipo:"", inicio:"", proxima_audiencia:"" };

export default function PageProcessos({ user }) {
  const [processos, setProcessos] = useState(mockProcessos);
  const [busca, setBusca]   = useState("");
  const [filtroArea, setFiltroArea]     = useState("Todos");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [modal, setModal]   = useState(null); // null | "novo" | {processo}
  const [form, setForm]     = useState(EMPTY);
  const [detalhe, setDetalhe] = useState(null);

  const filtered = useMemo(() => {
    let r = processos;
    if (busca) r = r.filter(p => p.numero.includes(busca) || p.cliente.toLowerCase().includes(busca.toLowerCase()) || p.tipo?.toLowerCase().includes(busca.toLowerCase()));
    if (filtroArea !== "Todos") r = r.filter(p => p.area === filtroArea);
    if (filtroStatus !== "Todos") r = r.filter(p => p.status === filtroStatus);
    return r;
  }, [processos, busca, filtroArea, filtroStatus]);

  function abrirNovo() { setForm(EMPTY); setModal("novo"); }
  function abrirEditar(p) { setForm({...p,valor_causa:p.valor_causa||"",honorarios:p.honorarios||""}); setModal(p); }

  function salvar() {
    if (!form.numero || !form.cliente) return alert("Número e cliente são obrigatórios.");
    if (modal === "novo") {
      setProcessos(ps => [...ps, {...form, id:Date.now(), ultima_movimentacao:new Date().toISOString().slice(0,10)}]);
    } else {
      setProcessos(ps => ps.map(p => p.id===modal.id ? {...form, id:p.id} : p));
    }
    setModal(null);
  }

  function excluir(id) {
    if (!confirm("Confirmar exclusão deste processo?")) return;
    setProcessos(ps => ps.filter(p => p.id !== id));
  }

  const f = (k,v) => setForm(p => ({...p,[k]:v}));

  return (
    <Fade>
      {/* Header + ações */}
      <Row between mb={16} wrap>
        <div>
          <div style={{fontSize:18,fontWeight:700,color:L.t1,fontFamily:"'Outfit',sans-serif"}}>Processos Judiciais</div>
          <div style={{fontSize:11,color:L.t3,marginTop:2}}>{filtered.length} de {processos.length} processos</div>
        </div>
        <PBtn onClick={abrirNovo}>+ Novo Processo</PBtn>
      </Row>

      {/* Filtros */}
      <Card style={{marginBottom:16}}>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
          <SearchBar value={busca} onChange={setBusca} placeholder="Buscar por número, cliente ou tipo..."/>
          <select value={filtroArea} onChange={e=>setFiltroArea(e.target.value)}
            style={{background:L.surface,border:`1px solid ${L.line}`,borderRadius:9,padding:"7px 12px",color:L.t2,fontSize:12,fontFamily:"inherit",outline:"none",cursor:"pointer"}}>
            <option>Todos</option>
            {AREAS.map(a=><option key={a}>{a}</option>)}
          </select>
          <select value={filtroStatus} onChange={e=>setFiltroStatus(e.target.value)}
            style={{background:L.surface,border:`1px solid ${L.line}`,borderRadius:9,padding:"7px 12px",color:L.t2,fontSize:12,fontFamily:"inherit",outline:"none",cursor:"pointer"}}>
            <option>Todos</option>
            {STATUS.map(s=><option key={s} value={s}>{STATUS_L[s]}</option>)}
          </select>
          {(busca||filtroArea!=="Todos"||filtroStatus!=="Todos") && (
            <button onClick={()=>{setBusca("");setFiltroArea("Todos");setFiltroStatus("Todos");}}
              style={{background:"none",border:`1px solid ${L.line}`,borderRadius:7,padding:"6px 12px",cursor:"pointer",fontSize:11,color:L.t3,fontFamily:"inherit"}}>
              Limpar filtros
            </button>
          )}
        </div>
      </Card>

      {/* Tabela */}
      <DataTable heads={["Número CNJ","Cliente","Área","Tribunal","Fase","Prioridade","Status","Próx. Audiência","Ações"]}>
        {filtered.length === 0 ? (
          <EmptyRow cols={9} msg="Nenhum processo encontrado"/>
        ) : filtered.map(p => {
          const d = diasAte(p.proxima_audiencia);
          return (
            <tr key={p.id} style={{borderBottom:`1px solid ${L.lineSoft}`}}>
              <td style={{padding:"11px 14px"}}>
                <button onClick={()=>setDetalhe(p)} style={{background:"none",border:"none",cursor:"pointer",color:L.accent,fontSize:11,fontWeight:600,fontFamily:"'JetBrains Mono',monospace",padding:0,textAlign:"left",textDecoration:"underline",textDecorationStyle:"dotted"}}>
                  {p.numero}
                </button>
              </td>
              <td style={{padding:"11px 14px",fontSize:12.5,color:L.t1,fontWeight:500}}>{p.cliente}</td>
              <td style={{padding:"11px 14px"}}><AreaBadge area={p.area}/></td>
              <td style={{padding:"11px 14px",fontSize:11,color:L.t3,fontFamily:"'JetBrains Mono',monospace"}}>{p.tribunal}</td>
              <td style={{padding:"11px 14px",fontSize:12,color:L.t2}}>{p.fase}</td>
              <td style={{padding:"11px 14px"}}><PrioridadeBadge prioridade={p.prioridade}/></td>
              <td style={{padding:"11px 14px"}}><StatusBadge status={p.status}/></td>
              <td style={{padding:"11px 14px"}}>
                {p.proxima_audiencia ? (
                  <div>
                    <div style={{fontSize:11,fontWeight:600,color:d!==null&&d<=3?L.red:L.t1}}>{fmtD(p.proxima_audiencia)}</div>
                    {d!==null && <div style={{fontSize:9,color:L.t4,fontFamily:"'JetBrains Mono',monospace"}}>{d===0?"HOJE":d===1?"AMANHÃ":`em ${d}d`}</div>}
                  </div>
                ) : <span style={{color:L.t4,fontSize:11}}>—</span>}
              </td>
              <td style={{padding:"11px 14px"}}>
                <div style={{display:"flex",gap:4}}>
                  <IBtn c={L.blue} onClick={()=>abrirEditar(p)} small>Editar</IBtn>
                  <IBtn c={L.red}  onClick={()=>excluir(p.id)} small>✕</IBtn>
                </div>
              </td>
            </tr>
          );
        })}
      </DataTable>

      {/* Modal Novo/Editar */}
      {modal !== null && (
        <Modal title={modal==="novo"?"Novo Processo":"Editar Processo"} onClose={()=>setModal(null)} width={600}>
          <div className="form-grid">
            <Field label="Número CNJ" required span><Input value={form.numero} onChange={v=>f("numero",v)} placeholder="0000000-00.0000.0.00.0000"/></Field>
            <Field label="Cliente" required><Input value={form.cliente} onChange={v=>f("cliente",v)} placeholder="Nome do cliente"/></Field>
            <Field label="Parte Contrária"><Input value={form.parte_contraria} onChange={v=>f("parte_contraria",v)} placeholder="Nome da parte contrária"/></Field>
            <Field label="Área do Direito"><Select value={form.area} onChange={v=>f("area",v)}>{AREAS.map(a=><option key={a}>{a}</option>)}</Select></Field>
            <Field label="Vara"><Input value={form.vara} onChange={v=>f("vara",v)} placeholder="Ex: 2ª Vara Cível"/></Field>
            <Field label="Tribunal"><Select value={form.tribunal} onChange={v=>f("tribunal",v)}>{TRIB.map(t=><option key={t}>{t}</option>)}</Select></Field>
            <Field label="Fase Processual"><Select value={form.fase} onChange={v=>f("fase",v)}>{FASES.map(f=><option key={f}>{f}</option>)}</Select></Field>
            <Field label="Status"><Select value={form.status} onChange={v=>f("status",v)}>{STATUS.map(s=><option key={s} value={s}>{STATUS_L[s]}</option>)}</Select></Field>
            <Field label="Prioridade"><Select value={form.prioridade} onChange={v=>f("prioridade",v)}>{PRIOS.map(p=><option key={p} value={p}>{p[0].toUpperCase()+p.slice(1)}</option>)}</Select></Field>
            <Field label="Tipo / Ação"><Input value={form.tipo} onChange={v=>f("tipo",v)} placeholder="Ex: Indenização por Danos Morais"/></Field>
            <Field label="Valor da Causa (R$)"><Input value={form.valor_causa} onChange={v=>f("valor_causa",v)} type="number" placeholder="0"/></Field>
            <Field label="Honorários (R$)"><Input value={form.honorarios} onChange={v=>f("honorarios",v)} type="number" placeholder="0"/></Field>
            <Field label="Data de Início"><Input value={form.inicio} onChange={v=>f("inicio",v)} type="date"/></Field>
            <Field label="Próxima Audiência"><Input value={form.proxima_audiencia} onChange={v=>f("proxima_audiencia",v)} type="date"/></Field>
          </div>
          <ModalFooter onClose={()=>setModal(null)} onSave={salvar} label={modal==="novo"?"Cadastrar Processo":"Salvar Alterações"}/>
        </Modal>
      )}

      {/* Modal Detalhe */}
      {detalhe && (
        <Modal title="Detalhes do Processo" onClose={()=>setDetalhe(null)} width={560}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{background:L.surface,borderRadius:10,padding:"14px 16px",border:`1px solid ${L.line}`}}>
              <div style={{fontSize:10,color:L.t4,fontFamily:"'JetBrains Mono',monospace",marginBottom:4}}>NÚMERO CNJ</div>
              <div style={{fontSize:13,fontWeight:700,color:L.accent,fontFamily:"'JetBrains Mono',monospace"}}>{detalhe.numero}</div>
            </div>
            <div className="form-grid" style={{gap:"10px 16px"}}>
              {[
                ["Cliente",detalhe.cliente],["Parte Contrária",detalhe.parte_contraria||"—"],
                ["Vara",detalhe.vara],["Tribunal",detalhe.tribunal],
                ["Tipo",detalhe.tipo||"—"],["Fase",detalhe.fase],
                ["Valor da Causa",fmt(detalhe.valor_causa)],["Honorários",fmt(detalhe.honorarios)],
                ["Início",fmtD(detalhe.inicio)],["Próx. Audiência",fmtD(detalhe.proxima_audiencia)],
              ].map(([l,v]) => (
                <div key={l}>
                  <div style={{fontSize:9,color:L.t4,textTransform:"uppercase",letterSpacing:"1px",fontFamily:"'JetBrains Mono',monospace",marginBottom:3}}>{l}</div>
                  <div style={{fontSize:12.5,color:L.t1,fontWeight:500}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <AreaBadge area={detalhe.area}/>
              <StatusBadge status={detalhe.status}/>
              <PrioridadeBadge prioridade={detalhe.prioridade}/>
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:16,paddingTop:14,borderTop:`1px solid ${L.lineSoft}`}}>
            <button onClick={()=>{setDetalhe(null);abrirEditar(detalhe);}}
              style={{padding:"8px 16px",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",background:L.accent,color:"white",border:"none"}}>
              Editar Processo
            </button>
            <button onClick={()=>setDetalhe(null)}
              style={{padding:"8px 16px",borderRadius:8,fontSize:12,fontWeight:500,cursor:"pointer",background:L.surface,color:L.t2,border:`1px solid ${L.line}`}}>
              Fechar
            </button>
          </div>
        </Modal>
      )}
    </Fade>
  );
}
