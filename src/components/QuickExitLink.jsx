import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

import { lerSaidaRapida } from '../constants/saidaRapida';

// Botão de saída rápida: leva ao site escolhido em "Minha área" e usa
// location.replace para não deixar a página da ELLA no histórico do navegador.
export default function QuickExitLink({
  className = '',
  children = 'Saída Rápida',
}) {
  function sair(event) {
    event.preventDefault();
    window.location.replace(lerSaidaRapida());
  }

  return (
    <a
      href={lerSaidaRapida()}
      onClick={sair}
      rel="noopener noreferrer"
      className={className}
    >
      <FontAwesomeIcon icon={faRightFromBracket} className="mr-2" />
      {children}
    </a>
  );
}
