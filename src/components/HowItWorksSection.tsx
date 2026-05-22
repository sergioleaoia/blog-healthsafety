import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Search, Smartphone, User, Wind, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsAppLeadDialog from "@/components/WhatsAppLeadDialog";
import phoebusHeroImg from "@/assets/phoebus-hero.jpg";
import stepAssopraImg from "@/assets/step-assopra.jpg";
import stepRegistroImg from "@/assets/step-registro.jpg";
import stepAlertasImg from "@/assets/step-alertas.jpg";

const steps = [
  {
    icon: User,
    title: "Aproxima-se",
    description: "Colaborador se aproxima do terminal e a câmera ativa o reconhecimento automaticamente",
    image: phoebusHeroImg,
  },
  {
    icon: Search,
    title: "Identificação Automática",
    description: "O sistema identifica a pessoa e solicita o sopro.",
    image: stepAssopraImg,
  },
  {
    icon: Wind,
    title: "Registro Completo",
    description: "O resultado é gravado com foto, data e hora instantaneamente.",
    image: stepRegistroImg,
  },
  {
    icon: Smartphone,
    title: "Alertas Instantâneos",
    description: "Em caso de resultado positivo, o gestor é notificado em tempo real.",
    image: stepAlertasImg,
  },
];

const HowItWorksSection = () => {
  const cardsRef = useRef<HTMLDivElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const scrollCards = (direction: "left" | "right") => {
    const amount = direction === "left" ? -420 : 420;
    cardsRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section id="como-funciona" className="section-padding bg-brand-gray">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-heading font-bold tracking-widest uppercase text-accent mb-3">
          Como Funciona
        </p>

        <h2 className="text-center text-3xl md:text-4xl font-heading font-extrabold text-foreground mb-4">
          Identificado, testado e registrado em segundos.
          <br className="hidden md:block" />
          Sem precisar de ninguém.
        </h2>

        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-heading font-bold uppercase tracking-wider text-accent">
            Arraste pro lado
          </p>

          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollCards("left")}
              aria-label="Ver card anterior"
              className="h-10 w-10 rounded-full border border-border bg-background text-foreground flex items-center justify-center transition-colors hover:bg-secondary"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scrollCards("right")}
              aria-label="Ver próximo card"
              className="h-10 w-10 rounded-full border border-border bg-background text-foreground flex items-center justify-center transition-colors hover:bg-secondary"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={cardsRef}
          className="flex gap-4 lg:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3"
        >
          {steps.map((step, index) => {
            const StepIcon = step.icon;

            return (
              <article
                key={step.title}
                className="min-w-[86%] sm:min-w-[72%] md:min-w-[56%] lg:min-w-[42%] snap-start overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
              >
                <div className="relative h-56 lg:h-64">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute left-4 top-4 rounded-full border border-border bg-background px-3 py-1 text-sm font-heading font-extrabold tracking-wide text-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="p-6">
                  <div className="mb-2 flex items-center gap-2">
                    <StepIcon size={16} className="text-accent" />
                    <h3 className="text-lg font-heading font-bold text-foreground">{step.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Button
            size="lg"
            className="bg-whatsapp hover:bg-whatsapp/90 text-primary-foreground font-heading font-bold text-base gap-3 px-10 h-14 rounded-2xl shadow-lg shadow-whatsapp/30"
            onClick={() => setDialogOpen(true)}
          >
            <Smartphone size={20} />
            Demonstração Gratuita
          </Button>
        </div>
      </div>
      <WhatsAppLeadDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </section>
  );
};

export default HowItWorksSection;
