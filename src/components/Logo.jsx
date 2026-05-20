export default function Logo({ size = 40, collapsed = false }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap: collapsed ? 0 : 11, flexShrink:0 }}>
      {/* Ícone — balança da justiça */}
      <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" style={{flexShrink:0}}>
        <rect width="44" height="44" rx="10" fill="#c9a430"/>
        {/* Haste central */}
        <rect x="21.5" y="9" width="1.5" height="26" fill="#0b1630" rx="1"/>
        {/* Base */}
        <rect x="14" y="33" width="16" height="2.5" fill="#0b1630" rx="1.2"/>
        {/* Travessa horizontal */}
        <rect x="10" y="14" width="24" height="1.5" fill="#0b1630" rx="0.75"/>
        {/* Correntes esquerda */}
        <line x1="13" y1="15.5" x2="13" y2="21" stroke="#0b1630" strokeWidth="1.3"/>
        {/* Prato esquerdo */}
        <path d="M9 21 Q13 23.5 17 21" stroke="#0b1630" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
        {/* Correntes direita */}
        <line x1="31" y1="15.5" x2="31" y2="21" stroke="#0b1630" strokeWidth="1.3"/>
        {/* Prato direito */}
        <path d="M27 21 Q31 23.5 35 21" stroke="#0b1630" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
        {/* Topo */}
        <circle cx="22.25" cy="9" r="1.8" fill="#0b1630"/>
      </svg>

      {/* Texto — só quando expandido */}
      {!collapsed && (
        <div>
          <div style={{
            fontFamily:"'Outfit',sans-serif",
            fontWeight:800,
            fontSize:17,
            lineHeight:1,
            letterSpacing:"-.4px",
            color:"#ffffff",
          }}>
            C4<span style={{color:"#c9a430"}}>JUS</span>
          </div>
          <div style={{
            fontSize:8.5,
            color:"rgba(201,164,48,0.65)",
            letterSpacing:"2.5px",
            textTransform:"uppercase",
            marginTop:2,
            fontFamily:"'JetBrains Mono',monospace",
            fontWeight:500,
          }}>
            by C4HUB
          </div>
        </div>
      )}
    </div>
  );
}
