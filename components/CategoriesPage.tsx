"use client"
import React, { useState } from 'react';
import { useData } from '../app/adminTioBen/contexts/DataContext';
import type { Category } from '../app/adminTioBen/types';

const CategoriesPage = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useData();
  const [currentCategory, setCurrentCategory] = useState<Partial<Category> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSelectCategory = (category: Category) => {
    setCurrentCategory(category);
  };

  const handleAddNew = () => {
    setCurrentCategory({ name: '' });
  };
  
  const handleCancel = () => {
    setCurrentCategory(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentCategory) {
      setCurrentCategory({ ...currentCategory, name: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCategory || !currentCategory.name) return;
    setIsSaving(true);
    
    try {
        if (currentCategory.id) {
            await updateCategory(currentCategory as Category);
        } else {
            await addCategory({ name: currentCategory.name });
        }
    } catch (error) {
        console.error("Failed to save category", error);
        alert("Falha ao salvar categoria.");
    } finally {
        setIsSaving(false);
        setCurrentCategory(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria? Isso pode afetar posts existentes.')) {
      await deleteCategory(id);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-text-primary mb-6">Gerenciar Categorias</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-surface p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Categorias Existentes</h3>
                <button
                    onClick={handleAddNew}
                    className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-md hover:bg-blue-800 transition-colors"
                    >
                    Nova Categoria
                </button>
            </div>
          
            <ul className="divide-y divide-gray-200">
                {categories.map(cat => (
                <li key={cat.id} className="py-3 flex justify-between items-center">
                    <span className="text-text-primary">{cat.name}</span>
                    <div>
                    <button onClick={() => handleSelectCategory(cat)} className="text-sm text-primary hover:text-blue-800 mr-4">
                        Editar
                    </button>
                    <button onClick={() => handleDelete(cat.id)} className="text-sm text-red-600 hover:text-red-900">
                        Excluir
                    </button>
                    </div>
                </li>
                ))}
            </ul>
        </div>

        {currentCategory && (
            <div className="md:col-span-1 bg-surface p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">{currentCategory.id ? 'Editar Categoria' : 'Nova Categoria'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="categoryName" className="block text-sm font-medium text-text-secondary">Nome</label>
                        <input
                        type="text"
                        id="categoryName"
                        value={currentCategory.name || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                        required
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={handleCancel} className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
                            Cancelar
                        </button>
                        <button type="submit" disabled={isSaving} className="px-3 py-1.5 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-blue-800 disabled:opacity-50">
                            {isSaving ? 'Salvando...' : 'Salvar'}
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
