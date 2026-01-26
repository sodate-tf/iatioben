// app/lib/web-stories/story-types.ts
export type StoryTheme = "dark" | "light";

export type StoryBackground = {
  type: "image";
  src: string;
  alt: string;
};

export type StoryCta = {
  label: string;
  url: string;
};

export type StoryPage = {
  id: string;
  theme?: StoryTheme;

  background: StoryBackground;

  heading: string;
  subheading?: string;
  text?: string;
  quote?: string;

  reference?: string;
  bullets?: string[];
  refrain?: string;

  prayer?: string;

  cta?: StoryCta | null;
};

export type LiturgyStoryJson = {
  type: "liturgy";
  lang: string; // ex.: pt-BR
  date: string; // yyyy-mm-dd
  slug: string;

  title: string;
  description: string;

  canonicalUrl: string;
  storyUrl: string;

  publisherName: string;
  publisherLogoSrc: string;

  poster: {
    src: string;
    width: number;
    height: number;
    alt: string;
  };

  pages: StoryPage[];
};
