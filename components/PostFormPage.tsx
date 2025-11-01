'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useData } from '@/app/adminTioBen/contexts/DataContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, Upload, FileText, Save, X } from 'lucide-react';
import type { Post, Category } from '@/app/adminTioBen/types';

interface PostFormPageProps {
  postId?: string;
}

type PostFormData = Partial<
  Omit<Post, 'createdAt' | 'updatedAt' | 'publishDate' | 'expiryDate' | 'coverImageUrl'>
> & {
  coverImageFile?: File;
  coverImageUrl?: string | null;
  publishDate: string;
  expiryDate: string;
};

const MAX_IMAGE_SIZE_MB = 5;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const PostFormPage: React.FC<PostFormPageProps> = ({ postId }) => {
  const router = useRouter();
  const { categories, getPost, addPost, updatePost } = useData();

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const [post, setPost] = useState<PostFormData>({
    title: '',
    slug: '',
    keywords: '',
    metaDescription: '',
    content: '',
    categoryId: '',
    coverImageUrl: null,
    isActive: true,
    publishDate: today,
    expiryDate: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  /** 🧠 Utilidades */
  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .replace(/ç/g, 'c')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }, []);

  const navigateBack = useCallback(() => router.push('/adminHome/artigos'), [router]);

  /** 🔍 Carrega post se for edição */
  useEffect(() => {
    if (!postId) return;

    const existing = getPost(postId);
    if (!existing) {
      setError('Post não encontrado. Redirecionando...');
      setTimeout(navigateBack, 2500);
      return;
    }

    setPost({
      ...existing,
      publishDate: existing.publishDate?.split('T')[0] || today,
      expiryDate: existing.expiryDate?.split('T')[0] || '',
    });
    setImagePreview(existing.coverImageUrl ?? null);
  }, [postId, getPost, navigateBack, today]);

  /** 🖊️ Manipuladores */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setPost((p) => ({ ...p, [name]: checked }));
    } else {
      setPost((p) => {
        const next = { ...p, [name]: value };
        if (name === 'title') next.slug = generateSlug(value);
        return next;
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setError(`A imagem excede ${MAX_IMAGE_SIZE_MB}MB.`);
      return;
    }
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setError('Formato inválido. Use JPG, PNG ou WEBP.');
      return;
    }

    setPost((p) => ({ ...p, coverImageFile: file }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  /** 💾 Envio */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSaving(true);

    try {
      const { title, slug, content, categoryId, publishDate } = post;
      if (!title || !slug || !content || !categoryId || !publishDate) {
        throw new Error('Preencha todos os campos obrigatórios.');
      }

      const category = categories.find((c: Category) => c.id === categoryId);
      if (!category) throw new Error('Categoria inválida.');

      const isEditing = !!postId;
      const postData: Post = {
        id: postId || '',
        title: post.title ?? '',
        slug: post.slug ?? '',
        content: post.content ?? '',
        categoryId,
        categoryName: category.name,
        keywords: post.keywords ?? '',
        metaDescription: post.metaDescription ?? '',
        coverImageUrl: post.coverImageUrl ?? undefined,
        isActive: post.isActive ?? true,
        publishDate: new Date(post.publishDate).toISOString(),
        expiryDate: post.expiryDate ? new Date(post.expiryDate).toISOString() : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (post.coverImageFile) {
        const formData = new FormData();
        formData.append('coverImage', post.coverImageFile);
        formData.append('postJson', JSON.stringify(postData));
        const result = isEditing
          ? await updatePost(postData, formData)
          : await addPost(postData, formData);
        if (result?.coverImageUrl) postData.coverImageUrl = result.coverImageUrl;
      } else {
        isEditing ? await updatePost(postData) : await addPost(postData);
      }

      setSuccess(true);
      setTimeout(navigateBack, 1200);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido.';
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  /** 🧱 UI */
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <h2 className="text-2xl font-bold mb-4">
        {postId ? 'Editar Post' : 'Novo Post'}
      </h2>

      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 border border-red-300 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded-md bg-green-50 text-green-700 border border-green-300 text-sm">
          Post salvo com sucesso!
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-card p-5 rounded-xl shadow-md space-y-6"
      >
        {/* 🎯 Informações principais */}
        <section className="space-y-4">
          <div>
            <label className="text-sm font-medium">Título</label>
            <input
              type="text"
              name="title"
              value={post.title ?? ''}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-input bg-background p-2 focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Slug</label>
            <input
              type="text"
              name="slug"
              value={post.slug ?? ''}
              readOnly
              className="mt-1 w-full rounded-md border border-input bg-muted p-2 text-gray-500"
            />
          </div>
        </section>

        {/* 🖼️ Imagem */}
        <section className="space-y-2">
          <label className="text-sm font-medium">Imagem de Capa</label>
          <div className="flex items-center gap-4 flex-wrap">
            {imagePreview && (
              <Image
                src={imagePreview}
                alt="Prévia da imagem"
                width={100}
                height={100}
                className="rounded-md object-cover border"
              />
            )}
            <label className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md cursor-pointer hover:bg-muted/70 transition">
              <Upload size={18} />
              <span className="text-sm">Escolher imagem</span>
              <input
                type="file"
                accept={ALLOWED_MIME_TYPES.join(',')}
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-xs text-muted-foreground">
            Máx. {MAX_IMAGE_SIZE_MB}MB. Tipos: JPG, PNG, WEBP.
          </p>
        </section>

        {/* ✍️ Conteúdo */}
        <section>
          <label className="text-sm font-medium">Conteúdo</label>
          <textarea
            name="content"
            rows={10}
            value={post.content ?? ''}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-input bg-background p-3 focus:ring-2 focus:ring-primary"
            placeholder="Escreva o conteúdo do post aqui..."
            required
          />
        </section>

        {/* 🔍 SEO */}
        <section className="space-y-4">
          <div>
            <label className="text-sm font-medium">Palavras-chave</label>
            <input
              type="text"
              name="keywords"
              value={post.keywords ?? ''}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-input bg-background p-2 focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Meta Description</label>
            <textarea
              name="metaDescription"
              rows={2}
              value={post.metaDescription ?? ''}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-input bg-background p-2 focus:ring-2 focus:ring-primary"
            />
          </div>
        </section>

        {/* ⚙️ Categoria e status */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Categoria</label>
            <select
              name="categoryId"
              value={post.categoryId ?? ''}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-input bg-background p-2 focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Selecione...</option>
              {categories.map((c: Category) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <input
              id="isActive"
              type="checkbox"
              name="isActive"
              checked={post.isActive ?? true}
              onChange={handleChange}
              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="isActive" className="text-sm">
              Post Ativo
            </label>
          </div>
        </section>

        {/* 📅 Datas */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Publicar em</label>
            <input
              type="date"
              name="publishDate"
              value={post.publishDate}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-input bg-background p-2 focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Expira em (opcional)</label>
            <input
              type="date"
              name="expiryDate"
              value={post.expiryDate}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-input bg-background p-2 focus:ring-2 focus:ring-primary"
            />
          </div>
        </section>

        {/* 🔘 Ações */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={navigateBack}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-muted hover:bg-muted/70 text-sm transition"
            disabled={isSaving}
          >
            <X size={16} />
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition text-sm disabled:opacity-70"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save size={16} />
                Salvar
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostFormPage;
