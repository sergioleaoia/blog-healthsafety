export type PostTopic =
  | "Álcool no Trabalho"
  | "Segurança Operacional"
  | "NRs e Conformidade";

export interface BlogPost {
  slug: string;
  number: string;
  date: string;
  dateISO: string;
  readTime: string;
  topic: PostTopic;
  title: string;
  subtitle: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  image: string | null;
  content: BlogSection[];
  cta?: {
    text: string;
    url: string;
    headline?: string;
    subtitle?: string;
  };
}

export interface BlogSection {
  type: "paragraph" | "heading" | "quote" | "list" | "divider" | "image" | "video";
  content?: string;
  items?: string[];
  level?: 2 | 3;
  src?: string;
  alt?: string;
  layout?: "default" | "side";
  caption?: string;
}
