import { useState } from "react";
import { motion } from "framer-motion";
import { Quote, Star, UserRound, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsAppLeadDialog from "@/components/WhatsAppLeadDialog";
import tuvLogo from "@/assets/tuv-iso9001.png";
import dotLogo from "@/assets/dot-nhtsa.png";
import logoRumo from "@/assets/logos/rumo.png";
import logoVix from "@/assets/logos/vix.png";
import logoCofco from "@/assets/logos/cofco.webp";


const testimonials = [
  {
    name: "Silmara Dias",
    company: "COFCO International",
    logo: logoCofco,
    quote: "O Phoebus transformou nosso processo de segurança. A identificação facial eliminou completamente as fraudes nos testes de alcoolemia.",
  },
  {
    name: "Antônio",
    company: "VIX",
    logo: logoVix,
    quote: "O alerta em tempo real via WhatsApp nos dá controle total sobre a operação, mesmo de madrugada. Mudou o jogo.",
  },
  {
    name: "Thaciane Cardoso",
    company: "Rumo Logística",
    logo: logoRumo,
    quote: "Com o registro auditável do Phoebus, ganhamos confiança total em auditorias e conformidade com as NRs.",
  },
];

const SocialProofSection = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <section id="prova-social">
      {/* Testimonials */}
      <div className="section-padding bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-heading font-bold tracking-widest uppercase text-accent mb-4">
              Quem usa, aprova
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
              Depoimentos de quem está na operação
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-secondary rounded-2xl p-6 border border-border relative flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <UserRound size={20} className="text-accent" />
                  </div>
                  <Quote size={20} className="text-accent/20" />
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6 text-sm flex-1">"{t.quote}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-heading font-bold text-foreground text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.company}</p>
                  </div>
                  {t.logo && (
                    <img src={t.logo} alt={t.company} className="h-6 w-auto object-contain opacity-50" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button
              size="lg"
              className="bg-whatsapp hover:bg-whatsapp/90 text-white font-heading font-bold text-base px-8 py-6 rounded-full"
              onClick={() => setDialogOpen(true)}
            >
              <MessageCircle className="mr-2" size={20} />
              Falar no WhatsApp
            </Button>
          </div>
        </div>
      </div>




      {/* Certifications */}
      <div className="section-padding bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={24} className="text-yellow-500 fill-yellow-500" />
              ))}
            </div>
            <h3 className="text-2xl md:text-3xl font-heading font-extrabold text-foreground mb-4">
              Qualidade e Confiabilidade Certificadas
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Os Bafômetros Health Safety são certificados pela ISO 9001 da TÜV Nord e aprovados pelo DOT/NHTSA, garantindo os mais altos padrões de qualidade e segurança para a sua empresa.
            </p>
            <div className="flex justify-center items-center gap-10 mb-10">
              <img src={tuvLogo} alt="TÜV Nord ISO 9001" className="h-20 md:h-24 object-contain" />
              <img src={dotLogo} alt="DOT / NHTSA" className="h-20 md:h-24 object-contain" />
            </div>
            <Button
              size="lg"
              className="bg-whatsapp hover:bg-whatsapp/90 text-white font-heading font-bold text-base px-8 py-6 rounded-full"
              onClick={() => setDialogOpen(true)}
            >
              <MessageCircle className="mr-2" size={20} />
              Falar no WhatsApp
            </Button>
          </div>
        </div>
      </div>

      <WhatsAppLeadDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </section>
  );
};

export default SocialProofSection;
