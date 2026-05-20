import { useState } from "react";
import { L } from "../constants/theme";
import { Fade, Card, Row, Grid, PBtn, IBtn, Tag } from "../components/ui";
import { Field, Input, Select, Textarea } from "../components/Modal";
import { mockUser } from "../constants/mockData";

export default function PageEscritorio({ user }) {
  const [form, setForm] = useState({
    nome: "Mendes & Associados Advocacia",
    cnpj: "12.345.678/0001-00",
    oab: "OAB/SP 1234-A",
    email: "contato@mendesadvocacia.com.br",
    telefone: "(11) 3333-4444",
    whatsapp: "(11) 99999-0000",
    endereco: "Av. Paulista, 1000 — cj. 501",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01310-100",
    site: "www.mendesadvocacia.com.br",
    descricao: "Escritório de advocacia especializado em Direito Cível, Empresarial e Tributário.",
    honorario_padrao: "20",
    moeda: "BRL",
    timezone: "America/Sao_Paulo",
  });
  const [saved, setSaved] = useState(false);

  const f = (k,v) => { setForm(p=>({...p,[k]:v})); setSaved(false); };

  function salvar() {
    setSaved(true);
    setTimeout(()=>setSaved(false), 3000);
  }

  return (
    <Fade>
      <Row between mb={16}>
        <div>
          <div style={{fontSize:18,fontWeight:700,color:L.t1,fontFamily:"'Outfit',sans-serif"}}>Escritório</div>
          <div style={{fontSize:11,color:L.t3,marginTop:2}}>Configurações gerais do escritório</div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {saved && <span style={{fontSize:12,color:L.green,fontWeight:600}}>✓ Salvo com sucesso!</span>}
          <PBtn onClick={salvar}>Salvar Alterações</PBtn>
        </div>
      </Row>

      <Grid cols="2fr 1fr" gap={16} responsive>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {/* Dados básicos */}
          <Card title="Dados do Escritório" accent>
            <div className="form-grid">
              <Field label="Nome / Razão Social" required span><Input value={form.nome} onChange={v=>f("nome",v)}/></Field>
              <Field label="CNPJ"><Input value={form.cnpj} onChange={v=>f("cnpj",v)} placeholder="00.000.000/0000-00"/></Field>
              <Field label="Registro OAB"><Input value={form.oab} onChange={v=>f("oab",v)} placeholder="OAB/SP 0000-A"/></Field>
              <Field label="E-mail Principal"><Input value={form.email} onChange={v=>f("email",v)} type="email"/></Field>
              <Field label="Telefone"><Input value={form.telefone} onChange={v=>f("telefone",v)}/></Field>
              <Field label="WhatsApp"><Input value={form.whatsapp} onChange={v=>f("whatsapp",v)}/></Field>
              <Field label="Site"><Input value={form.site} onChange={v=>f("site",v)} placeholder="www.seuescritorio.com.br"/></Field>
            </div>
          </Card>

          {/* Endereço */}
          <Card title="Endereço">
            <div className="form-grid">
              <Field label="Endereço Completo" span><Input value={form.endereco} onChange={v=>f("endereco",v)} placeholder="Rua, número, complemento"/></Field>
              <Field label="Cidade"><Input value={form.cidade} onChange={v=>f("cidade",v)}/></Field>
              <Field label="Estado"><Select value={form.estado} onChange={v=>f("estado",v)}>
                {["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map(e=><option key={e}>{e}</option>)}
              </Select></Field>
              <Field label="CEP"><Input value={form.cep} onChange={v=>f("cep",v)} placeholder="00000-000"/></Field>
            </div>
          </Card>

          {/* Descrição */}
          <Card title="Sobre o Escritório">
            <Field label="Descrição">
              <Textarea value={form.descricao} onChange={v=>f("descricao",v)} placeholder="Breve descrição do escritório e especialidades..." rows={4}/>
            </Field>
          </Card>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {/* Configurações */}
          <Card title="Configurações Financeiras">
            <Field label="Honorário Padrão (%)">
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <Input value={form.honorario_padrao} onChange={v=>f("honorario_padrao",v)} type="number" style={{maxWidth:80}}/>
                <span style={{fontSize:12,color:L.t3}}>% do valor da causa</span>
              </div>
            </Field>
            <Field label="Moeda">
              <Select value={form.moeda} onChange={v=>f("moeda",v)}>
                <option value="BRL">Real Brasileiro (R$)</option>
                <option value="USD">Dólar (US$)</option>
                <option value="EUR">Euro (€)</option>
              </Select>
            </Field>
            <Field label="Fuso Horário">
              <Select value={form.timezone} onChange={v=>f("timezone",v)}>
                <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                <option value="America/Manaus">Manaus (GMT-4)</option>
                <option value="America/Belem">Belém (GMT-3)</option>
                <option value="America/Fortaleza">Fortaleza (GMT-3)</option>
              </Select>
            </Field>
          </Card>

          {/* Integrações */}
          <Card title="Integrações">
            {[
              {nome:"Supabase",desc:"Banco de dados e autenticação",status:"pendente",icon:"🗄️"},
              {nome:"Claude AI",desc:"IA Jurídica (Anthropic)",status:"pendente",icon:"🤖"},
              {nome:"WhatsApp",desc:"Comunicação com clientes",status:"pendente",icon:"💬"},
              {nome:"Tribunais (CNJ)",desc:"Monitoramento de processos",status:"pendente",icon:"⚖️"},
              {nome:"DocuSign",desc:"Assinatura digital",status:"pendente",icon:"✍️"},
            ].map(int=>(
              <div key={int.nome} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${L.lineSoft}`}}>
                <div style={{width:34,height:34,borderRadius:8,background:L.surface,border:`1px solid ${L.line}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>
                  {int.icon}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:600,color:L.t1}}>{int.nome}</div>
                  <div style={{fontSize:10,color:L.t3}}>{int.desc}</div>
                </div>
                <Tag color={int.status==="ativo"?L.green:L.copper} small>{int.status==="ativo"?"Ativo":"Configurar"}</Tag>
              </div>
            ))}
          </Card>

          {/* Supabase config */}
          <div style={{padding:"16px",borderRadius:12,background:`linear-gradient(135deg,${L.tealBg},${L.copperBg})`,border:`1px solid ${L.tealA}`}}>
            <div style={{fontSize:13,fontWeight:700,color:L.t1,marginBottom:6}}>🚀 Configurar Supabase</div>
            <div style={{fontSize:11,color:L.t3,lineHeight:1.6,marginBottom:12}}>
              Para ativar o banco de dados real, configure as credenciais do Supabase no arquivo <code style={{background:L.tealA,padding:"1px 4px",borderRadius:4,fontFamily:"'JetBrains Mono',monospace",fontSize:10}}>.env</code>:
            </div>
            <div style={{background:L.white,borderRadius:8,padding:"10px 12px",fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:L.t2,border:`1px solid ${L.line}`,lineHeight:1.8}}>
              VITE_SUPABASE_URL=sua_url<br/>
              VITE_SUPABASE_ANON_KEY=sua_chave
            </div>
          </div>
        </div>
      </Grid>
    </Fade>
  );
}
