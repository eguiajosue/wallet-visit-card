'use client';

import { FormEvent, useState } from 'react';

type ScanState = 'idle' | 'result' | 'confirmed';

export default function ScanPage() {
  const [state, setState] = useState<ScanState>('idle');
  const [ticket, setTicket] = useState('');
  const [amount, setAmount] = useState('');
  const submit = (event: FormEvent) => { event.preventDefault(); setState('confirmed'); };

  return <main className="operationPage">
    <header className="operationHeader"><button onClick={() => history.back()}>←</button><span><b>Registrar visita</b><small>Sucursal Centro</small></span><i className="secureDot" /> Conexión segura</header>
    <section className="operationGrid">
      <div className="scannerPanel">
        <span className="eyebrow">ESCÁNER</span><h1>Escanea una tarjeta</h1><p>Coloca el código QR dentro del recuadro.</p>
        <button className={`camera ${state !== 'idle' ? 'success' : ''}`} onClick={() => setState('result')}>
          <span className="corner tl"/><span className="corner tr"/><span className="corner bl"/><span className="corner br"/>
          <i>{state === 'idle' ? '⌗' : '✓'}</i><b>{state === 'idle' ? 'Activar cámara' : 'Tarjeta encontrada'}</b><small>{state === 'idle' ? 'También puedes usar un lector físico' : 'Nébula Coffee · Café frecuente'}</small>
        </button>
        <div className="manual"><span>o captura el código manualmente</span><div><input aria-label="Código de tarjeta" placeholder="VP-XXXX-XXXX"/><button onClick={() => setState('result')}>Buscar</button></div></div>
      </div>
      <aside className="scanResult">
        {state === 'idle' ? <div className="emptyResult"><i>▱</i><h2>Sin tarjeta escaneada</h2><p>Aquí aparecerán el progreso, las visitas y el estado de la recompensa.</p></div> : <>
          <div className="resultTitle"><span className="avatar violet">LM</span><span><b>Tarjeta anónima</b><small>VP-82K4-P19A</small></span><em>ACTIVA</em></div>
          <div className="visitProgress"><span><small>PROGRESO</small><strong>7 <i>/ 10</i></strong></span><div><i /></div><b>Faltan 3 visitas</b></div>
          <dl className="cardMeta"><div><dt>Campaña</dt><dd>Café frecuente</dd></div><div><dt>Caducidad</dt><dd>31 dic 2026</dd></div><div><dt>Última visita</dt><dd>14 sep · Ticket 04921</dd></div></dl>
          <h3>Registrar compra</h3>
          <form className="visitForm" onSubmit={submit}><label>Número de ticket<input required value={ticket} onChange={e => setTicket(e.target.value)} placeholder="Ej. 04934"/></label><label>Monto de compra<input required inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} placeholder="$ 0.00"/></label><button>{state === 'confirmed' ? '✓ Visita registrada' : 'Confirmar visita'}</button></form>
          <div className="history"><h3>Historial reciente</h3>{[['14 sep 2026','04921','$128.00'],['08 sep 2026','04802','$96.00'],['29 ago 2026','04671','$145.00']].map(row => <div key={row[1]}><i>✓</i><span><b>{row[0]}</b><small>Sucursal Centro</small></span><span><b>Ticket {row[1]}</b><small>{row[2]}</small></span></div>)}</div>
        </>}
      </aside>
    </section>
  </main>;
}

