// components/PostFormPage.tsx
"use client";

import { useData } from '@/app/adminTioBen/contexts/DataContext';
import { Post, Category } from '@/app/adminTioBen/types';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
// CORREÇÃO: Usar useRouter do App Router
import { useRouter } from 'next/navigation'; 
import Image from 'next/image';

// Define a interface para as props do componente (Mantida a mesma)
interface PostFormPageProps {
  postId: string | undefined; // O Server Component passa o ID como string, mas mantemos | undefined por segurança
}

// Tipagens (Mantidas as mesmas)
type PostFormData = Partial<Omit<Post, 'createdAt' | 'updatedAt' | 'publishDate' | 'expiryDate'>> & {
  coverImageFile?: File;
  publishDate: string;
  expiryDate: string;
};
type FormError = { message: string } | null;

const PostFormPage: React.FC<PostFormPageProps> = ({ postId }) => {
  // CORREÇÃO: use router do 'next/navigation'
  const router = useRouter(); 
  
  const id: string | undefined = postId;
  
  const { categories, getPost, addPost, updatePost } = useData();
  
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<FormError>(null);

  const today = useMemo(() => new Date().toISOString().split('T')[0] || '', []);

  const [post, setPost] = useState<PostFormData>({
    title: '',
    slug: '',
    keywords: '',
    metaDescription: '',
    content: '',
    categoryId: '',
    isActive: true,
    publishDate: today,
    expiryDate: '',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // --- Helpers ---
  const generateSlug = useCallback((title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }, []);

  // CORREÇÃO: Funções de navegação usando router.push do App Router
  const navigateToArtigos = useCallback((): void => {
    router.push('/adminHome/artigos');
    // Não precisamos de .catch se estivermos usando o router do App Router, 
    // mas o uso de `router.refresh()` é bom se os dados precisarem ser revalidados.
  }, [router]);

  const isValidUUID = useCallback((uuid: string): boolean => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid);
  }, []);

  // --- Carregamento de Dados para Edição ---
  useEffect(() => {
    if (id) {
      if (!isValidUUID(id)) {
        setErrorMessage({ message: "ID de post inválido. Redirecionando..." });
        // Usamos setTimeout apenas para exibir a mensagem. O redirecionamento é via hook.
        const timer = setTimeout(navigateToArtigos, 3000); 
        return () => clearTimeout(timer); 
      }

      const existingPost = getPost(id);
      
      if (existingPost) {
        setPost({
          ...existingPost,
          publishDate: existingPost.publishDate.split('T')[0] ?? today,
          expiryDate: existingPost.expiryDate ? existingPost.expiryDate.split('T')[0] : '',
        });
        if (existingPost.coverImageUrl) {
          setImagePreview(existingPost.coverImageUrl);
        }
      } else {
        setErrorMessage({ message: "Post não encontrado. Redirecionando..." });
        const timer = setTimeout(navigateToArtigos, 3000); 
        return () => clearTimeout(timer); 
      }
    }
  }, [id, getPost, navigateToArtigos, today, isValidUUID]); 

  // --- Handlers (mantidos os mesmos) ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setPost(prev => ({ ...prev, [name]: checked }));
    } else {
      setPost(prev => ({ ...prev, [name]: value }));
      if (name === 'title') {
        setPost(prev => ({ ...prev, slug: generateSlug(value) }));
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file: File | undefined = e.target.files?.[0];
    if (file) {
      setPost(prev => ({ ...prev, coverImageFile: file, coverImageUrl: undefined }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPost(prev => ({ ...prev, coverImageFile: undefined }));
      if (!post.coverImageUrl && !post.coverImageFile) {
         setImagePreview(null);
      }
    }
  };

  // --- Submissão do Formulário ---
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSaving(true);
    
    const { title, slug, content, categoryId, publishDate } = post;

    if (!title || !slug || !content || !categoryId || !publishDate) {
      setErrorMessage({ message: "Por favor, preencha todos os campos obrigatórios (Título, Conteúdo, Categoria e Data de Publicação)." });
      setIsSaving(false);
      return;
    }
    
    const selectedCategory = categories.find(cat => cat.id === categoryId);
    if (!selectedCategory) {
      setErrorMessage({ message: "A categoria selecionada é inválida." });
      setIsSaving(false);
      return;
    }

    try {
      const postData: Post = {
        id: id && isValidUUID(id) ? id : '', 
        title, 
        slug, 
        content, 
        categoryId, 
        categoryName: selectedCategory.name,
        
        keywords: post.keywords ?? '',
        metaDescription: post.metaDescription ?? '',
        coverImageUrl: post.coverImageUrl,

        isActive: post.isActive ?? true,
        
        publishDate: new Date(publishDate).toISOString(),
        expiryDate: post.expiryDate ? new Date(post.expiryDate).toISOString() : undefined,
        
        createdAt: new Date(), 
        updatedAt: new Date(),
      };

      if (id && isValidUUID(id)) {
        await updatePost(postData);
      } else {
        await addPost(postData); 
      }
      
      // Redireciona
      navigateToArtigos();
    } catch (error) {
      const msg = (error instanceof Error) ? error.message : 'Erro desconhecido ao salvar o post.';
      console.error("Failed to save post:", error);
      setErrorMessage({ message: `Falha ao salvar o post: ${msg}` });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-text-primary mb-6">{id ? 'Editar Post' : 'Novo Post'}</h2>
      
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{errorMessage.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-surface p-6 rounded-lg shadow-md space-y-6">
        
        {/* Title and Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-text-secondary">Título</label>
            <input 
              type="text" 
              name="title" 
              id="title" 
              value={post.title} 
              onChange={handleChange} 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" 
              required 
            />
          </div>
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-text-secondary">Slug</label>
            <input 
              type="text" 
              name="slug" 
              id="slug" 
              value={post.slug} 
              onChange={handleChange} 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100" 
              readOnly 
            />
          </div>
        </div>

        {/* SEO Fields */}
        <div>
          <label htmlFor="keywords" className="block text-sm font-medium text-text-secondary">Palavras-chave (separadas por vírgula)</label>
          <input 
            type="text" 
            name="keywords" 
            id="keywords" 
            value={post.keywords} 
            onChange={handleChange} 
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" 
          />
        </div>
        <div>
          <label htmlFor="metaDescription" className="block text-sm font-medium text-text-secondary">Meta Description</label>
          <textarea 
            name="metaDescription" 
            id="metaDescription" 
            rows={3} 
            value={post.metaDescription} 
            onChange={handleChange} 
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" 
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-text-secondary">Imagem de Capa</label>
          <div className="mt-1 flex items-center gap-4">
            {imagePreview && (
              <Image 
                src={imagePreview} 
                alt="Pré-visualização" 
                className="h-20 w-auto object-cover rounded" 
                width={80} 
                height={80} 
              />
            )}
            <input 
              type="file" 
              onChange={handleImageChange} 
              accept="image/*" 
              className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">O upload do arquivo (se selecionado) será processado.</p>
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-text-secondary">Conteúdo</label>
          <textarea 
            name="content" 
            id="content" 
            rows={15} 
            value={post.content} 
            onChange={handleChange} 
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" 
            placeholder="Escreva o conteúdo do post aqui... HTML é suportado."
            required
          />
        </div>

        {/* Category and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-text-secondary">Categoria</label>
            <select 
              name="categoryId" 
              id="categoryId" 
              value={post.categoryId} 
              onChange={handleChange} 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" 
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((cat: Category) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <div className="flex items-center h-full">
              <input 
                id="isActive" 
                name="isActive" 
                type="checkbox" 
                checked={post.isActive} 
                onChange={handleChange} 
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" 
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-text-primary">
                Post Ativo
              </label>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="publishDate" className="block text-sm font-medium text-text-secondary">Data de Publicação</label>
            <input 
              type="date" 
              name="publishDate" 
              id="publishDate" 
              value={post.publishDate} 
              onChange={handleChange} 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" 
              required 
            />
          </div>
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-text-secondary">Data Limite de Exibição (Opcional)</label>
            <input 
              type="date" 
              name="expiryDate" 
              id="expiryDate" 
              value={post.expiryDate} 
              onChange={handleChange} 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" 
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button 
            type="button" 
            onClick={navigateToArtigos} 
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={isSaving} 
            className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {isSaving ? 'Salvando...' : 'Salvar Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostFormPage;