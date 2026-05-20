import { useState, useCallback, lazy, Suspense } from "react";
import { useBreakpoint } from "../hooks/useBreakpoint";
import Logo from "./Logo";
import { Av, Chip, Spinner } from "./ui";
import { L } from "../constants/theme";

const PageDashboard  = lazy(() => import("../pages/PageDashboard"));
const PageProcessos  = lazy(() => import("../pages/PageProcessos"));
const PageClientes   = lazy(() => import("../pages/PageClientes"));
const PageAgenda     = lazy(() => import("../pages/PageAgenda"));
const PagePrazos     = lazy(() => import("../pages/PagePrazos"));
const PageDocumentos = lazy(() => import("../pages/PageDocumentos"));
const PageFinanceiro = lazy(() => import("../pages/PageFinanceiro"));
const PageIA         = lazy(() => import("../pages/PageIA"));
const PageRelatorios = lazy(() => import("../pages/PageRelatorios"));
const PageEquipe     = lazy(() => import("../pages/PageEquipe"));
const PageEscritorio = lazy(() => import("../pages/PageEscritorio"));

const NAV_ITEMS = [
  { id:"dashboard",  label:"Dashboard",       ico:"▦",  g:"principal"  },
  { id:"processos",  label:"Processos",        ico:"⚖",  g:"principal"  },
  { id:"clientes",   label:"Clientes",         ico:"◉",  g:"principal"  },
  { id:"agenda",     label:"Agenda",           ico:"◷",  g:"jurídico"   },
  { id:"prazos",     label:"Prazos",           ico:"⏱",  g:"jurídico"   },
  { id:"documentos", label:"Documentos",       ico:"◫",  g:"documentos" },
  { id:"financeiro", label:"Financeiro",       ico:"◈",  g:"financeiro" },
  { id:"ia",         label:"C4 IA Jurídica",   ico:"✦",  g:"inteligência"},
  { id:"relatorios", label:"Relatórios",       ico:"◫",  g:"analytics"  },
  { id:"equipe",     label:"Equipe",           ico:"◉",  g:"escritório" },
  { id:"escritorio", label:"Escritório",       ico:"⊞",  g:"escritório" },
];

export default function Shell({ user, theme, toggleTheme }) {
  const [sec, setSec]       = useState("dashboard");
  const [col, setCol]       = useState(false);
  const [mobOpen, setMobOpen] = useState(false);
  const { isMobile, isTablet } = useBreakpoint();

  const navigate = useCallback((id) => {
    setSec(id);
    if (isMobile) setMobOpen(false);
  }, [isMobile]);

  const groups   = [...new Set(NAV_ITEMS.map(n => n.g))];
  const curr     = NAV_ITEMS.find(n => n.id === sec);
  const showCol  = isMobile ? false : col;

  return (
    <div style={{display:"flex",height:"100vh",overflow:"hidden",background:L.bg,fontFamily:"'Instrument Sans',sans-serif"}}>

      {/* Mobile overlay */}
      {isMobile && mobOpen && (
        <div className="sidebar-overlay" onClick={() => setMobOpen(false)} />
      )}

      {/* Sidebar wrapper */}
      <div style={{position:"relative",flexShrink:0,display:"flex"}}>
        <aside className={isMobile ? "sidebar-drawer" : undefined}
          style={isMobile ? {
            position:"fixed",top:0,left:0,bottom:0,width:240,
            background:L.white,borderRight:`1px solid ${L.line}`,
            display:"flex",flexDirection:"column",zIndex:20,
            boxShadow:"4px 0 20px rgba(0,0,0,0.14)",
            transform:mobOpen?"translateX(0)":"translateX(-100%)",
            transition:"transform .22s ease",overflow:"hidden",
          } : {
            width:showCol?56:220,minWidth:showCol?56:220,
            background:L.white,borderRight:`1px solid ${L.line}`,
            display:"flex",flexDirection:"column",
            transition:"width .22s ease,min-width .22s ease",
            overflow:"hidden",position:"relative",zIndex:20,flexShrink:0,
            boxShadow:"2px 0 12px rgba(0,0,0,0.04)",
          }}>

          {/* Logo */}
          <div style={{height:64,display:"flex",alignItems:"center",padding:showCol?"0 8px":"0 14px",gap:10,flexShrink:0,justifyContent:showCol?"center":"flex-start",position:"relative"}}>
            <Logo size={showCol?38:44}/>
            {!showCol && (
              <div style={{animation:"px .2s ease"}}>
                <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:16,color:L.t1,lineHeight:1,letterSpacing:"-.3px"}}>
                  C4 <span style={{color:L.accent}}>JUS</span>
                </div>
                <div style={{fontSize:9,color:L.t4,letterSpacing:"2px",textTransform:"uppercase",marginTop:1,fontFamily:"'JetBrains Mono',monospace"}}>by C4HUB</div>
              </div>
            )}
            <div style={{position:"absolute",bottom:0,left:0,right:0,height:1,background:`linear-gradient(90deg,var(--c-accent),transparent)`}}/>
          </div>

          {/* Escritório badge */}
          {!showCol && (
            <div style={{margin:"10px 12px 6px",padding:"8px 11px",borderRadius:8,background:L.tealBg,border:`1px solid ${L.tealA}`}}>
              <div style={{fontSize:9,letterSpacing:"1.5px",textTransform:"uppercase",color:L.accent,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",display:"flex",alignItems:"center",gap:5,marginBottom:2}}>
                <span style={{width:5,height:5,borderRadius:"50%",background:L.accent,display:"inline-block"}}/>
                {user.escritorio}
              </div>
              <div style={{fontSize:11,color:L.t2,fontWeight:500}}>{user.nome}</div>
            </div>
          )}

          {/* Nav */}
          <nav style={{flex:1,overflowY:"auto",padding:"8px 8px"}}>
            {groups.map(g => (
              <div key={g} style={{marginBottom:6}}>
                {!showCol && (
                  <div style={{display:"flex",alignItems:"center",gap:6,padding:"8px 9px 4px"}}>
                    <div style={{width:4,height:4,borderRadius:"50%",background:L.tealA2,flexShrink:0}}/>
                    <div style={{fontSize:9,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:L.t4,fontFamily:"'JetBrains Mono',monospace",flex:1}}>{g}</div>
                    <div style={{height:1,flex:1,background:L.lineSoft,maxWidth:40}}/>
                  </div>
                )}
                {NAV_ITEMS.filter(n => n.g === g).map(item => {
                  const on = sec === item.id;
                  return (
                    <button key={item.id} onClick={()=>navigate(item.id)} title={showCol?item.label:undefined}
                      style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:showCol?"10px 0":"7px 10px",justifyContent:showCol?"center":"flex-start",background:on?L.tealA:"transparent",border:on?`1px solid ${L.tealA2}`:"1px solid transparent",outline:"none",borderRadius:8,cursor:"pointer",marginBottom:1,color:on?L.accent:L.t3,fontSize:12.5,fontFamily:"inherit",fontWeight:on?600:400,transition:"all .12s",boxShadow:on?`0 2px 8px ${L.tealA}`:"none"}}
                      onMouseEnter={e=>{if(!on){e.currentTarget.style.background=L.surface;e.currentTarget.style.color=L.t2;e.currentTarget.style.borderColor=L.lineSoft;}}}
                      onMouseLeave={e=>{if(!on){e.currentTarget.style.background="transparent";e.currentTarget.style.color=L.t3;e.currentTarget.style.borderColor="transparent";}}}
                    >
                      <span style={{fontSize:14,flexShrink:0,opacity:on?1:.7}}>{item.ico}</span>
                      {!showCol && <span style={{whiteSpace:"nowrap"}}>{item.label}</span>}
                      {!showCol && item.id==="ia" && (
                        <span style={{marginLeft:"auto",background:L.tealA,color:L.accent,borderRadius:4,padding:"1px 6px",fontSize:8,fontWeight:700,letterSpacing:"1px",fontFamily:"'JetBrains Mono',monospace",border:`1px solid ${L.tealA2}`}}>IA</span>
                      )}
                      {!showCol && item.id==="prazos" && (
                        <span style={{marginLeft:"auto",background:"#dc2626",color:"white",borderRadius:10,padding:"1px 6px",fontSize:8,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",minWidth:18,textAlign:"center"}}>3</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* User footer */}
          <div style={{padding:"10px 8px",borderTop:`1px solid ${L.lineSoft}`,flexShrink:0,background:L.surface}}>
            <div style={{display:"flex",alignItems:"center",gap:9,padding:showCol?"8px 0":"8px 10px",borderRadius:9,background:L.white,border:`1px solid ${L.line}`,justifyContent:showCol?"center":"flex-start",boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
              <Av name={user.nome} color={user.cor} size={28}/>
              {!showCol && (
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:600,color:L.t1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user.nome}</div>
                  <div style={{fontSize:10,color:L.t3,whiteSpace:"nowrap"}}>{user.oab||user.cargo}</div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Collapse toggle */}
        {!isMobile && (
          <button onClick={()=>setCol(p=>!p)}
            style={{position:"absolute",top:"50%",right:-16,transform:"translateY(-50%)",width:16,height:48,borderRadius:"0 8px 8px 0",background:L.white,border:`1.5px solid ${L.line}`,borderLeft:"none",color:L.t3,fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s",zIndex:30,boxShadow:"3px 0 8px rgba(0,0,0,0.08)",padding:0}}
            onMouseEnter={e=>{e.currentTarget.style.background=L.accent;e.currentTarget.style.borderColor=L.accent;e.currentTarget.style.color="white";e.currentTarget.style.width="20px";}}
            onMouseLeave={e=>{e.currentTarget.style.background=L.white;e.currentTarget.style.borderColor=L.line;e.currentTarget.style.color=L.t3;e.currentTarget.style.width="16px";}}
          >
            {col?"›":"‹"}
          </button>
        )}
      </div>

      {/* Main content */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>

        {/* Header */}
        <header style={{height:56,minHeight:56,flexShrink:0,background:L.white,borderBottom:`1px solid ${L.line}`,display:"flex",alignItems:"center",justifyContent:"space-between",padding:isMobile?"0 14px":"0 24px",gap:12,boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {isMobile && (
              <button onClick={()=>setMobOpen(p=>!p)}
                style={{background:"none",border:`1px solid ${L.line}`,borderRadius:8,padding:"6px 9px",cursor:"pointer",color:L.t2,fontSize:15,lineHeight:1,transition:"all .12s"}}
              >☰</button>
            )}
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:3,height:18,borderRadius:2,background:L.accent,flexShrink:0}}/>
              <span style={{fontSize:isMobile?13:15,fontFamily:"'Outfit',sans-serif",fontWeight:700,color:L.t1,letterSpacing:"-.2px"}}>{curr?.label}</span>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {!isMobile && (
              <div style={{display:"flex",alignItems:"center",gap:7,background:L.surface,border:`1px solid ${L.line}`,borderRadius:20,padding:"6px 14px",transition:"all .15s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=L.tealA2;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=L.line;}}
              >
                <span style={{color:L.t4,fontSize:13}}>⌕</span>
                <input placeholder="Buscar processo, cliente..." style={{background:"none",border:"none",outline:"none",color:L.t1,fontSize:12,width:200,fontFamily:"inherit"}}/>
              </div>
            )}
            <Chip color={L.green} dot>Online</Chip>
            <button onClick={toggleTheme} title={theme==="dark"?"Modo claro":"Modo escuro"}
              style={{background:L.surface,border:`1px solid ${L.line}`,borderRadius:9,padding:"5px 9px",cursor:"pointer",color:L.t3,fontSize:15,lineHeight:1,transition:"all .15s",flexShrink:0}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=L.accent;e.currentTarget.style.color=L.accent;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=L.line;e.currentTarget.style.color=L.t3;}}
            >
              {theme==="dark"?"☀":"☽"}
            </button>
          </div>
        </header>

        {/* Page content */}
        <div style={{flex:1,overflow:"auto",padding:isMobile?"14px":"24px"}}>
          <Suspense fallback={<Spinner/>}>
            {sec==="dashboard"  && <PageDashboard  user={user}/>}
            {sec==="processos"  && <PageProcessos  user={user}/>}
            {sec==="clientes"   && <PageClientes   user={user}/>}
            {sec==="agenda"     && <PageAgenda     user={user}/>}
            {sec==="prazos"     && <PagePrazos     user={user}/>}
            {sec==="documentos" && <PageDocumentos user={user}/>}
            {sec==="financeiro" && <PageFinanceiro user={user}/>}
            {sec==="ia"         && <PageIA         user={user}/>}
            {sec==="relatorios" && <PageRelatorios user={user}/>}
            {sec==="equipe"     && <PageEquipe     user={user}/>}
            {sec==="escritorio" && <PageEscritorio user={user}/>}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
