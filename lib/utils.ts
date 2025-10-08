import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// types.ts (for reference)

export interface BlogPostCard {
  slug: string; // Used for the URL, e.g., 'meu-primeiro-post'
  title: string;
  excerpt: string; // Short summary for the card
  imageUrl: string; // URL for the card image
  author: string;
  date: string; // e.g., '2025-10-04'
}

export interface BlogPost extends BlogPostCard {
  content: string; // The full content of the post (HTML or Markdown, for simplicity we'll use string here)
  category: string;
}