// components/PostFormPage.tsx
"use client";

import { useData } from '@/app/adminTioBen/contexts/DataContext';
import { Post } from '@/app/adminTioBen/types';
import React, { useState, useEffect, useCallback } from 'react';
// Importação correta do useRouter para o Pages Router (onde a página está rodando)
import { useRouter } from 'next/router';
import Image from 'next/image';

// Define a interface para as props do componente
interface PostFormPageProps {
  postId: string | undefined; // Recebe o ID da página [id].tsx
}

// Define o tipo de dados que o formulário manipula (parcial do Post + arquivo de imagem)
type PostFormData = Partial<Omit<Post, 'createdAt' | 'updatedAt' | 'publishDate' | 'expiryDate'>> & {
  coverImageFile?: File;
  // Garante que o formulário use strings de data no formato 'YYYY-MM-DD'
  publishDate: string;
  expiryDate: string;
};

const PostFormPage: React.FC<PostFormPageProps> = ({ postId }) => {
  // Use o useRouter do 'next/router' para navegação no Pages Router
  const router = useRouter(); 
  
  // O ID agora é recebido via props
  const id = postId;
  
  const { categories, getPost, addPost, updatePost } = useData();
  
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Inicializa o estado com tipagem segura
  const [post, setPost] = useState<PostFormData>({
    title: '',
    slug: '',
    keywords: '',
    metaDescription: '',
    content: '',
    categoryId: '',
    isActive: true,
    publishDate: new Date().toISOString().split('T')[0] || '', // Garante 'YYYY-MM-DD'
    expiryDate: '',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // --- Helpers ---
  const generateSlug = useCallback((title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }, []);

  // --- Carregamento de Dados para Edição ---
  useEffect(() => {
    // 1. Validação de ID: Verifica se o ID tem o formato de um UUID válido (se existe)
    // Se o ID não for undefined (modo de edição), verifica o formato.
    const isUUID = id ? /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) : false;

    if (id && isUUID) {
      const existingPost = getPost(id);
      
      if (existingPost) {
        setPost({
          ...existingPost,
          // Formata as datas ISO de volta para 'YYYY-MM-DD'
          publishDate: existingPost.publishDate.split('T')[0] || '',
          expiryDate: existingPost.expiryDate ? existingPost.expiryDate.split('T')[0] : '',
        });
        if (existingPost.coverImageUrl) {
          setImagePreview(existingPost.coverImageUrl);
        }
      } else {
        // Post não encontrado: Exibe erro e redireciona
        setErrorMessage("Post não encontrado. Redirecionando...");
        const timer = setTimeout(() => {
          router.push('/adminHome/artigos').catch(console.error);
        }, 3000); 
        return () => clearTimeout(timer); // Cleanup
      }
    } else if (id && !isUUID) {
      // Caso o parâmetro 'id' exista, mas não seja um UUID (ex: '/artigos/new', '/artigos/cadastrar-editar'), 
      // mas você quer que a criação seja em '/artigos/cadastrar', 
      // Você pode redirecionar se o ID for inválido para edição. 
      // Como a lógica anterior tentava extrair de uma URL, aqui tratamos para garantir que o modo "criação" é quando o 'id' é `undefined` ou um valor específico (que não é o caso aqui). 
      // Mantendo o foco, se o ID existe, mas é inválido, redireciona.
      setErrorMessage("Parâmetro de edição inválido. Redirecionando...");
      const timer = setTimeout(() => {
        router.push('/adminHome/artigos').catch(console.error);
      }, 3000); 
      return () => clearTimeout(timer); // Cleanup
    }
    // Caso 'id' seja undefined (criação), o estado inicial é usado.
  }, [id, getPost, router]); // Adicionado router como dependência

  // --- Handlers ---
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
      // Remove coverImageUrl se um novo arquivo for selecionado
      setPost(prev => ({ ...prev, coverImageFile: file, coverImageUrl: undefined }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // Limpa a seleção
      setPost(prev => ({ ...prev, coverImageFile: undefined }));
      // Mantém a imagem original se for edição e não houver nova seleção
      if (!post.coverImageUrl) {
         setImagePreview(null);
      }
    }
  };

  // --- Submissão do Formulário ---
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSaving(true);
    
    // 1. VALIDAÇÃO ESSENCIAL
    const { title, slug, content, categoryId, publishDate } = post;

    if (!title || !slug || !content || !categoryId || !publishDate) {
      setErrorMessage("Por favor, preencha todos os campos obrigatórios (Título, Conteúdo, Categoria e Data de Publicação).");
      setIsSaving(false);
      return;
    }

    try {
      // 2. CONSTRUÇÃO EXPLÍCITA: Cria o objeto final 'Post' com tipagem correta
      const postData: Post = {
        // Campos obrigatórios de 'Post'
        // Em adição, o ID deve ser obrigatório para `Post`, por isso o DataProvider deve lidar com a criação de ID.
        // Aqui, garantimos que o ID é string (vazio se for criação, UUID se for edição).
        id: id ?? '', // O DataProvider/Backend deve ignorar se for '' na criação.
        title, 
        slug, 
        content, 
        categoryId, 
        // Adicione validação para garantir que categoryName existe, 
        // ou busque/defina um padrão se necessário. Assumindo que o Context lida com isso.
        categoryName: categories.find(cat => cat.id === categoryId)?.name ?? "Sem Categoria",
        
        // Campos opcionais/padrão (garantindo valor string/boolean/undefined)
        keywords: post.keywords ?? '',
        metaDescription: post.metaDescription ?? '',
        coverImageUrl: post.coverImageUrl, // Pode ser undefined

        isActive: post.isActive ?? true,
        
        // Conversão de datas para ISO String
        publishDate: new Date(publishDate).toISOString(),
        expiryDate: post.expiryDate ? new Date(post.expiryDate).toISOString() : undefined,
        
        // Campos de metadados obrigatórios (Aqui usamos a data atual como um placeholder seguro)
        createdAt: new Date(), 
        updatedAt: new Date(),
      };

      // 3. Lógica do CRUD
      if (id) {
        // Edição: ID precisa ser um UUID válido
        await updatePost(postData);
      } else {
        // Criação: ID será gerado pelo backend/Context
        // Passa o objeto PostData completo (ID='' será ignorado)
        await addPost(postData); 
      }
      
      // Redireciona após sucesso
      router.push('/adminHome/artigos').catch(console.error);
    } catch (error) {
      const errorMessage = (error as Error).message || 'Erro desconhecido ao salvar o post.';
      console.error("Failed to save post:", error);
      setErrorMessage(`Falha ao salvar o post: ${errorMessage}`);
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
                width={80} // Defina width e height para o Next/Image
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
          <p className="text-xs text-gray-500 mt-1">O upload do arquivo (se selecionado) será processado e salvo no Vercel Blob.</p>
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
              {categories.map(cat => (
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
            onClick={() => router.push('/adminHome/artigos').catch(console.error)} 
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