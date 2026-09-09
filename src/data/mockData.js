// Datos de ejemplo (mock) para alimentar el prototipo frontend.
// En producción estos vendrían de los servicios REST (SOA) descritos en la arquitectura.

export const dashboardStats = [
  {
    id: 'ventas',
    label: 'VENTAS DEL MES',
    value: '$ 27.800.000',
    sub: '56 transacciones',
    trend: '+11.7% vs mes anterior',
    trendUp: true,
    icon: 'DollarSign',
    accent: 'amber',
  },
  {
    id: 'pedidos',
    label: 'PEDIDOS ACTIVOS',
    value: '23',
    sub: '7 en proceso',
    trend: '+4.2% vs mes anterior',
    trendUp: true,
    icon: 'FileText',
    accent: 'blue',
  },
  {
    id: 'clientes',
    label: 'CLIENTES ACTIVOS',
    value: '94',
    sub: '8 nuevos este mes',
    trend: '+2.1% vs mes anterior',
    trendUp: true,
    icon: 'UserRound',
    accent: 'emerald',
  },
  {
    id: 'credito',
    label: 'CRÉDITO VIGENTE',
    value: '$ 81.700.000',
    sub: '4 créditos abiertos',
    trend: '-1.4% vs mes anterior',
    trendUp: false,
    icon: 'CreditCard',
    accent: 'violet',
  },
];

// Sin uso desde que "Ventas vs Compras" se reemplazó por reencauchesPorMes.
export const salesVsPurchases = [
  { month: 'Ene', ventas: 14 },
  { month: 'Feb', ventas: 16 },
  { month: 'Mar', ventas: 15 },
  { month: 'Abr', ventas: 22 },
  { month: 'May', ventas: 27 },
  { month: 'Jun', ventas: 28 },
  { month: 'Jul', ventas: 27.8 },
];

export const salesByBrand = [
  { name: 'Michelin', value: 34, color: '#FBBF24' },
  { name: 'Bridgestone', value: 27, color: '#3B82F6' },
  { name: 'Goodyear', value: 24, color: '#22C55E' },
  { name: 'Continental', value: 15, color: '#A78BFA' },
];

// `confirmado` indica si el asesor ya fijó el valor total de la cotización.
// Las cotizaciones nuevas nacen en cero y sin confirmar.
export const recentOrders = [
  { id: 'PED-2024-001', cliente: 'Transportes Andinos SAS', metodoPago: 'Transferencia', total: '$ 1.968.000', estado: 'Aprobado', confirmado: true },
  { id: 'PED-2024-002', cliente: 'Maria Garcia Ruiz', metodoPago: 'Crédito', total: '$ 775.000', estado: 'Pendiente', confirmado: true },
  { id: 'PED-2024-003', cliente: 'Flota Express Ltda', metodoPago: 'Contado', total: '$ 4.692.000', estado: 'Entregado', confirmado: true },
  { id: 'PED-2024-004', cliente: 'Carlos Arbeláez Ossa', metodoPago: 'Efectivo', total: '$ 447.000', estado: 'Rechazado', confirmado: true },
  { id: 'PED-2024-005', cliente: 'Servicios Terrestres SA', metodoPago: 'Crédito', total: '$ 0', estado: 'Pendiente', confirmado: false },
];

// Nota: el panel "Alertas del Sistema" se retiró del dashboard, así que hoy
// estos avisos no se pintan en ninguna pantalla. Se dejan aquí (ampliados con
// más warnings) para poder colocarlos donde se decida más adelante.
export const systemAlerts = [
  { id: 1, type: 'warning', text: 'Stock crítico: Bridgestone Potenza RE050A — 7 unid.' },
  { id: 2, type: 'danger', text: 'Crédito CRE-003 vencido — Servicios Terrestres SA' },
  { id: 3, type: 'info', text: 'Entrega ENT-003 despachar hoy — Serv. Terrestres' },
  { id: 4, type: 'success', text: 'Orden OC-2024-004 recibida correctamente' },
  { id: 5, type: 'warning', text: 'Reencauche REC-002 vence en 3 días (30 Jul)' },
  { id: 6, type: 'warning', text: 'Stock crítico: Michelin LTX Force — 4 unid.' },
  { id: 7, type: 'warning', text: 'Cotización PED-2024-005 sin respuesta hace 5 días' },
  { id: 8, type: 'warning', text: 'Orden OC-2024-003 sin confirmar por el proveedor' },
  { id: 9, type: 'warning', text: 'Crédito CRE-002 vence en 7 días — Flota Express Ltda' },
  { id: 10, type: 'warning', text: '3 evidencias de carcasa pendientes de revisión' },
  { id: 11, type: 'warning', text: 'Entrega ENT-002 lleva 2 días en camino' },
  { id: 12, type: 'danger', text: 'Abono ABN-003 sin comprobante adjunto' },
];

export const usuarios = [
  { id: 'U001', nombre: 'Carlos Mendoza', tipoDoc: 'CC', numDoc: '79.456.123', correo: 'admin@mirallantas.com', telefono: '3001112233', rol: 'Administrador' },
  { id: 'U002', nombre: 'Ana Ríos Salcedo', tipoDoc: 'CC', numDoc: '52.678.901', correo: 'ana.rios@mirallantas.com', telefono: '3112223344', rol: 'Vendedor' },
  { id: 'U003', nombre: 'Pedro Martínez', tipoDoc: 'CC', numDoc: '80.234.567', correo: 'pedro.m@mirallantas.com', telefono: '3204445566', rol: 'Bodeguero' },
  { id: 'U004', nombre: 'Luis Vargas Ríos', tipoDoc: 'CC', numDoc: '19.345.678', correo: 'luis.v@mirallantas.com', telefono: '3056667788', rol: 'Contador' },
  { id: 'U005', nombre: 'María García', tipoDoc: 'CC', numDoc: '1.024.567.890', correo: 'maria@gmail.com', telefono: '3119876543', rol: 'Cliente' },
  { id: 'U006', nombre: 'José Herrera', tipoDoc: 'CC', numDoc: '80.999.001', correo: 'jose.h@mirallantas.com', telefono: '3188889900', rol: 'Vendedor' },
];

export const roles = [
  { id: 'R001', nombre: 'Administrador', permisos: 12 },
  { id: 'R002', nombre: 'Vendedor', permisos: 6 },
  { id: 'R003', nombre: 'Bodeguero', permisos: 4 },
  { id: 'R004', nombre: 'Contador', permisos: 4 },
  { id: 'R005', nombre: 'Cliente', permisos: 3 },
];

export const clientes = [
  { id: 'C001', nombre: 'Transportes Andinos SAS', documento: '900.123.456-1', correo: 'contacto@transportesandinos.com', telefono: '3001234567', direccion: 'Cra 30 #25-90, Bogotá' },
  { id: 'C002', nombre: 'Maria Garcia Ruiz', documento: '1.024.567.890', correo: 'maria@gmail.com', telefono: '3119876543', direccion: 'Calle 50 #45-12, Medellín' },
  { id: 'C003', nombre: 'Flota Express Ltda', documento: '800.456.789-2', correo: 'flota@express.co', telefono: '3209988776', direccion: 'Av 3N #35-12, Cali' },
  { id: 'C004', nombre: 'Carlos Arbeláez Ossa', documento: '79.543.210', correo: 'carlos.a@hotmail.com', telefono: '3145551234', direccion: 'Cra 15 #20-40, Barranquilla' },
  { id: 'C005', nombre: 'Servicios Terrestres SA', documento: '901.234.567-3', correo: 'admin@sterrestres.com.co', telefono: '3018889900', direccion: 'Calle 80 #50-30, Bogotá' },
  { id: 'C006', nombre: 'Luis Fernando Mora', documento: '19.876.543', correo: 'lfmora@yahoo.com', telefono: '3204449988', direccion: 'Cra 5 #10-22, Pereira' },
  { id: 'C007', nombre: 'Cooperativa de Taxis Norte', documento: '802.345.678-5', correo: 'admin@taxinorte.coop', telefono: '3176667788', direccion: 'Calle 134 #19-20, Bogotá' },
  { id: 'C008', nombre: 'Inversiones Rodante SAS', documento: '900.987.654-3', correo: 'inv@rodante.co', telefono: '3125554433', direccion: 'Cra 33 #48-10, Bucaramanga' },
];

export const proveedores = [
  { id: 'PR001', nombre: 'Michelin Colombia SAS', tipoDoc: 'NIT', numDoc: '860.345.678-9', correo: 'ventas@michelin.co', telefono: '6017891234', direccion: 'Cra 7 #71-52, Bogotá', estado: 'Activo' },
  { id: 'PR002', nombre: 'Bridgestone de Colombia', tipoDoc: 'NIT', numDoc: '890.123.456-7', correo: 'pedidos@bridgestone.co', telefono: '6015671234', direccion: 'Calle 26 #68-03, Bogotá', estado: 'Activo' },
  { id: 'PR003', nombre: 'Goodyear Colombia Ltda', tipoDoc: 'NIT', numDoc: '800.789.012-4', correo: 'goodyear@goodyear.co', telefono: '4446789012', direccion: 'Av El Poblado #16-28, Medell.', estado: 'Activo' },
  { id: 'PR004', nombre: 'Continental Distribuciones SA', tipoDoc: 'NIT', numDoc: '901.456.789-1', correo: 'ventas@contidist.com', telefono: '3234561234', direccion: 'Av 3N #12-34, Cali', estado: 'Activo' },
  { id: 'PR005', nombre: 'Importadora Llantas Plus', tipoDoc: 'NIT', numDoc: '700.234.890-5', correo: 'importaciones@llantasplus.co', telefono: '6013456789', direccion: 'Calle 13 #23-45, Bogotá', estado: 'Inactivo' },
  { id: 'PR006', nombre: 'Pirelli Colombia', tipoDoc: 'NIT', numDoc: '830.112.334-2', correo: 'ventas@pirelli.co', telefono: '6014445566', direccion: 'Cra 11 #93-45, Bogotá', estado: 'Activo' },
];

export const terceros = [
  { id: 'TER001', nombre: 'Seguros Bolívar SA', nit: '860.003.128-1', contacto: 'Sandra Ruiz', telefono: '6013456789', correo: 'seguros@bolivar.com.co', direccion: 'Cra 7 #32-10, Bogotá', estado: 'Activo' },
  { id: 'TER002', nombre: 'Logística Nacional SA', nit: '900.234.567-8', contacto: 'Miguel Torres', telefono: '3155667788', correo: 'ops@logicanal.co', direccion: 'Av 68 #24-30, Bogotá', estado: 'Activo' },
  { id: 'TER003', nombre: 'Plásticos del Valle SA', nit: '800.456.012-3', contacto: 'Carmen López', telefono: '4448889000', correo: 'ventas@plasvalle.com', direccion: 'Calle 36 #3N-45, Cali', estado: 'Activo' },
  { id: 'TER004', nombre: 'Banco de Bogotá', nit: '860.003.167-7', contacto: 'Fiduciaria', telefono: '6017777777', correo: 'fiducia@bancodebogota.co', direccion: 'Cra 8 #15-60, Bogotá', estado: 'Activo' },
  { id: 'TER005', nombre: 'Taller Vulcanizadora Sur', nit: '79.456.789', contacto: 'Hernán Caro', telefono: '3201234567', correo: 'tallervulc@gmail.com', direccion: 'Calle 12 Sur #40-20, Bogotá', estado: 'Activo' },
];

export const productos = [
  { id: 'PRD001', nombre: 'Michelin Energy XM2+', marca: 'Michelin', medida: '195/65R15', categoria: 'Turismo', vehiculo: 'Turismo', estado: 'Disponible', img: 'tire-workshop' },
  { id: 'PRD002', nombre: 'Bridgestone Turanza T005', marca: 'Bridgestone', medida: '205/55R16', categoria: 'Turismo', vehiculo: 'Turismo', estado: 'Disponible', img: 'tire-car' },
  { id: 'PRD003', nombre: 'Goodyear EfficientGrip P2', marca: 'Goodyear', medida: '225/45R17', categoria: 'Performance', vehiculo: 'Turismo', estado: 'Disponible', img: 'tire-sports' },
  { id: 'PRD004', nombre: 'Continental PremiumContact 7', marca: 'Continental', medida: '215/60R17', categoria: 'SUV / Camioneta', vehiculo: 'SUV / Camioneta', estado: 'Disponible', img: 'tire-suv' },
  { id: 'PRD005', nombre: 'Bridgestone Alenza 001', marca: 'Bridgestone', medida: '255/50R19', categoria: 'SUV / Camioneta', vehiculo: 'SUV / Camioneta', estado: 'Disponible', img: 'tire-workshop' },
  { id: 'PRD006', nombre: 'Goodyear Wrangler AT Silent', marca: 'Goodyear', medida: '265/65R17', categoria: 'SUV / Camioneta', vehiculo: 'SUV / Camioneta', estado: 'Disponible', img: 'tire-bmw' },
  { id: 'PRD007', nombre: 'Michelin LTX Force', marca: 'Michelin', medida: '265/70R16', categoria: 'Carga liviana', vehiculo: 'Carga liviana', estado: 'Disponible', img: 'tire-truck' },
  { id: 'PRD008', nombre: 'Bridgestone Potenza RE050A', marca: 'Bridgestone', medida: '245/45R18', categoria: 'Performance', vehiculo: 'Turismo', estado: 'Disponible', img: 'tire-sports' },
  { id: 'PRD009', nombre: 'Continental VanContact 100', marca: 'Continental', medida: '235/65R16', categoria: 'SUV / Camioneta', vehiculo: 'SUV / Camioneta', estado: 'Disponible', img: 'tire-workshop' },
  { id: 'PRD010', nombre: 'Goodyear KMax D', marca: 'Goodyear', medida: '295/80R22.5', categoria: 'Camión / Tracto', vehiculo: 'Camión / Tracto', estado: 'Disponible', img: 'tire-truck2' },
  { id: 'PRD011', nombre: 'Michelin Pilot Sport 5', marca: 'Michelin', medida: '225/40R18', categoria: 'Performance', vehiculo: 'Turismo', estado: 'Disponible', img: 'tire-bmw' },
];

export const categorias = [
  { id: 'CAT001', nombre: 'Turismo', productos: 3 },
  { id: 'CAT002', nombre: 'SUV / Camioneta', productos: 4 },
  { id: 'CAT003', nombre: 'Performance', productos: 2 },
  { id: 'CAT004', nombre: 'Carga liviana', productos: 1 },
  { id: 'CAT005', nombre: 'Camión / Tracto', productos: 1 },
];

export const ordenesCompra = [
  { id: 'OC-2024-001', proveedor: 'Michelin Colombia SAS', total: '$ 12.400.000', estado: 'Recibida' },
  { id: 'OC-2024-002', proveedor: 'Bridgestone de Colombia', total: '$ 8.750.000', estado: 'En tránsito' },
  { id: 'OC-2024-003', proveedor: 'Goodyear Colombia Ltda', total: '$ 5.200.000', estado: 'Pendiente' },
  { id: 'OC-2024-004', proveedor: 'Continental Distribuciones SA', total: '$ 3.980.000', estado: 'Recibida' },
];

export const creditos = [
  { id: 'CRE-001', cliente: 'Transportes Andinos SAS', cupo: '$ 20.000.000', saldo: '$ 4.300.000', estado: 'Al día' },
  { id: 'CRE-002', cliente: 'Flota Express Ltda', cupo: '$ 15.000.000', saldo: '$ 15.000.000', estado: 'Al día' },
  { id: 'CRE-003', cliente: 'Servicios Terrestres SA', cupo: '$ 10.000.000', saldo: '$ 9.200.000', estado: 'Vencido' },
];

export const abonos = [
  { id: 'ABN-001', credito: 'CRE-001', fecha: '2024-07-05', monto: '$ 2.000.000', metodo: 'Transferencia', estado: 'Confirmado' },
  { id: 'ABN-002', credito: 'CRE-002', fecha: '2024-07-12', monto: '$ 1.500.000', metodo: 'Consignación', estado: 'Confirmado' },
];

export const entregas = [
  { id: 'ENT-001', pedido: 'PED-2024-001', cliente: 'Transportes Andinos SAS', estado: 'Entregado' },
  { id: 'ENT-002', pedido: 'PED-2024-003', cliente: 'Flota Express Ltda', estado: 'En camino' },
  { id: 'ENT-003', pedido: 'PED-2024-005', cliente: 'Servicios Terrestres SA', estado: 'Pendiente' },
];

export const reencauches = [
  { id: 'REC-001', cliente: 'María García', taller: 'Taller Vulcanizadora Sur', estado: 'Completado' },
  { id: 'REC-002', cliente: 'Transportes Andinos SAS', taller: 'Taller Vulcanizadora Sur', estado: 'En proceso' },
];

// --- Datos del portal de cliente (usuario: María García) ---

// Perfil del cliente en sesión (tabla `usuario` + `cliente`). El modal de
// perfil del navbar del portal edita estos campos.
export const clientProfile = {
  nombre: 'María García',
  iniciales: 'MG',
  tipoDoc: 'CC',
  numDoc: '1.024.567.890',
  correo: 'maria@gmail.com',
  telefono: '3119876543',
  direccion: 'Calle 50 #45-12, Medellín',
  foto: '',
};

export const clientHomeStats = [
  { id: 'pedidos', label: 'MIS PEDIDOS-COTIZACIÓN', value: '12', sub: '1 cotización pendiente', icon: 'FileText', accent: 'amber' },
  { id: 'entrega', label: 'PRÓXIMA ENTREGA', value: '22 Jul', sub: 'ENT-031 · programada', icon: 'Truck', accent: 'blue' },
  { id: 'credito', label: 'MI CRÉDITO', value: '$ 1.175.000', sub: 'Saldo pendiente en 2 créditos', icon: 'CreditCard', accent: 'emerald' },
  { id: 'total', label: 'TOTAL COMPRADO', value: '$ 16.730.000', sub: 'Este año', icon: 'DollarSign', accent: 'violet' },
];

export const clientOrders = [
  { id: 'PED-2024-002', fecha: '2024-07-16', total: '$ 775.000', estado: 'Pendiente' },
];


// =====================================================================
// Catálogos del modelo de datos v2 (dbdiagram) — alimentan los selects
// de los formularios y modales.
// =====================================================================

export const tiposDocumento = ['CC', 'CE', 'NIT', 'Pasaporte'];

export const metodosPago = ['Efectivo', 'Transferencia', 'Consignación', 'Tarjeta', 'Crédito'];

// Cupo total de crédito del cliente. El "saldo usable" es este monto menos
// lo que ya tiene comprometido en créditos vigentes.
export const CUPO_CREDITO_TOTAL = 2000000;

export const tiposVehiculo = [
  'Turismo',
  'SUV / Camioneta',
  'Carga',
  'Agrícola',
  'OTR',
  'Industrial',
];

export const marcas = ['Michelin', 'Bridgestone', 'Goodyear', 'Continental', 'Pirelli'];

export const modulosPermiso = [
  'Usuarios',
  'Roles',
  'Proveedores',
  'Terceros',
  'Catálogo',
  'Pedidos-Cotización',
  'Órdenes de compra',
  'Entregas',
  'Reencauche',
  'Créditos',
  'Abonos',
];

// Catálogos de estado, uno por módulo (tal como están en la BD)
export const estadosCotizacion = ['Pendiente', 'Aprobado', 'En proceso', 'Por entregar', 'Entregado', 'Rechazado'];
export const estadosCredito = ['Al día', 'Vencido', 'Pagado'];
export const estadosAbono = ['Pendiente', 'Confirmado', 'Rechazado'];
export const estadosEntrega = ['Pendiente', 'En camino', 'Entregado', 'Cancelado'];
export const estadosOrdenCompra = ['Pendiente', 'En tránsito', 'Recibida'];
export const estadosOrdenReencauche = ['Pendiente', 'En proceso', 'Completado'];
export const estadosProducto = ['Disponible', 'Agotado', 'Descontinuado'];
// Estado común de los listados de gestión (usuario.activo en la BD; las
// demás tablas necesitarían la misma columna para persistirlo).
export const estadosActivo = ['Activo', 'Inactivo'];
export const estadosEvidenciaCarcasa = ['Pendiente de revisión', 'Apta', 'No apta'];

// Tabla `servicio`: hoy la empresa presta un único servicio (reencauche),
// aquí quedan sus dos modalidades.
export const servicios = [
  {
    id: 'SRV001',
    nombre: 'Reencauche en frío',
    descripcion: 'Reencauche de carcasa con banda precurada. Incluye inspección y reparación menor.',
    garantiaDias: 180,
    precioSugerido: 320000,
  },
  {
    id: 'SRV002',
    nombre: 'Reencauche en caliente',
    descripcion: 'Reencauche con banda cruda vulcanizada en molde. Recomendado para carga pesada.',
    garantiaDias: 240,
    precioSugerido: 385000,
  },
];

// --- Listados del portal de cliente (María García) --------------------
// Se reemplazan los estados "sin registros" por datos de ejemplo, para
// poder ver el formato de cartas, el buscador, el filtro y la paginación.

export const clientPedidos = [
  {
    id: 'PED-2024-002',
    fecha: '2024-07-16',
    proveedor: 'Michelin Colombia SAS',
    metodoPago: 'Transferencia',
    items: 4,
    total: '$ 775.000',
    estado: 'Pendiente',
    detalle: [
      { tipo: 'producto', nombre: 'Michelin Energy XM2+', medida: '195/65R15', cantidad: 2, unitario: '$ 280.000', subtotal: '$ 560.000' },
      { tipo: 'servicio', nombre: 'Reencauche en frío', medida: '295/80R22.5', cantidad: 2, unitario: '$ 107.500', subtotal: '$ 215.000', fichaServicio: { orden: 'REC-001', estado: 'Completado', paso: 3, taller: 'Taller Vulcanizadora Sur', modalidad: 'Reencauche en frío', garantiaDias: 180, estadoEvidencia: 'Apta', recepcion: '2024-07-12', entrega: '2024-07-22', observaciones: 'Carcasa sin cortes laterales.' } },
    ],
  },
  {
    id: 'PED-2024-008',
    fecha: '2024-07-09',
    proveedor: 'Bridgestone de Colombia',
    metodoPago: 'Efectivo',
    items: 2,
    total: '$ 1.240.000',
    estado: 'Por entregar',
    detalle: [
      { tipo: 'producto', nombre: 'Bridgestone Alenza 001', medida: '255/50R19', cantidad: 2, unitario: '$ 620.000', subtotal: '$ 1.240.000' },
    ],
  },
  {
    id: 'PED-2024-014',
    fecha: '2024-06-28',
    proveedor: 'Goodyear Colombia Ltda',
    metodoPago: 'Transferencia',
    items: 6,
    total: '$ 2.980.000',
    estado: 'Entregado',
    detalle: [
      { tipo: 'producto', nombre: 'Goodyear Wrangler AT Silent', medida: '265/65R17', cantidad: 4, unitario: '$ 575.000', subtotal: '$ 2.300.000' },
      { tipo: 'producto', nombre: 'Goodyear EfficientGrip P2', medida: '225/45R17', cantidad: 2, unitario: '$ 340.000', subtotal: '$ 680.000' },
    ],
  },
  {
    id: 'PED-2024-019',
    fecha: '2024-06-15',
    proveedor: 'Michelin Colombia SAS',
    metodoPago: 'Tarjeta',
    items: 1,
    total: '$ 320.000',
    estado: 'Rechazado',
    detalle: [
      { tipo: 'servicio', nombre: 'Reencauche en frío', medida: '295/80R22.5', cantidad: 1, unitario: '$ 320.000', subtotal: '$ 320.000', fichaServicio: { orden: 'REC-004', estado: 'En proceso', paso: 2, taller: 'Taller Vulcanizadora Sur', modalidad: 'Reencauche en frío', garantiaDias: 180, estadoEvidencia: 'Apta', recepcion: '2024-06-15', entrega: '2024-06-25', observaciones: 'Labrado consumido, apta para banda nueva.' } },
    ],
  },
  {
    id: 'PED-2024-023',
    fecha: '2024-06-02',
    proveedor: 'Continental Distribuciones SA',
    metodoPago: 'Consignación',
    items: 4,
    total: '$ 1.560.000',
    estado: 'Entregado',
    detalle: [
      { tipo: 'producto', nombre: 'Continental PremiumContact 7', medida: '215/60R17', cantidad: 2, unitario: '$ 465.000', subtotal: '$ 930.000' },
      { tipo: 'producto', nombre: 'Continental VanContact 100', medida: '235/65R16', cantidad: 2, unitario: '$ 315.000', subtotal: '$ 630.000' },
    ],
  },
  {
    id: 'PED-2024-027',
    fecha: '2024-05-21',
    proveedor: 'Pirelli Colombia',
    metodoPago: 'Efectivo',
    items: 2,
    total: '$ 890.000',
    estado: 'Entregado',
    detalle: [
      { tipo: 'producto', nombre: 'Michelin Pilot Sport 5', medida: '225/40R18', cantidad: 1, unitario: '$ 720.000', subtotal: '$ 720.000' },
      { tipo: 'servicio', nombre: 'Reencauche en frío', medida: '265/70R16', cantidad: 1, unitario: '$ 170.000', subtotal: '$ 170.000', fichaServicio: { orden: 'REC-007', estado: 'Pendiente', paso: 1, taller: 'Taller Vulcanizadora Sur', modalidad: 'Reencauche en frío', garantiaDias: 180, estadoEvidencia: 'Pendiente de revisión', recepcion: '2024-05-21', entrega: '2024-05-30', observaciones: 'A la espera de la revisión del asesor.' } },
    ],
  },
  {
    id: 'PED-2024-031',
    fecha: '2024-05-08',
    proveedor: 'Bridgestone de Colombia',
    metodoPago: 'Transferencia',
    items: 8,
    total: '$ 4.120.000',
    estado: 'Por entregar',
    detalle: [
      { tipo: 'producto', nombre: 'Bridgestone Potenza RE050A', medida: '245/45R18', cantidad: 4, unitario: '$ 610.000', subtotal: '$ 2.440.000' },
      { tipo: 'producto', nombre: 'Bridgestone Turanza T005', medida: '205/55R16', cantidad: 4, unitario: '$ 420.000', subtotal: '$ 1.680.000' },
    ],
  },
  {
    id: 'PED-2024-035',
    fecha: '2024-04-27',
    proveedor: 'Michelin Colombia SAS',
    metodoPago: 'Efectivo',
    items: 2,
    total: '$ 640.000',
    estado: 'Entregado',
    detalle: [
      { tipo: 'producto', nombre: 'Michelin Energy XM2+', medida: '195/65R15', cantidad: 2, unitario: '$ 320.000', subtotal: '$ 640.000' },
    ],
  },
  {
    id: 'PED-2024-040',
    fecha: '2024-04-11',
    proveedor: 'Goodyear Colombia Ltda',
    metodoPago: 'Consignación',
    items: 4,
    total: '$ 1.780.000',
    estado: 'Entregado',
    detalle: [
      { tipo: 'producto', nombre: 'Goodyear KMax D', medida: '295/80R22.5', cantidad: 1, unitario: '$ 1.250.000', subtotal: '$ 1.250.000' },
      { tipo: 'servicio', nombre: 'Reencauche en caliente', medida: '295/80R22.5', cantidad: 3, unitario: '$ 176.667', subtotal: '$ 530.000', fichaServicio: { orden: 'REC-009', estado: 'Completado', paso: 3, taller: 'Taller Vulcanizadora Sur', modalidad: 'Reencauche en caliente', garantiaDias: 240, estadoEvidencia: 'Apta', recepcion: '2024-04-11', entrega: '2024-04-24', observaciones: 'Segunda vida de la carcasa.' } },
    ],
  },
  {
    id: 'PED-2024-044',
    fecha: '2024-03-30',
    proveedor: 'Continental Distribuciones SA',
    metodoPago: 'Tarjeta',
    items: 1,
    total: '$ 415.000',
    estado: 'Entregado',
    detalle: [
      { tipo: 'producto', nombre: 'Continental VanContact 100', medida: '235/65R16', cantidad: 1, unitario: '$ 415.000', subtotal: '$ 415.000' },
    ],
  },
  {
    id: 'PED-2024-049',
    fecha: '2024-03-14',
    proveedor: 'Michelin Colombia SAS',
    metodoPago: 'Transferencia',
    items: 4,
    total: '$ 1.290.000',
    estado: 'Entregado',
    detalle: [
      { tipo: 'producto', nombre: 'Michelin LTX Force', medida: '265/70R16', cantidad: 2, unitario: '$ 520.000', subtotal: '$ 1.040.000' },
      { tipo: 'servicio', nombre: 'Reencauche en frío', medida: '265/70R16', cantidad: 2, unitario: '$ 125.000', subtotal: '$ 250.000', fichaServicio: { orden: 'REC-012', estado: 'Pendiente', paso: 1, taller: 'Taller Vulcanizadora Sur', modalidad: 'Reencauche en frío', garantiaDias: 180, estadoEvidencia: 'No apta', recepcion: '2024-03-14', entrega: '2024-03-26', observaciones: 'Flanco con daño estructural, no reencauchable.' } },
    ],
  },
  {
    id: 'PED-2024-053',
    fecha: '2024-02-26',
    proveedor: 'Pirelli Colombia',
    metodoPago: 'Efectivo',
    items: 2,
    total: '$ 720.000',
    estado: 'Entregado',
    detalle: [
      { tipo: 'producto', nombre: 'Bridgestone Turanza T005', medida: '205/55R16', cantidad: 2, unitario: '$ 360.000', subtotal: '$ 720.000' },
    ],
  },
];

export const clientCreditos = [
  { id: 'CRE-014', pedido: 'PED-2024-002', valor: '$ 775.000', saldo: '$ 575.000', plazoDias: 30, inicio: '2024-07-16', limite: '2024-08-15', estado: 'Al día' },
  { id: 'CRE-011', pedido: 'PED-2024-031', valor: '$ 4.120.000', saldo: '$ 600.000', plazoDias: 60, inicio: '2024-05-08', limite: '2024-07-07', estado: 'Vencido' },
  { id: 'CRE-008', pedido: 'PED-2024-023', valor: '$ 1.560.000', saldo: '$ 0', plazoDias: 30, inicio: '2024-06-02', limite: '2024-07-02', estado: 'Pagado' },
  { id: 'CRE-005', pedido: 'PED-2024-040', valor: '$ 1.780.000', saldo: '$ 0', plazoDias: 45, inicio: '2024-04-11', limite: '2024-05-26', estado: 'Pagado' },
  { id: 'CRE-002', pedido: 'PED-2024-049', valor: '$ 1.290.000', saldo: '$ 0', plazoDias: 30, inicio: '2024-03-14', limite: '2024-04-13', estado: 'Pagado' },
];

export const clientAbonos = [
  { id: 'ABN-021', credito: 'CRE-011', fecha: '2024-06-20', monto: '$ 3.520.000', saldo: '$ 600.000', metodo: 'Transferencia', comprobante: 'TRF-88213', estado: 'Confirmado' },
  { id: 'ABN-017', credito: 'CRE-008', fecha: '2024-06-28', monto: '$ 1.560.000', saldo: '$ 0', metodo: 'Consignación', comprobante: 'CNS-55120', estado: 'Confirmado' },
  { id: 'ABN-012', credito: 'CRE-005', fecha: '2024-05-20', monto: '$ 1.780.000', saldo: '$ 0', metodo: 'Transferencia', comprobante: 'TRF-71904', estado: 'Confirmado' },
  { id: 'ABN-006', credito: 'CRE-002', fecha: '2024-04-10', monto: '$ 1.290.000', saldo: '$ 0', metodo: 'Efectivo', comprobante: 'REC-31022', estado: 'Confirmado' },
  { id: 'ABN-003', credito: 'CRE-014', fecha: '2024-07-30', monto: '$ 200.000', saldo: '$ 575.000', metodo: 'Tarjeta', comprobante: 'TRJ-10455', estado: 'Pendiente' },
];

export const clientEntregas = [
  { id: 'ENT-026', pedido: 'PED-2024-031', direccion: 'Calle 50 #45-12, Medellín', programada: '2024-05-18', entrega: '', estado: 'Pendiente' },
  { id: 'ENT-031', pedido: 'PED-2024-002', direccion: 'Calle 50 #45-12, Medellín', programada: '2024-07-22', entrega: '', estado: 'Pendiente' },
  { id: 'ENT-028', pedido: 'PED-2024-008', direccion: 'Calle 50 #45-12, Medellín', programada: '2024-07-14', entrega: '', estado: 'En camino' },
  { id: 'ENT-024', pedido: 'PED-2024-014', direccion: 'Calle 50 #45-12, Medellín', programada: '2024-07-02', entrega: '2024-07-02', estado: 'Entregado' },
  { id: 'ENT-019', pedido: 'PED-2024-023', direccion: 'Cra 43A #7-50, Medellín', programada: '2024-06-08', entrega: '2024-06-09', estado: 'Entregado' },
  { id: 'ENT-015', pedido: 'PED-2024-027', direccion: 'Calle 50 #45-12, Medellín', programada: '2024-05-27', entrega: '2024-05-27', estado: 'Entregado' },
  { id: 'ENT-011', pedido: 'PED-2024-035', direccion: 'Calle 50 #45-12, Medellín', programada: '2024-05-02', entrega: '', estado: 'Cancelado' },
];

// Reencauches procesados por mes — reemplaza a "Ventas vs Compras" en el
// dashboard del admin.
export const reencauchesPorMes = [
  { month: 'Ene', reencauches: 18 },
  { month: 'Feb', reencauches: 24 },
  { month: 'Mar', reencauches: 21 },
  { month: 'Abr', reencauches: 32 },
  { month: 'May', reencauches: 28 },
  { month: 'Jun', reencauches: 37 },
  { month: 'Jul', reencauches: 41 },
];

// Perfil del administrador en sesión (tabla `usuario`). El modal de perfil
// del topbar edita estos campos.
export const adminProfile = {
  nombre: 'Carlos Mendoza',
  tipoDoc: 'CC',
  numDoc: '79.456.123',
  correo: 'admin@mirallantas.com',
  telefono: '3001112233',
  rol: 'Administrador',
  activo: 'Activo',
  foto: '',
};
