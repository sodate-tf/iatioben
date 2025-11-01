'use client';

import React, { useState } from 'react';
import { useData } from '@/app/adminTioBen/contexts/DataContext';
import type { Category } from '@/app/adminTioBen/types';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';

const CategoriesPage: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useData();
  const [currentCategory, setCurrentCategory] = useState<Partial<Category> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectCategory = (category: Category) => {
    setCurrentCategory(category);
  };

  const handleAddNew = () => {
    setCurrentCategory({ name: '' });
  };

  const handleCancel = () => {
    setCurrentCategory(null);
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentCategory) {
      setCurrentCategory({ ...currentCategory, name: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCategory?.name?.trim()) {
      setError('Informe um nome para a categoria.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      if (currentCategory.id) {
        await updateCategory(currentCategory as Category);
      } else {
        await addCategory({ name: currentCategory.name.trim() });
      }
      setCurrentCategory(null);
    } catch (err) {
      console.error('Erro ao salvar categoria:', err);
      setError('Falha ao salvar categoria. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria? Isso pode afetar posts existentes.')) {
      await deleteCategory(id);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      {/* 🔹 Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Gerenciar Categorias</h2>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium"
        >
          <Plus size={18} />
          Nova Categoria
        </button>
      </div>

      {/* 🔹 Corpo principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lista de categorias */}
        <div className={`md:col-span-${currentCategory ? '2' : '3'} bg-card p-5 rounded-xl shadow-sm border border-border`}>
          <h3 className="text-lg font-semibold mb-4">Categorias Existentes</h3>
          {categories.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhuma categoria cadastrada ainda.</p>
          ) : (
            <ul className="divide-y divide-border">
              {categories.map((cat) => (
                <li key={cat.id} className="py-3 flex justify-between items-center">
                  <span className="text-foreground font-medium">{cat.name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSelectCategory(cat)}
                      className="p-2 rounded-md hover:bg-muted text-primary transition"
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-2 rounded-md hover:bg-muted text-destructive transition"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Formulário de edição/criação */}
        {currentCategory && (
          <div className="bg-card p-5 rounded-xl shadow-sm border border-border animate-in fade-in slide-in-from-right duration-300">
            <h3 className="text-lg font-semibold mb-4">
              {currentCategory.id ? 'Editar Categoria' : 'Nova Categoria'}
            </h3>
            {error && (
              <div className="mb-3 p-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="categoryName"
                  className="block text-sm font-medium text-muted-foreground mb-1"
                >
                  Nome
                </label>
                <input
                  id="categoryName"
                  type="text"
                  value={currentCategory.name ?? ''}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background p-2 focus:ring-2 focus:ring-primary"
                  placeholder="Digite o nome da categoria..."
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-md border border-border bg-muted hover:bg-muted/70 transition text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition text-sm disabled:opacity-60"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
