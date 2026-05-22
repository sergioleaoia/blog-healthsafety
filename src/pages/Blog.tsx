import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  X,
  CheckCircle,
  ShieldCheck,
  Timer,
  MessageCircle,
  Wine,
  HardHat,
  ScrollText,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import BlogHeader from "@/components/BlogHeader";
import BlogFooter from "@/components/BlogFooter";
import { posts, ALL_TOPICS, type PostTopic } from "@/lib/posts";

// TODO: substituir pelo webhook real (Make/n8n) quando o endpoint da newsletter estiver pronto.
const WEBHOOK_URL = "";

const WHATSAPP_URL =
  "https://api.whatsapp.com/send?phone=5581981771177&text=Ol%C3%A1%2C%20vim%20do%20blog%20Health%20Safety%20e%20quero%20conhecer%20o%20Phoebus";

const TOPIC_ICONS: Record<PostTopic, typeof Wine> = {
  "Álcool no Trabalho": Wine,
  "Segurança Operacional": HardHat,
  "NRs e Conformidade": ScrollText,
};

function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_content: params.get("utm_content") || "",
    utm_term: params.get("utm_term") || "",
  };
}

/* ── Thank You Modal ── */
function ThankYouModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/70 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="relative bg-background rounded-2xl p-8 max-w-md w-full text-center border border-border shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-7 h-7 text-accent" />
        </div>

        <h3 className="font-heading text-2xl font-extrabold text-foreground mb-2 uppercase tracking-tight">
          Cadastro confirmado
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          Toda semana você recebe conteúdo prático sobre bafômetro, alcoolemia e segurança
          operacional — direto no seu email.
        </p>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 font-heading font-bold transition-colors"
        >
          <MessageCircle size={16} />
          Quer conhecer o Phoebus? Falar no WhatsApp
          <ArrowUpRight size={14} />
        </a>
      </motion.div>
    </div>
  );
}

/* ── Card Cover (no-photo posts) ── */
function PostCover({ post }: { post: (typeof posts)[number] }) {
  const Icon = TOPIC_ICONS[post.topic] ?? Wine;

  return (
    <div className="relative aspect-[16/10] overflow-hidden bg-brand-dark">
      {/* Brand gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--brand-dark)) 0%, hsl(212 78% 16%) 40%, hsl(211 76% 41%) 100%)",
        }}
      />
      {/* Subtle measurement grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Faded watermark icon */}
      <Icon
        className="absolute -right-6 -bottom-6 text-background/[0.10]"
        size={210}
        strokeWidth={1.1}
      />

      {/* Top bar: number badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-background/95 text-foreground text-xs font-heading font-extrabold tracking-wide">
          {post.number}
        </span>
      </div>

      {/* Top right: small "BLOG" stamp */}
      <div className="absolute top-4 right-4 z-10">
        <span className="text-[10px] font-heading font-bold tracking-[0.2em] uppercase text-background/50">
          Health Safety
        </span>
      </div>

      {/* Bottom area: topic name */}
      <div className="absolute bottom-5 left-5 right-5 z-10 flex items-end justify-between gap-3">
        <span className="font-heading font-extrabold uppercase tracking-tight text-background leading-tight text-lg sm:text-xl max-w-[80%]">
          {post.topic}
        </span>
        <Icon size={28} className="text-background/80 shrink-0" />
      </div>
    </div>
  );
}

const Blog = () => {
  const [email, setEmail] = useState("");
  const [activeTopic, setActiveTopic] = useState<PostTopic | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submitNewsletterToWebhook = async (emailValue: string) => {
    if (!WEBHOOK_URL) return; // placeholder mode
    const utms = getUtmParams();
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailValue,
        source: "blog-healthsafety",
        ...utms,
      }),
    });
    if (!response.ok) throw new Error(`Webhook retornou status ${response.status}`);
  };

  const hasHoneypotValue = (form: HTMLFormElement) => {
    const honeypot = new FormData(form).get("website");
    return typeof honeypot === "string" && honeypot.trim().length > 0;
  };

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    if (hasHoneypotValue(e.currentTarget)) return;
    setSubmitting(true);
    try {
      await submitNewsletterToWebhook(email);
      setEmail("");
      setShowThankYou(true);
    } catch (err) {
      console.error("Webhook error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPosts = activeTopic
    ? posts.filter((p) => p.topic === activeTopic)
    : posts;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BlogHeader />
      <ThankYouModal open={showThankYou} onClose={() => setShowThankYou(false)} />

      {/* ── HERO — light bg, refined HS look ── */}
      <section className="relative pt-28 md:pt-32 pb-14 md:pb-16 overflow-hidden bg-[#DCE6F2]">
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(var(--brand-dark)) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Soft accent glow */}
        <div className="absolute -top-32 right-1/4 w-[420px] h-[420px] rounded-full bg-accent/15 blur-[140px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-[10px] font-heading font-bold tracking-[0.2em] uppercase border border-accent/30 mb-6">
              Blog · Health Safety
            </span>

            <h1 className="font-heading font-extrabold leading-[1.1] tracking-tight text-foreground uppercase text-[clamp(1.5rem,3.6vw,2.25rem)] mb-5">
              Bafômetro, alcoolemia <span className="text-gradient">e segurança no trabalho.</span>
            </h1>

            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto mb-7">
              Conteúdo prático toda semana para quem responde por vidas na operação.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto"
            >
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] opacity-0 pointer-events-none"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="flex-1 px-4 h-11 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all font-body"
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-5 h-11 bg-foreground hover:bg-brand-dark disabled:opacity-60 text-background text-sm font-heading font-bold rounded-lg transition-colors inline-flex items-center justify-center gap-2 group whitespace-nowrap uppercase tracking-wide"
              >
                {submitting ? "Enviando..." : (
                  <>
                    Inscreva-me
                    <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
            <p className="text-[11px] text-muted-foreground/70 mt-3">
              Gratuita. Sem spam.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── ARTICLES ── */}
      <section className="bg-background section-padding pt-16 md:pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-12">
            <div>
              <p className="text-xs font-heading font-bold tracking-[0.25em] uppercase text-accent mb-3">
                Edições recentes
              </p>
              <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-foreground leading-tight max-w-xl">
                O que sua operação precisa saber esta semana
              </h2>
            </div>

            {/* Topic filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTopic(null)}
                className={`px-4 py-2 rounded-full text-xs font-heading font-bold tracking-wide transition-all uppercase ${
                  activeTopic === null
                    ? "bg-foreground text-background"
                    : "bg-secondary text-muted-foreground hover:bg-accent/10 hover:text-accent border border-border"
                }`}
              >
                Todos
              </button>
              {ALL_TOPICS.map((topic) => {
                const Icon = TOPIC_ICONS[topic];
                return (
                  <button
                    key={topic}
                    onClick={() => setActiveTopic(activeTopic === topic ? null : topic)}
                    className={`px-4 py-2 rounded-full text-xs font-heading font-bold tracking-wide transition-all inline-flex items-center gap-1.5 uppercase ${
                      activeTopic === topic
                        ? "bg-foreground text-background"
                        : "bg-secondary text-muted-foreground hover:bg-accent/10 hover:text-accent border border-border"
                    }`}
                  >
                    <Icon size={13} />
                    {topic}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Posts grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
            {filteredPosts.map((post, index) => {
              const Icon = TOPIC_ICONS[post.topic];
              return (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: (index % 3) * 0.08 }}
                >
                  <Link
                    to={`/${post.slug}`}
                    className="group block bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <PostCover post={post} />

                    <div className="p-6">
                      <div className="flex items-center justify-between gap-2 mb-3 text-[11px] font-medium">
                        <span className="inline-flex items-center gap-1.5 text-accent">
                          <Icon size={13} />
                          {post.topic}
                        </span>
                        <span className="text-muted-foreground/70">
                          {post.date} · {post.readTime}
                        </span>
                      </div>

                      <h3 className="font-heading font-extrabold text-foreground text-[17px] leading-snug mb-2.5 group-hover:text-accent transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {post.subtitle}
                      </p>

                      <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-wider text-foreground group-hover:text-accent transition-colors">
                        Ler artigo
                        <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-20 text-muted-foreground text-sm">
              Nenhum artigo nesta categoria — em breve.
            </div>
          )}
        </div>
      </section>

      {/* ── BOTTOM CTA — HS DNA dark section ── */}
      <section className="section-padding bg-brand-dark relative overflow-hidden">
        {/* Subtle measurement grid */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[420px] bg-accent/[0.10] rounded-full blur-[140px] pointer-events-none" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Left: newsletter recap */}
            <div className="md:border-r md:border-background/10 md:pr-12">
              <p className="text-[11px] font-heading font-bold tracking-[0.2em] uppercase text-accent mb-4">
                Newsletter
              </p>
              <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-background uppercase leading-tight tracking-tight mb-3">
                Receba a próxima edição
              </h2>
              <p className="text-sm text-background/60 mb-6 leading-relaxed">
                Bafômetro, NRs, política antiálcool e gestão de riscos — toda semana, sem
                enrolação.
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] opacity-0 pointer-events-none"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full px-4 h-12 bg-background/[0.04] border border-background/15 rounded-xl text-sm text-background placeholder:text-background/40 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-12 bg-accent hover:bg-accent/90 disabled:opacity-60 text-background text-sm font-heading font-bold rounded-xl transition-colors uppercase tracking-wide"
                >
                  {submitting ? "Enviando..." : "Inscrever-me"}
                </button>
              </form>
            </div>

            {/* Right: WhatsApp / Phoebus */}
            <div className="md:pl-4">
              <p className="text-[11px] font-heading font-bold tracking-[0.2em] uppercase text-accent mb-4">
                Quer o Phoebus na sua operação?
              </p>
              <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-background uppercase leading-tight tracking-tight mb-3">
                Fale com um especialista
              </h2>
              <p className="text-sm text-background/60 mb-6 leading-relaxed">
                Bafômetro com reconhecimento facial, alerta em tempo real e cadeia de
                custódia auditável. Diagnóstico gratuito de conformidade NR.
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-whatsapp hover:bg-whatsapp/90 text-primary-foreground text-sm font-heading font-bold rounded-xl transition-colors shadow-lg shadow-whatsapp/20 w-full sm:w-auto"
              >
                <MessageCircle size={18} />
                Falar no WhatsApp
              </a>
              <div className="flex items-center gap-5 mt-6 text-[11px] text-background/40">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-accent/80" />
                  Sem compromisso
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Timer size={13} className="text-accent/80" />
                  Resposta em minutos
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BlogFooter />
    </div>
  );
};

export default Blog;
