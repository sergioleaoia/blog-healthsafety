import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, ChevronDown, Users, ShieldCheck, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import phoebusImg from "@/assets/phoebus-hero.jpg";
import WhatsAppLeadDialog from "@/components/WhatsAppLeadDialog";

const metrics = [
{ icon: Users, value: "+147mil", label: "Usuários" },
{ icon: ShieldCheck, value: "+20 milhões", label: "Testes realizados" },
{ icon: Timer, value: "5~8s", label: "Por teste" }];

const HeroSection = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center pt-28 md:pt-20 overflow-hidden bg-brand-gray">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6 md:space-y-8">
            
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-heading font-bold tracking-wider uppercase border border-accent/20">
              BAFÔMETRO AUTOMATIZADO 
            </span>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-extrabold leading-[1.1] text-foreground uppercase">
              TESTE DE ALCOOLEMIA AUTOMATIZADO.
              <br className="hidden md:block" />
              <span className="text-gradient">{`\nIDENTIFICAÇÃO, REGISTRO E `}</span>
              <br className="hidden md:block" />
              ALERTA NO WHATSAPP
            </h1>

            <p className="text-muted-foreground max-w-lg font-body leading-relaxed md:text-lg text-base">
              Conheça o Phoebus — <strong>reconhecimento facial, resultado em segundos e registro 100% rastreável.</strong> Solicite agora uma Demonstração Gratuita com um especialista.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-whatsapp hover:bg-whatsapp/90 text-primary-foreground font-heading font-bold text-base gap-2 px-8 h-14 rounded-xl shadow-lg shadow-whatsapp/25" onClick={() => setDialogOpen(true)}>
                <MessageCircle size={20} />
                Falar no WhatsApp
              </Button>
              <Button variant="outline" size="lg" className="font-heading font-bold text-base gap-2 px-8 h-14 rounded-xl border-2 border-primary/20 text-foreground hover:bg-primary/5" onClick={() => document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" })}>
                Ver como funciona
                <ChevronDown size={18} />
              </Button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center lg:justify-end">
            <img
              src={phoebusImg}
              alt="Bafômetro Phoebus — Health & Safety"
              loading="lazy"
              decoding="async"
              className="w-full max-w-xs lg:max-w-sm aspect-[3/4] rounded-2xl shadow-2xl object-cover object-center" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {metrics.map((m) =>
          <div key={m.label} className="flex items-center gap-4 justify-center sm:justify-start bg-background rounded-2xl p-5 shadow-sm border border-border">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <m.icon size={22} className="text-accent" />
              </div>
              <div>
                <p className="font-heading font-extrabold text-xl text-foreground">{m.value}</p>
                <p className="text-sm text-muted-foreground">{m.label}</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
      <WhatsAppLeadDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </section>);
};

export default HeroSection;
