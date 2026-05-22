import { useState, useEffect } from "react";
import { Menu, X, MessageCircle, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoColor from "@/assets/health-safety-logo-color.png";
import WhatsAppLeadDialog from "@/components/WhatsAppLeadDialog";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto max-w-6xl relative flex items-center justify-center md:justify-between h-16 md:h-20 px-4 sm:px-6 lg:px-8 mb-3 md:mb-0">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center">
          <img src={logoColor} alt="Health & Safety" className="h-10 md:h-12 w-auto" />
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: "Como funciona", id: "como-funciona" },
            { label: "Veja em Ação", id: "video", icon: true },
            { label: "Depoimentos", id: "prova-social" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              {"icon" in item && <Video size={14} />}
              {item.label}
            </button>
          ))}
          <Button className="bg-whatsapp hover:bg-whatsapp/90 text-primary-foreground font-heading font-bold text-sm gap-2" onClick={() => setDialogOpen(true)}>
            <MessageCircle size={16} />
            Falar no WhatsApp
          </Button>
        </nav>

        <button className="md:hidden absolute right-4 text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-background border-t border-border px-4 pb-4 space-y-3">
          {[
            { label: "Como funciona", id: "como-funciona" },
            { label: "Veja em Ação", id: "video", icon: true },
            { label: "Depoimentos", id: "prova-social" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="block w-full text-left py-2 text-sm font-medium text-muted-foreground"
            >
              {item.label}
            </button>
          ))}
          <Button className="w-full bg-whatsapp hover:bg-whatsapp/90 text-primary-foreground font-heading font-bold gap-2" onClick={() => { setMenuOpen(false); setDialogOpen(true); }}>
            <MessageCircle size={16} />
            Falar no WhatsApp
          </Button>
        </div>
      )}

      <WhatsAppLeadDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </header>
  );
};

export default Header;
