export interface Post {
  id: string;
  title: string;
  slug: string;
  metaDescription: string;
  coverImageUrl?: string;
  content: string;
  publishDate: string;
  expiryDate?: string | null;
  categoryId?: string;
  isActive: boolean;
}