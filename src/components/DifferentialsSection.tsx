import { motion } from "framer-motion";
import { ShieldCheck, Smartphone, Link, Wrench } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Reconhecimento Facial Anti-Fraude",
    description: "Biometria facial impede que outro colaborador realize o teste no lugar.",
  },
  {
    icon: Smartphone,
    title: "Alertas WhatsApp em Tempo Real",
    description: "Gestor recebe notificação instantânea em caso de teste positivo ou recusa.",
  },
  {
    icon: Link,
    title: "Integração via API",
    description: "Compatível com SAP, Senior, Dimep e outros sistemas de gestão.",
  },
  {
    icon: Wrench,
    title: "Calibração por Módulo Substituível",
    description: "Troca rápida do módulo sensor — sem enviar o equipamento para calibração externa.",
  },
];

const specs = [
  { label: "Sensor", value: "Célula de Combustível" },
  { label: "Resultado", value: "< 10 segundos" },
  { label: "Memória", value: "20.000 registros" },
  { label: "Faces cadastradas", value: "15.000" },
  { label: "Conectividade", value: "Wi-Fi / Ethernet / 4G" },
  { label: "Certificações", value: "ISO 9001 · DOT/NHTSA" },
  { label: "Calibração", value: "Módulo substituível" },
];

const DifferentialsSection = () => {
  return (
    <section className="section-padding bg-brand-gray" id="diferenciais">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-heading font-bold tracking-widest uppercase text-accent mb-4">
            Diferenciais Técnicos
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-foreground">
            Tecnologia que não deixa brechas
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Feature cards */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-background rounded-2xl p-6 shadow-sm border border-border"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <f.icon size={22} className="text-accent" />
                </div>
                <h3 className="font-heading font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Specs table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-background rounded-2xl shadow-sm border border-border overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-border">
              <h3 className="font-heading font-bold text-foreground text-lg">Especificações Técnicas</h3>
            </div>
            <div className="divide-y divide-border">
              {specs.map((s) => (
                <div key={s.label} className="flex justify-between items-center px-6 py-4">
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                  <span className="text-sm font-heading font-bold text-foreground">{s.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DifferentialsSection;
