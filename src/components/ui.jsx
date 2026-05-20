import { useState } from "react";
import { L } from "../constants/theme";

const ao = (color, pct) =>
  color?.startsWith?.("var(")
    ? `color-mix(in srgb, ${color} ${pct}%, transparent)`
    : `${color}${Math.round(pct * 2.55).toString(16).padStart(2, "0")}`;

export const TT = {background:L.white,border:`1px solid ${L.line}`,borderRadius:9,color:L.t1,fontSize:11,boxShadow:"0 4px 20px rgba(0,0,0,0.12)"};
export const TD = {padding:"11px 14px",fontSize:12.5,transition:"background .1s"};

export function Fade({children}) {
  return <div style={{animation:"up .35s ease"}}>{children}</div>;
}

export function Card({title,sub,children,accent,action,style:extraStyle}) {
  return (
    <div style={{background:L.white,borderRadius:12,border:`1px solid ${L.line}`,padding:"18px 20px",boxShadow:"0 1px 6px rgba(0,0,0,0.06)",position:"relative",overflow:"hidden",...extraStyle}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:accent?`linear-gradient(90deg,#c9a430 0%,transparent 70%)`:`linear-gradient(90deg,${L.line} 0%,transparent 60%)`}}/>
      {(title||action) && (
        <div style={{marginBottom:14,display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8}}>
          <div>
            <div style={{fontSize:13,fontWeight:600,color:L.t1}}>{title}</div>
            {sub && <div style={{fontSize:10.5,color:L.t3,marginTop:1}}>{sub}</div>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function Grid({cols,gap,mb,children,responsive}) {
  if (responsive) {
    return (
      <div className="rg-auto"
        style={{gridTemplateColumns:typeof cols==="number"?`repeat(${cols},1fr)`:cols,gap:gap||12,marginBottom:mb||0}}>
        {children}
      </div>
    );
  }
  return (
    <div style={{display:"grid",gridTemplateColumns:typeof cols==="number"?`repeat(${cols},1fr)`:cols,gap,marginBottom:mb||0}}>
      {children}
    </div>
  );
}

export function Row({children,gap,between,justify,mb,mt,wrap}) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:gap||8,justifyContent:between?"space-between":justify||"flex-start",marginBottom:mb||0,marginTop:mt||0,flexWrap:wrap?"wrap":"nowrap"}}>
      {children}
    </div>
  );
}

export function DataTable({heads,children,empty}) {
  return (
    <div className="table-scroll" style={{background:L.white,borderRadius:12,border:`1px solid ${L.line}`,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead>
          <tr style={{background:L.surface,borderBottom:`2px solid ${L.line}`}}>
            {heads.map(h => (
              <th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:9,fontWeight:700,color:L.t3,letterSpacing:"1.4px",textTransform:"uppercase",whiteSpace:"nowrap",fontFamily:"'JetBrains Mono',monospace"}}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
          {empty}
        </tbody>
      </table>
    </div>
  );
}

export function EmptyRow({cols,msg="Nenhum registro encontrado"}) {
  return (
    <tr>
      <td colSpan={cols} style={{padding:"40px 20px",textAlign:"center",color:L.t4,fontSize:12}}>
        <div style={{fontSize:24,marginBottom:8,opacity:.4}}>⚖️</div>
        {msg}
      </td>
    </tr>
  );
}

export function Av({name,color,size=28,src,style:extraStyle}) {
  const [imgErr,setImgErr] = useState(false);
  const initials = (name||"?").split(" ").map(n=>n[0]).filter(Boolean).slice(0,2).join("").toUpperCase();
  const radius = Math.round(size*.28);
  const bg  = ao(color||L.accent, 9);
  const brd = ao(color||L.accent, 14);
  if (src && !imgErr) {
    return <img src={src} alt={name} onError={()=>setImgErr(true)} style={{width:size,height:size,borderRadius:radius,flexShrink:0,objectFit:"cover",border:`1.5px solid ${brd}`,display:"block",...extraStyle}}/>;
  }
  return (
    <div style={{width:size,height:size,borderRadius:radius,flexShrink:0,background:bg,border:`1.5px solid ${brd}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.37,fontWeight:700,color:color||L.accent,fontFamily:"'Outfit',sans-serif",...extraStyle}}>
      {initials}
    </div>
  );
}

export function Tag({children,color,bg,small}) {
  return (
    <span style={{padding:small?"2px 8px":"3px 10px",borderRadius:6,fontSize:small?10:10.5,fontWeight:600,whiteSpace:"nowrap",background:bg||ao(color,7),color,border:`1px solid ${ao(color,12)}`}}>
      {children}
    </span>
  );
}

export function Chip({children,color,dot}) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",background:ao(color,6),border:`1px solid ${ao(color,12)}`,borderRadius:6}}>
      {dot && <div style={{width:5,height:5,borderRadius:"50%",background:color}}/>}
      <span style={{fontSize:10,color,fontFamily:"'JetBrains Mono',monospace",fontWeight:600,letterSpacing:"1px"}}>{children}</span>
    </div>
  );
}

export function PBtn({children,onClick,full,disabled,color,small}) {
  const bg = color || "#0b1630";
  return (
    <button onClick={onClick} disabled={disabled}
      style={{padding:small?"6px 14px":"8px 20px",borderRadius:8,fontSize:small?11:12.5,fontWeight:600,cursor:disabled?"not-allowed":"pointer",fontFamily:"'Instrument Sans',sans-serif",background:disabled?L.surface:bg,color:disabled?L.t4:"white",border:`1px solid ${disabled?L.line:"transparent"}`,transition:"all .15s",whiteSpace:"nowrap",display:full?"block":"inline-flex",alignItems:"center",gap:6,width:full?"100%":"auto",letterSpacing:".1px",opacity:disabled?.6:1,boxShadow:disabled?"none":"0 2px 8px rgba(11,22,48,0.25)"}}
      onMouseEnter={e=>{if(!disabled){e.currentTarget.style.opacity=".88";e.currentTarget.style.transform="translateY(-1px)";}}}
      onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="none";}}
    >
      {children}
    </button>
  );
}

export function IBtn({children,c,onClick,small}) {
  const bg  = ao(c, 6);
  const bg2 = ao(c, 12);
  const brd = ao(c, 13);
  const brd2 = ao(c, 26);
  return (
    <button onClick={onClick}
      style={{padding:small?"3px 8px":"4px 10px",borderRadius:7,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",background:bg,color:c,border:`1px solid ${brd}`,transition:"all .1s",whiteSpace:"nowrap"}}
      onMouseEnter={e=>{e.currentTarget.style.background=bg2;e.currentTarget.style.borderColor=brd2;}}
      onMouseLeave={e=>{e.currentTarget.style.background=bg;e.currentTarget.style.borderColor=brd;}}
    >
      {children}
    </button>
  );
}

export function TabPills({tabs,active,onChange}) {
  return (
    <div style={{display:"flex",gap:4,background:L.surface,padding:4,borderRadius:9,border:`1px solid ${L.line}`,flexWrap:"wrap"}}>
      {tabs.map(t => {
        const on = active===t;
        return (
          <button key={t} onClick={()=>onChange(t)}
            style={{padding:"6px 14px",borderRadius:7,fontSize:12,fontWeight:on?600:400,cursor:"pointer",fontFamily:"inherit",background:on?L.white:L.surface,color:on?L.accent:L.t3,border:"none",transition:"all .12s",boxShadow:on?"0 1px 3px rgba(0,0,0,0.07)":"none",whiteSpace:"nowrap"}}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}

export function KpiCard({label,value,desc,color,bg,icon,sub,i=0}) {
  return (
    <div style={{background:L.white,borderRadius:12,border:`1px solid ${L.line}`,padding:"16px 18px",position:"relative",overflow:"hidden",animation:`up .35s ease ${i*.05}s both`,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
      <div style={{fontSize:10,color:L.t3,textTransform:"uppercase",letterSpacing:"1.5px",fontFamily:"'JetBrains Mono',monospace",marginBottom:8,fontWeight:600}}>{label}</div>
      <div style={{fontSize:22,fontWeight:700,fontFamily:"'Outfit',sans-serif",color:L.t1,marginBottom:8,letterSpacing:"-.5px"}}>{value}</div>
      <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
        {desc && <span style={{fontSize:11,fontWeight:600,color,background:bg,padding:"2px 8px",borderRadius:5}}>{desc}</span>}
        {sub && <span style={{fontSize:10,color:L.t3}}>{sub}</span>}
      </div>
      <div style={{position:"absolute",top:16,right:16,width:36,height:36,borderRadius:9,background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>
        {icon}
      </div>
    </div>
  );
}

export function SearchBar({value,onChange,placeholder="Buscar..."}) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:7,background:L.surface,border:`1px solid ${L.line}`,borderRadius:9,padding:"7px 12px",flex:1,maxWidth:300,transition:"all .15s"}}
      onMouseEnter={e=>{e.currentTarget.style.borderColor=L.tealA2;}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor=L.line;}}
    >
      <span style={{color:L.t4,fontSize:14,flexShrink:0}}>⌕</span>
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{background:"none",border:"none",outline:"none",color:L.t1,fontSize:12,width:"100%",fontFamily:"inherit"}}/>
      {value && <button onClick={()=>onChange("")} style={{background:"none",border:"none",cursor:"pointer",color:L.t4,fontSize:13,padding:0,lineHeight:1}}>×</button>}
    </div>
  );
}

export function StatusBadge({status}) {
  const map = {
    em_andamento:  {l:"Em Andamento", c:L.blue,   bg:L.blueBg},
    aguardando:    {l:"Aguardando",   c:L.yellow,  bg:L.yellowBg},
    suspenso:      {l:"Suspenso",     c:L.copper,  bg:L.copperBg},
    encerrado:     {l:"Encerrado",    c:L.t3,      bg:L.surface},
    arquivado:     {l:"Arquivado",    c:L.t4,      bg:L.surface},
    pago:          {l:"Pago",         c:L.green,   bg:L.greenBg},
    pendente:      {l:"Pendente",     c:L.yellow,  bg:L.yellowBg},
    atrasado:      {l:"Atrasado",     c:L.red,     bg:L.redBg},
    ativo:         {l:"Ativo",        c:L.green,   bg:L.greenBg},
    inativo:       {l:"Inativo",      c:L.t3,      bg:L.surface},
    confirmada:    {l:"Confirmada",   c:L.green,   bg:L.greenBg},
    concluido:     {l:"Concluído",    c:L.t3,      bg:L.surface},
    finalizado:    {l:"Finalizado",   c:L.green,   bg:L.greenBg},
    assinado:      {l:"Assinado",     c:L.blue,    bg:L.blueBg},
    rascunho:      {l:"Rascunho",     c:L.copper,  bg:L.copperBg},
    em_analise:    {l:"Em Análise",   c:L.yellow,  bg:L.yellowBg},
  };
  const s = map[status] || {l:status, c:L.t3, bg:L.surface};
  return <Tag color={s.c} bg={s.bg} small>{s.l}</Tag>;
}

export function PrioridadeBadge({prioridade}) {
  const map = {
    urgente: {l:"🔴 Urgente", c:L.red,    bg:L.redBg},
    alta:    {l:"🟠 Alta",    c:L.yellow,  bg:L.yellowBg},
    media:   {l:"🔵 Média",   c:L.blue,    bg:L.blueBg},
    baixa:   {l:"⚪ Baixa",   c:L.t3,      bg:L.surface},
  };
  const p = map[prioridade] || {l:prioridade, c:L.t3, bg:L.surface};
  return <Tag color={p.c} bg={p.bg} small>{p.l}</Tag>;
}

export function AreaBadge({area}) {
  const map = {
    "Cível":         "#1a3a6b",
    "Trabalhista":   "#b8860b",
    "Empresarial":   "#16a34a",
    "Criminal":      "#dc2626",
    "Tributário":    "#2563eb",
    "Família":       "#7c3aed",
    "Imobiliário":   "#ca8a04",
    "Previdenciário":"#0891b2",
    "Administrativo":"#6b7280",
    "Ambiental":     "#059669",
  };
  const c = map[area] || L.t3;
  return <Tag color={c} small>{area}</Tag>;
}

export function EmptyState({icon="⚖️",title="Nenhum registro",desc}) {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 20px",gap:12}}>
      <div style={{fontSize:40,opacity:.3}}>{icon}</div>
      <div style={{fontSize:14,fontWeight:600,color:L.t3}}>{title}</div>
      {desc && <div style={{fontSize:12,color:L.t4,textAlign:"center",maxWidth:300}}>{desc}</div>}
    </div>
  );
}

export function Spinner() {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh",gap:12,flexDirection:"column"}}>
      <div style={{width:28,height:28,borderRadius:"50%",border:`3px solid ${L.tealA2}`,borderTopColor:L.accent,animation:"spin 0.8s linear infinite"}}/>
      <span style={{fontSize:12,color:L.t4,fontFamily:"'JetBrains Mono',monospace"}}>carregando...</span>
    </div>
  );
}
