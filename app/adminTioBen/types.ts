
export interface Category {
  id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  keywords: string;
  metaDescription: string;
  coverImageUrl?: string;
  coverImageFile?: File;
  content: string;
  categoryId: string;
  categoryName: string;
  isActive: boolean;
  publishDate: string; // ISO string format
  expiryDate?: string; // Optional ISO string format
  createdAt?: Date;
  updatedAt?: Date;
}
