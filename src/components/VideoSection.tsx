import { useState } from "react";
import { motion } from "framer-motion";
import { Play, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsAppLeadDialog from "@/components/WhatsAppLeadDialog";

const YOUTUBE_VIDEO_ID = "3md4Er-nXEA";
const YOUTUBE_THUMBNAIL = `https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/maxresdefault.jpg`;

const VideoSection = () => {
  const [playing, setPlaying] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <section className="section-padding bg-brand-dark" id="video">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16 items-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto w-full max-w-[340px] aspect-[9/16] rounded-2xl overflow-hidden border border-primary-foreground/10 shadow-2xl"
          >
            {!playing ? (
              <button
                onClick={() => setPlaying(true)}
                className="absolute inset-0 flex items-center justify-center group cursor-pointer"
              >
                <img
                  src={YOUTUBE_THUMBNAIL}
                  alt="Phoebus em ação"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="relative z-10 w-20 h-20 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/50 group-hover:scale-110 transition-transform animate-pulse">
                  <Play size={32} className="text-white ml-1" fill="currentColor" />
                </div>
                <p className="absolute bottom-6 text-primary-foreground/70 text-sm font-heading z-10">
                  Clique para assistir
                </p>
              </button>
            ) : (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                title="Phoebus em ação"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
              />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-xs font-heading font-bold tracking-widest uppercase text-accent">
              Veja o Phoebus em Ação
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-primary-foreground leading-tight">
              Chega de teste <span className="relative inline-block"><span className="absolute left-0 right-0 top-1/2 h-[3px] bg-accent rounded-full" /><span className="text-primary-foreground/60">manual</span></span>
            </h2>
            <p className="text-lg text-primary-foreground/70 font-body leading-relaxed max-w-lg">
              25% dos Acidentes de Trabalho envolvem Álcool - Veja como o Phoebus elimina este risco com Testagem Automatizada
            </p>

            <Button
              size="lg"
              className="bg-whatsapp hover:bg-whatsapp/90 text-primary-foreground font-heading font-bold text-lg gap-3 px-10 h-16 rounded-2xl shadow-lg shadow-whatsapp/30 w-full sm:w-auto"
              onClick={() => setDialogOpen(true)}
            >
              <MessageCircle size={22} />
              Conheça o Phoebus
            </Button>
          </motion.div>
        </div>
      </div>
      <WhatsAppLeadDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </section>
  );
};

export default VideoSection;
