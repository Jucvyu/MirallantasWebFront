import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PedidoPanel from './PedidoPanel';

export default function NuevoPedidoPage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
          aria-label="Volver"
        >
          <ArrowLeft size={17} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">Nuevo pedido-cotización</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Revisa los productos que agregaste y añade los servicios que necesites
          </p>
        </div>
      </div>

      <div className="mt-6">
        <PedidoPanel />
      </div>
    </div>
  );
}
