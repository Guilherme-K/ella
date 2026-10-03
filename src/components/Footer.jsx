import Brand from "./Brand";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-[#321653] px-6 py-7 text-white sm:px-10">
      <div className="absolute -bottom-16 right-0 -z-10 h-32 w-[34%] -rotate-6 rounded-tl-[100%] bg-linear-to-r from-pink-400 via-fuchsia-400 to-violet-400" />
      <div className="mx-auto flex max-w-6xl flex-col gap-7 text-[10px] sm:flex-row sm:items-start sm:justify-between">
        <div className="sm:basis-[32%]">
          <div className="mb-4 flex items-center gap-2.5">
            <Brand className="h-9 w-9" />
            <div>
              <strong className="text-pink-300">ELLA</strong>
              <p className="text-[8px] text-purple-100">
                Educação, Liberdade, Laços e Assistência
              </p>
            </div>
          </div>
          <p className="max-w-64 leading-[1.35] text-purple-50">
            Um site de conscientização e apoio
            <br className="hidden sm:block" /> no combate à violência contra a
            mulher.
            <br className="hidden sm:block" /> Informação, acolhimento, rede de
            apoio
            <br className="hidden sm:block" /> e ferramentas de segurança.
          </p>
          <div className="mt-4 flex gap-4 text-base font-bold text-fuchsia-500">
            <a href="#facebook" aria-label="Facebook">
              f
            </a>
            <a href="#youtube" aria-label="YouTube">
              ▶
            </a>
            <a href="#instagram" aria-label="Instagram">
              ◎
            </a>
            <a href="#x" aria-label="X">
              𝕏
            </a>
          </div>
        </div>
        <div className="sm:basis-[15%]">
          <h2 className="mb-2 font-semibold">Links úteis</h2>
          <ul className="space-y-1.5 text-purple-100">
            <li>
              <Link to="/">Início</Link>
            </li>
            <li>
              <Link to="/sobre">Sobre nós</Link>
            </li>
            <li>
              <Link to="/informacoes">Informações</Link>
            </li>
            <li>
              <Link to="/apoio">Rede de apoio</Link>
            </li>
            <li>
              <Link to="/apoio#contato">Contato</Link>
            </li>
          </ul>
        </div>
        <div className="sm:basis-[28%]">
          <h2 className="mb-2 font-semibold">Atendimento</h2>
          <div className="space-y-3 text-purple-100">
            <p>
              <b className="mr-2">☎</b> Disque 180
              <br />
              <span className="pl-6 text-purple-200">
                Central de Atendimento à Mulher
              </span>
            </p>
            <p>
              <b className="mr-2">☎</b> Polícia Militar
              <br />
              <span className="pl-6 text-purple-200">190</span>
            </p>
          </div>
        </div>
        <p className="self-start text-left font-serif text-lg italic leading-tight text-pink-200 sm:basis-[18%] sm:text-right">
          A sua voz
          <br />
          também é proteção
          <br />
          <span className="text-2xl">♡</span>
        </p>
      </div>
    </footer>
  );
}
