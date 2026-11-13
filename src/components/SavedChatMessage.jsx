import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faPen,
  faTrashCan,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

const MAX_CARACTERES = 2000;

function formatarHora(valor) {
  if (!valor) return '';

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) return '';

  return data.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Bolha de uma mensagem salva no banco, com edição e exclusão.
// O visual é herdado da página que a utiliza através das classes recebidas.
export default function SavedChatMessage({
  mensagem,
  alinhadaDireita = false,
  classeBalao = '',
  avatar = null,
  onEditar,
  onExcluir,
}) {
  const [editando, setEditando] = useState(false);
  const [texto, setTexto] = useState(mensagem.texto);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  const editada =
    mensagem.updatedAt &&
    mensagem.createdAt &&
    new Date(mensagem.updatedAt).getTime() -
      new Date(mensagem.createdAt).getTime() >
      1000;

  function cancelar() {
    setTexto(mensagem.texto);
    setErro('');
    setEditando(false);
  }

  async function salvar(event) {
    event.preventDefault();

    const limpo = texto.trim();

    if (!limpo) {
      setErro('Escreva uma mensagem antes de salvar.');
      return;
    }

    if (limpo === mensagem.texto) {
      cancelar();
      return;
    }

    setSalvando(true);
    setErro('');

    try {
      await onEditar(mensagem.id, limpo);
      setEditando(false);
    } catch (error) {
      setErro(error.message || 'Não foi possível salvar a edição.');
    } finally {
      setSalvando(false);
    }
  }

  async function excluir() {
    const confirmado = window.confirm(
      'Excluir esta mensagem? Essa ação não pode ser desfeita.',
    );

    if (!confirmado) return;

    setErro('');

    try {
      await onExcluir(mensagem.id);
    } catch (error) {
      setErro(error.message || 'Não foi possível excluir a mensagem.');
    }
  }

  return (
    <div
      className={`flex items-start gap-3 ${alinhadaDireita ? 'justify-end' : ''}`}
    >
      {!alinhadaDireita && avatar}

      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
          alinhadaDireita ? 'rounded-tr-sm' : 'rounded-tl-sm'
        } ${classeBalao}`}
      >
        {editando ? (
          <form onSubmit={salvar} className="space-y-2">
            <textarea
              value={texto}
              onChange={(event) => setTexto(event.target.value)}
              maxLength={MAX_CARACTERES}
              rows={2}
              aria-label="Editar mensagem"
              className="w-full min-w-0 resize-y rounded-xl border border-violet-200 bg-white/70 px-3 py-2 text-sm text-[#50449b] outline-none focus:border-violet-500"
            />

            <div className="flex items-center justify-end gap-3 text-xs font-semibold">
              <button
                type="button"
                onClick={cancelar}
                disabled={salvando}
                className="inline-flex items-center gap-1 opacity-80 transition hover:opacity-100 disabled:opacity-40"
              >
                <FontAwesomeIcon icon={faXmark} />
                Cancelar
              </button>

              <button
                type="submit"
                disabled={salvando}
                className="inline-flex items-center gap-1 rounded-full bg-violet-600 px-3 py-1 text-white transition hover:bg-violet-700 disabled:opacity-60"
              >
                <FontAwesomeIcon icon={faCheck} />
                {salvando ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        ) : (
          <>
            <p className="whitespace-pre-wrap break-words text-sm">
              {mensagem.texto}
            </p>

            <div className="mt-2 flex items-center justify-end gap-2 text-[10px] opacity-70">
              <span>
                {formatarHora(mensagem.createdAt)}
                {editada ? ' · editada' : ''}
              </span>

              <button
                type="button"
                onClick={() => {
                  setTexto(mensagem.texto);
                  setErro('');
                  setEditando(true);
                }}
                aria-label="Editar mensagem"
                title="Editar mensagem"
                className="transition hover:opacity-100"
              >
                <FontAwesomeIcon icon={faPen} />
              </button>

              <button
                type="button"
                onClick={excluir}
                aria-label="Excluir mensagem"
                title="Excluir mensagem"
                className="transition hover:opacity-100"
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            </div>
          </>
        )}

        {erro && (
          <p role="alert" className="mt-1 text-[10px] text-red-600">
            {erro}
          </p>
        )}
      </div>

      {alinhadaDireita && avatar}
    </div>
  );
}
