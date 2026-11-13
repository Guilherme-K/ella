import { useNavigate } from 'react-router-dom';

export default function BotaoVoltar({ className = '' }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className={`inline-flex items-center gap-1.5 text-sm font-medium text-purple-900 transition hover:text-pink-600 cursor-pointer ${className}`}
      title="Voltar para a página anterior"
    >
      ← Voltar
    </button>
  );
}
