import { Disc3 } from 'lucide-react';

const BRAND_GRADIENTS = {
  Michelin: 'from-blue-900 to-slate-900',
  Bridgestone: 'from-red-900 to-slate-900',
  Goodyear: 'from-amber-800 to-slate-900',
  Continental: 'from-emerald-900 to-slate-900',
};

export default function TireThumb({ brand, badge, className = '' }) {
  const gradient = BRAND_GRADIENTS[brand] ?? 'from-slate-700 to-slate-900';
  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${gradient} ${className}`}>
      <Disc3 size={48} strokeWidth={1} className="text-white/25" />
      {badge && (
        <span className="absolute right-2 top-2 rounded-md bg-black/60 px-2 py-1 text-[10px] font-bold tracking-wide text-white">
          {badge}
        </span>
      )}
    </div>
  );
}
