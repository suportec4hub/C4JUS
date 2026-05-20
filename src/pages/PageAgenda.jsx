import { useState, useMemo } from "react";
import { L } from "../constants/theme";
import { Fade, Card, Row, Grid, PBtn, IBtn, TabPills, Tag } from "../components/ui";
import Modal, { Field, Input, Select, ModalFooter } from "../components/Modal";
import { mockAgenda } from "../constants/mockData";

const TIPOS = ["audiencia","prazo","reuniao","diligencia"];
const TIPO_L = {audiencia:"Audiência",prazo:"Prazo",reuniao:"Reunião",diligencia:"Diligência"};
const TIPO_ICON = {audiencia:"🏛️",prazo:"⏰",reuniao:"👥",diligencia:"📋"};
const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const DIAS_SEMANA = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

function diasAte(data) {
  if (!data) return 999;
  const hoje = new Date(); hoje.setHours(0,0,0,0);
  return Math.round((new Date(data+"T00:00:00")-hoje)/86400000);
}

function urgenciaCor(dias) {
  if (dias < 0) return {c:L.red,bg:L.redBg,l:"Vencido"};
  if (dias === 0) return {c:L.red,bg:L.redBg,l:"Hoje"};
  if (dias <= 3)  return {c:L.yellow,bg:L.yellowBg,l:`em ${dias}d`};
  if (dias <= 7)  return {c:L.copper,bg:L.copperBg,l:`em ${dias}d`};
  return {c:L.t3,bg:L.surface,l:`em ${dias}d`};
}

const EMPTY = { tipo:"audiencia", titulo:"", processo:"", cliente:"", data:"", hora:"", local:"", status:"pendente", prioridade:"media" };

export default function PageAgenda({ user }) {
  const [eventos, setEventos] = useState(mockAgenda);
  const [aba, setAba]         = useState("Lista");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [modal, setModal]     = useState(null);
  const [form, setForm]       = useState(EMPTY);

  const hoje = new Date();
  const [mesVis, setMesVis]  = useState(hoje.getMonth());
  const [anoVis, setAnoVis]  = useState(hoje.getFullYear());

  // Lista filtrada e ordenada
  const lista = useMemo(() => {
    let r = eventos.filter(e => e.status !== "concluido");
    if (filtroTipo !== "Todos") r = r.filter(e => e.tipo === filtroTipo);
    return r.sort((a,b) => new Date(a.data) - new Date(b.data));
  }, [eventos, filtroTipo]);

  // Dias do calendário
  const diasCal = useMemo(() => {
    const primeiro = new Date(anoVis, mesVis, 1);
    const ultimo   = new Date(anoVis, mesVis+1, 0);
    const dias = [];
    for (let i = 0; i < primeiro.getDay(); i++) dias.push(null);
    for (let d = 1; d <= ultimo.getDate(); d++) dias.push(d);
    return dias;
  }, [mesVis, anoVis]);

  function eventosNoDia(dia) {
    if (!dia) return [];
    const dataStr = `${anoVis}-${String(mesVis+1).padStart(2,"0")}-${String(dia).padStart(2,"0")}`;
    return eventos.filter(e => e.data === dataStr);
  }

  function salvar() {
    if (!form.titulo || !form.data) return alert("Título e data são obrigatórios.");
    if (modal === "novo") {
      setEventos(es => [...es, {...form, id:Date.now()}]);
    } else {
      setEventos(es => es.map(e => e.id===modal.id ? {...form,id:e.id} : e));
    }
    setModal(null);
  }

  function concluir(id) {
    setEventos(es => es.map(e => e.id===id ? {...e,status:"concluido"} : e));
  }

  const f = (k,v) => setForm(p => ({...p,[k]:v}));

  return (
    <Fade>
      <Row between mb={16} wrap>
        <div>
          <div style={{fontSize:18,fontWeight:700,color:L.t1,fontFamily:"'Outfit',sans-serif"}}>Agenda</div>
          <div style={{fontSize:11,color:L.t3,marginTop:2}}>{lista.length} compromissos pendentes</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <TabPills tabs={["Lista","Calendário"]} active={aba} onChange={setAba}/>
          <PBtn onClick={()=>{setForm(EMPTY);setModal("novo");}}>+ Novo</PBtn>
        </div>
      </Row>

      {/* Filtros tipo */}
      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        {["Todos",...TIPOS].map(t => {
          const on = filtroTipo === t;
          const l  = t==="Todos" ? "Todos" : TIPO_L[t];
          const i  = t==="Todos" ? "📌" : TIPO_ICON[t];
          return (
            <button key={t} onClick={()=>setFiltroTipo(t)}
              style={{display:"flex",alignItems:"center",gap:6,padding:"6px 14px",borderRadius:8,fontSize:12,fontWeight:on?600:400,cursor:"pointer",fontFamily:"inherit",background:on?L.accent:"transparent",color:on?"white":L.t3,border:`1px solid ${on?L.accent:L.line}`,transition:"all .12s"}}>
              <span>{i}</span>{l}
            </button>
          );
        })}
      </div>

      {aba === "Lista" ? (
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {lista.length === 0 && (
            <div style={{padding:"60px 20px",textAlign:"center",color:L.t4,background:L.white,borderRadius:12,border:`1px solid ${L.line}`}}>
              <div style={{fontSize:32,marginBottom:8,opacity:.3}}>📅</div>
              <div>Nenhum compromisso encontrado</div>
            </div>
          )}
          {lista.map(ev => {
            const d   = diasAte(ev.data);
            const urg = urgenciaCor(d);
            const dataD = new Date(ev.data+"T00:00:00");
            return (
              <div key={ev.id} style={{background:L.white,borderRadius:12,border:`1px solid ${d<=3?L.redA:L.line}`,padding:"14px 18px",boxShadow:"0 1px 4px rgba(0,0,0,0.04)",display:"flex",alignItems:"flex-start",gap:14,transition:"all .12s"}}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 4px 16px rgba(0,0,0,0.08)`;}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.04)";}}
              >
                {/* Data bloco */}
                <div style={{flexShrink:0,textAlign:"center",background:d<=0?L.redBg:L.tealBg,borderRadius:10,padding:"8px 14px",border:`1px solid ${d<=0?L.redA:L.tealA}`,minWidth:56}}>
                  <div style={{fontSize:20,fontWeight:800,color:d<=0?L.red:L.accent,fontFamily:"'Outfit',sans-serif",lineHeight:1}}>{String(dataD.getDate()).padStart(2,"0")}</div>
                  <div style={{fontSize:9,color:L.t4,textTransform:"uppercase",letterSpacing:"1px",marginTop:2}}>{MESES[dataD.getMonth()].slice(0,3)}</div>
                </div>
                {/* Info */}
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                    <span style={{fontSize:15}}>{TIPO_ICON[ev.tipo]}</span>
                    <span style={{fontSize:13,fontWeight:700,color:L.t1}}>{ev.titulo}</span>
                    <Tag color={urg.c} bg={urg.bg} small>{urg.l}</Tag>
                  </div>
                  <div style={{fontSize:11,color:L.t3,marginBottom:4}}>{ev.cliente}</div>
                  <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                    {ev.hora && <span style={{fontSize:11,color:L.t4}}>🕐 {ev.hora}</span>}
                    {ev.local && <span style={{fontSize:11,color:L.t4,maxWidth:300,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>📍 {ev.local}</span>}
                    {ev.processo && <span style={{fontSize:10,color:L.accent,fontFamily:"'JetBrains Mono',monospace"}}>{ev.processo.slice(0,20)}...</span>}
                  </div>
                </div>
                {/* Ações */}
                <div style={{display:"flex",flexDirection:"column",gap:4,flexShrink:0}}>
                  <IBtn c={L.green} onClick={()=>concluir(ev.id)} small>✓ Concluir</IBtn>
                  <IBtn c={L.blue} onClick={()=>{setForm({...ev});setModal(ev);}} small>Editar</IBtn>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Calendário */
        <Card>
          {/* Controles do mês */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <button onClick={()=>{const d=new Date(anoVis,mesVis-1,1);setMesVis(d.getMonth());setAnoVis(d.getFullYear());}}
              style={{background:L.surface,border:`1px solid ${L.line}`,borderRadius:7,padding:"5px 12px",cursor:"pointer",fontSize:13,color:L.t2}}>‹</button>
            <div style={{fontSize:14,fontWeight:700,color:L.t1,fontFamily:"'Outfit',sans-serif"}}>{MESES[mesVis]} {anoVis}</div>
            <button onClick={()=>{const d=new Date(anoVis,mesVis+1,1);setMesVis(d.getMonth());setAnoVis(d.getFullYear());}}
              style={{background:L.surface,border:`1px solid ${L.line}`,borderRadius:7,padding:"5px 12px",cursor:"pointer",fontSize:13,color:L.t2}}>›</button>
          </div>
          {/* Cabeçalho dias */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:6}}>
            {DIAS_SEMANA.map(d=>(
              <div key={d} style={{textAlign:"center",fontSize:10,fontWeight:700,color:L.t4,fontFamily:"'JetBrains Mono',monospace",padding:"4px 0"}}>{d}</div>
            ))}
          </div>
          {/* Grid de dias */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
            {diasCal.map((dia,i) => {
              if (!dia) return <div key={`v${i}`}/>;
              const evsDia = eventosNoDia(dia);
              const dataStr = `${anoVis}-${String(mesVis+1).padStart(2,"0")}-${String(dia).padStart(2,"0")}`;
              const isHoje = dataStr === hoje.toISOString().slice(0,10);
              return (
                <div key={dia} style={{minHeight:64,borderRadius:8,border:`1px solid ${isHoje?L.accent:L.line}`,background:isHoje?L.tealBg:L.white,padding:"4px 5px",overflow:"hidden"}}>
                  <div style={{fontSize:11,fontWeight:isHoje?700:500,color:isHoje?L.accent:L.t2,marginBottom:2}}>{dia}</div>
                  {evsDia.slice(0,2).map(ev=>(
                    <div key={ev.id} style={{fontSize:9,background:ev.tipo==="prazo"?L.redBg:ev.tipo==="audiencia"?L.blueBg:L.greenBg,color:ev.tipo==="prazo"?L.red:ev.tipo==="audiencia"?L.blue:L.green,borderRadius:3,padding:"1px 4px",marginBottom:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",fontWeight:600}}>
                      {TIPO_ICON[ev.tipo]} {ev.titulo}
                    </div>
                  ))}
                  {evsDia.length>2 && <div style={{fontSize:9,color:L.t4}}>+{evsDia.length-2}</div>}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Modal */}
      {modal !== null && (
        <Modal title={modal==="novo"?"Novo Compromisso":"Editar Compromisso"} onClose={()=>setModal(null)}>
          <div className="form-grid">
            <Field label="Tipo" required><Select value={form.tipo} onChange={v=>f("tipo",v)}>{TIPOS.map(t=><option key={t} value={t}>{TIPO_L[t]}</option>)}</Select></Field>
            <Field label="Prioridade"><Select value={form.prioridade} onChange={v=>f("prioridade",v)}><option value="urgente">Urgente</option><option value="alta">Alta</option><option value="media">Média</option><option value="baixa">Baixa</option></Select></Field>
            <Field label="Título" required span><Input value={form.titulo} onChange={v=>f("titulo",v)} placeholder="Descrição do compromisso"/></Field>
            <Field label="Cliente"><Input value={form.cliente} onChange={v=>f("cliente",v)} placeholder="Nome do cliente"/></Field>
            <Field label="Processo (nº CNJ)"><Input value={form.processo} onChange={v=>f("processo",v)} placeholder="0000000-00.0000.0.00.0000"/></Field>
            <Field label="Data" required><Input value={form.data} onChange={v=>f("data",v)} type="date"/></Field>
            <Field label="Hora"><Input value={form.hora} onChange={v=>f("hora",v)} type="time"/></Field>
            <Field label="Local" span><Input value={form.local} onChange={v=>f("local",v)} placeholder="Local ou videoconferência"/></Field>
          </div>
          <ModalFooter onClose={()=>setModal(null)} onSave={salvar} label={modal==="novo"?"Cadastrar":"Salvar"}/>
        </Modal>
      )}
    </Fade>
  );
}
