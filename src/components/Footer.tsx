import logoWhite from "@/assets/health-safety-logo-white.png";
import { Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
          <div className="flex items-center gap-3">
            <img src={logoWhite} alt="Health & Safety" className="h-14 w-auto" />
            <p className="text-background/40 text-xs">Rua Viscondessa do Livramento, 54 — Recife - PE</p>
          </div>

          <a
            href="https://www.instagram.com/healthsafety.oficial/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-background/40 hover:text-background/70 transition-colors"
            aria-label="Instagram Health Safety"
          >
            <Instagram size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
