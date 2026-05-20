import { useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { L } from "../constants/theme";
import { Fade, Card, Grid, TT, KpiCard, Row, Tag, AreaBadge, StatusBadge } from "../components/ui";
import {
  mockProcessos, mockAgenda, mockHonorarios,
  mockFaturamentoMensal, mockProcessosPorArea,
} from "../constants/mockData";

const fmt = v => v >= 1000000 ? `R$ ${(v/1000000).toFixed(1)}M` : v >= 1000 ? `R$ ${(v/1000).toFixed(0)}k` : `R$ ${v.toLocaleString("pt-BR")}`;
const fmtD = s => { if (!s) return "—"; const d = new Date(s+"T00:00:00"); return d.toLocaleDateString("pt-BR",{day:"2-digit",month:"short"}); };

function diasAte(data) {
  if (!data) return 999;
  const hoje = new Date(); hoje.setHours(0,0,0,0);
  const alvo = new Date(data+"T00:00:00");
  return Math.round((alvo-hoje)/86400000);
}

export default function PageDashboard({ user }) {
  const dados = useMemo(() => {
    const ativos   = mockProcessos.filter(p => p.status === "em_andamento").length;
    const urgentes = mockProcessos.filter(p => p.prioridade === "urgente").length;
    const honorariosPendentes = mockHonorarios.filter(h => h.status === "pendente" || h.status === "atrasado").reduce((s,h) => s+h.valor, 0);
    const honorariosAtrasados = mockHonorarios.filter(h => h.status === "atrasado").length;
    const totalRecebido = mockHonorarios.filter(h => h.status === "pago").reduce((s,h) => s+h.valor, 0);
    const prazosUrgentes = mockAgenda.filter(a => a.tipo==="prazo" && a.status==="pendente" && diasAte(a.data) <= 7).length;
    const audienciasHoje = mockAgenda.filter(a => a.tipo==="audiencia" && diasAte(a.data) === 0).length;
    const audienciasMes  = mockAgenda.filter(a => a.tipo==="audiencia" && diasAte(a.data) >= 0 && diasAte(a.data) <= 30).length;

    const proximosEventos = [...mockAgenda]
      .filter(a => a.status !== "concluido" && diasAte(a.data) >= 0)
      .sort((a,b) => new Date(a.data) - new Date(b.data))
      .slice(0, 6);

    const statusCount = {em_andamento:0,aguardando:0,suspenso:0,encerrado:0};
    mockProcessos.forEach(p => { if(statusCount[p.status]!==undefined) statusCount[p.status]++; });
    const statusData = [
      {name:"Em Andamento", value:statusCount.em_andamento, fill:L.blue},
      {name:"Aguardando",   value:statusCount.aguardando,   fill:L.yellow},
      {name:"Suspenso",     value:statusCount.suspenso,     fill:L.copper},
      {name:"Encerrado",    value:statusCount.encerrado,    fill:L.t4},
    ];

    return { ativos, urgentes, honorariosPendentes, honorariosAtrasados, totalRecebido, prazosUrgentes, audienciasMes, proximosEventos, statusData };
  }, []);

  const kpis = [
    { label:"Processos Ativos",    value:String(dados.ativos),          desc:`${dados.urgentes} urgentes`,    color:L.blue,   bg:L.blueBg,   icon:"⚖️", sub:"total em curso" },
    { label:"Audiências no Mês",   value:String(dados.audienciasMes),   desc:`hoje: 0 agendadas`,             color:L.green,  bg:L.greenBg,  icon:"🏛️", sub:"próximos 30 dias" },
    { label:"Honorários em Aberto",value:fmt(dados.honorariosPendentes),desc:`${dados.honorariosAtrasados} atrasados`, color:dados.honorariosAtrasados>0?L.red:L.yellow, bg:dados.honorariosAtrasados>0?L.redBg:L.yellowBg, icon:"💰", sub:"a receber" },
    { label:"Prazos Urgentes",     value:String(dados.prazosUrgentes),  desc:"próximos 7 dias",               color:dados.prazosUrgentes>0?L.red:L.green, bg:dados.prazosUrgentes>0?L.redBg:L.greenBg, icon:"⏰", sub:"atenção requerida" },
    { label:"Total Recebido",      value:fmt(dados.totalRecebido),      desc:"histórico geral",               color:L.green,  bg:L.greenBg,  icon:"✅", sub:"honorários pagos" },
    { label:"Clientes Ativos",     value:"8",                           desc:"3 novas consultas",             color:L.copper, bg:L.copperBg, icon:"👥", sub:"base ativa" },
  ];

  return (
    <Fade>
      {/* Boas-vindas */}
      <div style={{background:"linear-gradient(135deg,#0b1630 0%,#162448 100%)",border:"1px solid #1e2f50",borderRadius:12,padding:"16px 20px",marginBottom:20,display:"flex",alignItems:"center",gap:14}}>
        <div style={{fontSize:24}}>⚖️</div>
        <div>
          <div style={{fontSize:14,fontWeight:700,color:"rgba(255,255,255,0.95)"}}>Bom dia, {user.nome.split(" ")[0]}!</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.55)",marginTop:3}}>
            Você tem <b style={{color:"#f87171"}}>{dados.prazosUrgentes} prazos urgentes</b> e <b style={{color:"#c9a430"}}>{dados.audienciasMes} audiências</b> nos próximos 30 dias.
          </div>
        </div>
      </div>

      {/* KPIs */}
      <Grid cols={3} gap={12} mb={20} responsive>
        {kpis.map((k,i) => <KpiCard key={i} {...k} i={i}/>)}
      </Grid>

      {/* Gráficos linha 1 */}
      <Grid cols="2fr 1fr" gap={12} mb={12} responsive>
        <Card title="Faturamento Mensal" sub="honorários × despesas × líquido" accent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mockFaturamentoMensal}>
              <defs>
                <linearGradient id="gh" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#16a34a" stopOpacity={.18}/><stop offset="95%" stopColor="#16a34a" stopOpacity={0}/></linearGradient>
                <linearGradient id="gd" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#dc2626" stopOpacity={.12}/><stop offset="95%" stopColor="#dc2626" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke={L.lineSoft} vertical={false}/>
              <XAxis dataKey="mes" tick={{fill:L.t3,fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:L.t3,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
              <Tooltip contentStyle={TT} formatter={v=>[`R$ ${v.toLocaleString("pt-BR")}`]}/>
              <Area type="monotone" dataKey="honorarios" stroke="#16a34a" strokeWidth={2} fill="url(#gh)" name="Honorários"/>
              <Area type="monotone" dataKey="despesas"   stroke="#dc2626" strokeWidth={1.5} fill="url(#gd)" strokeDasharray="5 4" name="Despesas"/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Status dos Processos" sub="distribuição atual">
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={dados.statusData} cx="50%" cy="50%" innerRadius={42} outerRadius={64} dataKey="value" paddingAngle={3}>
                {dados.statusData.map((s,i) => <Cell key={i} fill={s.fill}/>)}
              </Pie>
              <Tooltip contentStyle={TT} formatter={(v,n)=>[`${v} processos`,n]}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center",marginTop:4}}>
            {dados.statusData.map((s,i) => (
              <div key={i} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:L.t3}}>
                <div style={{width:6,height:6,borderRadius:2,background:s.fill}}/>
                {s.name} <b style={{color:L.t1}}>{s.value}</b>
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      {/* Gráficos linha 2 */}
      <Grid cols="1fr 1fr" gap={12} mb={12} responsive>
        <Card title="Processos por Área" sub="volume total e ativos">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockProcessosPorArea} layout="vertical" barSize={10}>
              <CartesianGrid strokeDasharray="4 4" stroke={L.lineSoft} horizontal={false}/>
              <XAxis type="number" tick={{fill:L.t3,fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis dataKey="area" type="category" tick={{fill:L.t3,fontSize:10}} axisLine={false} tickLine={false} width={80}/>
              <Tooltip contentStyle={TT} formatter={(v,n)=>[v,n]}/>
              <Bar dataKey="total"  name="Total"  fill={L.tealA2} radius={[0,4,4,0]}/>
              <Bar dataKey="ativos" name="Ativos" radius={[0,4,4,0]}>
                {mockProcessosPorArea.map((e,i) => <Cell key={i} fill={e.c}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Próximos Compromissos" sub="audiências, prazos e reuniões">
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {dados.proximosEventos.map(ev => {
              const d = diasAte(ev.data);
              const urgente = d <= 3;
              const tipoIcon = {audiencia:"🏛️",prazo:"⏰",reuniao:"👥",diligencia:"📋"}[ev.tipo] || "📌";
              return (
                <div key={ev.id} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 12px",borderRadius:9,background:urgente?L.redBg:L.surface,border:`1px solid ${urgente?L.redA:L.line}`,transition:"all .12s"}}>
                  <div style={{fontSize:16,flexShrink:0,marginTop:1}}>{tipoIcon}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:600,color:L.t1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{ev.titulo}</div>
                    <div style={{fontSize:10.5,color:L.t3,marginTop:1}}>{ev.cliente}</div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontSize:11,fontWeight:700,color:urgente?L.red:L.t2}}>{fmtD(ev.data)}</div>
                    <div style={{fontSize:9,color:L.t4,fontFamily:"'JetBrains Mono',monospace"}}>{d===0?"HOJE":d===1?"AMANHÃ":`+${d}d`}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </Grid>
    </Fade>
  );
}
