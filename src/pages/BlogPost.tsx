import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar,
  Share2,
  Linkedin,
  ChevronUp,
  Wine,
  HardHat,
  ScrollText,
  MessageCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import BlogHeader from "@/components/BlogHeader";
import BlogFooter from "@/components/BlogFooter";
import { getPostBySlug, posts, type BlogPost as BlogPostType, type PostTopic } from "@/lib/posts";

const SITE_URL = "https://blog.healthsafety.com.br";
const OG_IMAGE = `${SITE_URL}/og-image.png`;
const WHATSAPP_URL =
  "https://api.whatsapp.com/send?phone=5581981771177&text=Ol%C3%A1%2C%20vim%20do%20blog%20Health%20Safety%20e%20quero%20conhecer%20o%20Phoebus";

const URL_REGEX = /(?:https?:\/\/|www\.)[^\s)]+/gi;
const MD_LINK_REGEX = /\[([^\]]+)\]\(([^)]+)\)/g;
const BOLD_REGEX = /\*\*([^*]+)\*\*/g;
const LINK_CLASS =
  "text-accent underline decoration-accent/50 underline-offset-2 hover:text-accent/80 transition-colors break-words";

const TOPIC_ICONS: Record<PostTopic, typeof Wine> = {
  "Álcool no Trabalho": Wine,
  "Segurança Operacional": HardHat,
  "NRs e Conformidade": ScrollText,
};

/* Inline: raw URLs (https:// or www.) → links */
function renderUrls(text: string, keyPrefix: string): Array<string | JSX.Element> {
  const nodes: Array<string | JSX.Element> = [];
  let lastIndex = 0;
  URL_REGEX.lastIndex = 0;

  for (const match of text.matchAll(URL_REGEX)) {
    const rawUrl = match[0];
    const start = match.index ?? 0;

    if (start > lastIndex) nodes.push(text.slice(lastIndex, start));

    let cleanUrl = rawUrl;
    let trailing = "";
    while (/[.,;:!?)]$/.test(cleanUrl)) {
      trailing = cleanUrl.slice(-1) + trailing;
      cleanUrl = cleanUrl.slice(0, -1);
    }
    const href = /^https?:\/\//i.test(cleanUrl) ? cleanUrl : `https://${cleanUrl}`;

    nodes.push(
      <a
        key={`${keyPrefix}-u${start}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={LINK_CLASS}
      >
        {cleanUrl}
      </a>
    );

    if (trailing) nodes.push(trailing);
    lastIndex = start + rawUrl.length;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

/* Inline: **bold** (raw URLs handled inside the non-bold runs) */
function renderBold(text: string, keyPrefix: string): Array<string | JSX.Element> {
  const nodes: Array<string | JSX.Element> = [];
  let lastIndex = 0;
  BOLD_REGEX.lastIndex = 0;

  for (const match of text.matchAll(BOLD_REGEX)) {
    const start = match.index ?? 0;
    if (start > lastIndex)
      nodes.push(...renderUrls(text.slice(lastIndex, start), `${keyPrefix}-${start}`));
    nodes.push(
      <strong key={`${keyPrefix}-b${start}`} className="font-semibold text-foreground">
        {match[1]}
      </strong>
    );
    lastIndex = start + match[0].length;
  }

  if (lastIndex < text.length)
    nodes.push(...renderUrls(text.slice(lastIndex), `${keyPrefix}-end`));
  return nodes;
}

/* Inline markdown: [text](url) links, then **bold**, then raw URLs */
function renderTextWithLinks(text: string) {
  const nodes: Array<string | JSX.Element> = [];
  let lastIndex = 0;
  MD_LINK_REGEX.lastIndex = 0;

  for (const match of text.matchAll(MD_LINK_REGEX)) {
    const start = match.index ?? 0;
    if (start > lastIndex) nodes.push(...renderBold(text.slice(lastIndex, start), `t${start}`));
    nodes.push(
      <a
        key={`l${start}`}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className={LINK_CLASS}
      >
        {match[1]}
      </a>
    );
    lastIndex = start + match[0].length;
  }

  if (lastIndex < text.length) nodes.push(...renderBold(text.slice(lastIndex), "tend"));
  return nodes.length > 0 ? nodes : text;
}

/* ── JSON-LD BlogPosting ── */
function PostSchema({ post }: { post: BlogPostType }) {
  const url = `${SITE_URL}/${post.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.metaTitle,
    description: post.metaDescription,
    datePublished: post.dateISO,
    dateModified: post.dateISO,
    author: { "@type": "Organization", name: "Health Safety", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "Health Safety",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.ico` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: post.keywords.join(", "),
    inLanguage: "pt-BR",
    articleSection: post.topic,
    url,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function BreadcrumbSchema({ post }: { post: BlogPostType }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Health Safety Blog", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: post.title, item: `${SITE_URL}/${post.slug}` },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function FAQSchema({ post }: { post: BlogPostType }) {
  const headings = post.content.filter(
    (s) => s.type === "heading" && s.level === 2 && s.content
  );
  const faqItems = headings.map((h) => {
    const idx = post.content.indexOf(h);
    const nextParagraph = post.content.slice(idx + 1).find((s) => s.type === "paragraph");
    return {
      "@type": "Question",
      name: h.content,
      acceptedAnswer: { "@type": "Answer", text: nextParagraph?.content || "" },
    };
  });

  if (faqItems.length === 0) return null;
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/* Reading progress (accent bar) */
function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    function handleScroll() {
      const el = document.getElementById("article-body");
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.scrollHeight;
      const scrolled = Math.max(0, -rect.top);
      setProgress(Math.min(100, (scrolled / (total - window.innerHeight)) * 100));
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className="fixed top-16 md:top-20 left-0 right-0 z-40 h-[2px] bg-transparent">
      <div
        className="h-full bg-accent transition-[width] duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function ShareButtons({ post }: { post: BlogPostType }) {
  const url = `${SITE_URL}/${post.slug}`;
  const shareLinkedIn = () =>
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank"
    );
  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={shareLinkedIn}
        className="w-10 h-10 rounded-xl border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-[#0077B5] hover:border-[#0077B5]/30 transition-all"
        aria-label="Compartilhar no LinkedIn"
      >
        <Linkedin size={16} />
      </button>
      <button
        onClick={copyLink}
        className="w-10 h-10 rounded-xl border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent/40 transition-all"
        aria-label="Copiar link"
      >
        <Share2 size={16} />
      </button>
    </div>
  );
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    const postUrl = `${SITE_URL}/${post.slug}`;
    document.title = `${post.metaTitle} | Health Safety Blog`;

    const setMeta = (name: string, content: string, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };
    const setLink = (rel: string, href: string, extra?: Record<string, string>) => {
      const selector = extra
        ? `link[rel="${rel}"][hreflang="${extra.hreflang}"]`
        : `link[rel="${rel}"]`;
      let el = document.querySelector(selector) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement("link");
        el.rel = rel;
        if (extra) Object.entries(extra).forEach(([k, v]) => el!.setAttribute(k, v));
        document.head.appendChild(el);
      }
      el.href = href;
    };

    setMeta("description", post.metaDescription);
    setMeta("keywords", post.keywords.join(", "));
    setMeta("author", "Health Safety");
    setMeta("robots", "index, follow, max-image-preview:large, max-snippet:-1");
    setMeta("og:title", post.metaTitle, "property");
    setMeta("og:description", post.metaDescription, "property");
    setMeta("og:type", "article", "property");
    setMeta("og:url", postUrl, "property");
    setMeta("og:image", OG_IMAGE, "property");
    setMeta("og:site_name", "Health Safety Blog", "property");
    setMeta("og:locale", "pt_BR", "property");
    setMeta("article:published_time", post.dateISO, "property");
    setMeta("article:modified_time", post.dateISO, "property");
    setMeta("article:author", "Health Safety", "property");
    setMeta("article:section", post.topic, "property");
    post.keywords.forEach((kw, i) => setMeta(`article:tag:${i}`, kw, "property"));
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", post.metaTitle);
    setMeta("twitter:description", post.metaDescription);
    setMeta("twitter:image", OG_IMAGE);
    setLink("canonical", postUrl);
    setLink("alternate", postUrl, { hreflang: "pt-BR" });
    setLink("alternate", postUrl, { hreflang: "x-default" });

    return () => {
      document.title = "Health Safety Blog";
    };
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <BlogHeader />
        <div className="text-center pt-20">
          <p className="text-xs font-heading font-bold tracking-[0.25em] uppercase text-accent mb-3">
            404
          </p>
          <h1 className="font-heading font-extrabold text-3xl text-foreground mb-4 uppercase">
            Artigo não encontrado
          </h1>
          <Link to="/" className="text-sm text-accent hover:text-accent/80 font-heading font-bold">
            ← Voltar para o blog
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = posts.findIndex((p) => p.slug === post.slug);
  const prevPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const TopicIcon = TOPIC_ICONS[post.topic] ?? Wine;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PostSchema post={post} />
      <BreadcrumbSchema post={post} />
      <FAQSchema post={post} />

      <BlogHeader variant="solid" />
      <ReadingProgress />

      {/* ── HERO — light bg with breadcrumb, meta, title ── */}
      <section className="relative pt-28 md:pt-36 pb-12 md:pb-16 bg-[#DCE6F2] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(var(--brand-dark)) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl relative">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-xs text-muted-foreground mb-7"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="hover:text-accent transition-colors font-medium">
              Blog
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-accent font-medium">{post.topic}</span>
          </motion.nav>

          {/* Topic + number badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-[11px] font-heading font-bold tracking-wide uppercase border border-accent/25">
              <TopicIcon size={12} />
              {post.topic}
            </span>
            <span className="text-[11px] font-heading font-bold tracking-[0.2em] uppercase text-muted-foreground">
              Edição {post.number}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-heading font-extrabold text-[28px] sm:text-[34px] md:text-[42px] leading-[1.1] tracking-tight text-foreground mb-5"
          >
            {post.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base md:text-lg text-muted-foreground leading-relaxed mb-9 max-w-2xl"
          >
            {post.subtitle}
          </motion.p>

          {/* Byline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex items-center justify-between flex-wrap gap-4 pt-6 border-t border-border"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-foreground flex items-center justify-center">
                <span className="text-background font-heading font-extrabold text-sm tracking-tight">
                  HS
                </span>
              </div>
              <div>
                <p className="text-sm font-heading font-bold text-foreground">Health Safety</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={12} />
                    {post.date}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={12} />
                    {post.readTime} de leitura
                  </span>
                </div>
              </div>
            </div>
            <ShareButtons post={post} />
          </motion.div>
        </div>
      </section>

      {/* ── ARTICLE BODY — white card on light bg ── */}
      <article id="article-body" className="bg-background py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          {post.content.map((section, i) => {
            switch (section.type) {
              case "paragraph":
                return (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4 }}
                    className="text-[16px] sm:text-[17px] leading-[1.75] text-foreground/85 mb-6 font-body"
                  >
                    {section.content ? renderTextWithLinks(section.content) : null}
                  </motion.p>
                );

              case "heading":
                if (section.level === 2) {
                  return (
                    <motion.h2
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.4 }}
                      className="font-heading font-extrabold text-[22px] sm:text-[28px] leading-[1.2] text-foreground mt-12 mb-5 tracking-tight"
                    >
                      {section.content}
                    </motion.h2>
                  );
                }
                return (
                  <motion.h3
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.3 }}
                    className="font-heading font-bold text-[18px] sm:text-[20px] text-accent mt-8 mb-3 uppercase tracking-wide"
                  >
                    {section.content}
                  </motion.h3>
                );

              case "quote":
                return (
                  <motion.blockquote
                    key={i}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4 }}
                    className="relative my-10 pl-6 border-l-2 border-accent text-[17px] sm:text-[19px] leading-[1.5] text-foreground italic font-heading"
                  >
                    {section.content ? renderTextWithLinks(section.content) : null}
                  </motion.blockquote>
                );

              case "list":
                return (
                  <motion.ol
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4 }}
                    className="my-7 space-y-4 pl-0 list-none"
                  >
                    {section.items?.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-4 text-[16px] sm:text-[17px] leading-[1.7] text-foreground/85"
                      >
                        <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-accent/10 text-accent text-sm font-heading font-extrabold flex items-center justify-center mt-0.5">
                          {j + 1}
                        </span>
                        <span>{renderTextWithLinks(item)}</span>
                      </li>
                    ))}
                  </motion.ol>
                );

              case "video":
                return (
                  <motion.figure
                    key={i}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5 }}
                    className="my-10"
                  >
                    <video
                      src={section.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full rounded-2xl border border-border"
                    />
                  </motion.figure>
                );

              case "image":
                if (section.layout === "side") {
                  const sideText = section.caption || section.alt || "";
                  return (
                    <motion.figure
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.6 }}
                      className="my-12 md:my-16"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-8 sm:gap-10 items-center">
                        <div className="relative aspect-[3/4] w-full max-w-[220px] sm:max-w-none mx-auto sm:mx-0 rounded-2xl overflow-hidden border border-border shadow-sm">
                          <img
                            src={section.src}
                            alt={section.alt || ""}
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <figcaption className="not-italic">
                          <span className="block text-[11px] tracking-[0.25em] uppercase text-accent font-heading font-bold mb-3">
                            Em campo
                          </span>
                          <p className="font-heading font-bold text-[19px] sm:text-[22px] leading-[1.3] text-foreground">
                            {sideText}
                          </p>
                        </figcaption>
                      </div>
                    </motion.figure>
                  );
                }
                return (
                  <motion.figure
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5 }}
                    className="my-10"
                  >
                    <img
                      src={section.src}
                      alt={section.alt || ""}
                      className="w-full rounded-2xl border border-border"
                      loading="lazy"
                    />
                    {section.alt && (
                      <figcaption className="mt-3 text-center text-[12px] text-muted-foreground leading-relaxed">
                        {section.alt}
                      </figcaption>
                    )}
                  </motion.figure>
                );

              case "divider":
                return (
                  <div
                    key={i}
                    className="my-12 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
                      <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
                      <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
                    </div>
                  </div>
                );

              default:
                return null;
            }
          })}

          {/* In-article CTA */}
          {post.cta && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-14 mb-4 relative overflow-hidden rounded-2xl bg-brand-dark text-background p-8 md:p-10"
            >
              {/* Accent grid */}
              <div
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                  backgroundSize: "36px 36px",
                }}
              />
              <div className="absolute -top-12 -right-12 w-[280px] h-[280px] rounded-full bg-accent/15 blur-[80px]" />

              <div className="relative">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-[11px] font-heading font-bold tracking-[0.2em] uppercase mb-5 border border-accent/30">
                  Health Safety · Phoebus
                </span>
                <h3 className="font-heading font-extrabold text-2xl md:text-3xl text-background uppercase leading-[1.15] tracking-tight mb-3">
                  {post.cta.headline || "Quer levar mais segurança pra sua operação?"}
                </h3>
                {post.cta.subtitle !== "" && (
                  <p className="text-sm md:text-base text-background/70 leading-relaxed mb-7 max-w-xl">
                    {post.cta.subtitle ?? "Fale com a Health Safety."}
                  </p>
                )}
                <a
                  href={post.cta.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 h-12 bg-whatsapp hover:bg-whatsapp/90 text-primary-foreground text-sm font-heading font-bold rounded-xl transition-colors shadow-lg shadow-whatsapp/30"
                >
                  <MessageCircle size={18} />
                  {post.cta.text}
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </article>

      {/* ── Prev/Next ── */}
      {(prevPost || nextPost) && (
        <section className="bg-[#DCE6F2] section-padding py-12 md:py-16 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <p className="text-[11px] font-heading font-bold tracking-[0.25em] uppercase text-accent mb-6 text-center">
              Continue lendo
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {prevPost && prevPost.content.length > 0 ? (
                <Link
                  to={`/${prevPost.slug}`}
                  className="group flex flex-col p-6 rounded-2xl bg-card border border-border hover:border-accent/40 hover:shadow-md transition-all"
                >
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-heading font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    <ArrowLeft size={12} />
                    Anterior
                  </span>
                  <span className="font-heading font-bold text-foreground group-hover:text-accent transition-colors leading-snug">
                    {prevPost.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {nextPost && nextPost.content.length > 0 ? (
                <Link
                  to={`/${nextPost.slug}`}
                  className="group flex flex-col items-end text-right p-6 rounded-2xl bg-card border border-border hover:border-accent/40 hover:shadow-md transition-all"
                >
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-heading font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    Próximo
                    <ArrowRight size={12} />
                  </span>
                  <span className="font-heading font-bold text-foreground group-hover:text-accent transition-colors leading-snug">
                    {nextPost.title}
                  </span>
                </Link>
              ) : null}
            </div>

            <div className="flex items-center justify-between mt-10 pt-8 border-t border-border/60">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent font-heading font-bold uppercase tracking-wider transition-colors"
              >
                <ArrowLeft size={12} />
                Todos os artigos
              </Link>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent font-heading font-bold uppercase tracking-wider transition-colors"
              >
                <ChevronUp size={12} />
                Topo
              </button>
            </div>
          </div>
        </section>
      )}

      <BlogFooter />
    </div>
  );
}
