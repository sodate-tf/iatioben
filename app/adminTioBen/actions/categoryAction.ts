"use server";

// Importa a função SQL do SDK do Vercel Postgres, que lida com a conexão segura.
import { QueryResultRow, sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { Category } from '../types';

/**
 * Interface para a estrutura de dados bruta (raw) vinda do banco de dados.
 */
interface RawCategoryRow {
  id: number | string; // ID pode vir como número ou string do BD
  name: string;
  created_at: string; // Datas geralmente vêm como strings do BD
  updated_at: string;
}

/**
 * Normaliza o objeto de categoria retornado pelo Neon para o tipo Category local.
 * Esta função foi tornada INTERNA (sem export) para evitar o erro do Next.js, 
 * pois ela é síncrona e não uma Server Action.
 * * @param row - O resultado de uma linha do Neon/Postgres.
 */
const normalizeCategory = (row: QueryResultRow): Category => {
  const typedRow = row as RawCategoryRow;
  return {
    id: typedRow.id.toString(), 
    name: typedRow.name,
    createdAt: new Date(typedRow.created_at),
    updatedAt: new Date(typedRow.updated_at), 
  };
};

/**
 * -------------------
 * Rota: READ (Listar todas as categorias)
 * -------------------
 */
export async function getCategoriesAction(): Promise<Category[]> {
  try {
    const { rows } = await sql`
      SELECT id, name, created_at, updated_at FROM categories ORDER BY name ASC;
    `;
    return rows.map(normalizeCategory);
  } catch (error) {
    console.error("ERRO NEON/READ: Falha ao buscar categorias:", error);
    return [];
  }
}

/**
 * -------------------
 * Rota: CREATE (Adicionar uma nova categoria)
 * -------------------
 */
export async function addCategoryAction(name: string): Promise<Category | null> {
  if (!name || name.trim() === '') return null;
  
  try {
    const result = await sql.query(
      `INSERT INTO categories (name, created_at, updated_at)
       VALUES ($1, NOW(), NOW()) RETURNING id, name, created_at, updated_at;`,
      [name.trim()]
    );

    // Revalida o cache do path para garantir que o cliente veja a mudança imediatamente.
    revalidatePath('/adminTioBen/categories');
    return result.rows.length > 0 ? normalizeCategory(result.rows[0]) : null;

  } catch (error) {
    console.error("ERRO NEON/CREATE: Falha ao adicionar categoria:", error);
    throw new Error('Falha ao adicionar categoria no banco de dados.');
  }
}

/**
 * -------------------
 * Rota: UPDATE (Atualizar uma categoria existente)
 * -------------------
 */
export async function updateCategoryAction(id: string, name: string): Promise<Category | null> {
  if (!id || !name || name.trim() === '') return null;

  try {
    const result = await sql.query(
      `UPDATE categories 
       SET name = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING id, name, created_at, updated_at;`,
      [name.trim(), id]
    );

    revalidatePath('/adminTioBen/categories');
    return result.rows.length > 0 ? normalizeCategory(result.rows[0]) : null;

  } catch (error) {
    console.error(`ERRO NEON/UPDATE: Falha ao atualizar categoria ${id}:`, error);
    throw new Error('Falha ao atualizar categoria no banco de dados.');
  }
}

/**
 * -------------------
 * Rota: DELETE (Excluir uma categoria)
 * -------------------
 */
export async function deleteCategoryAction(id: string): Promise<boolean> {
  if (!id) return false;

  try {
    // Nota: É recomendável verificar dependências (posts) antes de deletar ou usar ON DELETE CASCADE.
    await sql.query(`DELETE FROM categories WHERE id = $1;`, [id]);
    
    revalidatePath('/adminTioBen/categories');
    return true;

  } catch (error) {
    console.error(`ERRO NEON/DELETE: Falha ao deletar categoria ${id}:`, error);
    // Lançamos o erro para que o DataContext possa notificar o cliente.
    throw new Error('Falha ao excluir categoria no banco de dados.');
  }
}
