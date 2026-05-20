import { useState, useMemo } from "react";
import { L } from "../constants/theme";
import { Fade, Card, Grid, Row, KpiCard, IBtn, PBtn, Tag } from "../components/ui";
import Modal, { Field, Input, Select, ModalFooter } from "../components/Modal";
import { mockAgenda } from "../constants/mockData";

function diasAte(data) {
  if (!data) return 999;
  const hoje = new Date(); hoje.setHours(0,0,0,0);
  return Math.round((new Date(data+"T00:00:00")-hoje)/86400000);
}

const fmtD = s => { if (!s) return "—"; const d = new Date(s+"T00:00:00"); return d.toLocaleDateString("pt-BR",{day:"2-digit",month:"long",year:"numeric"}); };

function getBucket(dias) {
  if (dias < 0)  return "vencidos";
  if (dias === 0) return "hoje";
  if (dias <= 3)  return "3dias";
  if (dias <= 7)  return "7dias";
  return "futuros";
}

const BUCKET_CONF = {
  vencidos: {label:"Vencidos",      c:L.red,    bg:L.redBg,    icon:"🔴"},
  hoje:     {label:"Hoje",          c:L.red,    bg:L.redBg,    icon:"🚨"},
  "3dias":  {label:"Próximos 3 dias",c:L.yellow, bg:L.yellowBg, icon:"🟡"},
  "7dias":  {label:"Próximos 7 dias",c:L.copper, bg:L.copperBg, icon:"🟠"},
  futuros:  {label:"Futuros",       c:L.green,  bg:L.greenBg,  icon:"🟢"},
};

const EMPTY = { titulo:"", processo:"", cliente:"", data:"", prioridade:"alta", status:"pendente" };

export default function PagePrazos({ user }) {
  const prazosBase = mockAgenda.filter(a => a.tipo === "prazo");
  const [prazos, setPrazos] = useState(prazosBase);
  const [modal, setModal] = useState(null);
  const [form, setForm]   = useState(EMPTY);

  const todos = useMemo(() => prazos.map(p => ({...p, dias:diasAte(p.data), bucket:getBucket(diasAte(p.data))})), [prazos]);
  const pendentes = todos.filter(p => p.status !== "concluido");
  const concluidos = todos.filter(p => p.status === "concluido");

  const kpis = [
    {label:"Vencidos",        value:String(pendentes.filter(p=>p.bucket==="vencidos").length), desc:"ação imediata",  color:L.red,    bg:L.redBg,    icon:"🔴"},
    {label:"Hoje",            value:String(pendentes.filter(p=>p.bucket==="hoje").length),     desc:"neste momento",  color:L.red,    bg:L.redBg,    icon:"🚨"},
    {label:"Próximos 3 dias", value:String(pendentes.filter(p=>p.bucket==="3dias").length),    desc:"atenção urgente", color:L.yellow, bg:L.yellowBg, icon:"⚠️"},
    {label:"Próximos 7 dias", value:String(pendentes.filter(p=>p.bucket==="7dias").length),    desc:"monitorar",      color:L.copper, bg:L.copperBg, icon:"📅"},
  ];

  function concluir(id) { setPrazos(ps => ps.map(p => p.id===id ? {...p,status:"concluido"} : p)); }
  function salvar() {
    if (!form.titulo || !form.data) return alert("Título e data são obrigatórios.");
    if (modal === "novo") setPrazos(ps => [...ps, {...form,id:Date.now(),tipo:"prazo"}]);
    else setPrazos(ps => ps.map(p => p.id===modal.id ? {...form,id:p.id,tipo:"prazo"} : p));
    setModal(null);
  }
  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  return (
    <Fade>
      <Row between mb={16} wrap>
        <div>
          <div style={{fontSize:18,fontWeight:700,color:L.t1,fontFamily:"'Outfit',sans-serif"}}>Controle de Prazos</div>
          <div style={{fontSize:11,color:L.t3,marginTop:2}}>{pendentes.length} prazos pendentes</div>
        </div>
        <PBtn onClick={()=>{setForm(EMPTY);setModal("novo");}}>+ Novo Prazo</PBtn>
      </Row>

      <Grid cols={4} gap={12} mb={20} responsive>
        {kpis.map((k,i) => <KpiCard key={i} {...k} i={i}/>)}
      </Grid>

      {/* Buckets de prazos */}
      {Object.entries(BUCKET_CONF).map(([bucket,conf]) => {
        const items = pendentes.filter(p=>p.bucket===bucket);
        if (items.length === 0) return null;
        return (
          <div key={bucket} style={{marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <span style={{fontSize:18}}>{conf.icon}</span>
              <div style={{fontSize:13,fontWeight:700,color:conf.c}}>{conf.label}</div>
              <div style={{background:conf.bg,color:conf.c,borderRadius:10,padding:"2px 10px",fontSize:11,fontWeight:700,border:`1px solid ${conf.c}22`}}>{items.length}</div>
              <div style={{flex:1,height:1,background:conf.c,opacity:.15}}/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {items.sort((a,b)=>a.dias-b.dias).map(pz => (
                <div key={pz.id} style={{background:L.white,borderRadius:11,border:`2px solid ${conf.c}22`,padding:"14px 18px",display:"flex",alignItems:"center",gap:14,boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
                  <div style={{flexShrink:0,textAlign:"center",background:conf.bg,borderRadius:8,padding:"6px 12px",border:`1px solid ${conf.c}33`,minWidth:52}}>
                    <div style={{fontSize:16,fontWeight:800,color:conf.c,fontFamily:"'Outfit',sans-serif",lineHeight:1}}>
                      {pz.dias<0?Math.abs(pz.dias):pz.dias===0?"⚡":pz.dias}
                    </div>
                    <div style={{fontSize:8,color:L.t4,textTransform:"uppercase",letterSpacing:"1px",marginTop:1}}>
                      {pz.dias<0?"dias atr.":pz.dias===0?"":"dias"}
                    </div>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:700,color:L.t1,marginBottom:2}}>{pz.titulo}</div>
                    <div style={{fontSize:11,color:L.t3}}>{pz.cliente}</div>
                    <div style={{fontSize:10,color:L.t4,marginTop:2}}>{fmtD(pz.data)}</div>
                    {pz.processo && <div style={{fontSize:9,color:L.accent,fontFamily:"'JetBrains Mono',monospace",marginTop:2}}>{pz.processo.slice(0,25)}...</div>}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:4,flexShrink:0}}>
                    <IBtn c={L.green} onClick={()=>concluir(pz.id)} small>✓ Concluir</IBtn>
                    <IBtn c={L.blue}  onClick={()=>{setForm({titulo:pz.titulo,processo:pz.processo||"",cliente:pz.cliente||"",data:pz.data,prioridade:pz.prioridade||"alta",status:pz.status});setModal(pz);}} small>Editar</IBtn>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Concluídos */}
      {concluidos.length > 0 && (
        <div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            <span style={{fontSize:16}}>✅</span>
            <div style={{fontSize:12,fontWeight:700,color:L.t3}}>Concluídos ({concluidos.length})</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {concluidos.map(pz => (
              <div key={pz.id} style={{background:L.surface,borderRadius:9,border:`1px solid ${L.line}`,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,opacity:.7}}>
                <span style={{fontSize:14}}>✅</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:600,color:L.t2,textDecoration:"line-through"}}>{pz.titulo}</div>
                  <div style={{fontSize:10,color:L.t4}}>{pz.cliente} — {fmtD(pz.data)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {modal !== null && (
        <Modal title={modal==="novo"?"Novo Prazo":"Editar Prazo"} onClose={()=>setModal(null)}>
          <div className="form-grid">
            <Field label="Descrição do Prazo" required span><Input value={form.titulo} onChange={v=>f("titulo",v)} placeholder="Ex: Prazo para Contestação"/></Field>
            <Field label="Data Fatal" required><Input value={form.data} onChange={v=>f("data",v)} type="date"/></Field>
            <Field label="Prioridade"><Select value={form.prioridade} onChange={v=>f("prioridade",v)}><option value="urgente">Urgente</option><option value="alta">Alta</option><option value="media">Média</option><option value="baixa">Baixa</option></Select></Field>
            <Field label="Cliente"><Input value={form.cliente} onChange={v=>f("cliente",v)} placeholder="Nome do cliente"/></Field>
            <Field label="Número do Processo" span><Input value={form.processo} onChange={v=>f("processo",v)} placeholder="0000000-00.0000.0.00.0000"/></Field>
          </div>
          <ModalFooter onClose={()=>setModal(null)} onSave={salvar} label={modal==="novo"?"Cadastrar Prazo":"Salvar"}/>
        </Modal>
      )}
    </Fade>
  );
}
