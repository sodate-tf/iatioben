export type StoryBackground = {
  type: "image";
  src: string;
  alt: string;
};

export type StoryCta = {
  label: string;
  url: string;
};

export type StoryPage =
  | {
      id: "cover";
      background: StoryBackground;
      heading: string;
      subheading?: string;
      text?: string;
      cta?: { label: string; url?: string | null };
    }
  | {
      id: "theme";
      background: StoryBackground;
      heading: string;
      text: string;
      quote?: string;
      cta?: StoryCta;
    }
  | {
      id: "reading1" | "reading2" | "gospel" | "gospel1";
      background: StoryBackground;
      heading: string;
      reference: string;
      bullets: string[];
    }
  | {
      id: "psalm";
      background: StoryBackground;
      heading: string;
      reference: string;
      refrain: string;
      bullets?: string[];
    }
  | {
      id: "application";
      background: StoryBackground;
      heading: string;
      bullets: string[];
      prayer?: string;
    }
  | {
      id: "cta";
      background: StoryBackground;
      heading: string;
      text: string;
      cta: StoryCta;
    };

export type LiturgyStoryJson = {
  type: "liturgy";
  lang: string; // "pt-BR"
  date: string; // YYYY-MM-DD
  slug: string; // liturgia-23-01-2026
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
