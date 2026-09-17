'use client';

import { useState } from 'react';

export default function DesignerPage() {
  const [business, setBusiness] = useState('NÉBULA');
  const [headline, setHeadline] = useState('Tu café número 10 va por nuestra cuenta.');
  const [color, setColor] = useState('#6f4bd8');
  const [mode, setMode] = useState<'template'|'canvas'|'upload'>('template');
  return <main className="designerPage">
    <header className="designerHeader"><button onClick={() => history.back()}>←</button><span><b>Diseñador de tarjeta</b><small>Café frecuente · Borrador guardado</small></span><div><button>Vista previa</button><button className="publish">Publicar diseño</button></div></header>
    <div className="designerGrid">
      <aside className="designControls">
        <span className="eyebrow">MODO DE DISEÑO</span><div className="modeTabs">{(['template','canvas','upload'] as const).map(item => <button key={item} className={mode===item?'active':''} onClick={() => setMode(item)}>{item==='template'?'Plantilla':item==='canvas'?'Lienzo':'Subir arte'}</button>)}</div>
        <h2>Identidad del negocio</h2><label>Nombre<input value={business} onChange={e=>setBusiness(e.target.value.toUpperCase())}/></label><label>Mensaje principal<textarea value={headline} onChange={e=>setHeadline(e.target.value)} maxLength={80}/><small>{headline.length}/80</small></label>
        <label>Color principal<div className="colorInput"><input type="color" value={color} onChange={e=>setColor(e.target.value)}/><input value={color} onChange={e=>setColor(e.target.value)}/></div></label>
        <label>Logo<div className="uploadBox"><i>N</i><span><b>Arrastra tu logo</b><small>PNG o SVG · Máximo 4 MB</small></span><button>Cambiar</button></div></label>
        <div className="compat"><b>Compatibilidad automática</b><p>Adaptaremos el diseño a las zonas seguras de Apple, Google y Samsung Wallet.</p></div>
      </aside>
      <section className="designStage">
        <div className="deviceLabel"><span>Vista frontal</span><div><button className="active">Wallet</button><button>Página pública</button></div></div>
        <div className="previewCard" style={{'--accent':color} as React.CSSProperties}>
          <div className="previewTop"><i>N</i><span><b>{business || 'TU NEGOCIO'}</b><small>REWARDS</small></span><em>)))</em></div>
          <h1>{headline || 'Tu recompensa te espera.'}</h1><div className="previewStamps">{[1,2,3,4,5,6,7,8,9,10].map(n=><span className={n<8?'done':n===10?'prize':''} key={n}>{n===10?'✦':n}</span>)}</div>
          <footer><span>7 DE 10 VISITAS</span><span>VENCE 31 DIC 2026</span></footer>
        </div>
        <div className="platformPreview"><span>Así se adaptará en</span><b> Apple Wallet</b><b>G Google Wallet</b><b>Samsung Wallet</b></div>
      </section>
    </div>
  </main>;
}
