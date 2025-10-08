"use client";

import React from 'react';
import { useRouter } from 'next/navigation'; // 👈 CORREÇÃO: Usando useRouter do Next.js
import Link from 'next/link';             // 👈 CORREÇÃO: Usando Link do Next.js
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Post } from '@/app/adminTioBen/types';
import { useData } from '../app/adminTioBen/contexts/DataContext'; 

const PostsListPage = () => {
  const { posts, deletePost, categories } = useData();
  const router = useRouter(); // 👈 Inicializa o hook de roteamento do Next.js

  // CORREÇÃO: Substituir window.confirm por uma mensagem no console para evitar erros no iFrame.
  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este post?')) {
      await deletePost(id);
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Sem Categoria';
  };
  
  // Ordena os posts pelo mais recente primeiro
  const sortedPosts = [...posts].sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Gerenciar Posts</h2>
        {/* CORREÇÃO: Link usa 'href' e caminho ajustado para '/adminTioBen/posts/new' */}
        <Link
          href="/adminHome/artigos/cadastrar-editar"
          className="inline-flex items-center gap-2 px-4 py-2 font-bold text-white bg-primary rounded-md hover:bg-blue-800 transition-colors"
        >
          <Plus size={18} />
          Novo Post
        </Link>
      </div>
      <div className="bg-surface rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Título
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Categoria
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Data de Publicação
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedPosts.map((post: Post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-text-primary">{post.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text-secondary">{getCategoryName(post.categoryId)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {post.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    {new Date(post.publishDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {/* CORREÇÃO: Usando router.push() e caminho ajustado para '/adminTioBen/posts/edit/[id]' */}
                    <button onClick={() => router.push(`/AdminHome/artigos/cadastrar-editar/${post.id}`)} className="text-primary hover:text-blue-800 mr-4 p-1 rounded-full hover:bg-blue-100 transition-colors">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PostsListPage;
