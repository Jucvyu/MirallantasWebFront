# MiraLlantas — Prototipo Frontend (React + Vite + Tailwind)

Prototipo **solo-frontend** de la plataforma ERP MiraLlantas, basado en el diseño de Figma Make.
Incluye **Landing page, Login, Panel Admin y Portal de Cliente**, con soporte completo para
modo **claro** y **oscuro**. Por ahora cubre únicamente la versión **WEB** (Mobile queda para
una siguiente iteración).

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`. El botón sol/luna (arriba a la derecha en cada vista) alterna el tema.

## Mapa de rutas

| Ruta | Vista |
| --- | --- |
| `/` | Landing page (Hero, características, módulos, CTA, footer) |
| `/login` | Inicio de sesión, con acceso directo a las 2 cuentas demo |
| `/admin` | Dashboard General (KPIs, gráficos, últimos pedidos, alertas) |
| `/admin/usuarios` | Usuarios del sistema |
| `/admin/roles` | Roles y permisos |
| `/admin/clientes` | Clientes |
| `/admin/proveedores` | Proveedores |
| `/admin/terceros` | Terceros |
| `/admin/productos` · `/categorias` | Catálogo interno |
| `/admin/pedidos-cotizacion` · `/ordenes-compra` | Operación |
| `/admin/entregas` · `/reencauche` | Operación |
| `/admin/creditos` · `/abonos` | Finanzas |
| `/portal` | Home del cliente (bienvenida, KPIs, accesos rápidos) |
| `/portal/catalogo` | Catálogo de llantas + modal de detalle de producto |
| `/portal/pedidos` | Mis Pedidos-Cotización |
| `/portal/creditos` | Mi Crédito |
| `/portal/abonos` | Mis Abonos (estado vacío) |
| `/portal/entregas` | Mis Entregas |
| `/portal/reencauches` | Mis Reencauches (timeline de estado) |

Desde `/login`, los dos botones bajo **"Cuentas de demostración"** navegan directo a `/admin`
o `/portal` (no hay backend real; es un prototipo de frontend).

## Estructura de carpetas (patrón Features / Base)

```
src/
├── components/
│   ├── base/                    ← Átomos reutilizables en toda la app
│   │   ├── Badge/                 (pastillas de estado: Aprobado, Pendiente, etc.)
│   │   ├── DataTable/             (tabla genérica: búsqueda, paginación, acciones)
│   │   ├── EmptyState/
│   │   ├── Footer/                (footer de marca, claro/oscuro)
│   │   ├── Logo/                  (insignia ML + wordmark)
│   │   ├── Modal/
│   │   ├── PageHeader/            (breadcrumb)
│   │   ├── StatCard/              (tarjeta de KPI)
│   │   ├── ThemeToggle/
│   │   └── TireThumb/             (miniatura ilustrada de producto)
│   └── layout/                  ← Layouts por zona de la app
│       ├── AdminLayout.jsx / AdminSidebar.jsx / AdminTopbar.jsx
│       ├── ClientLayout.jsx / ClientNavbar.jsx
│       └── PublicNavbar.jsx
│
├── features/                    ← Una carpeta por pantalla/dominio
│   ├── landing/                   (Hero, Features, Modules, CTA, LandingPage)
│   ├── auth/                      (LoginPage)
│   ├── admin/
│   │   ├── dashboard/             (DashboardPage con recharts)
│   │   ├── usuarios/ roles/ clientes/ proveedores/ terceros/
│   │   └── generic/               (Productos, Categorías, Pedidos-Cotización,
│   │                                Órd. Compra, Entregas, Reencauche, Créditos, Abonos)
│   └── portal/                    (Home, Catálogo, Pedidos, Créditos, Abonos,
│                                    Entregas, Reencauches del cliente)
│
├── context/
│   └── ThemeContext.jsx         ← Estado global de tema, persistido en localStorage
│
├── data/
│   └── mockData.js              ← Todos los datos de ejemplo (reemplazar por API real)
│
├── App.jsx                      ← Enrutador (react-router-dom)
└── index.css                    ← Tailwind + fuentes
```

## Piezas clave para reutilizar

- **`DataTable`** (`src/components/base/DataTable`): recibe `columns` y `data` y arma automáticamente
  buscador, paginación (8 filas) y columna de acciones. Se usa en casi todas las pantallas de listados
  del Admin. Props útiles: `statusKey` (para pintar un `Badge` en esa columna), `toolbar={false}`
  (oculta Exportar/Nuevo, usado en el portal de cliente) y `readOnly` (oculta editar/eliminar).
- **`StatCard`**: usado tanto en el Dashboard Admin como en el Home del Portal de Cliente.
- **`mockData.js`**: centraliza todos los datos. Para conectar con el backend real (ver la
  arquitectura SOA del proyecto), basta con reemplazar estos arrays por llamadas a los servicios
  REST correspondientes — los componentes ya están hechos para recibir esa forma de datos.

## Paleta de marca

| Token (Tailwind) | Hex | Uso |
| --- | --- | --- |
| `amber.400` | `#FBBF24` | Acento principal: botones, KPIs, enlaces activos |
| `brand.navy.950` | `#0B0E13` | Sidebar admin, secciones oscuras de la landing, fondo modo oscuro |
| `brand.navy.800` | `#161B24` | Tarjetas en modo oscuro |
| `brand.gold.500` | `#C9A876` | Dorado del footer de marca (logo, "Portal de clientes") |
| `brand.whatsapp` / `facebook` / `instagram` | `#00D492` / `#2196F3` / `#EC4899` | Iconos de redes en el footer |

Definidos en `tailwind.config.js` bajo `theme.extend.colors`.

## Notas técnicas

- **Gráficos**: `recharts` (área para Ventas vs Compras, donut para Ventas por Marca). El donut usa
  `isAnimationActive={false}` para evitar un glitch de recharts v3 al capturarlo antes de que
  termine su animación de entrada.
- **Iconos**: `lucide-react` para UI, `react-icons/fa` para los logos exactos de WhatsApp/Facebook/Instagram.
- **Imágenes de producto**: como este es un prototipo sin backend/CDN, el catálogo usa `TireThumb`
  (un placeholder ilustrado con gradiente + icono) en vez de fotos reales. Es trivial reemplazarlo
  por `<img src={...} />` cuando haya URLs reales.
- El **Sidebar del Admin** siempre usa fondo oscuro (aunque el resto de la pantalla esté en modo
  claro), igual que en tus capturas de Figma Make.

## Próximos pasos (Mobile)

Este prototipo cubre únicamente **WEB**. Para Mobile se reutilizarían `ThemeContext`, `mockData.js`
y toda la lógica de cada `feature`, cambiando principalmente los `layout/` (sidebar → menú inferior
o drawer) y los grids a una sola columna.
