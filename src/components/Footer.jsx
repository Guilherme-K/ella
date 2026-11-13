import { Link } from 'react-router-dom'
import Brand from './Brand'

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-violet-950 px-6 py-7 text-white sm:px-10">
      <div className="absolute -bottom-16 right-0 -z-10 h-32 w-1/3 -rotate-6 rounded-tl-full bg-linear-to-r from-pink-400 via-fuchsia-400 to-violet-400" />
      <div className="mx-auto flex max-w-6xl flex-col gap-7 text-xs sm:flex-row sm:items-start sm:justify-between">
        <div className="sm:basis-1/3">
          <div className="mb-4 flex items-center gap-2.5">
            <Brand className="h-9 w-9" />
            <div>
              <strong className="text-pink-300">ELLA</strong>
              <p className="text-xs text-purple-100">
                Educação, Liberdade, Laços e Assistência
              </p>
            </div>
          </div>
          <p className="max-w-64 leading-relaxed text-purple-50">
            Um site de conscientização e apoio
            <br className="hidden sm:block" /> no combate à violência contra a
            mulher.
            <br className="hidden sm:block" /> Informação, acolhimento, rede de
            apoio
            <br className="hidden sm:block" /> e ferramentas de segurança.
          </p>
          <div className="mt-4 flex gap-1 text-base font-bold text-pink-300">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook (abre em nova aba)"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-violet-900 hover:text-pink-100"
            >
              <i className="fa-brands fa-facebook" aria-hidden="true" />
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube (abre em nova aba)"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-violet-900 hover:text-pink-100"
            >
              <i className="fa-brands fa-youtube" aria-hidden="true" />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram (abre em nova aba)"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-violet-900 hover:text-pink-100"
            >
              <i className="fa-brands fa-instagram" aria-hidden="true" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (abre em nova aba)"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-violet-900 hover:text-pink-100"
            >
              <i className="fa-brands fa-x-twitter" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="sm:basis-1/6">
          <h2 className="mb-2 font-semibold">Links úteis</h2>
          <ul className="space-y-1 text-purple-100">
            <li>
              <Link to="/" className="inline-block py-1 transition hover:text-pink-200">
                Início
              </Link>
            </li>
            <li>
              <Link to="/sobre" className="inline-block py-1 transition hover:text-pink-200">
                Sobre
              </Link>
            </li>
            <li>
              <Link to="/informacoes" className="inline-block py-1 transition hover:text-pink-200">
                Informações
              </Link>
            </li>
            <li>
              <Link to="/apoio" className="inline-block py-1 transition hover:text-pink-200">
                Rede de Apoio
              </Link>
            </li>
            <li>
              <Link to="/contato" className="inline-block py-1 transition hover:text-pink-200">
                Contato
              </Link>
            </li>
            <li>
              <Link to="/voluntaria" className="inline-block py-1 transition hover:text-pink-200">
                Voluntariado
              </Link>
            </li>
          </ul>
        </div>

        <div className="sm:basis-1/4">
          <h2 className="mb-2 font-semibold">Atendimento</h2>
          <div className="space-y-3 text-purple-100">
            <p>
              <i className="fa-solid fa-phone mr-2" aria-hidden="true" />
              <a
                href="tel:180"
                className="-mx-1 inline-block px-1 py-1 transition hover:text-pink-200"
              >
                Disque 180
              </a>
              <br />
              <span className="pl-6 text-purple-200">
                Central de Atendimento à Mulher
              </span>
            </p>
            <p>
              <i className="fa-solid fa-phone mr-2" aria-hidden="true" />
              Polícia Militar
              <br />
              <span className="pl-6 text-purple-200">
                <a
                  href="tel:190"
                  className="-mx-1 inline-block px-1 py-1 transition hover:text-pink-200"
                >
                  190
                </a>
              </span>
            </p>
            <div className="flex flex-wrap gap-x-3 pt-1 text-purple-200">
              <Link
                to="/emergencia"
                className="inline-block py-1 transition hover:text-pink-200"
              >
                Emergência
              </Link>
              <Link
                to="/denuncia"
                className="inline-block py-1 transition hover:text-pink-200"
              >
                Como denunciar
              </Link>
            </div>
          </div>
        </div>

        <p className="self-start text-left font-serif text-lg italic leading-tight text-pink-200 sm:basis-1/5 sm:text-right">
          A sua voz
          <br />
          também é proteção
          <br />
          <i className="fa-regular fa-heart text-2xl" aria-hidden="true" />
        </p>
      </div>
    </footer>
  )
}
