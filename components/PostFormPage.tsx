"use client";

import { useData } from '@/app/adminTioBen/contexts/DataContext';
import { Post } from '@/app/adminTioBen/types';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

// Define o tipo de dados que o formulário manipula (parcial do Post + arquivo de imagem)
type PostFormData = Partial<Post> & {
 coverImageFile?: File;
 // Garante que o formulário use strings de data no formato 'YYYY-MM-DD'
 publishDate: string;
 expiryDate: string;
};

const PostFormPage: React.FC = () => {
 const router = useRouter();
 const pathname = usePathname();
 
 // --- Lógica Corrigida para Extrair o ID ---
 const lastSegment = pathname.split('/').pop();
 
 // Verifica se o último segmento é um UUID (para rotas de Edição) ou o slug de Criação
 // Usamos um regex para evitar pegar slugs de criação como ID (como "new" ou "cadastrar-editar")
 const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(lastSegment || '');
 
 // O ID é válido apenas se for um UUID. Caso contrário, é undefined (modo de criação).
 const id = isUUID ? lastSegment : undefined;
 
 const { categories, getPost, addPost, updatePost } = useData();
 
 const [isSaving, setIsSaving] = useState(false);
 const [errorMessage, setErrorMessage] = useState<string | null>(null);

 const [post, setPost] = useState<PostFormData>({
  title: '',
  slug: '',
  keywords: '',
  metaDescription: '',
  content: '',
  categoryId: '',
  isActive: true,
  publishDate: new Date().toISOString().split('T')[0],
  expiryDate: '',
 });

 const [imagePreview, setImagePreview] = useState<string | null>(null);

 // --- Carregamento de Dados para Edição ---
 useEffect(() => {
  if (id) {
   const existingPost = getPost(id);
   if (existingPost) {
    setPost({
     ...existingPost,
     // Formata as datas ISO de volta para 'YYYY-MM-DD'
     publishDate: existingPost.publishDate.split('T')[0],
     expiryDate: existingPost.expiryDate ? existingPost.expiryDate.split('T')[0] : '',
    });
    if (existingPost.coverImageUrl) {
     setImagePreview(existingPost.coverImageUrl);
    }
   } else {
    setErrorMessage("Post não encontrado. Redirecionando...");
        router.push('/adminHome/artigos');
   }
  }
 }, [id, getPost, router]);
 
 // --- Helpers ---
 const generateSlug = (title: string) => {
  return title
   .toLowerCase()
   .trim()
   .replace(/[^\w\s-]/g, '')
   .replace(/[\s_-]+/g, '-')
   .replace(/^-+|-+$/g, '');
 };

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

 const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
   setPost(prev => ({ ...prev, coverImageFile: file, coverImageUrl: '' }));
   
   const reader = new FileReader();
   reader.onloadend = () => {
    setImagePreview(reader.result as string);
   };
   reader.readAsDataURL(file);
  }
 };

 // --- Submissão do Formulário ---
 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrorMessage(null);
  setIsSaving(true);
  
  // 1. VALIDAÇÃO ESSENCIAL: Garante que os campos obrigatórios foram preenchidos
  if (!post.title || !post.slug || !post.content || !post.categoryId) {
    setErrorMessage("Por favor, preencha todos os campos obrigatórios (Título, Conteúdo, Categoria).");
    setIsSaving(false);
    return;
  }

  try {
    // 2. CONSTRUÇÃO EXPLÍCITA: Cria o objeto final 'Post', garantindo que todos os campos obrigatórios sejam string
    // E CORRIGINDO O ERRO DE TIPAGEM DE DATAS.
    const postData: Post = {
      // Campos obrigatórios de 'Post'
      id: id || '', 
      title: post.title, 
      slug: post.slug, 
      content: post.content, 
      categoryId: post.categoryId, 
      categoryName: post.categoryName || "",
      
      // Campos opcionais/padrão (garantindo valor string)
      keywords: post.keywords || '',
      metaDescription: post.metaDescription || '',
      coverImageUrl: post.coverImageUrl,

      isActive: post.isActive ?? true,
      
      // Conversão de datas para ISO String (Corrigindo o erro de tipagem Date -> String)
      publishDate: new Date(post.publishDate).toISOString(),
      expiryDate: post.expiryDate ? new Date(post.expiryDate).toISOString() : undefined,
      
      // Placeholders como ISO Strings (CORREÇÃO)
      createdAt: new Date(), 
      updatedAt: new Date(),
    };

    // 3. Lógica do CRUD
    if (id) {
      // Se for edição, o ID é um UUID válido
      await updatePost(postData);
    } else {
      // Se for criação, o ID é "" e a Server Action irá ignorá-lo
      // Omitimos o ID aqui, pois ele é opcional na interface de adição:
      await addPost(postData); 
    }
    
    router.push('/adminHome/artigos');
  } catch (error) {
    console.error("Failed to save post", error);
    setErrorMessage(`Falha ao salvar o post: ${(error as Error).message || 'Erro de conexão.'}`);
  } finally {
    setIsSaving(false);
  }
};

 return (
  <div>
   <h2 className="text-2xl font-bold text-text-primary mb-6">{id ? 'Editar Post' : 'Novo Post'}</h2>
   
   {errorMessage && (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
     <span className="block sm:inline">{errorMessage}</span>
    </div>
   )}

   <form onSubmit={handleSubmit} className="bg-surface p-6 rounded-lg shadow-md space-y-6">
    
    {/* Title and Slug */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
     <div>
      <label htmlFor="title" className="block text-sm font-medium text-text-secondary">Título</label>
      <input type="text" name="title" id="title" value={post.title || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" required />
     </div>
     <div>
      <label htmlFor="slug" className="block text-sm font-medium text-text-secondary">Slug</label>
      <input type="text" name="slug" id="slug" value={post.slug || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100" readOnly />
     </div>
    </div>

    {/* SEO Fields */}
    <div>
     <label htmlFor="keywords" className="block text-sm font-medium text-text-secondary">Palavras-chave (separadas por vírgula)</label>
     <input type="text" name="keywords" id="keywords" value={post.keywords || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
    </div>
    <div>
     <label htmlFor="metaDescription" className="block text-sm font-medium text-text-secondary">Meta Description</label>
     <textarea name="metaDescription" id="metaDescription" rows={3} value={post.metaDescription || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
    </div>

    {/* Cover Image */}
    <div>
      <label className="block text-sm font-medium text-text-secondary">Imagem de Capa</label>
      <div className="mt-1 flex items-center gap-4">
       {imagePreview && <Image src={imagePreview} alt="Pré-visualização" className="h-20 w-auto object-cover rounded" />}
       <input type="file" onChange={handleImageChange} accept="image/*" className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100"/>
      </div>
      <p className="text-xs text-gray-500 mt-1">O upload do arquivo (se selecionado) será processado e salvo no Vercel Blob.</p>
    </div>

    {/* Content */}
    <div>
     <label htmlFor="content" className="block text-sm font-medium text-text-secondary">Conteúdo</label>
     <textarea name="content" id="content" rows={15} value={post.content || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" placeholder="Escreva o conteúdo do post aqui... HTML é suportado."/>
    </div>

    {/* Category and Status */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
       <label htmlFor="categoryId" className="block text-sm font-medium text-text-secondary">Categoria</label>
       <select name="categoryId" id="categoryId" value={post.categoryId || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" required>
       <option value="">Selecione uma categoria</option>
       {categories.map(cat => (
        <option key={cat.id} value={cat.id}>{cat.name}</option>
       ))}
       </select>
      </div>
      <div className="flex items-end">
       <div className="flex items-center h-full">
        <input id="isActive" name="isActive" type="checkbox" checked={post.isActive || false} onChange={handleChange} className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" />
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
       <input type="date" name="publishDate" id="publishDate" value={post.publishDate} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" required />
      </div>
      <div>
       <label htmlFor="expiryDate" className="block text-sm font-medium text-text-secondary">Data Limite de Exibição (Opcional)</label>
       <input type="date" name="expiryDate" id="expiryDate" value={post.expiryDate} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
      </div>
    </div>

    {/* Actions */}
    <div className="flex justify-end gap-4">
      <button type="button" onClick={() => router.push('/adminHome/artigos')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
        Cancelar
      </button>
      <button type="submit" disabled={isSaving} className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50">
        {isSaving ? 'Salvando...' : 'Salvar Post'}
      </button>
    </div>
   </form>
  </div>
 );
};

export default PostFormPage;