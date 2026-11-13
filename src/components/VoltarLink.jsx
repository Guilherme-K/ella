import { useLocation, useNavigate } from 'react-router-dom'

// Botão "Voltar" seguro: usa o histórico quando existe uma navegação
// anterior dentro do app e, caso a página tenha sido aberta diretamente
// (link externo, favorito ou nova aba), leva para uma rota conhecida.
export default function VoltarLink({
  to = '/',
  className = '',
  children = '← Voltar',
}) {
  const navigate = useNavigate()
  const location = useLocation()

  function voltar() {
    if (location.key && location.key !== 'default') {
      navigate(-1)
    } else {
      navigate(to, { replace: true })
    }
  }

  return (
    <button type="button" onClick={voltar} className={className}>
      {children}
    </button>
  )
}
