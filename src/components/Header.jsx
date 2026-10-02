import { Link } from "react-router-dom";
import Brand from "./Brand";

export default function Header() {
  return (
    <header className="relative z-20 mx-auto flex h-10.5 w-full items-center rounded-b-xl bg-white px-4 shadow-sm sm:px-5">
      <Link
        to="/"
        className="flex shrink-0 items-center gap-3 text-xs text-pink-500"
        aria-label="ELLA — início"
      >
        <span aria-hidden="true" className="text-base leading-none text-black">
          ←
        </span>
        <Brand className="h-8 w-8" />
        <span>ELLA</span>
      </Link>
      <nav
        className="hidden flex-1 items-center justify-center gap-7 text-[10px] text-pink-500 sm:flex"
        aria-label="Navegação principal"
      >
        <a href="#inicio">Início</a>
        <a href="#sobre">Sobre</a>
        <a href="#informacoes">Informações</a>
        <a href="#apoio">Rede de Apoio</a>
      </nav>
      <Link
        to="/cadastro"
        className="rounded-full bg-pink-400 px-4 py-1 text-[9px] text-white transition hover:bg-pink-500"
      >
        Cadastre-se
      </Link>
    </header>
  );
}
