"use client";
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
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

interface DataContextType {
  posts: Post[];
  activePosts: Post[];
  categories: Category[];
  getPost: (id: string) => Post | undefined;
  getPostBySlug: (slug: string) => Post | undefined;
  addPost: (post: Omit<Post, "id">) => Promise<Post>;
  updatePost: (post: Post) => Promise<Post>;
  deletePost: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, "id">) => Promise<Category>;
  updateCategory: (category: Category) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dbAvailable, setDbAvailable] = useState(true);

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

  const activePosts = posts
    .filter(
      (p) =>
        p.isActive &&
        new Date(p.publishDate) <= new Date() &&
        (!p.expiryDate || new Date(p.expiryDate) > new Date())
    )
    .sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );

  const getPost = (id: string) => posts.find((p) => p.id === id);
  const getPostBySlug = (slug: string) => posts.find((p) => p.slug === slug);

  // --- POSTS ---
  const addPost = async (data: Omit<Post, "id">): Promise<Post> => {
    if (!dbAvailable) {
      const newPost: Post = { ...data, id: uuidv4() };
      setPosts((prev) => [newPost, ...prev]);
      return newPost;
    }

    const post = await addPostAction(data);

    if (!post) throw new Error("Falha ao adicionar post");

    setPosts((prev) => [post, ...prev]);
    return post;
  };

  const updatePost = async (postData: Post): Promise<Post> => {
    if (!dbAvailable) {
      setPosts((prev) => prev.map((p) => (p.id === postData.id ? postData : p)));
      return postData;
    }

    const updated = await updatePostAction(postData);

    if (!updated) throw new Error("Falha ao atualizar post");

    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    return updated;
  };

  const deletePost = async (id: string): Promise<void> => {
    if (!dbAvailable) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      return;
    }
    await deletePostAction(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  // --- CATEGORIES ---
  const addCategory = async (data: Omit<Category, "id">): Promise<Category> => {
    if (!dbAvailable) {
      const newCategory: Category = { ...data, id: uuidv4() };
      setCategories((prev) => [...prev, newCategory]);
      return newCategory;
    }

    const category = await addCategoryAction(data.name);

    if (!category) throw new Error("Falha ao adicionar categoria");

    setCategories((prev) => [...prev, category]);
    return category;
  };

  const updateCategory = async (category: Category): Promise<Category> => {
    if (!dbAvailable) {
      setCategories((prev) => prev.map((c) => (c.id === category.id ? category : c)));
      return category;
    }

    const updated = await updateCategoryAction(category.id, category.name);

    if (!updated) throw new Error("Falha ao atualizar categoria");

    setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    return updated;
  };

  const deleteCategory = async (id: string): Promise<void> => {
    if (!dbAvailable) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      return;
    }
    await deleteCategoryAction(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

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
