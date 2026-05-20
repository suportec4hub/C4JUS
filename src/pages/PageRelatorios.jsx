import { useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { L } from "../constants/theme";
import { Fade, Card, Grid, Row, KpiCard, TT, Tag } from "../components/ui";
import { mockProcessos, mockHonorarios, mockFaturamentoMensal, mockProcessosPorArea, mockEquipe } from "../constants/mockData";

const fmt = v => v>=1000000?`R$ ${(v/1000000).toFixed(1)}M`:v>=1000?`R$ ${(v/1000).toFixed(0)}k`:`R$ ${v.toLocaleString("pt-BR")}`;

export default function PageRelatorios({ user }) {
  const dados = useMemo(() => {
    const totalRecebido   = mockHonorarios.filter(h=>h.status==="pago").reduce((s,h)=>s+h.valor,0);
    const taxaSucesso     = Math.round((mockProcessos.filter(p=>p.status==="encerrado").length / mockProcessos.length) * 100);
    const processosAtivos = mockProcessos.filter(p=>p.status==="em_andamento").length;
    const totalClientes   = 8;

    // Processos por fase
    const faseCount = {};
    mockProcessos.forEach(p => { faseCount[p.fase] = (faseCount[p.fase]||0)+1; });
    const porFase = Object.entries(faseCount).map(([name,value]) => ({name,value})).sort((a,b)=>b.value-a.value);

    // Status
    const statusCount = {};
    mockProcessos.forEach(p => { statusCount[p.status] = (statusCount[p.status]||0)+1; });
    const porStatus = [
      {name:"Em Andamento",value:statusCount.em_andamento||0,fill:L.blue},
      {name:"Aguardando",  value:statusCount.aguardando||0,  fill:L.yellow},
      {name:"Suspenso",    value:statusCount.suspenso||0,    fill:L.copper},
      {name:"Encerrado",   value:statusCount.encerrado||0,   fill:L.green},
    ];

    // Honorários por forma de pagamento
    const formaCount = {};
    mockHonorarios.filter(h=>h.status==="pago").forEach(h => { formaCount[h.forma] = (formaCount[h.forma]||0)+h.valor; });
    const porForma = Object.entries(formaCount).map(([name,value]) => ({name,value}));

    // Radar de áreas (volume)
    const radarData = mockProcessosPorArea.slice(0,6).map(a => ({area:a.area, total:a.total, ativos:a.ativos}));

    return { totalRecebido, taxaSucesso, processosAtivos, totalClientes, porFase, porStatus, porForma, radarData };
  }, []);

  const kpis = [
    {label:"Total Faturado",     value:fmt(dados.totalRecebido), desc:"honorários recebidos",   color:L.green,  bg:L.greenBg,  icon:"💰"},
    {label:"Taxa de Sucesso",    value:`${dados.taxaSucesso}%`,  desc:"processos encerrados",   color:L.blue,   bg:L.blueBg,   icon:"🏆"},
    {label:"Processos Ativos",   value:String(dados.processosAtivos), desc:"em andamento",      color:L.accent, bg:L.tealBg,   icon:"⚖️"},
    {label:"Clientes Atendidos", value:String(dados.totalClientes),   desc:"base total",        color:L.copper, bg:L.copperBg, icon:"👥"},
  ];

  const CORES_AREA = mockProcessosPorArea.map(a=>a.c);

  return (
    <Fade>
      <Row between mb={16}>
        <div>
          <div style={{fontSize:18,fontWeight:700,color:L.t1,fontFamily:"'Outfit',sans-serif"}}>Relatórios e Analytics</div>
          <div style={{fontSize:11,color:L.t3,marginTop:2}}>Visão estratégica do escritório</div>
        </div>
        <button style={{background:L.surface,border:`1px solid ${L.line}`,borderRadius:9,padding:"7px 14px",cursor:"pointer",fontSize:12,color:L.t2,fontFamily:"inherit",display:"flex",alignItems:"center",gap:6}}>
          📥 Exportar PDF
        </button>
      </Row>

      <Grid cols={4} gap={12} mb={20} responsive>
        {kpis.map((k,i) => <KpiCard key={i} {...k} i={i}/>)}
      </Grid>

      {/* Faturamento e Processos por Área */}
      <Grid cols="3fr 2fr" gap={12} mb={12} responsive>
        <Card title="Evolução do Faturamento" sub="honorários, despesas e líquido — últimos 6 meses" accent>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={mockFaturamentoMensal}>
              <defs>
                <linearGradient id="r1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#16a34a" stopOpacity={.2}/><stop offset="95%" stopColor="#16a34a" stopOpacity={0}/></linearGradient>
                <linearGradient id="r2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1a3a6b" stopOpacity={.15}/><stop offset="95%" stopColor="#1a3a6b" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke={L.lineSoft} vertical={false}/>
              <XAxis dataKey="mes" tick={{fill:L.t3,fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:L.t3,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
              <Tooltip contentStyle={TT} formatter={v=>[`R$ ${v.toLocaleString("pt-BR")}`]}/>
              <Area type="monotone" dataKey="honorarios" stroke="#16a34a" strokeWidth={2} fill="url(#r1)" name="Honorários"/>
              <Area type="monotone" dataKey="liquido"    stroke={L.accent} strokeWidth={2} fill="url(#r2)" name="Líquido"/>
              <Area type="monotone" dataKey="despesas"   stroke="#dc2626" strokeWidth={1.5} fill="none" strokeDasharray="5 4" name="Despesas"/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Processos por Status" sub="distribuição atual">
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={dados.porStatus} cx="50%" cy="50%" innerRadius={40} outerRadius={62} dataKey="value" paddingAngle={3}>
                {dados.porStatus.map((s,i) => <Cell key={i} fill={s.fill}/>)}
              </Pie>
              <Tooltip contentStyle={TT} formatter={(v,n)=>[`${v} processos`,n]}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center",marginTop:8}}>
            {dados.porStatus.map((s,i) => (
              <div key={i} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:L.t3}}>
                <div style={{width:6,height:6,borderRadius:2,background:s.fill}}/>
                {s.name} <b style={{color:L.t1}}>{s.value}</b>
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      {/* Área + Fase + Formas */}
      <Grid cols={3} gap={12} mb={12} responsive>
        <Card title="Volume por Área" sub="total × ativos">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockProcessosPorArea} layout="vertical" barSize={8}>
              <CartesianGrid strokeDasharray="4 4" stroke={L.lineSoft} horizontal={false}/>
              <XAxis type="number" tick={{fill:L.t3,fontSize:9}} axisLine={false} tickLine={false}/>
              <YAxis dataKey="area" type="category" tick={{fill:L.t3,fontSize:9}} axisLine={false} tickLine={false} width={70}/>
              <Tooltip contentStyle={TT}/>
              <Bar dataKey="total"  name="Total"  fill={L.tealA2} radius={[0,3,3,0]}/>
              <Bar dataKey="ativos" name="Ativos" radius={[0,3,3,0]}>
                {mockProcessosPorArea.map((e,i)=><Cell key={i} fill={e.c}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Processos por Fase" sub="distribuição nas fases">
          <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:4}}>
            {dados.porFase.map((f,i) => {
              const pct = Math.round((f.value/mockProcessos.length)*100);
              return (
                <div key={f.name}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3}}>
                    <span style={{color:L.t2,fontWeight:500}}>{f.name}</span>
                    <span style={{color:L.t3,fontFamily:"'JetBrains Mono',monospace"}}>{f.value}</span>
                  </div>
                  <div style={{height:5,borderRadius:3,background:L.surface,overflow:"hidden"}}>
                    <div style={{width:`${pct}%`,height:"100%",background:L.accent,borderRadius:3,transition:"width .5s ease"}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="Recebimento por Forma" sub="honorários pagos">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={dados.porForma} cx="50%" cy="50%" outerRadius={65} dataKey="value" label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false} fontSize={9}>
                {dados.porForma.map((_,i)=><Cell key={i} fill={[L.accent,L.copper,L.green,L.blue,L.yellow][i%5]}/>)}
              </Pie>
              <Tooltip contentStyle={TT} formatter={v=>[`R$ ${v.toLocaleString("pt-BR")}`]}/>
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </Grid>

      {/* Ranking equipe */}
      <Card title="Ranking da Equipe" sub="produtividade por membro">
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10,marginTop:4}}>
          {mockEquipe.map((m,i)=>(
            <div key={m.id} style={{background:L.surface,borderRadius:10,border:`1px solid ${L.line}`,padding:"14px",display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:36,height:36,borderRadius:9,background:`${m.cor}22`,border:`1px solid ${m.cor}44`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14,color:m.cor,fontFamily:"'Outfit',sans-serif",flexShrink:0}}>
                {i+1}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:700,color:L.t1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{m.nome.split(" ").slice(0,2).join(" ")}</div>
                <div style={{fontSize:10,color:L.t3}}>{m.cargo}</div>
                <div style={{fontSize:11,fontWeight:600,color:L.blue,marginTop:2}}>{m.processos_ativos} processos</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </Fade>
  );
}
