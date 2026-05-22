import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, ShieldCheck, Zap, ClipboardList, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsAppLeadDialog from "@/components/WhatsAppLeadDialog";

const trust = [
  { icon: ShieldCheck, label: "Sem compromisso" },
  { icon: Zap, label: "Resposta em minutos" },
  { icon: ClipboardList, label: "Diagnóstico gratuito" },
];

const CTASection = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <section className="section-padding bg-brand-dark" id="cta">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-accent/20 text-accent text-sm font-heading font-bold mb-8 border border-accent/30">
            <Gift size={16} />
            BÔNUS — Relatório de Conformidade NR para sua operação
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-primary-foreground mb-4">
            Proteja sua operação agora
          </h2>
          <p className="text-lg text-primary-foreground/70 mb-10 font-body">
            Fale com um especialista e receba um diagnóstico gratuito de conformidade com as NRs para a sua operação.
          </p>

          <Button
            size="lg"
            className="bg-whatsapp hover:bg-whatsapp/90 text-primary-foreground font-heading font-bold text-lg gap-3 px-12 h-16 rounded-2xl shadow-lg shadow-whatsapp/30 w-full sm:w-auto"
            onClick={() => setDialogOpen(true)}
          >
            <MessageCircle size={22} />
            Falar com Especialista no WhatsApp
          </Button>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10">
            {trust.map((t) => (
              <div key={t.label} className="flex items-center gap-2 text-primary-foreground/50 text-sm">
                <t.icon size={16} />
                <span>{t.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <WhatsAppLeadDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </section>
  );
};

export default CTASection;
