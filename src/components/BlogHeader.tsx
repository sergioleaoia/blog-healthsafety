import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logoColor from "@/assets/health-safety-logo-color.png";

interface BlogHeaderProps {
  variant?: "transparent" | "solid";
}

const BlogHeader = ({ variant = "transparent" }: BlogHeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isPostPage = location.pathname !== "/";
  const transparentMode = variant === "transparent" && !scrolled && !isPostPage;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        !transparentMode
          ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto max-w-6xl flex items-center justify-between h-16 md:h-20 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 group" aria-label="Health Safety Blog">
          <img src={logoColor} alt="Health & Safety" className="h-9 md:h-11 w-auto" />
          <span className="hidden sm:inline-block text-[11px] font-heading font-bold tracking-[0.25em] uppercase pl-3 border-l text-muted-foreground border-border">
            Blog
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Artigos
          </Link>
          <a
            href="https://contatos.healthsafety.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Conhecer o Phoebus
          </a>
        </nav>

        <button
          className="md:hidden p-1 text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-background border-t border-border px-4 py-4 space-y-3">
          <Link
            to="/"
            className="block py-2 text-sm font-medium text-muted-foreground"
            onClick={() => setMenuOpen(false)}
          >
            Artigos
          </Link>
          <a
            href="https://contatos.healthsafety.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="block py-2 text-sm font-medium text-muted-foreground"
            onClick={() => setMenuOpen(false)}
          >
            Conhecer o Phoebus
          </a>
        </div>
      )}
    </header>
  );
};

export default BlogHeader;
