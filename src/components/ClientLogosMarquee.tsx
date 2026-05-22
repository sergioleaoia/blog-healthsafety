import logoRumo from "@/assets/logos/rumo.png";
import logoVix from "@/assets/logos/vix.png";
import logoEurochem from "@/assets/logos/eurochem.png";
import logoGuanabara from "@/assets/logos/guanabara.png";
import logoGerdau from "@/assets/logos/gerdau.png";
import logoVotorantim from "@/assets/logos/votorantim.png";
import logoMineracaoCaraiba from "@/assets/logos/mineracao-caraiba.png";

const clientLogos = [
{ src: logoRumo, alt: "Rumo", scale: "" },
{ src: logoVix, alt: "Vix", scale: "" },
{ src: logoEurochem, alt: "EuroChem", scale: "scale-[2]" },
{ src: logoGuanabara, alt: "Guanabara", scale: "scale-[2]" },
{ src: logoGerdau, alt: "Gerdau", scale: "scale-[0.7]" },
{ src: logoVotorantim, alt: "Votorantim Cimentos", scale: "scale-[0.7]" },
{ src: logoMineracaoCaraiba, alt: "Mineração Caraíba", scale: "scale-[0.5]" }];


const ClientLogosMarquee = () => {
  return (
    <section className="py-12 bg-brand-gray overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
        <p className="text-xs font-heading font-bold tracking-widest uppercase text-muted-foreground">
          Empresas que confiam na Health e Safety  
        </p>
      </div>

      <div className="relative w-full overflow-hidden">
        <div className="flex animate-marquee-slow w-max">
          {[...clientLogos, ...clientLogos].map((logo, index) =>
          <div
            key={`${logo.alt}-${index}`}
            className="flex items-center justify-center mx-14 md:mx-20 shrink-0">
            
              <img
              src={logo.src}
              alt={logo.alt}
              className={`h-10 md:h-14 w-auto object-contain opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 ${
              logo.scale || ""}`
              } />
            
            </div>
          )}
        </div>
      </div>
    </section>);

};

export default ClientLogosMarquee;