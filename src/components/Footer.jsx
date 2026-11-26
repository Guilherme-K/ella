import { Link } from 'react-router-dom'
import Brand from './Brand'

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-violet-950 px-5 pt-10 pb-24 text-white sm:px-10 sm:pt-8 sm:pb-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 right-0 -z-10 hidden h-32 w-1/3 -rotate-6 rounded-tl-full bg-linear-to-r from-pink-400 via-fuchsia-400 to-violet-400 sm:block"
      />

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 text-xs sm:grid-cols-2 sm:gap-8 lg:grid-cols-[1.5fr_1fr_1.25fr_1fr] lg:gap-6">
        <div className="min-w-0">
          <div className="mb-4 flex items-center gap-2.5">
            <Brand className="h-9 w-9 shrink-0" />
            <div className="min-w-0">
              <strong className="text-pink-300">ELLA</strong>
              <p className="text-xs text-purple-100">
                Educação, Liberdade, Laços e Assistência
              </p>
            </div>
          </div>
          <p className="max-w-xs leading-relaxed text-purple-50 sm:text-sm">
            Um site de conscientização e apoio no combate à violência contra a
            mulher. Informação, acolhimento, rede de apoio e ferramentas de
            segurança.
          </p>
          <div className="mt-4 flex flex-wrap gap-1 text-base font-bold text-pink-300">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook (abre em nova aba)"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-violet-900 hover:text-pink-100 sm:h-9 sm:w-9"
            >
              <i className="fa-brands fa-facebook" aria-hidden="true" />
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube (abre em nova aba)"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-violet-900 hover:text-pink-100 sm:h-9 sm:w-9"
            >
              <i className="fa-brands fa-youtube" aria-hidden="true" />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram (abre em nova aba)"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-violet-900 hover:text-pink-100 sm:h-9 sm:w-9"
            >
              <i className="fa-brands fa-instagram" aria-hidden="true" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (abre em nova aba)"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-violet-900 hover:text-pink-100 sm:h-9 sm:w-9"
            >
              <i className="fa-brands fa-x-twitter" aria-hidden="true" />
            </a>
          </div>
        </div>

        <nav aria-label="Links úteis" className="min-w-0">
          <h2 className="mb-2 font-semibold">Links úteis</h2>
          <ul className="space-y-1 text-purple-100">
            <li>
              <Link to="/" className="inline-block py-1.5 transition hover:text-pink-200">
                Início
              </Link>
            </li>
            <li>
              <Link to="/sobre" className="inline-block py-1.5 transition hover:text-pink-200">
                Sobre
              </Link>
            </li>
            <li>
              <Link to="/informacoes" className="inline-block py-1.5 transition hover:text-pink-200">
                Informações
              </Link>
            </li>
            <li>
              <Link to="/apoio" className="inline-block py-1.5 transition hover:text-pink-200">
                Rede de Apoio
              </Link>
            </li>
            <li>
              <Link to="/contato" className="inline-block py-1.5 transition hover:text-pink-200">
                Contato
              </Link>
            </li>
            <li>
              <Link to="/voluntaria" className="inline-block py-1.5 transition hover:text-pink-200">
                Voluntariado
              </Link>
            </li>
          </ul>
        </nav>

        <section aria-label="Atendimento" className="min-w-0">
          <h2 className="mb-2 font-semibold">Atendimento</h2>
          <div className="space-y-3 text-purple-100">
            <p className="flex items-start gap-2">
              <i className="fa-solid fa-phone mt-1 shrink-0" aria-hidden="true" />
              <span className="min-w-0">
                <a
                  href="tel:180"
                  className="inline-block py-0.5 transition hover:text-pink-200"
                >
                  Disque 180
                </a>
                <span className="block text-purple-200">
                  Central de Atendimento à Mulher
                </span>
              </span>
            </p>
            <p className="flex items-start gap-2">
              <i className="fa-solid fa-phone mt-1 shrink-0" aria-hidden="true" />
              <span className="min-w-0">
                Polícia Militar
                <span className="block text-purple-200">
                  <a
                    href="tel:190"
                    className="inline-block py-0.5 transition hover:text-pink-200"
                  >
                    190
                  </a>
                </span>
              </span>
            </p>
            <div className="flex flex-wrap gap-x-4 pt-1 text-purple-200">
              <Link
                to="/emergencia"
                className="inline-block py-1.5 transition hover:text-pink-200"
              >
                Emergência
              </Link>
              <Link
                to="/denuncia"
                className="inline-block py-1.5 transition hover:text-pink-200"
              >
                Como denunciar
              </Link>
            </div>
          </div>
        </section>

        <p className="min-w-0 self-start font-serif text-lg italic leading-tight text-pink-200 sm:col-span-2 lg:col-span-1 lg:text-right">
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
