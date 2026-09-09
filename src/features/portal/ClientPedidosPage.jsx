import { useMemo, useState } from 'react';
import {
  CalendarDays,
  ChevronDown,
  CreditCard,
  Package,
  Plus,
  Receipt,
  Truck,
  Wrench,
} from 'lucide-react';
import Badge from '../../components/base/Badge';
import CardList from '../../components/base/CardList';
import { useAbonos } from '../../context/AbonosContext';
import {
  clientCreditos,
  clientEntregas,
  clientPedidos,
  estadosCotizacion,
  estadosCredito,
  estadosEntrega,
  estadosOrdenReencauche,
} from '../../data/mockData';
import EntregaModal from './EntregaModal';
import ReencaucheModal from './ReencaucheModal';
import RegistrarAbonoModal from './RegistrarAbonoModal';

// -------------------------------------------------------------------------
// Aspecto de la carta según el estado del crédito: contorno marcado y, solo
// en modo claro, un fondo del mismo tono muy tenue para que se distinga
// mejor. En oscuro basta con el contorno, así que la carta conserva el
// fondo normal. Los pedidos de contado quedan neutros.
// -------------------------------------------------------------------------
const ESTILO_CREDITO = {
  'Al día': 'border-emerald-400 bg-emerald-50 dark:border-emerald-400/70 dark:bg-brand-navy-800',
  Vencido: 'border-red-400 bg-red-50 dark:border-red-400/70 dark:bg-brand-navy-800',
  Pagado: 'border-slate-300 bg-slate-100/70 dark:border-white/25 dark:bg-brand-navy-800',
};

const ESTILO_NEUTRO = 'border-slate-200 bg-white dark:border-white/10 dark:bg-brand-navy-800';

/** El botón de entrega solo se habilita cuando el pedido espera despacho. */
const ESTADO_DESPACHABLE = 'Por entregar';

// Valores de "sin dato" que se ofrecen en los filtros derivados.
const SIN_CREDITO = 'Sin crédito';
const SIN_ENTREGA = 'Sin entrega';
const SIN_REENCAUCHE = 'Sin reencauche';

export default function ClientPedidosPage() {
  const { abonos, addAbono } = useAbonos();

  // Detalles abiertos. Son objetos (y no un solo id) a propósito: se pueden
  // desplegar varias cotizaciones —y varios servicios— al mismo tiempo.
  const [pedidosAbiertos, setPedidosAbiertos] = useState({});
  const [serviciosAbiertos, setServiciosAbiertos] = useState({});
  const [entregaDe, setEntregaDe] = useState(null);
  const [reencaucheDe, setReencaucheDe] = useState(null);
  const [abonoDe, setAbonoDe] = useState(null);

  const alternarPedido = (id) => setPedidosAbiertos((prev) => ({ ...prev, [id]: !prev[id] }));
  const alternarServicio = (clave) => setServiciosAbiertos((prev) => ({ ...prev, [clave]: !prev[clave] }));

  // -----------------------------------------------------------------------
  // A cada pedido se le adjuntan su crédito y su entrega, y se arma un texto
  // `buscable` con los números de crédito, entrega y reencauche para que el
  // buscador los encuentre desde aquí.
  // -----------------------------------------------------------------------
  const pedidos = useMemo(
    () =>
      clientPedidos.map((pedido) => {
        const credito = clientCreditos.find((c) => c.pedido === pedido.id) ?? null;
        const entrega = clientEntregas.find((e) => e.pedido === pedido.id) ?? null;
        const reencauches = pedido.detalle
          .filter((l) => l.tipo === 'servicio' && l.fichaServicio)
          .map((l) => l.fichaServicio);

        return {
          ...pedido,
          credito,
          entrega,
          reencauches,
          buscable: [
            pedido.id,
            pedido.proveedor,
            pedido.total,
            pedido.fecha,
            credito?.id,
            entrega?.id,
            ...reencauches.map((r) => `${r.orden} ${r.taller}`),
          ]
            .filter(Boolean)
            .join(' '),
        };
      }),
    [],
  );

  // -----------------------------------------------------------------------
  // Filtros derivados: el dato no está plano en el pedido, así que cada uno
  // trae su propia función de coincidencia.
  // -----------------------------------------------------------------------
  const filtros = [
    { key: 'estado', label: 'Pedido', options: estadosCotizacion },
    { key: 'metodoPago', label: 'Pago' },
    {
      key: 'filtroCredito',
      label: 'Crédito',
      options: [...estadosCredito, SIN_CREDITO],
      match: (p, valor) => (valor === SIN_CREDITO ? !p.credito : p.credito?.estado === valor),
    },
    {
      key: 'filtroEntrega',
      label: 'Entrega',
      options: [...estadosEntrega, SIN_ENTREGA],
      match: (p, valor) => (valor === SIN_ENTREGA ? !p.entrega : p.entrega?.estado === valor),
    },
    {
      key: 'filtroReencauche',
      label: 'Reencauche',
      options: [...estadosOrdenReencauche, SIN_REENCAUCHE],
      match: (p, valor) =>
        valor === SIN_REENCAUCHE
          ? p.reencauches.length === 0
          : p.reencauches.some((r) => r.estado === valor),
    },
  ];

  // Los pedidos a crédito siempre encabezan; dentro de cada grupo manda la fecha.
  const porGrupoYFecha = (direccion) => (a, b) => {
    const grupo = Number(Boolean(b.credito)) - Number(Boolean(a.credito));
    if (grupo !== 0) return grupo;
    return direccion * a.fecha.localeCompare(b.fecha);
  };

  const ordenes = [
    { value: 'fecha-desc', label: 'Fecha: más recientes', compare: porGrupoYFecha(-1) },
    { value: 'fecha-asc', label: 'Fecha: más antiguas', compare: porGrupoYFecha(1) },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">Mis Pedidos-Cotización</h1>
      <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
        Historial completo de tus solicitudes · los pedidos a crédito aparecen primero
      </p>

      <CardList
        items={pedidos}
        searchKeys={['buscable']}
        filters={filtros}
        sortOptions={ordenes}
        stickyToolbar
        emptyIcon="FileText"
        emptyTitle="Sin pedidos"
        emptyDescription="Aquí verás tus cotizaciones y pedidos."
        renderCard={(p) => {
          const abierto = Boolean(pedidosAbiertos[p.id]);
          const estilo = p.credito ? ESTILO_CREDITO[p.credito.estado] ?? ESTILO_NEUTRO : ESTILO_NEUTRO;
          const abonosDelCredito = p.credito ? abonos.filter((a) => a.credito === p.credito.id) : [];
          const despachable = p.estado === ESTADO_DESPACHABLE;

          return (
            <article
              key={p.id}
              className={`flex flex-col rounded-xl border-2 p-5 transition-shadow hover:shadow-md dark:hover:shadow-black/30 ${estilo}`}
            >
              {/* ---- Estados: crédito (si aplica) y pedido, arriba a la izquierda ---- */}
              <div className="flex flex-col gap-1.5">
                {p.credito && (
                  <div className="flex items-center gap-2">
                    <span className="w-14 shrink-0 text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      Crédito
                    </span>
                    <Badge>{p.credito.estado}</Badge>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="w-14 shrink-0 text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Pedido
                  </span>
                  <Badge>{p.estado}</Badge>
                </div>
              </div>

              {/* ---- Resumen del pedido ---- */}
              <div className="mt-4">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{p.id}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <CalendarDays size={12} /> {p.fecha}
                </p>
              </div>

              <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Truck size={13} /> {p.proveedor}
              </p>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Package size={13} /> {p.items} {p.items === 1 ? 'llanta' : 'llantas'}
              </p>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <CreditCard size={13} /> {p.metodoPago}
              </p>

              <div className="mt-4 flex items-end justify-between border-t border-slate-200/70 pt-4 dark:border-white/5">
                <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Total
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">{p.total}</span>
              </div>

              {/* ---- Botón que despliega el detalle ---- */}
              <button
                type="button"
                onClick={() => alternarPedido(p.id)}
                aria-expanded={abierto}
                aria-controls={`detalle-${p.id}`}
                className="mt-3 flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white/60 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-white dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:hover:bg-white/5"
              >
                {abierto ? 'Ocultar detalle' : 'Ver detalle'}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${abierto ? 'rotate-180' : ''}`}
                />
              </button>

              {/* ---- Detalle desplegable (animado con grid-rows) ---- */}
              <div
                id={`detalle-${p.id}`}
                className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                  abierto ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                    Detalle de la cotización
                  </p>

                  <ul className="mt-2 divide-y divide-slate-200/70 rounded-lg border border-slate-200 bg-white/60 dark:divide-white/5 dark:border-white/10 dark:bg-transparent">
                    {p.detalle.map((linea, i) => {
                      const claveServicio = `${p.id}-${i}`;
                      const servicioAbierto = Boolean(serviciosAbiertos[claveServicio]);
                      const esServicio = linea.tipo === 'servicio';

                      return (
                        <li key={claveServicio} className="px-3 py-2.5">
                          <div className="flex items-start gap-3">
                            <span
                              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                                esServicio
                                  ? 'bg-blue-500/15 text-blue-500 dark:text-blue-400'
                                  : 'bg-amber-400/15 text-amber-500 dark:text-amber-400'
                              }`}
                            >
                              {esServicio ? <Wrench size={13} /> : <Package size={13} />}
                            </span>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">
                                {linea.nombre}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                {linea.medida} · {linea.cantidad} × {linea.unitario}
                              </p>
                            </div>

                            <span className="shrink-0 text-xs font-bold text-slate-900 dark:text-white">
                              {linea.subtotal}
                            </span>
                          </div>

                          {/* ---- Ficha del servicio, desplegable aparte ---- */}
                          {esServicio && linea.fichaServicio && (
                            <>
                              <button
                                type="button"
                                onClick={() => alternarServicio(claveServicio)}
                                aria-expanded={servicioAbierto}
                                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md border border-blue-500/30 py-1.5 text-[11px] font-semibold text-blue-600 transition-colors hover:bg-blue-500/10 dark:text-blue-400"
                              >
                                {servicioAbierto ? 'Ocultar servicio' : 'Ver detalle del servicio'}
                                <ChevronDown
                                  size={12}
                                  className={`transition-transform duration-200 ${
                                    servicioAbierto ? 'rotate-180' : ''
                                  }`}
                                />
                              </button>

                              <div
                                className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                                  servicioAbierto ? 'mt-2 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                }`}
                              >
                                <div className="overflow-hidden">
                                  <dl className="space-y-1.5 rounded-md bg-slate-100/80 p-3 text-[11px] dark:bg-white/5">
                                    {[
                                      ['Modalidad', linea.fichaServicio.modalidad],
                                      ['Taller', linea.fichaServicio.taller],
                                      ['Recepción', linea.fichaServicio.recepcion],
                                      ['Entrega estimada', linea.fichaServicio.entrega],
                                      ['Garantía', `${linea.fichaServicio.garantiaDias} días`],
                                    ].map(([etiqueta, valor]) => (
                                      <div key={etiqueta} className="flex justify-between gap-3">
                                        <dt className="text-slate-500 dark:text-slate-400">{etiqueta}</dt>
                                        <dd className="text-right font-semibold text-slate-800 dark:text-slate-100">
                                          {valor}
                                        </dd>
                                      </div>
                                    ))}
                                    <div className="flex items-center justify-between gap-3 pt-0.5">
                                      <dt className="text-slate-500 dark:text-slate-400">Evidencia</dt>
                                      <dd>
                                        <Badge>{linea.fichaServicio.estadoEvidencia}</Badge>
                                      </dd>
                                    </div>
                                    <p className="border-t border-slate-200 pt-2 text-slate-500 dark:border-white/10 dark:text-slate-400">
                                      {linea.fichaServicio.observaciones}
                                    </p>
                                  </dl>

                                  <button
                                    type="button"
                                    onClick={() => setReencaucheDe(linea)}
                                    className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md bg-blue-500 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-blue-600"
                                  >
                                    <Wrench size={12} /> Ver estado del reencauche
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </li>
                      );
                    })}
                  </ul>

                  {/* ---- Crédito y abonos del pedido ---- */}
                  {p.credito && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                          Crédito {p.credito.id}
                        </p>
                        <button
                          type="button"
                          onClick={() => setAbonoDe(p.credito)}
                          className="inline-flex items-center gap-1 rounded-md border border-amber-400 px-2 py-1 text-[11px] font-bold text-amber-600 transition-colors hover:bg-amber-400/10 dark:text-amber-400"
                        >
                          <Plus size={12} /> Registrar abono
                        </button>
                      </div>

                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {[
                          ['VALOR', p.credito.valor],
                          ['SALDO', p.credito.saldo],
                          ['PLAZO', `${p.credito.plazoDias} días`],
                          ['VENCE', p.credito.limite],
                        ].map(([etiqueta, valor]) => (
                          <div key={etiqueta} className="rounded-md bg-slate-100/80 p-2 dark:bg-white/5">
                            <p className="text-[10px] font-bold tracking-wide text-slate-400 dark:text-slate-500">
                              {etiqueta}
                            </p>
                            <p className="mt-0.5 text-xs font-bold text-slate-800 dark:text-slate-100">{valor}</p>
                          </div>
                        ))}
                      </div>

                      {abonosDelCredito.length > 0 && (
                        <ul className="mt-2 divide-y divide-slate-200/70 rounded-md border border-slate-200 bg-white/60 dark:divide-white/5 dark:border-white/10 dark:bg-transparent">
                          {abonosDelCredito.map((a) => (
                            <li key={a.id} className="flex items-center gap-2 px-3 py-2">
                              <Receipt size={12} className="shrink-0 text-slate-400" />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-[11px] font-bold text-slate-800 dark:text-slate-100">
                                  {a.id} · {a.monto}
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                  {a.fecha} · {a.metodo}
                                </p>
                              </div>
                              <Badge>{a.estado}</Badge>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {/* ---- Seguimiento de la entrega ---- */}
                  <button
                    type="button"
                    disabled={!despachable}
                    onClick={() => setEntregaDe(p)}
                    title={
                      despachable
                        ? 'Ver el seguimiento del despacho'
                        : `Disponible cuando el pedido pase a "${ESTADO_DESPACHABLE}"`
                    }
                    className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-500 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-500/25 disabled:text-emerald-900/50 dark:disabled:text-white/40"
                  >
                    <Truck size={14} /> Ver estado de la entrega
                  </button>
                </div>
              </div>
            </article>
          );
        }}
      />

      {/* Seguimiento del despacho del pedido seleccionado */}
      {entregaDe && (
        <EntregaModal pedido={entregaDe} entrega={entregaDe.entrega} onClose={() => setEntregaDe(null)} />
      )}

      {/* Avance de la orden de reencauche de una línea de servicio */}
      {reencaucheDe && <ReencaucheModal linea={reencaucheDe} onClose={() => setReencaucheDe(null)} />}

      {/* Registro de un abono sobre el crédito del pedido */}
      {abonoDe && (
        <RegistrarAbonoModal creditoId={abonoDe.id} onSubmit={addAbono} onClose={() => setAbonoDe(null)} />
      )}
    </div>
  );
}
