export const L = {
  bg:"var(--c-bg)", bgWarm:"var(--c-bgWarm)", white:"var(--c-white)",
  surface:"var(--c-surface)", hover:"var(--c-hover)",
  line:"var(--c-line)", lineSoft:"var(--c-lineSoft)",

  accent:"var(--c-accent)",
  navy:"var(--c-navy)",
  gold:"var(--c-gold)",
  goldBg:"var(--c-goldBg)",
  goldA:"var(--c-goldA)",

  // aliases para compatibilidade com componentes existentes
  tealBg:"var(--c-goldBg)", tealA:"var(--c-goldA)", tealA2:"var(--c-gold)",

  copper:"var(--c-copper)", copperBg:"var(--c-copperBg)", copperA:"var(--c-copperA)",
  green:"var(--c-green)",   greenBg:"var(--c-greenBg)",   greenA:"var(--c-greenA)", greenA2:"var(--c-greenA2)",
  red:"var(--c-red)",       redBg:"var(--c-redBg)",       redA:"var(--c-redA)",   redA2:"var(--c-redA2)", redA3:"var(--c-redA3)",
  yellow:"var(--c-yellow)", yellowBg:"var(--c-yellowBg)", yellowA:"var(--c-yellowA)", yellowA2:"var(--c-yellowA2)",
  blue:"var(--c-blue)",     blueBg:"var(--c-blueBg)",     blueA:"var(--c-blueA)",

  t1:"var(--c-t1)", t2:"var(--c-t2)", t3:"var(--c-t3)", t4:"var(--c-t4)", t5:"var(--c-t5)",
};

export const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=EB+Garamond:ital,wght@0,500;0,600;1,500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%}

  /* ── Sidebar: sempre escura independente do tema ── */
  :root, html[data-theme="dark"] {
    --sb-bg:        #0b1630;
    --sb-bg-deep:   #07102a;
    --sb-border:    #162348;
    --sb-text:      rgba(255,255,255,0.55);
    --sb-text-h:    rgba(255,255,255,0.90);
    --sb-active-bg: rgba(201,164,48,0.12);
    --sb-active-br: #c9a430;
    --sb-active-c:  #c9a430;
    --sb-hover:     rgba(255,255,255,0.05);
    --sb-group:     rgba(201,164,48,0.40);
    --sb-footer:    #060e22;
    --sb-badge-bg:  rgba(201,164,48,0.16);
    --sb-badge-c:   #c9a430;
    --sb-badge-br:  rgba(201,164,48,0.32);
  }

  /* ── Light: Pergaminho Jurídico ── */
  :root {
    --c-bg:      #f0ece6;
    --c-bgWarm:  #ede8e1;
    --c-white:   #ffffff;
    --c-surface: #e9e4dd;
    --c-hover:   #e2dbd2;
    --c-line:    #d6cec3;
    --c-lineSoft:#e5dfd8;

    --c-accent:  #0b1630;
    --c-navy:    #0b1630;
    --c-gold:    #c9a430;
    --c-goldBg:  #fdf8ee;
    --c-goldA:   rgba(201,164,48,0.13);

    --c-copper:  #9e6e14; --c-copperBg:#fdf6e8; --c-copperA:rgba(158,110,20,0.12);
    --c-green:   #1a7438; --c-greenBg: #f0fdf4; --c-greenA: rgba(26,116,56,0.12); --c-greenA2:rgba(26,116,56,0.24);
    --c-red:     #c42b2b; --c-redBg:   #fef2f2; --c-redA:   rgba(196,43,43,0.12); --c-redA2:rgba(196,43,43,0.20); --c-redA3:rgba(196,43,43,0.28);
    --c-yellow:  #a87010; --c-yellowBg:#fefce8; --c-yellowA:rgba(168,112,16,0.13); --c-yellowA2:rgba(168,112,16,0.25);
    --c-blue:    #1a4db5; --c-blueBg:  #eff6ff; --c-blueA:  rgba(26,77,181,0.16);

    --c-t1:#1c1409; --c-t2:#3a2e1e; --c-t3:#776658; --c-t4:#a8947c; --c-t5:#d4c5b2;
  }

  /* ── Dark ── */
  html[data-theme="dark"] {
    --c-bg:      #090e1c;
    --c-bgWarm:  #0c1226;
    --c-white:   #0f1828;
    --c-surface: #131e34;
    --c-hover:   #192640;
    --c-line:    #1e2e48;
    --c-lineSoft:#162038;

    --c-accent:  #d4b54a;
    --c-navy:    #d4b54a;
    --c-gold:    #d4b54a;
    --c-goldBg:  #191508;
    --c-goldA:   rgba(212,181,74,0.14);

    --c-copper:  #d4a030; --c-copperBg:#1c1408; --c-copperA:rgba(212,160,48,0.14);
    --c-green:   #3ab865; --c-greenBg: #071510; --c-greenA: rgba(58,184,101,0.13); --c-greenA2:rgba(58,184,101,0.25);
    --c-red:     #f05050; --c-redBg:   #180808; --c-redA:   rgba(240,80,80,0.14); --c-redA2:rgba(240,80,80,0.22); --c-redA3:rgba(240,80,80,0.30);
    --c-yellow:  #e0aa20; --c-yellowBg:#181208; --c-yellowA:rgba(224,170,32,0.14); --c-yellowA2:rgba(224,170,32,0.26);
    --c-blue:    #5590ff; --c-blueBg:  #091428; --c-blueA:  rgba(85,144,255,0.20);

    --c-t1:#ece5db; --c-t2:#cec4b6; --c-t3:#8a7e6e; --c-t4:#5a5048; --c-t5:#2e2820;
  }

  :root{color-scheme:light}
  html[data-theme="dark"]{color-scheme:dark}

  body{
    background:var(--c-bg);
    color:var(--c-t1);
    font-family:'Instrument Sans',sans-serif;
    font-size:13px;
    line-height:1.55;
    -webkit-font-smoothing:antialiased;
    transition:background .25s,color .25s;
  }
  input,textarea,select{color:var(--c-t1);background:var(--c-white)}
  input::placeholder,textarea::placeholder{color:var(--c-t4)}
  :focus-visible{outline:2px solid var(--c-gold);outline-offset:2px;border-radius:4px}
  ::selection{background:var(--c-goldA);color:var(--c-t1)}
  ::-webkit-scrollbar{width:5px;height:5px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:var(--c-line);border-radius:99px}
  ::-webkit-scrollbar-thumb:hover{background:var(--c-goldA)}
  tbody tr{transition:background .1s}
  tbody tr:hover{background:var(--c-surface)}

  @keyframes up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  @keyframes in{from{opacity:0}to{opacity:1}}
  @keyframes px{from{transform:translateX(-5px);opacity:0}to{transform:none;opacity:1}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes slideIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}

  .rg-auto{display:grid}
  .sidebar-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:14;animation:in .15s ease}
  .sidebar-drawer{animation:slideIn .22s ease}
  .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 14px}
  .table-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}

  @media(max-width:639px){
    .form-grid{grid-template-columns:1fr!important}
    .rg-auto{grid-template-columns:1fr!important}
    .hide-mobile{display:none!important}
    .table-scroll table{min-width:580px}
    .stack-mobile{flex-direction:column!important;align-items:stretch!important;gap:8px!important}
    .modal-box{width:calc(100vw - 24px)!important;max-height:92dvh;overflow-y:auto}
    .action-row{flex-wrap:wrap!important;gap:6px!important}
  }
  @media(min-width:640px) and (max-width:1023px){
    .rg-auto{grid-template-columns:repeat(2,1fr)!important}
    .table-scroll table{min-width:580px}
    .modal-box{width:min(520px,calc(100vw - 48px))!important}
  }
  @media(min-width:1920px){body{font-size:14px}}
`;
