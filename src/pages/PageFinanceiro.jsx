import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { L } from "../constants/theme";
import { Fade, Card, Grid, Row, DataTable, EmptyRow, PBtn, IBtn, SearchBar, StatusBadge, Tag, KpiCard, TT } from "../components/ui";
import Modal, { Field, Input, Select, ModalFooter } from "../components/Modal";
import { mockHonorarios, mockFaturamentoMensal } from "../constants/mockData";

const STATUS = ["pendente","pago","atrasado"];
const STATUS_L = {pendente:"Pendente",pago:"Pago",atrasado:"Atrasado"};
const FORMAS = ["PIX","Transferência","Boleto","Cartão","Dinheiro"];

const fmt = v => v ? `R$ ${Number(v).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}` : "R$ 0,00";
const fmtD = s => { if (!s) return "—"; return new Date(s+"T00:00:00").toLocaleDateString("pt-BR"); };

const EMPTY = { cliente:"", processo:"", descricao:"", valor:"", parcelas:"1", parcela_atual:"1", status:"pendente", forma:"PIX", data_vencimento:"", data_pagamento:"" };

export default function PageFinanceiro({ user }) {
  const [honorarios, setHonorarios] = useState(mockHonorarios);
  const [busca, setBusca]           = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [modal, setModal] = useState(null);
  const [form, setForm]   = useState(EMPTY);

  const filtered = useMemo(() => {
    let r = honorarios;
    if (busca) r = r.filter(h => h.cliente.toLowerCase().includes(busca.toLowerCase()) || h.descricao?.toLowerCase().includes(busca.toLowerCase()));
    if (filtroStatus !== "Todos") r = r.filter(h => h.status === filtroStatus);
    return r;
  }, [honorarios, busca, filtroStatus]);

  const totais = useMemo(() => ({
    totalRecebido:  honorarios.filter(h=>h.status==="pago").reduce((s,h)=>s+h.valor,0),
    totalPendente:  honorarios.filter(h=>h.status==="pendente").reduce((s,h)=>s+h.valor,0),
    totalAtrasado:  honorarios.filter(h=>h.status==="atrasado").reduce((s,h)=>s+h.valor,0),
    qtdAtrasado:    honorarios.filter(h=>h.status==="atrasado").length,
    ticketMedio:    honorarios.length ? honorarios.reduce((s,h)=>s+h.valor,0)/honorarios.length : 0,
  }), [honorarios]);

  function salvar() {
    if (!form.cliente || !form.valor) return alert("Cliente e valor são obrigatórios.");
    const obj = {...form, valor:parseFloat(form.valor)||0, parcelas:parseInt(form.parcelas)||1, parcela_atual:parseInt(form.parcela_atual)||1};
    if (modal === "novo") {
      setHonorarios(hs => [...hs, {...obj, id:Date.now()}]);
    } else {
      setHonorarios(hs => hs.map(h => h.id===modal.id ? {...obj,id:h.id} : h));
    }
    setModal(null);
  }

  function excluir(id) {
    if (!confirm("Excluir este lançamento?")) return;
    setHonorarios(hs => hs.filter(h => h.id !== id));
  }

  function marcarPago(id) {
    setHonorarios(hs => hs.map(h => h.id===id ? {...h, status:"pago", data_pagamento:new Date().toISOString().slice(0,10)} : h));
  }

  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  const kpis = [
    {label:"Total Recebido",   value:fmt(totais.totalRecebido),  desc:"honorários pagos",        color:L.green,  bg:L.greenBg,  icon:"✅"},
    {label:"A Receber",        value:fmt(totais.totalPendente),  desc:"aguardando pagamento",     color:L.yellow, bg:L.yellowBg, icon:"⏳"},
    {label:"Em Atraso",        value:fmt(totais.totalAtrasado),  desc:`${totais.qtdAtrasado} clientes`, color:totais.qtdAtrasado>0?L.red:L.green, bg:totais.qtdAtrasado>0?L.redBg:L.greenBg, icon:"⚠️"},
    {label:"Ticket Médio",     value:fmt(totais.ticketMedio),    desc:"por lançamento",           color:L.copper, bg:L.copperBg, icon:"📊"},
  ];

  return (
    <Fade>
      <Row between mb={16} wrap>
        <div>
          <div style={{fontSize:18,fontWeight:700,color:L.t1,fontFamily:"'Outfit',sans-serif"}}>Financeiro</div>
          <div style={{fontSize:11,color:L.t3,marginTop:2}}>Gestão de honorários e recebimentos</div>
        </div>
        <PBtn onClick={()=>{setForm(EMPTY);setModal("novo");}}>+ Novo Lançamento</PBtn>
      </Row>

      <Grid cols={4} gap={12} mb={20} responsive>
        {kpis.map((k,i) => <KpiCard key={i} {...k} i={i}/>)}
      </Grid>

      {/* Gráfico faturamento */}
      <Grid cols="2fr 1fr" gap={12} mb={20} responsive>
        <Card title="Faturamento × Despesas" sub="últimos 6 meses" accent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockFaturamentoMensal} barGap={4} barSize={16}>
              <CartesianGrid strokeDasharray="4 4" stroke={L.lineSoft} vertical={false}/>
              <XAxis dataKey="mes" tick={{fill:L.t3,fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:L.t3,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
              <Tooltip contentStyle={TT} formatter={v=>[`R$ ${v.toLocaleString("pt-BR")}`]}/>
              <Bar dataKey="honorarios" name="Honorários" fill="#16a34a" radius={[4,4,0,0]}/>
              <Bar dataKey="despesas"   name="Despesas"   fill="#dc2626" radius={[4,4,0,0]}/>
              <Bar dataKey="liquido"    name="Líquido"    fill={L.accent} radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Inadimplência" sub="clientes em atraso">
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {honorarios.filter(h=>h.status==="atrasado").map(h=>(
              <div key={h.id} style={{padding:"10px 12px",borderRadius:9,background:L.redBg,border:`1px solid ${L.redA}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:L.red}}>{h.cliente}</div>
                  <div style={{fontSize:10,color:L.t3,marginTop:1}}>Venc: {fmtD(h.data_vencimento)}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:13,fontWeight:700,color:L.red}}>{fmt(h.valor)}</div>
                  <button onClick={()=>marcarPago(h.id)}
                    style={{fontSize:10,fontWeight:600,cursor:"pointer",background:L.green,color:"white",border:"none",borderRadius:5,padding:"2px 8px",marginTop:4}}>
                    Pago ✓
                  </button>
                </div>
              </div>
            ))}
            {honorarios.filter(h=>h.status==="atrasado").length === 0 && (
              <div style={{padding:"30px",textAlign:"center",color:L.green,fontSize:12}}>
                <div style={{fontSize:24,marginBottom:6}}>🎉</div>
                Sem inadimplências!
              </div>
            )}
          </div>
        </Card>
      </Grid>

      {/* Filtros */}
      <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center",marginBottom:16}}>
        <SearchBar value={busca} onChange={setBusca} placeholder="Buscar por cliente ou descrição..."/>
        <select value={filtroStatus} onChange={e=>setFiltroStatus(e.target.value)}
          style={{background:L.surface,border:`1px solid ${L.line}`,borderRadius:9,padding:"7px 12px",color:L.t2,fontSize:12,fontFamily:"inherit",outline:"none",cursor:"pointer"}}>
          <option>Todos</option>
          {STATUS.map(s=><option key={s} value={s}>{STATUS_L[s]}</option>)}
        </select>
      </div>

      {/* Tabela */}
      <DataTable heads={["Cliente","Descrição","Parcela","Forma","Vencimento","Pagamento","Valor","Status","Ações"]}>
        {filtered.length === 0 ? <EmptyRow cols={9} msg="Nenhum lançamento encontrado"/> :
          filtered.map(h => (
            <tr key={h.id} style={{borderBottom:`1px solid ${L.lineSoft}`}}>
              <td style={{padding:"11px 14px",fontSize:12.5,fontWeight:600,color:L.t1}}>{h.cliente}</td>
              <td style={{padding:"11px 14px",fontSize:11.5,color:L.t2,maxWidth:200}}>
                <div style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.descricao}</div>
              </td>
              <td style={{padding:"11px 14px",fontSize:11,color:L.t3,textAlign:"center",fontFamily:"'JetBrains Mono',monospace"}}>{h.parcela_atual}/{h.parcelas}</td>
              <td style={{padding:"11px 14px",fontSize:11,color:L.t3}}>{h.forma}</td>
              <td style={{padding:"11px 14px",fontSize:11,color:L.t2}}>{fmtD(h.data_vencimento)}</td>
              <td style={{padding:"11px 14px",fontSize:11,color:h.data_pagamento?L.green:L.t4}}>{fmtD(h.data_pagamento)}</td>
              <td style={{padding:"11px 14px",fontSize:13,fontWeight:700,color:h.status==="pago"?L.green:h.status==="atrasado"?L.red:L.t1,fontFamily:"'Outfit',sans-serif"}}>{fmt(h.valor)}</td>
              <td style={{padding:"11px 14px"}}><StatusBadge status={h.status}/></td>
              <td style={{padding:"11px 14px"}}>
                <div style={{display:"flex",gap:4}}>
                  {h.status !== "pago" && <IBtn c={L.green} onClick={()=>marcarPago(h.id)} small>✓ Pago</IBtn>}
                  <IBtn c={L.blue}  onClick={()=>{setForm({cliente:h.cliente,processo:h.processo||"",descricao:h.descricao,valor:String(h.valor),parcelas:String(h.parcelas),parcela_atual:String(h.parcela_atual),status:h.status,forma:h.forma,data_vencimento:h.data_vencimento||"",data_pagamento:h.data_pagamento||""});setModal(h);}} small>Edit</IBtn>
                  <IBtn c={L.red}   onClick={()=>excluir(h.id)} small>✕</IBtn>
                </div>
              </td>
            </tr>
          ))
        }
      </DataTable>

      {/* Modal */}
      {modal !== null && (
        <Modal title={modal==="novo"?"Novo Lançamento":"Editar Lançamento"} onClose={()=>setModal(null)}>
          <div className="form-grid">
            <Field label="Cliente" required><Input value={form.cliente} onChange={v=>f("cliente",v)} placeholder="Nome do cliente"/></Field>
            <Field label="Status"><Select value={form.status} onChange={v=>f("status",v)}>{STATUS.map(s=><option key={s} value={s}>{STATUS_L[s]}</option>)}</Select></Field>
            <Field label="Descrição" span><Input value={form.descricao} onChange={v=>f("descricao",v)} placeholder="Ex: Honorários — Fase Inicial"/></Field>
            <Field label="Valor (R$)" required><Input value={form.valor} onChange={v=>f("valor",v)} type="number" placeholder="0.00"/></Field>
            <Field label="Forma de Pagamento"><Select value={form.forma} onChange={v=>f("forma",v)}>{FORMAS.map(f=><option key={f}>{f}</option>)}</Select></Field>
            <Field label="Parcelas"><Input value={form.parcelas} onChange={v=>f("parcelas",v)} type="number" placeholder="1"/></Field>
            <Field label="Parcela Atual"><Input value={form.parcela_atual} onChange={v=>f("parcela_atual",v)} type="number" placeholder="1"/></Field>
            <Field label="Vencimento"><Input value={form.data_vencimento} onChange={v=>f("data_vencimento",v)} type="date"/></Field>
            <Field label="Data Pagamento"><Input value={form.data_pagamento} onChange={v=>f("data_pagamento",v)} type="date"/></Field>
          </div>
          <ModalFooter onClose={()=>setModal(null)} onSave={salvar} label={modal==="novo"?"Cadastrar":"Salvar"}/>
        </Modal>
      )}
    </Fade>
  );
}
