'use client';

import { useState } from 'react';

const Icon = ({ children }: { children: React.ReactNode }) => <span className="icon">{children}</span>;

const nav = [
  ['⌂', 'Resumen'], ['◇', 'Campañas'], ['▣', 'Tarjetas'], ['⌁', 'Visitas'],
  ['♙', 'Clientes'], ['⌘', 'Equipo'], ['◫', 'Reportes'],
];

const activity = [
  { initials: 'LM', name: 'Luis M.', detail: 'Visita 7 de 10', place: 'Centro · Ticket 04921', time: 'Hace 2 min', color: 'violet' },
  { initials: 'AR', name: 'Ana R.', detail: 'Recompensa obtenida', place: 'Reforma · Café gratis', time: 'Hace 18 min', color: 'mint' },
  { initials: 'JG', name: 'Jorge G.', detail: 'Visita 3 de 10', place: 'Centro · Ticket 04918', time: 'Hace 31 min', color: 'amber' },
  { initials: 'SC', name: 'Sofía C.', detail: 'Tarjeta vinculada', place: 'Verificación por teléfono', time: 'Hace 1 h', color: 'blue' },
];

export default function Dashboard() {
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState('Resumen');

  return <div className="shell">
    <aside className={menu ? 'sidebar open' : 'sidebar'}>
      <div className="brand"><span className="brandMark">V</span><span>visitpass</span></div>
      <button className="close" onClick={() => setMenu(false)}>×</button>
      <div className="business">
        <span className="businessLogo">N</span>
        <span><b>Nébula Coffee</b><small>Plan Premium</small></span><span className="chev">⌄</span>
      </div>
      <nav>{nav.map(([symbol, label]) => <button key={label} className={active === label ? 'active' : ''} onClick={() => { setActive(label); setMenu(false); }}><Icon>{symbol}</Icon>{label}</button>)}</nav>
      <div className="sideBottom">
        <button><Icon>⚙</Icon>Configuración</button>
        <div className="profile"><span className="avatar">JE</span><span><b>Josué Eguia</b><small>Propietario</small></span><button aria-label="Opciones">•••</button></div>
      </div>
    </aside>

    <main>
      <header>
        <button className="hamburger" onClick={() => setMenu(true)}>☰</button>
        <div><span className="eyebrow">JUEVES, 17 DE SEPTIEMBRE</span><h1>Buenas noches, Josué</h1><p>Así está funcionando tu programa hoy.</p></div>
        <div className="headerActions"><button className="scan" onClick={() => { window.location.href = '/scan'; }}><span>⌗</span> Escanear tarjeta</button><button className="bell">♢<i /></button></div>
      </header>

      <section className="stats">
        <Stat label="Visitas este mes" value="1,284" trend="+12.4%" note="vs. mes anterior" icon="↗" />
        <Stat label="Tarjetas activas" value="842" trend="+8.1%" note="64 nuevas este mes" icon="▰" />
        <Stat label="Recompensas" value="96" trend="11.4%" note="tasa de conversión" icon="✦" />
        <Stat label="Clientes recurrentes" value="68%" trend="+4.2%" note="vs. mes anterior" icon="↻" />
      </section>

      <section className="grid">
        <article className="panel campaignPanel">
          <div className="panelTitle"><div><span className="status"><i /> ACTIVA</span><h2>Tu campaña principal</h2></div><button>Administrar <span>→</span></button></div>
          <div className="campaignContent">
            <div className="walletCard">
              <div className="cardGlow" />
              <div className="cardTop"><span className="miniLogo">N</span><span><b>NÉBULA</b><small>COFFEE ROASTERS</small></span><span className="contactless">)))</span></div>
              <div className="cardTitle">Tu café número 10<br/><em>va por nuestra cuenta.</em></div>
              <div className="stamps">
                {[1,2,3,4,5,6,7,8,9,10].map(n => <span key={n} className={n <= 7 ? 'filled' : n === 10 ? 'gift' : ''}>{n === 10 ? '✦' : n}</span>)}
              </div>
              <div className="cardFoot"><span>7 DE 10 VISITAS</span><span>VENCE 31 DIC 2026</span></div>
            </div>
            <div className="campaignData">
              <h3>Café frecuente</h3><p>10 visitas · Premio fijo</p>
              <div className="progressLabel"><span>Progreso promedio</span><b>6.8 / 10</b></div><div className="progress"><i /></div>
              <dl><div><dt>Tarjetas activas</dt><dd>842</dd></div><div><dt>Visitas totales</dt><dd>5,726</dd></div><div><dt>Canjeadas</dt><dd>96</dd></div></dl>
              <div className="wallets"><span>Disponible en</span><b> Wallet</b><b className="google">G Wallet</b><b className="samsung">SAMSUNG Wallet</b></div>
            </div>
          </div>
        </article>

        <article className="panel quick">
          <div className="panelTitle"><div><span className="eyebrow">ACCESOS RÁPIDOS</span><h2>¿Qué quieres hacer?</h2></div></div>
          <button className="primaryQuick" onClick={() => { window.location.href = '/scan'; }}><Icon>⌗</Icon><span><b>Registrar una visita</b><small>Escanea el QR de una tarjeta</small></span><i>→</i></button>
          <button><Icon>＋</Icon><span><b>Nueva campaña</b><small>Crea una experiencia de lealtad</small></span><i>→</i></button>
          <button onClick={() => { window.location.href = '/designer'; }}><Icon>▱</Icon><span><b>Diseñar tarjeta</b><small>Personaliza colores y contenido</small></span><i>→</i></button>
          <button><Icon>⌘</Icon><span><b>Invitar empleado</b><small>Asigna sucursal y permisos</small></span><i>→</i></button>
        </article>

        <article className="panel chartPanel">
          <div className="panelTitle"><div><span className="eyebrow">RENDIMIENTO</span><h2>Visitas registradas</h2></div><select aria-label="Periodo"><option>Últimos 7 días</option><option>Este mes</option></select></div>
          <div className="chartLegend"><b>312</b><span>visitas esta semana</span><em>+18.2%</em></div>
          <div className="chart" aria-label="Gráfica de visitas por día">
            <div className="gridLines"><i/><i/><i/><i/></div>
            <svg viewBox="0 0 700 170" role="img"><defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7658ef" stopOpacity=".26"/><stop offset="1" stopColor="#7658ef" stopOpacity="0"/></linearGradient></defs><path className="area" d="M0,136 C45,128 55,107 100,112 S170,104 200,86 S270,103 300,92 S365,52 400,70 S465,82 500,52 S570,64 600,34 S665,48 700,20 L700,170 L0,170Z"/><path className="line" d="M0,136 C45,128 55,107 100,112 S170,104 200,86 S270,103 300,92 S365,52 400,70 S465,82 500,52 S570,64 600,34 S665,48 700,20"/></svg>
          </div><div className="days"><span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span></div>
        </article>

        <article className="panel activity">
          <div className="panelTitle"><div><span className="eyebrow">EN TIEMPO REAL</span><h2>Actividad reciente</h2></div><button>Ver todo</button></div>
          {activity.map(item => <div className="activityRow" key={item.name}><span className={`avatar ${item.color}`}>{item.initials}</span><span><b>{item.name}</b><small>{item.detail}</small></span><span className="place">{item.place}</span><time>{item.time}</time></div>)}
        </article>
      </section>
    </main>
    {menu && <div className="scrim" onClick={() => setMenu(false)} />}
  </div>;
}

function Stat({label, value, trend, note, icon}: {label:string;value:string;trend:string;note:string;icon:string}) {
  return <article className="stat"><div className="statIcon">{icon}</div><span>{label}</span><strong>{value}</strong><footer><em>{trend}</em> {note}</footer></article>;
}
