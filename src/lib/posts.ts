import type { BlogPost, PostTopic } from "./types";

export type { BlogPost, BlogSection, PostTopic } from "./types";

export const ALL_TOPICS: PostTopic[] = [
  "Álcool no Trabalho",
  "Segurança Operacional",
  "NRs e Conformidade",
];

const postModules = import.meta.glob("../content/posts/*.json", {
  eager: true,
  import: "default",
}) as Record<string, BlogPost>;

const normalizeDate = (dateISO: string) => {
  const parsed = Date.parse(dateISO);
  if (Number.isNaN(parsed)) {
    throw new Error(`dateISO inválido detectado em post: "${dateISO}"`);
  }
  return parsed;
};

export const posts: BlogPost[] = Object.values(postModules)
  .slice()
  .sort((a, b) => normalizeDate(b.dateISO) - normalizeDate(a.dateISO));

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
