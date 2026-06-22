import { Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import logoWhite from "@/assets/health-safety-logo-white.png";

const BlogFooter = () => {
  return (
    <footer className="bg-foreground py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          <div className="flex flex-col gap-4">
            <img
              src={logoWhite}
              alt="Health & Safety"
              className="h-16 w-auto object-contain self-start"
            />
            <p className="text-background/40 text-xs leading-relaxed">
              Rua Viscondessa do Livramento, 54
              <br />
              Recife — PE
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <p className="text-background/30 text-[11px] font-heading font-bold tracking-[0.2em] uppercase">
              Blog
            </p>
            <Link
              to="/"
              className="text-background/60 hover:text-background transition-colors"
            >
              Todos os artigos
            </Link>
            <a
              href="https://contatos.healthsafety.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-background/60 hover:text-background transition-colors"
            >
              Conhecer o Phoebus
            </a>
          </div>

          <div className="flex flex-col gap-3 text-sm md:items-end">
            <p className="text-background/30 text-[11px] font-heading font-bold tracking-[0.2em] uppercase">
              Conectar
            </p>
            <a
              href="https://www.instagram.com/healthsafety.oficial/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-background/60 hover:text-background transition-colors inline-flex items-center gap-2"
              aria-label="Instagram Health Safety"
            >
              <Instagram size={18} />
              @healthsafety.oficial
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-background/30 text-xs">
            © {new Date().getFullYear()} Health & Safety. Todos os direitos reservados.
          </p>
          <p className="text-background/20 text-[10px] tracking-[0.2em] uppercase font-mono">
            ISO 9001 · DOT/NHTSA
          </p>
        </div>
      </div>
    </footer>
  );
};

export default BlogFooter;
