import { useState, useMemo } from "react";
import { L } from "../constants/theme";
import { Fade, Card, Row, DataTable, EmptyRow, PBtn, IBtn, SearchBar, StatusBadge, AreaBadge, Tag, Av } from "../components/ui";
import Modal, { Field, Input, Select, ModalFooter } from "../components/Modal";
import { mockClientes, mockProcessos, mockHonorarios } from "../constants/mockData";

const AREAS = ["Cível","Trabalhista","Criminal","Tributário","Empresarial","Família","Imobiliário","Previdenciário","Administrativo","Ambiental"];
const ESTADOS = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

const fmt = v => v ? `R$ ${Number(v).toLocaleString("pt-BR")}` : "—";
const fmtD = s => { if (!s) return "—"; const d = new Date(s+"T00:00:00"); return d.toLocaleDateString("pt-BR"); };

const EMPTY = { nome:"", tipo:"PF", cpf:"", cnpj:"", email:"", telefone:"", cidade:"", estado:"SP", area:"Cível", status:"ativo" };

export default function PageClientes({ user }) {
  const [clientes, setClientes] = useState(mockClientes);
  const [busca, setBusca]       = useState("");
  const [filtroTipo, setFiltroTipo]     = useState("Todos");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [modal, setModal]   = useState(null);
  const [form, setForm]     = useState(EMPTY);
  const [detalhe, setDetalhe] = useState(null);

  const filtered = useMemo(() => {
    let r = clientes;
    if (busca) r = r.filter(c => c.nome.toLowerCase().includes(busca.toLowerCase()) || c.email?.includes(busca) || c.cpf?.includes(busca) || c.cnpj?.includes(busca));
    if (filtroTipo !== "Todos")   r = r.filter(c => c.tipo === filtroTipo);
    if (filtroStatus !== "Todos") r = r.filter(c => c.status === filtroStatus);
    return r;
  }, [clientes, busca, filtroTipo, filtroStatus]);

  function abrirNovo() { setForm(EMPTY); setModal("novo"); }
  function abrirEditar(c) { setForm({...c}); setModal(c); }

  function salvar() {
    if (!form.nome) return alert("Nome é obrigatório.");
    if (modal === "novo") {
      setClientes(cs => [...cs, {...form, id:Date.now(), processos:0, valor_total:0, created_at:new Date().toISOString().slice(0,10)}]);
    } else {
      setClientes(cs => cs.map(c => c.id===modal.id ? {...form,id:c.id,processos:c.processos,valor_total:c.valor_total,created_at:c.created_at} : c));
    }
    setModal(null);
  }

  function excluir(id) {
    if (!confirm("Excluir este cliente?")) return;
    setClientes(cs => cs.filter(c => c.id !== id));
  }

  const f = (k,v) => setForm(p => ({...p,[k]:v}));

  // Processos e honorários do cliente em detalhe
  const clienteProcessos   = detalhe ? mockProcessos.filter(p => p.cliente_id === detalhe.id) : [];
  const clienteHonorarios  = detalhe ? mockHonorarios.filter(h => h.cliente_id === detalhe.id) : [];
  const totalPago          = clienteHonorarios.filter(h=>h.status==="pago").reduce((s,h)=>s+h.valor,0);
  const totalPendente      = clienteHonorarios.filter(h=>h.status!=="pago").reduce((s,h)=>s+h.valor,0);

  return (
    <Fade>
      <Row between mb={16} wrap>
        <div>
          <div style={{fontSize:18,fontWeight:700,color:L.t1,fontFamily:"'Outfit',sans-serif"}}>Clientes</div>
          <div style={{fontSize:11,color:L.t3,marginTop:2}}>{filtered.length} de {clientes.length} clientes</div>
        </div>
        <PBtn onClick={abrirNovo}>+ Novo Cliente</PBtn>
      </Row>

      {/* Filtros */}
      <Card style={{marginBottom:16}}>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
          <SearchBar value={busca} onChange={setBusca} placeholder="Buscar por nome, CPF, CNPJ ou e-mail..."/>
          <select value={filtroTipo} onChange={e=>setFiltroTipo(e.target.value)}
            style={{background:L.surface,border:`1px solid ${L.line}`,borderRadius:9,padding:"7px 12px",color:L.t2,fontSize:12,fontFamily:"inherit",outline:"none",cursor:"pointer"}}>
            <option>Todos</option>
            <option value="PF">Pessoa Física</option>
            <option value="PJ">Pessoa Jurídica</option>
          </select>
          <select value={filtroStatus} onChange={e=>setFiltroStatus(e.target.value)}
            style={{background:L.surface,border:`1px solid ${L.line}`,borderRadius:9,padding:"7px 12px",color:L.t2,fontSize:12,fontFamily:"inherit",outline:"none",cursor:"pointer"}}>
            <option>Todos</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
      </Card>

      {/* Cards de clientes */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12,marginBottom:0}} className="rg-auto">
        {filtered.length === 0 && (
          <div style={{gridColumn:"1/-1",padding:"60px 20px",textAlign:"center",color:L.t4}}>
            <div style={{fontSize:32,marginBottom:8,opacity:.3}}>👥</div>
            <div>Nenhum cliente encontrado</div>
          </div>
        )}
        {filtered.map(c => (
          <div key={c.id}
            style={{background:L.white,borderRadius:12,border:`1px solid ${L.line}`,padding:"16px",boxShadow:"0 1px 4px rgba(0,0,0,0.05)",transition:"all .15s",cursor:"pointer"}}
            onClick={()=>setDetalhe(c)}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=L.tealA2;e.currentTarget.style.boxShadow=`0 4px 16px ${L.tealA}`;e.currentTarget.style.transform="translateY(-2px)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=L.line;e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.05)";e.currentTarget.style.transform="none";}}
          >
            <div style={{display:"flex",alignItems:"flex-start",gap:11,marginBottom:12}}>
              <Av name={c.nome} color="#1a3a6b" size={38}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:700,color:L.t1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.nome}</div>
                <div style={{fontSize:10,color:L.t4,marginTop:1,fontFamily:"'JetBrains Mono',monospace"}}>{c.tipo==="PJ" ? c.cnpj : c.cpf}</div>
              </div>
              <StatusBadge status={c.status}/>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
              <AreaBadge area={c.area}/>
              <Tag color={L.copper} small>{c.tipo==="PJ"?"Jurídica":"Física"}</Tag>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:11,color:L.t3}}>
              <div>
                <div style={{fontSize:9,textTransform:"uppercase",letterSpacing:"1px",fontFamily:"'JetBrains Mono',monospace",marginBottom:2}}>Processos</div>
                <div style={{fontSize:14,fontWeight:700,color:L.t1,fontFamily:"'Outfit',sans-serif"}}>{c.processos}</div>
              </div>
              <div>
                <div style={{fontSize:9,textTransform:"uppercase",letterSpacing:"1px",fontFamily:"'JetBrains Mono',monospace",marginBottom:2}}>Valor Total</div>
                <div style={{fontSize:13,fontWeight:700,color:L.green,fontFamily:"'Outfit',sans-serif"}}>{fmt(c.valor_total)}</div>
              </div>
            </div>
            <div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${L.lineSoft}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:10,color:L.t4}}>{c.cidade}/{c.estado}</div>
              <div style={{display:"flex",gap:4}} onClick={e=>e.stopPropagation()}>
                <IBtn c={L.blue} onClick={()=>abrirEditar(c)} small>Editar</IBtn>
                <IBtn c={L.red}  onClick={()=>excluir(c.id)} small>✕</IBtn>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Novo/Editar */}
      {modal !== null && (
        <Modal title={modal==="novo"?"Novo Cliente":"Editar Cliente"} onClose={()=>setModal(null)} width={540}>
          <div className="form-grid">
            <Field label="Nome Completo / Razão Social" required span><Input value={form.nome} onChange={v=>f("nome",v)} placeholder="Nome completo ou razão social"/></Field>
            <Field label="Tipo de Pessoa"><Select value={form.tipo} onChange={v=>f("tipo",v)}><option value="PF">Pessoa Física</option><option value="PJ">Pessoa Jurídica</option></Select></Field>
            <Field label={form.tipo==="PJ"?"CNPJ":"CPF"}><Input value={form.tipo==="PJ"?form.cnpj:form.cpf} onChange={v=>f(form.tipo==="PJ"?"cnpj":"cpf",v)} placeholder={form.tipo==="PJ"?"00.000.000/0000-00":"000.000.000-00"}/></Field>
            <Field label="E-mail"><Input value={form.email} onChange={v=>f("email",v)} type="email" placeholder="email@exemplo.com"/></Field>
            <Field label="Telefone / WhatsApp"><Input value={form.telefone} onChange={v=>f("telefone",v)} placeholder="(00) 00000-0000"/></Field>
            <Field label="Área do Direito"><Select value={form.area} onChange={v=>f("area",v)}>{AREAS.map(a=><option key={a}>{a}</option>)}</Select></Field>
            <Field label="Status"><Select value={form.status} onChange={v=>f("status",v)}><option value="ativo">Ativo</option><option value="inativo">Inativo</option></Select></Field>
            <Field label="Cidade"><Input value={form.cidade} onChange={v=>f("cidade",v)} placeholder="Cidade"/></Field>
            <Field label="Estado"><Select value={form.estado} onChange={v=>f("estado",v)}>{ESTADOS.map(e=><option key={e}>{e}</option>)}</Select></Field>
          </div>
          <ModalFooter onClose={()=>setModal(null)} onSave={salvar} label={modal==="novo"?"Cadastrar Cliente":"Salvar Alterações"}/>
        </Modal>
      )}

      {/* Modal Detalhe */}
      {detalhe && (
        <Modal title="Perfil do Cliente" onClose={()=>setDetalhe(null)} width={580}>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20,padding:"14px 16px",background:L.surface,borderRadius:10,border:`1px solid ${L.line}`}}>
            <Av name={detalhe.nome} color="#1a3a6b" size={48}/>
            <div>
              <div style={{fontSize:15,fontWeight:700,color:L.t1}}>{detalhe.nome}</div>
              <div style={{fontSize:11,color:L.t3,marginTop:2,fontFamily:"'JetBrains Mono',monospace"}}>{detalhe.tipo==="PJ"?detalhe.cnpj:detalhe.cpf}</div>
              <div style={{display:"flex",gap:6,marginTop:6,flexWrap:"wrap"}}>
                <AreaBadge area={detalhe.area}/>
                <StatusBadge status={detalhe.status}/>
              </div>
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
            {[
              ["Processos",detalhe.processos,"⚖️",L.blue],
              ["Total Pago",fmt(totalPago),"✅",L.green],
              ["Pendente",fmt(totalPendente),"⏳",L.yellow],
            ].map(([l,v,i,c])=>(
              <div key={l} style={{background:L.surface,borderRadius:9,padding:"12px 14px",border:`1px solid ${L.line}`,textAlign:"center"}}>
                <div style={{fontSize:18,marginBottom:4}}>{i}</div>
                <div style={{fontSize:16,fontWeight:700,color:c,fontFamily:"'Outfit',sans-serif"}}>{v}</div>
                <div style={{fontSize:10,color:L.t4,textTransform:"uppercase",letterSpacing:"1px"}}>{l}</div>
              </div>
            ))}
          </div>

          <div style={{marginBottom:16}}>
            <div style={{fontSize:12,fontWeight:700,color:L.t1,marginBottom:8}}>Processos</div>
            {clienteProcessos.length===0 ? <div style={{fontSize:12,color:L.t4,padding:"12px 0"}}>Nenhum processo cadastrado</div> :
              clienteProcessos.map(p=>(
                <div key={p.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",background:L.surface,borderRadius:8,border:`1px solid ${L.line}`,marginBottom:6}}>
                  <div>
                    <div style={{fontSize:11,fontWeight:600,color:L.accent,fontFamily:"'JetBrains Mono',monospace"}}>{p.numero}</div>
                    <div style={{fontSize:11,color:L.t3,marginTop:1}}>{p.tipo||p.area} — {p.fase}</div>
                  </div>
                  <StatusBadge status={p.status}/>
                </div>
              ))
            }
          </div>

          <div style={{display:"flex",justifyContent:"flex-end",gap:8,paddingTop:14,borderTop:`1px solid ${L.lineSoft}`}}>
            <button onClick={()=>{setDetalhe(null);abrirEditar(detalhe);}}
              style={{padding:"8px 16px",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",background:L.accent,color:"white",border:"none"}}>
              Editar Cliente
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
