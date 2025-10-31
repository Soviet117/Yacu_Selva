import { UserPlus, UserMinus } from 'lucide-react';

export function BotonesAccion({ onAgregarClick, onDespedirClick }) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <button
        onClick={onAgregarClick}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
      >
        <UserPlus size={20} />
        Agregar Trabajador
      </button>
      <button
        onClick={onDespedirClick}
        className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
      >
        <UserMinus size={20} />
        Despedir Trabajador
      </button>
    </div>
  );
}