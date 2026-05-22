import { motion } from "framer-motion";
import { UserX, FileX, Clock } from "lucide-react";

const problems = [
  {
    icon: UserX,
    title: "Burla do Teste",
    description: "Sem reconhecimento facial, qualquer pessoa pode soprar no lugar de outra. Fraude invisível, risco real.",
  },
  {
    icon: FileX,
    title: "Zero Rastreabilidade",
    description: "Sem registro auditável, sua empresa fica sem defesa jurídica em caso de acidente ou fiscalização.",
  },
  {
    icon: Clock,
    title: "Demora na Resposta",
    description: "Teste positivo às 2h da manhã e ninguém fica sabendo. O risco continua operando silenciosamente.",
  },
];

const ProblemSection = () => {
  return (
    <section className="section-padding bg-background" id="problema">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-heading font-bold tracking-widest uppercase text-destructive mb-4">
            O Problema Real
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-foreground mb-4">
            Sua operação está protegida de verdade?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Processos manuais de teste de alcoolemia deixam brechas que colocam vidas — e sua empresa — em risco.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-destructive/5 rounded-2xl p-8 border border-destructive/10"
            >
              <div className="w-14 h-14 rounded-xl bg-destructive/10 flex items-center justify-center mb-6">
                <p.icon size={26} className="text-destructive" />
              </div>
              <h3 className="font-heading font-bold text-xl text-foreground mb-3">{p.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{p.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
