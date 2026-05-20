import { useState } from "react";
import { L } from "../constants/theme";
import { Fade, Row, Grid, Card, PBtn, IBtn, Av, Tag, StatusBadge } from "../components/ui";
import Modal, { Field, Input, Select, ModalFooter } from "../components/Modal";
import { mockEquipe } from "../constants/mockData";

const CARGOS = ["Sócio-Fundador","Sócio","Advogado Associado","Advogado Júnior","Paralegal Sênior","Paralegal","Estagiário","Assistente Administrativo"];
const AREAS  = ["Cível","Trabalhista","Criminal","Tributário","Empresarial","Família","Imobiliário","Previdenciário","Suporte Geral","Todas as Áreas"];
const CORES  = ["#1a3a6b","#7c3aed","#b8860b","#16a34a","#dc2626","#2563eb","#0891b2","#d97706"];

const EMPTY = { nome:"", cargo:"Advogado Associado", oab:"", email:"", telefone:"", area:"Cível", status:"ativo", cor:"#1a3a6b" };

export default function PageEquipe({ user }) {
  const [equipe, setEquipe]   = useState(mockEquipe);
  const [modal, setModal]     = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [detalhe, setDetalhe] = useState(null);

  function salvar() {
    if (!form.nome) return alert("Nome é obrigatório.");
    if (modal === "novo") {
      setEquipe(es => [...es, {...form, id:Date.now(), processos_ativos:0}]);
    } else {
      setEquipe(es => es.map(e => e.id===modal.id ? {...form,id:e.id,processos_ativos:e.processos_ativos} : e));
    }
    setModal(null);
  }

  function excluir(id) {
    if (!confirm("Remover este membro?")) return;
    setEquipe(es => es.filter(e => e.id !== id));
  }

  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  const ativos   = equipe.filter(e=>e.status==="ativo").length;
  const advogados = equipe.filter(e=>e.oab).length;

  return (
    <Fade>
      <Row between mb={16} wrap>
        <div>
          <div style={{fontSize:18,fontWeight:700,color:L.t1,fontFamily:"'Outfit',sans-serif"}}>Equipe</div>
          <div style={{fontSize:11,color:L.t3,marginTop:2}}>{ativos} ativos · {advogados} advogados OAB</div>
        </div>
        <PBtn onClick={()=>{setForm(EMPTY);setModal("novo");}}>+ Novo Membro</PBtn>
      </Row>

      {/* KPIs */}
      <Grid cols={4} gap={12} mb={20} responsive>
        {[
          {l:"Total de Membros",v:String(equipe.length),     i:"👥", c:L.accent,  bg:L.tealBg},
          {l:"Advogados OAB",   v:String(advogados),         i:"⚖️", c:L.blue,   bg:L.blueBg},
          {l:"Paralegais",      v:String(equipe.filter(e=>e.cargo.toLowerCase().includes("paralegal")).length), i:"📋", c:L.copper, bg:L.copperBg},
          {l:"Estagiários",     v:String(equipe.filter(e=>e.cargo.toLowerCase().includes("estag")).length),     i:"🎓", c:L.green,  bg:L.greenBg},
        ].map((k,i) => (
          <div key={i} style={{background:L.white,borderRadius:12,border:`1px solid ${L.line}`,padding:"16px 18px",position:"relative",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
            <div style={{fontSize:10,color:L.t3,textTransform:"uppercase",letterSpacing:"1.5px",fontFamily:"'JetBrains Mono',monospace",marginBottom:6,fontWeight:600}}>{k.l}</div>
            <div style={{fontSize:22,fontWeight:700,color:L.t1,fontFamily:"'Outfit',sans-serif"}}>{k.v}</div>
            <div style={{position:"absolute",top:16,right:16,width:36,height:36,borderRadius:9,background:k.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{k.i}</div>
          </div>
        ))}
      </Grid>

      {/* Cards da equipe */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:14}}>
        {equipe.map(m => (
          <div key={m.id}
            style={{background:L.white,borderRadius:12,border:`1px solid ${L.line}`,overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.05)",transition:"all .15s",cursor:"pointer"}}
            onClick={()=>setDetalhe(m)}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 4px 16px rgba(0,0,0,0.1)`;e.currentTarget.style.transform="translateY(-2px)";}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.05)";e.currentTarget.style.transform="none";}}
          >
            {/* Topo colorido */}
            <div style={{height:6,background:m.cor}}/>
            <div style={{padding:"16px"}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:12}}>
                <Av name={m.nome} color={m.cor} size={44}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,color:L.t1}}>{m.nome}</div>
                  <div style={{fontSize:11,color:L.t3,marginTop:1}}>{m.cargo}</div>
                  {m.oab && <div style={{fontSize:10,color:L.accent,marginTop:2,fontFamily:"'JetBrains Mono',monospace",fontWeight:600}}>{m.oab}</div>}
                </div>
              </div>
              <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
                <Tag color={L.copper} small>{m.area}</Tag>
                <StatusBadge status={m.status}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:11,color:L.t3,marginBottom:12}}>
                <div>
                  <div style={{fontSize:9,textTransform:"uppercase",letterSpacing:"1px",fontFamily:"'JetBrains Mono',monospace",marginBottom:1}}>Processos</div>
                  <div style={{fontSize:16,fontWeight:700,color:L.blue,fontFamily:"'Outfit',sans-serif"}}>{m.processos_ativos}</div>
                </div>
                <div>
                  <div style={{fontSize:9,textTransform:"uppercase",letterSpacing:"1px",fontFamily:"'JetBrains Mono',monospace",marginBottom:1}}>Contato</div>
                  <div style={{fontSize:11,color:L.t2}}>{m.telefone}</div>
                </div>
              </div>
              <div style={{display:"flex",gap:6,paddingTop:10,borderTop:`1px solid ${L.lineSoft}`}} onClick={e=>e.stopPropagation()}>
                <button style={{flex:1,padding:"6px 0",borderRadius:7,fontSize:11,fontWeight:600,cursor:"pointer",background:L.tealBg,color:L.accent,border:`1px solid ${L.tealA}`}}>
                  ✉️ Email
                </button>
                <IBtn c={L.blue} onClick={()=>{setForm({...m});setModal(m);}} small>Editar</IBtn>
                <IBtn c={L.red}  onClick={()=>excluir(m.id)} small>✕</IBtn>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Novo/Editar */}
      {modal !== null && (
        <Modal title={modal==="novo"?"Novo Membro":"Editar Membro"} onClose={()=>setModal(null)}>
          <div className="form-grid">
            <Field label="Nome Completo" required span><Input value={form.nome} onChange={v=>f("nome",v)} placeholder="Nome completo"/></Field>
            <Field label="Cargo"><Select value={form.cargo} onChange={v=>f("cargo",v)}>{CARGOS.map(c=><option key={c}>{c}</option>)}</Select></Field>
            <Field label="Status"><Select value={form.status} onChange={v=>f("status",v)}><option value="ativo">Ativo</option><option value="inativo">Inativo</option></Select></Field>
            <Field label="OAB (se advogado)"><Input value={form.oab||""} onChange={v=>f("oab",v)} placeholder="OAB/SP 000.000"/></Field>
            <Field label="Área de Atuação"><Select value={form.area} onChange={v=>f("area",v)}>{AREAS.map(a=><option key={a}>{a}</option>)}</Select></Field>
            <Field label="E-mail"><Input value={form.email} onChange={v=>f("email",v)} type="email" placeholder="email@escritorio.com.br"/></Field>
            <Field label="Telefone"><Input value={form.telefone} onChange={v=>f("telefone",v)} placeholder="(11) 99999-0000"/></Field>
            <Field label="Cor de Identificação" span>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {CORES.map(c=>(
                  <button key={c} onClick={()=>f("cor",c)}
                    style={{width:28,height:28,borderRadius:7,background:c,border:`2px solid ${form.cor===c?L.t1:"transparent"}`,cursor:"pointer",transition:"all .12s"}}/>
                ))}
              </div>
            </Field>
          </div>
          <ModalFooter onClose={()=>setModal(null)} onSave={salvar} label={modal==="novo"?"Adicionar Membro":"Salvar"}/>
        </Modal>
      )}

      {/* Modal Detalhe */}
      {detalhe && (
        <Modal title="Perfil do Membro" onClose={()=>setDetalhe(null)}>
          <div style={{textAlign:"center",marginBottom:20}}>
            <Av name={detalhe.nome} color={detalhe.cor} size={64} style={{margin:"0 auto 12px"}}/>
            <div style={{fontSize:16,fontWeight:700,color:L.t1}}>{detalhe.nome}</div>
            <div style={{fontSize:12,color:L.t3,marginTop:2}}>{detalhe.cargo}</div>
            {detalhe.oab && <div style={{fontSize:11,color:L.accent,marginTop:4,fontFamily:"'JetBrains Mono',monospace",fontWeight:600}}>{detalhe.oab}</div>}
          </div>
          <div className="form-grid" style={{gap:"12px 20px"}}>
            {[
              ["Área",detalhe.area],["Processos Ativos",String(detalhe.processos_ativos)],
              ["E-mail",detalhe.email],["Telefone",detalhe.telefone],
            ].map(([l,v])=>(
              <div key={l}>
                <div style={{fontSize:9,color:L.t4,textTransform:"uppercase",letterSpacing:"1px",fontFamily:"'JetBrains Mono',monospace",marginBottom:3}}>{l}</div>
                <div style={{fontSize:12.5,color:L.t1,fontWeight:500}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:20,paddingTop:14,borderTop:`1px solid ${L.lineSoft}`}}>
            <button onClick={()=>{setDetalhe(null);setForm({...detalhe});setModal(detalhe);}}
              style={{padding:"8px 16px",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",background:L.accent,color:"white",border:"none"}}>Editar</button>
            <button onClick={()=>setDetalhe(null)}
              style={{padding:"8px 16px",borderRadius:8,fontSize:12,fontWeight:500,cursor:"pointer",background:L.surface,color:L.t2,border:`1px solid ${L.line}`}}>Fechar</button>
          </div>
        </Modal>
      )}
    </Fade>
  );
}
