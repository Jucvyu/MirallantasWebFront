import { useState } from 'react';
import { ArrowRight, TriangleAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/base/Logo';
import FormModal from '../../components/base/FormModal';
import { BORDER_ERR, BORDER_OK, INPUT } from '../../components/base/formStyles';
import TruckTire from '../../components/base/TruckTire';
import { useSesion } from '../../context/SesionContext';
import { tiposDocumento } from '../../data/mockData';
import SplashScreen from './SplashScreen';

const DEMO_ACCOUNTS = [
  { role: 'Administrador', email: 'admin@mirallantas.com', to: '/admin', nombre: 'Carlos', nota: 'Panel completo' },
  {
    role: 'Cliente con crédito',
    email: 'maria@gmail.com',
    to: '/portal',
    nombre: 'María',
    nota: 'Cartera con un crédito abierto',
  },
  {
    role: 'Cliente sin crédito',
    email: 'lfmora@yahoo.com',
    to: '/portal',
    nombre: 'Luis',
    nota: 'Cupo completo, compra de contado',
  },
];

/** Formato mínimo de correo, para no depender de la validación del navegador. */
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// ---- Registro de un cliente nuevo ---------------------------------------
const registroSections = [
  {
    title: 'Datos personales',
    fields: [
      { key: 'nombre', label: 'Nombre completo', required: true, span: 2 },
      { key: 'tipoDocumento', label: 'Tipo de documento', type: 'select', required: true, options: tiposDocumento },
      { key: 'numeroDocumento', label: 'Número de documento', type: 'number', required: true },
      { key: 'telefono', label: 'Teléfono', type: 'tel', required: true },
      { key: 'direccion', label: 'Dirección' },
    ],
  },
  {
    title: 'Acceso',
    fields: [
      { key: 'correo', label: 'Correo electrónico', type: 'email', required: true, span: 2 },
      { key: 'password', label: 'Contraseña', type: 'password', required: true, placeholder: 'Mínimo 8 caracteres' },
      { key: 'password2', label: 'Repite la contraseña', type: 'password', required: true },
    ],
  },
];

/** Reglas que miran varios campos del registro a la vez. */
function validarRegistro(values) {
  const errores = {};
  if (values.correo && !CORREO_VALIDO.test(values.correo)) {
    errores.correo = 'Escribe un correo válido, por ejemplo nombre@correo.com';
  }
  if (values.password && values.password.length < 8) {
    errores.password = 'La contraseña debe tener al menos 8 caracteres';
  }
  if (values.password2 && values.password !== values.password2) {
    errores.password2 = 'Las contraseñas no coinciden';
  }
  return errores;
}

// ---- Recuperación de contraseña -----------------------------------------
const recuperarSections = [
  {
    title: 'Recuperar el acceso',
    fields: [
      {
        key: 'correo',
        label: 'Correo electrónico',
        type: 'email',
        required: true,
        span: 2,
        placeholder: 'user@mirallantas.com',
        hint: 'Te enviaremos un enlace para crear una contraseña nueva.',
      },
    ],
  },
];

function validarRecuperar(values) {
  if (values.correo && !CORREO_VALIDO.test(values.correo)) {
    return { correo: 'Escribe un correo válido, por ejemplo nombre@correo.com' };
  }
  return {};
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { entrarComo } = useSesion();

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [errores, setErrores] = useState({});
  // Pantalla de carga: guarda a dónde ir cuando termine
  const [entrando, setEntrando] = useState(null);
  const [dialogo, setDialogo] = useState(null);
  const [aviso, setAviso] = useState('');

  /** Validación propia: el navegador no muestra sus globos por defecto. */
  const validar = () => {
    const next = {};
    if (!correo.trim()) next.correo = 'Escribe tu correo electrónico';
    else if (!CORREO_VALIDO.test(correo)) next.correo = 'Escribe un correo válido, por ejemplo nombre@correo.com';
    if (!password) next.password = 'Escribe tu contraseña';
    else if (password.length < 6) next.password = 'La contraseña debe tener al menos 6 caracteres';
    setErrores(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;
    // La cuenta decide el panel; cualquier otra entra como administrador
    const cuenta = DEMO_ACCOUNTS.find((c) => c.email === correo.trim().toLowerCase());
    // El portal trabaja con la cuenta de cliente que se acaba de usar
    entrarComo(correo.trim().toLowerCase());
    setEntrando({ to: cuenta?.to ?? '/admin', nombre: cuenta?.nombre ?? '' });
  };

  if (entrando) {
    return <SplashScreen nombre={entrando.nombre} onFinish={() => navigate(entrando.to)} />;
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Panel de marca */}
      <div className="hidden flex-col justify-between bg-brand-navy-950 p-12 lg:flex">
        <div>
          <Logo size="md" />
          <h1 className="ml-aparece mt-10 max-w-sm text-4xl font-extrabold leading-tight text-white">
            ERP para tu negocio de llantas
          </h1>
          <p className="ml-aparece mt-4 max-w-sm text-slate-400" style={{ animationDelay: '80ms' }}>
            Gestión completa de ventas, pedidos, reencauche, créditos, entregas y más — en una
            sola plataforma.
          </p>
        </div>
        {/* Llantas de camión */}
        <div className="relative mt-10 flex items-end justify-center">
          <TruckTire className="h-40 w-40 shrink-0 drop-shadow-2xl" />
          <TruckTire className="-ml-8 h-52 w-52 shrink-0 drop-shadow-2xl" />
          <TruckTire className="-ml-8 h-40 w-40 shrink-0 drop-shadow-2xl" />
        </div>
      </div>

      {/* Formulario */}
      <div className="flex items-center justify-center bg-white px-6 py-16 dark:bg-brand-navy-900">
        <div className="ml-aparece w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo size="sm" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Iniciar sesión</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Accede a tu cuenta ERP</p>

          {/* Aviso de las acciones secundarias */}
          {aviso && (
            <p className="ml-aparece mt-4 flex items-start gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              {aviso}
            </p>
          )}

          {/* noValidate: los avisos los pinta la app, no el navegador */}
          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <div>
              <label htmlFor="lg-correo" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Correo electrónico <span className="text-red-500">*</span>
              </label>
              <input
                id="lg-correo"
                type="email"
                value={correo}
                onChange={(e) => {
                  setCorreo(e.target.value);
                  setErrores((x) => ({ ...x, correo: undefined }));
                }}
                placeholder="user@mirallantas.com"
                aria-invalid={Boolean(errores.correo)}
                className={`${INPUT} ${errores.correo ? BORDER_ERR : BORDER_OK} mt-1.5 dark:bg-brand-navy-800`}
              />
              {errores.correo && (
                <p className="ml-aparece mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500">
                  <TriangleAlert size={13} className="shrink-0" /> {errores.correo}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="lg-password" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <input
                id="lg-password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrores((x) => ({ ...x, password: undefined }));
                }}
                placeholder="••••••••"
                aria-invalid={Boolean(errores.password)}
                className={`${INPUT} ${errores.password ? BORDER_ERR : BORDER_OK} mt-1.5 dark:bg-brand-navy-800`}
              />
              {errores.password && (
                <p className="ml-aparece mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500">
                  <TriangleAlert size={13} className="shrink-0" /> {errores.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="ml-pulsable flex w-full items-center justify-center gap-2 rounded-lg bg-amber-400 py-2.5 text-sm font-semibold text-slate-900 hover:bg-amber-300"
            >
              Ingresar <ArrowRight size={16} />
            </button>
          </form>

          {/* ---- Acciones secundarias ---- */}
          <div className="mt-4 flex items-center justify-between gap-3 text-xs">
            <button
              type="button"
              onClick={() => setDialogo('recuperar')}
              className="font-semibold text-slate-500 underline-offset-2 hover:text-amber-500 hover:underline dark:text-slate-400"
            >
              ¿Olvidaste tu contraseña?
            </button>
            <button
              type="button"
              onClick={() => setDialogo('registro')}
              className="font-semibold text-amber-600 underline-offset-2 hover:underline dark:text-amber-400"
            >
              Crear una cuenta
            </button>
          </div>

          <div className="mt-6 rounded-xl bg-slate-50 p-4 dark:bg-white/5">
            <p className="mb-3 text-xs font-bold tracking-wide text-slate-500 dark:text-slate-400">
              CUENTAS DE DEMOSTRACIÓN
            </p>
            <div className="space-y-2.5">
              {DEMO_ACCOUNTS.map(({ role, email, to, nombre, nota }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    entrarComo(email);
                    setEntrando({ to, nombre });
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-1 py-1 text-left transition-colors hover:bg-white dark:hover:bg-white/5"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full bg-amber-400" />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-800 dark:text-slate-100">{role}</span>
                    <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                      {email} · 123456
                    </span>
                    <span className="block text-[11px] text-slate-400 dark:text-slate-500">{nota}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---- Registro de una cuenta nueva ---- */}
      {dialogo === 'registro' && (
        <FormModal
          mode="create"
          title="Crear una cuenta"
          subtitle="Regístrate para cotizar desde el portal de clientes."
          sections={registroSections}
          validate={validarRegistro}
          submitLabel="Crear cuenta"
          onSubmit={(values) => setAviso(`Cuenta creada para ${values.correo}. Ya puedes iniciar sesión.`)}
          onClose={() => setDialogo(null)}
        />
      )}

      {/* ---- Recuperación de contraseña ---- */}
      {dialogo === 'recuperar' && (
        <FormModal
          mode="create"
          title="¿Olvidaste tu contraseña?"
          subtitle="Te ayudamos a recuperar el acceso a tu cuenta."
          sections={recuperarSections}
          validate={validarRecuperar}
          size="md"
          submitLabel="Enviar enlace"
          onSubmit={(values) => setAviso(`Enviamos un enlace de recuperación a ${values.correo}.`)}
          onClose={() => setDialogo(null)}
        />
      )}
    </div>
  );
}
