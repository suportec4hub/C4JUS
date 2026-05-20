import { useState, useCallback, lazy, Suspense } from "react";
import { useBreakpoint } from "../hooks/useBreakpoint";
import Logo from "./Logo";
import { Av, Spinner } from "./ui";
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

const NAV = [
  { id:"dashboard",  label:"Dashboard",      ico:"▦", g:"Principal"    },
  { id:"processos",  label:"Processos",       ico:"⚖", g:"Principal"    },
  { id:"clientes",   label:"Clientes",        ico:"◉", g:"Principal"    },
  { id:"agenda",     label:"Agenda",          ico:"◷", g:"Jurídico"     },
  { id:"prazos",     label:"Prazos",          ico:"⏱", g:"Jurídico",  badge:"3" },
  { id:"documentos", label:"Documentos",      ico:"◫", g:"Documentos"   },
  { id:"financeiro", label:"Financeiro",      ico:"◈", g:"Financeiro"   },
  { id:"ia",         label:"C4 IA Jurídica",  ico:"✦", g:"Inteligência", badge:"IA" },
  { id:"relatorios", label:"Relatórios",      ico:"◧", g:"Analytics"    },
  { id:"equipe",     label:"Equipe",          ico:"◉", g:"Escritório"   },
  { id:"escritorio", label:"Escritório",      ico:"⊞", g:"Escritório"   },
];

const GROUPS = [...new Set(NAV.map(n => n.g))];

/* ── Sidebar item ── */
function NavItem({ item, active, onClick, collapsed }) {
  const [hov, setHov] = useState(false);
  const on = active === item.id;
  return (
    <button
      onClick={() => onClick(item.id)}
      title={collapsed ? item.label : undefined}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:"flex", alignItems:"center", gap:9,
        width:"100%",
        padding: collapsed ? "10px 0" : "7px 10px",
        justifyContent: collapsed ? "center" : "flex-start",
        background: on ? "var(--sb-active-bg)" : hov ? "var(--sb-hover)" : "transparent",
        border:"none",
        borderLeft: on ? "3px solid var(--sb-active-br)" : "3px solid transparent",
        borderRadius: collapsed ? 9 : "0 8px 8px 0",
        cursor:"pointer",
        marginBottom:2,
        color: on ? "var(--sb-active-c)" : hov ? "var(--sb-text-h)" : "var(--sb-text)",
        fontSize:12.5,
        fontFamily:"'Instrument Sans',sans-serif",
        fontWeight: on ? 600 : 400,
        transition:"all .12s",
        outline:"none",
        paddingLeft: collapsed ? 0 : on ? 9 : 12,
      }}
    >
      <span style={{fontSize:14, flexShrink:0, opacity: on ? 1 : hov ? .9 : .65}}>{item.ico}</span>
      {!collapsed && <span style={{flex:1, textAlign:"left", whiteSpace:"nowrap"}}>{item.label}</span>}
      {!collapsed && item.badge && (
        <span style={{
          background: item.badge === "IA" ? "rgba(201,164,48,.18)" : "#c42b2b",
          color: item.badge === "IA" ? "#c9a430" : "#fff",
          borderRadius: item.badge === "IA" ? 5 : 10,
          padding: item.badge === "IA" ? "1px 6px" : "1px 7px",
          fontSize:9, fontWeight:700,
          fontFamily:"'JetBrains Mono',monospace",
          letterSpacing: item.badge === "IA" ? "1px" : 0,
          border: item.badge === "IA" ? "1px solid rgba(201,164,48,.35)" : "none",
          flexShrink:0,
        }}>
          {item.badge}
        </span>
      )}
    </button>
  );
}

export default function Shell({ user, theme, toggleTheme }) {
  const [sec, setSec]         = useState("dashboard");
  const [col, setCol]         = useState(false);
  const [mobOpen, setMobOpen] = useState(false);
  const { isMobile }          = useBreakpoint();

  const navigate = useCallback(id => {
    setSec(id);
    if (isMobile) setMobOpen(false);
  }, [isMobile]);

  const collapsed = !isMobile && col;
  const curr      = NAV.find(n => n.id === sec);

  /* ── Sidebar ── */
  const sidebarContent = (
    <aside style={{
      width: collapsed ? 56 : 230,
      minWidth: collapsed ? 56 : 230,
      background:"var(--sb-bg)",
      borderRight:"1px solid var(--sb-border)",
      display:"flex", flexDirection:"column",
      overflow:"hidden",
      transition:"width .22s ease, min-width .22s ease",
      flexShrink:0, position:"relative", zIndex:20,
    }}>

      {/* ── Logo header ── */}
      <div style={{
        minHeight:64, display:"flex", alignItems:"center",
        padding: collapsed ? "0 9px" : "0 18px",
        justifyContent: collapsed ? "center" : "flex-start",
        borderBottom:"1px solid var(--sb-border)",
        background:"var(--sb-bg-deep)",
        flexShrink:0,
      }}>
        <Logo size={38} collapsed={collapsed}/>
      </div>

      {/* ── Escritório badge ── */}
      {!collapsed && (
        <div style={{
          margin:"12px 12px 4px",
          padding:"8px 12px",
          borderRadius:8,
          background:"rgba(201,164,48,0.07)",
          border:"1px solid rgba(201,164,48,0.18)",
        }}>
          <div style={{fontSize:9, color:"var(--sb-badge-c)", letterSpacing:"1.8px", textTransform:"uppercase", fontFamily:"'JetBrains Mono',monospace", fontWeight:600, marginBottom:3, display:"flex", alignItems:"center", gap:5}}>
            <span style={{width:5, height:5, borderRadius:"50%", background:"var(--sb-badge-c)", display:"inline-block", flexShrink:0}}/>
            {user.escritorio}
          </div>
          <div style={{fontSize:11.5, color:"rgba(255,255,255,0.75)", fontWeight:500}}>{user.nome}</div>
          <div style={{fontSize:10, color:"rgba(201,164,48,0.6)", marginTop:1}}>{user.oab}</div>
        </div>
      )}

      {/* ── Nav ── */}
      <nav style={{flex:1, overflowY:"auto", padding: collapsed ? "10px 4px" : "10px 0 10px 8px", paddingRight: collapsed ? 4 : 10}}>
        {GROUPS.map(g => (
          <div key={g} style={{marginBottom:8}}>
            {!collapsed && (
              <div style={{display:"flex", alignItems:"center", gap:8, padding:"6px 12px 3px"}}>
                <span style={{fontSize:9, fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", color:"var(--sb-group)", fontFamily:"'JetBrains Mono',monospace"}}>{g}</span>
                <div style={{flex:1, height:1, background:"var(--sb-group)", opacity:.35}}/>
              </div>
            )}
            {collapsed && <div style={{height:1, background:"var(--sb-border)", margin:"4px 6px 4px"}}/>}
            {NAV.filter(n => n.g === g).map(item => (
              <NavItem key={item.id} item={item} active={sec} onClick={navigate} collapsed={collapsed}/>
            ))}
          </div>
        ))}
      </nav>

      {/* ── Rodapé usuário ── */}
      <div style={{padding:"8px", borderTop:"1px solid var(--sb-border)", background:"var(--sb-footer)", flexShrink:0}}>
        <div style={{
          display:"flex", alignItems:"center", gap:9,
          padding: collapsed ? "8px 0" : "8px 10px",
          borderRadius:9,
          background:"rgba(255,255,255,0.04)",
          border:"1px solid rgba(255,255,255,0.07)",
          justifyContent: collapsed ? "center" : "flex-start",
        }}>
          <Av name={user.nome} color="#c9a430" size={28}/>
          {!collapsed && (
            <div style={{flex:1, minWidth:0}}>
              <div style={{fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.9)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{user.nome}</div>
              <div style={{fontSize:10, color:"rgba(201,164,48,0.6)"}}>{user.cargo}</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );

  return (
    <div style={{display:"flex", height:"100vh", overflow:"hidden", background:L.bg}}>

      {/* Mobile overlay */}
      {isMobile && mobOpen && <div className="sidebar-overlay" onClick={() => setMobOpen(false)}/>}

      {/* Sidebar wrapper */}
      <div style={{position:"relative", flexShrink:0, display:"flex"}}>
        {isMobile ? (
          <div style={{
            position:"fixed", top:0, left:0, bottom:0, width:230,
            transform: mobOpen ? "translateX(0)" : "translateX(-100%)",
            transition:"transform .22s ease", zIndex:20,
            boxShadow:"6px 0 24px rgba(0,0,0,0.35)",
          }}>
            {sidebarContent}
          </div>
        ) : sidebarContent}

        {/* Colapsar toggle (desktop) */}
        {!isMobile && (
          <button
            onClick={() => setCol(p => !p)}
            style={{
              position:"absolute", top:"50%", right:-13, transform:"translateY(-50%)",
              width:13, height:44, borderRadius:"0 6px 6px 0",
              background:"var(--sb-bg)", border:"1px solid var(--sb-border)", borderLeft:"none",
              color:"rgba(201,164,48,0.5)", fontSize:10, cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center",
              transition:"all .15s", zIndex:30,
              boxShadow:"3px 0 8px rgba(0,0,0,0.25)", padding:0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background="#c9a430"; e.currentTarget.style.color="#0b1630"; e.currentTarget.style.width="17px"; }}
            onMouseLeave={e => { e.currentTarget.style.background="var(--sb-bg)"; e.currentTarget.style.color="rgba(201,164,48,0.5)"; e.currentTarget.style.width="13px"; }}
          >
            {col ? "›" : "‹"}
          </button>
        )}
      </div>

      {/* ── Conteúdo principal ── */}
      <div style={{flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0}}>

        {/* Header */}
        <header style={{
          height:56, minHeight:56, flexShrink:0,
          background:L.white,
          borderBottom:`1px solid ${L.line}`,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding: isMobile ? "0 14px" : "0 28px",
          gap:12,
          boxShadow:"0 1px 0 rgba(0,0,0,0.04)",
        }}>
          <div style={{display:"flex", alignItems:"center", gap:12}}>
            {/* Hamburguer mobile */}
            {isMobile && (
              <button onClick={() => setMobOpen(p => !p)}
                style={{background:"none", border:`1px solid ${L.line}`, borderRadius:8, padding:"6px 9px", cursor:"pointer", color:L.t2, fontSize:15, lineHeight:1}}>
                ☰
              </button>
            )}
            {/* Separador dourado + título */}
            <div style={{display:"flex", alignItems:"center", gap:10}}>
              <div style={{width:3, height:20, borderRadius:2, background:"#c9a430", flexShrink:0}}/>
              <div>
                <div style={{fontSize: isMobile ? 13 : 15, fontFamily:"'Outfit',sans-serif", fontWeight:700, color:L.t1, letterSpacing:"-.2px", lineHeight:1}}>
                  {curr?.label}
                </div>
                {!isMobile && (
                  <div style={{fontSize:10, color:L.t4, fontFamily:"'JetBrains Mono',monospace", letterSpacing:"1px", marginTop:1}}>
                    C4JUS · {user.escritorio}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{display:"flex", alignItems:"center", gap:8}}>
            {/* Busca (desktop) */}
            {!isMobile && (
              <div style={{display:"flex", alignItems:"center", gap:7, background:L.surface, border:`1px solid ${L.line}`, borderRadius:20, padding:"6px 14px", transition:"all .15s"}}
                onMouseEnter={e => e.currentTarget.style.borderColor="#c9a430"}
                onMouseLeave={e => e.currentTarget.style.borderColor=L.line}
              >
                <span style={{color:L.t4, fontSize:13}}>⌕</span>
                <input placeholder="Buscar processo, cliente, número..." style={{background:"none", border:"none", outline:"none", color:L.t1, fontSize:12, width:220, fontFamily:"inherit"}}/>
              </div>
            )}

            {/* Status online */}
            <div style={{display:"flex", alignItems:"center", gap:5, padding:"4px 10px", background:L.surface, border:`1px solid ${L.line}`, borderRadius:20, fontSize:10.5, color:L.t3, fontFamily:"'JetBrains Mono',monospace"}}>
              <span style={{width:5, height:5, borderRadius:"50%", background:"#1a7438", display:"inline-block"}}/>
              Online
            </div>

            {/* Notificações */}
            <button style={{position:"relative", background:L.surface, border:`1px solid ${L.line}`, borderRadius:9, padding:"6px 10px", cursor:"pointer", color:L.t3, fontSize:15, lineHeight:1, transition:"all .15s"}}
              onMouseEnter={e => { e.currentTarget.style.borderColor="#c9a430"; e.currentTarget.style.color="#c9a430"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=L.line; e.currentTarget.style.color=L.t3; }}
            >
              🔔
              <span style={{position:"absolute", top:4, right:4, width:7, height:7, borderRadius:"50%", background:"#c42b2b", border:`1.5px solid ${L.white}`}}/>
            </button>

            {/* Tema */}
            <button onClick={toggleTheme} title={theme === "dark" ? "Modo claro" : "Modo escuro"}
              style={{background:L.surface, border:`1px solid ${L.line}`, borderRadius:9, padding:"6px 9px", cursor:"pointer", color:L.t3, fontSize:14, lineHeight:1, transition:"all .15s"}}
              onMouseEnter={e => { e.currentTarget.style.borderColor="#c9a430"; e.currentTarget.style.color="#c9a430"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=L.line; e.currentTarget.style.color=L.t3; }}
            >
              {theme === "dark" ? "☀" : "☽"}
            </button>
          </div>
        </header>

        {/* Faixa dourada abaixo do header */}
        <div style={{height:2, background:"linear-gradient(90deg,#c9a430 0%,transparent 60%)", flexShrink:0, opacity:.5}}/>

        {/* Conteúdo da página */}
        <div style={{flex:1, overflow:"auto", padding: isMobile ? "16px" : "24px 28px"}}>
          <Suspense fallback={<Spinner/>}>
            {sec === "dashboard"  && <PageDashboard  user={user}/>}
            {sec === "processos"  && <PageProcessos  user={user}/>}
            {sec === "clientes"   && <PageClientes   user={user}/>}
            {sec === "agenda"     && <PageAgenda     user={user}/>}
            {sec === "prazos"     && <PagePrazos     user={user}/>}
            {sec === "documentos" && <PageDocumentos user={user}/>}
            {sec === "financeiro" && <PageFinanceiro user={user}/>}
            {sec === "ia"         && <PageIA         user={user}/>}
            {sec === "relatorios" && <PageRelatorios user={user}/>}
            {sec === "equipe"     && <PageEquipe     user={user}/>}
            {sec === "escritorio" && <PageEscritorio user={user}/>}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
