'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import { useData } from '@/app/adminTioBen/contexts/DataContext';
import type { Post } from '@/app/adminTioBen/types';

const PostsListPage: React.FC = () => {
  const router = useRouter();
  const { posts, deletePost, categories } = useData();

  /** Ordena os posts do mais recente ao mais antigo */
  const sortedPosts = useMemo(
    () =>
      [...posts].sort(
        (a, b) =>
          new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      ),
    [posts]
  );

  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name || 'Sem Categoria';

  const handleDelete = async (id: string) => {
    if (confirm('Deseja realmente excluir este post?')) {
      await deletePost(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* 🔹 Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          <span>Gerenciar Posts</span>
        </h2>
        <Link
          href="/adminHome/artigos/cadastrar-editar"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition"
        >
          <Plus size={18} />
          Novo Post
        </Link>
      </div>

      {/* 🔹 Corpo */}
      {sortedPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
          <FileText className="w-10 h-10 mb-3 opacity-60" />
          <p className="text-sm">Nenhum post encontrado.</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl shadow-md overflow-hidden border border-border">
          {/* 📱 Mobile-first: lista empilhada */}
          <div className="sm:hidden divide-y divide-border">
            {sortedPosts.map((post) => (
              <div key={post.id} className="p-4 space-y-1">
                <h3 className="font-semibold text-base text-foreground">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {getCategoryName(post.categoryId)} •{' '}
                  {new Date(post.publishDate).toLocaleDateString('pt-BR')}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      post.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {post.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        router.push(`/adminHome/artigos/cadastrar-editar/${post.id}`)
                      }
                      className="p-2 rounded-md text-primary hover:bg-muted transition"
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 rounded-md text-destructive hover:bg-muted transition"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 💻 Versão Desktop */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-3">Título</th>
                  <th className="px-6 py-3">Categoria</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Publicação</th>
                  <th className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {sortedPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-muted/30 transition-colors border-t border-border"
                  >
                    <td className="px-6 py-4 font-medium text-foreground">
                      {post.title}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {getCategoryName(post.categoryId)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                          post.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {post.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(post.publishDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-3">
                      <button
                        onClick={() =>
                          router.push(`/adminHome/artigos/cadastrar-editar/${post.id}`)
                        }
                        className="p-2 rounded-md text-primary hover:bg-muted transition"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 rounded-md text-destructive hover:bg-muted transition"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsListPage;
