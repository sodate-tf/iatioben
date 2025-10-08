"use client";
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useMemo } from "react";
import type { Post, Category } from "../types";
import { v4 as uuidv4 } from "uuid";

import {
  getCategoriesAction,
  addCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/app/adminTioBen/actions/categoryAction";

import {
  getPostsAction,
  addPostAction,
  updatePostAction,
  deletePostAction,
} from "@/app/adminTioBen/actions/postAction";

// Definição de Tipos para consistência
type NewPostData = Omit<Post, "id">;
type NewCategoryData = Omit<Category, "id">;

// Tipagem atualizada para incluir FormData
interface DataContextType {
  posts: Post[];
  activePosts: Post[];
  categories: Category[];
  getPost: (id: string) => Post | undefined;
  getPostBySlug: (slug: string) => Post | undefined;
  // Refatorado para aceitar FormData opcional
  addPost: (post: NewPostData, formData?: FormData) => Promise<Post>;
  updatePost: (post: Post, formData?: FormData) => Promise<Post>;
  deletePost: (id: string) => Promise<void>;
  addCategory: (category: NewCategoryData) => Promise<Category>;
  updateCategory: (category: Category) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dbAvailable, setDbAvailable] = useState<boolean>(true);

  // Carrega dados iniciais
  useEffect(() => {
    async function loadData() {
      try {
        const [cat, pst] = await Promise.all([
          getCategoriesAction(),
          getPostsAction(),
        ]);
        setCategories(cat);
        setPosts(pst);
      } catch (err) {
        console.warn("⚠️ Neon indisponível, usando dados mock:", err);
        setDbAvailable(false);
      }
    }
    loadData();
  }, []);

  // Posts ativos e ordenados (usando useMemo para otimização)
  const activePosts: Post[] = useMemo(() => {
    return posts
      .filter((p: Post) => {
        const publishDate = new Date(p.publishDate);
        const expiryDate = p.expiryDate ? new Date(p.expiryDate) : null;
        const now = new Date();

        return (
          p.isActive &&
          publishDate <= now &&
          (!expiryDate || expiryDate > now)
        );
      })
      .sort((a, b) => {
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      });
  }, [posts]);

  // Helpers para busca (usando useCallback para otimização)
  const getPost = useCallback((id: string): Post | undefined => posts.find((p) => p.id === id), [posts]);
  const getPostBySlug = useCallback((slug: string): Post | undefined => posts.find((p) => p.slug === slug), [posts]);


  // --- FUNÇÃO CENTRALIZADA DE MANIPULAÇÃO DA API DE POSTS (inclui Upload) ---
  const handlePostApiCall = useCallback(async (
    endpoint: string,
    postData: Post,
    formData?: FormData,
  ): Promise<Post> => {
    let response: Response;
    
    if (formData) {
      // Requisição com FormData (Upload para Vercel Blob via Route Handler)
      response = await fetch(endpoint, {
        method: 'POST', 
        body: formData,
      });
    } else {
      // Requisição sem arquivo (apenas dados JSON - atualização simples/sem imagem)
      response = await fetch(endpoint, {
        method: 'POST', // O Route Handler pode ser simplificado para POST, mas um método mais apropriado como PUT/PATCH pode ser usado dependendo da convenção. Manter POST por consistência com FormData.
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
    }

    if (!response.ok) {
      const errorData: { message?: string } = await response.json().catch(() => ({ message: 'Erro de API desconhecido.' }));
      const errorMessage: string = errorData.message || 'Falha na comunicação com o servidor ao salvar o post.';
      throw new Error(errorMessage);
    }

    const result: Post = await response.json();
    return result;
  }, []);


  // --- POSTS ---
  const addPost = useCallback(async (data: NewPostData, formData?: FormData): Promise<Post> => {
    if (!dbAvailable) {
      const newPost: Post = { ...data, id: uuidv4() };
      setPosts((prev) => [newPost, ...prev]);
      return newPost;
    }

    let post: Post;

    if (formData) {
      // Chama a API de upload/salvamento
      post = await handlePostApiCall('/api/posts/upload', { ...data, id: uuidv4() }, formData);
    } else {
      // Chama a Server Action simples (sem upload)
      const actionResult = await addPostAction(data);
      if (!actionResult) throw new Error("Falha ao adicionar post via Server Action");
      post = actionResult;
    }

    setPosts((prev) => [post, ...prev]);
    return post;
  }, [dbAvailable, handlePostApiCall]);


  const updatePost = useCallback(async (postData: Post, formData?: FormData): Promise<Post> => {
    if (!dbAvailable) {
      setPosts((prev) => prev.map((p) => (p.id === postData.id ? postData : p)));
      return postData;
    }

    let updated: Post;

    if (formData) {
      // Chama a API de upload/atualização
      updated = await handlePostApiCall('/api/posts/upload', postData, formData);
    } else {
      // Chama a Server Action simples (sem upload)
      const actionResult = await updatePostAction(postData);
      if (!actionResult) throw new Error("Falha ao atualizar post via Server Action");
      updated = actionResult;
    }

    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    return updated;
  }, [dbAvailable, handlePostApiCall]);


  const deletePost = useCallback(async (id: string): Promise<void> => {
    if (!dbAvailable) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      return;
    }
    
    // CORREÇÃO: Chamar a API de delete de postagem se for necessário deletar a imagem do Blob
    // Por enquanto, apenas deletamos do DB via Server Action.
    await deletePostAction(id); 
    
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }, [dbAvailable]);


  // --- CATEGORIES ---
  // Mantidas com useCallback e tipagem rigorosa
  const addCategory = useCallback(async (data: NewCategoryData): Promise<Category> => {
    if (!dbAvailable) {
      const newCategory: Category = { ...data, id: uuidv4() };
      setCategories((prev) => [...prev, newCategory]);
      return newCategory;
    }

    const category = await addCategoryAction(data.name);

    if (!category) throw new Error("Falha ao adicionar categoria");

    setCategories((prev) => [...prev, category]);
    return category;
  }, [dbAvailable]);

  const updateCategory = useCallback(async (category: Category): Promise<Category> => {
    if (!dbAvailable) {
      setCategories((prev) => prev.map((c) => (c.id === category.id ? category : c)));
      return category;
    }

    const updated = await updateCategoryAction(category.id, category.name);

    if (!updated) throw new Error("Falha ao atualizar categoria");

    setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    return updated;
  }, [dbAvailable]);

  const deleteCategory = useCallback(async (id: string): Promise<void> => {
    if (!dbAvailable) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      return;
    }
    await deleteCategoryAction(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, [dbAvailable]);


  return (
    <DataContext.Provider
      value={{
        posts,
        activePosts,
        categories,
        getPost,
        getPostBySlug,
        addPost,
        updatePost,
        deletePost,
        addCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};