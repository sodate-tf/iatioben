"use server";

import { QueryResultRow, sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { Post } from "../types";

// Função auxiliar para validar o formato UUID v4
// Removido 'export'
function isValidUuid(id: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
}
// Tipagem mínima para o sitemap
interface SitemapPostData {
  slug: string;
  updatedAt: Date;
}

/**
 * Normaliza o objeto retornado do Neon/Postgres para o tipo SitemapPostData.
 * @param row - Linha retornada do banco de dados.
 */
const normalizeSitemapPost = (row: QueryResultRow): SitemapPostData => ({
    slug: row.slug,
    updatedAt: new Date(row.updated_at),
});

/**
 * Normaliza o objeto retornado do Neon/Postgres para o tipo Post local.
 * Removido 'export'
 * @param row - Linha retornada do banco de dados.
 */
const normalizePost = (row: QueryResultRow): Post => ({
    id: row.id.toString(),
    title: row.title,
    slug: row.slug,
    keywords: row.keywords,
    metaDescription: row.meta_description,
    content: row.content,
    categoryId: row.category_id?.toString(),
    categoryName: row.category_name, // Correção: O JOIN usa category_name
    isActive: row.is_active,
    publishDate: row.publish_date ? new Date(row.publish_date).toISOString() : "",
    expiryDate: row.expiry_date ? new Date(row.expiry_date).toISOString() : undefined,
    coverImageUrl: row.cover_image_url,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
});


export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const { rows } = await sql`
      SELECT 
        p.id,
        p.title,
        p.slug,
        p.content,
        p.meta_description AS "metaDescription",
        p.cover_image_url AS "coverImageUrl",
        p.keywords,
        c.name AS "categoryName",
        p.publish_date AS "publishDate",
        p.updated_at AS "updatedAt"
      FROM posts p JOIN categories c ON c.id = p.category_id
      WHERE p.slug = ${slug}
      LIMIT 1;
    `;

    if (rows.length === 0) return null;
    return rows[0] as Post;
  } catch (error) {
    console.error("Erro ao buscar post pelo slug:", error);
    return null;
  }
}

/**
 * -------------------
 * Nova Função: Obter posts ativos para o Sitemap
 * -------------------
 */

export async function getPublishedPostsForSitemapAction(): Promise<SitemapPostData[]> {
    try {
        const now = new Date().toISOString();
        
        const { rows } = await sql`
            SELECT 
              slug,
              COALESCE(updated_at, created_at) AS updated_at
            FROM posts                      
            ORDER BY updated_at DESC;
        `;

        return rows.map(normalizeSitemapPost);
    } catch (error) {
        console.error("ERRO NEON/SITEMAP: Falha ao buscar posts ativos:", error);
        return [];
    }
}


/**
 * -------------------
 * Rota: READ (Listar todos os posts)
 * -------------------
 */
export async function getPostsAction(): Promise<Post[]> {
    try {
        // Renomeei 'c.name' para 'category_name' para consistência no normalizePost
        const { rows } = await sql`
            SELECT 
              p.id, 
              p.title, 
              p.slug, 
              c.name AS category_name, 
              p.keywords, 
              p.meta_description, 
              p.content, 
              p.category_id, 
              p.is_active, 
              p.publish_date, 
              p.expiry_date, 
              p.cover_image_url, 
              p.created_at, 
              p.updated_at
            FROM posts p
            LEFT JOIN categories c ON p.category_id = c.id -- Use LEFT JOIN caso o category_id seja null
            ORDER BY p.publish_date DESC;
          `;

        return rows.map(normalizePost);
    } catch (error) {
        console.error("ERRO NEON/READ: Falha ao buscar posts:", error);
        return [];
    }
}

/**
 * -------------------
 * Rota: CREATE (Adicionar um novo post)
 * -------------------
 */
export async function addPostAction(post: Omit<Post, "id">): Promise<Post | null> {
    try {
        const result = await sql.query(
            `
            INSERT INTO posts 
              (title, slug, keywords, meta_description, content, category_id, is_active, publish_date, expiry_date, cover_image_url, created_at, updated_at)
            VALUES 
              ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
            RETURNING id, title, slug, keywords, meta_description, content, category_id, is_active, publish_date, expiry_date, cover_image_url, created_at, updated_at;
            `,
            [
                post.title,
                post.slug,
                post.keywords,
                post.metaDescription,
                post.content,
                post.categoryId,
                post.isActive,
                post.publishDate,
                post.expiryDate ?? null,
                post.coverImageUrl,
            ]
        );

        revalidatePath("/adminTioBen/posts");
        // Nota: Para retornar o objeto Post completo com o categoryName, 
        // seria necessário fazer um novo JOIN ou chamar a getPostActionById.
        // Por simplicidade, retornamos a versão sem categoryName (que deve ser resolvida pelo revalidatePath no lado do cliente).
        return result.rows.length > 0 ? normalizePost(result.rows[0]) : null;
    } catch (error) {
        console.error("ERRO NEON/CREATE: Falha ao adicionar post:", error);
        throw new Error("Falha ao adicionar post no banco de dados.");
    }
}

/**
 * -------------------
 * Rota: UPDATE (Atualizar um post existente)
 * -------------------
 */
export async function updatePostAction(post: Post): Promise<Post | null> {
    if (!post.id) throw new Error("ID do post não informado.");
    
    // CORREÇÃO: Garante que o ID tem o formato UUID antes de enviar para o DB
    if (!isValidUuid(post.id)) {
        console.error(`ERRO NEON/UPDATE: ID inválido: ${post.id}`);
        throw new Error(`ID de post inválido ('${post.id}'). A operação de atualização foi bloqueada.`);
    }

    try {
        const result = await sql.query(
            `
            UPDATE posts SET
              title = $1,
              slug = $2,
              keywords = $3,
              meta_description = $4,
              content = $5,
              category_id = $6,
              is_active = $7,
              publish_date = $8,
              expiry_date = $9,
              cover_image_url = $10,
              updated_at = NOW()
            WHERE id = $11
            RETURNING id, title, slug, keywords, meta_description, content, category_id, is_active, publish_date, expiry_date, cover_image_url, created_at, updated_at;
            `,
            [
                post.title,
                post.slug,
                post.keywords,
                post.metaDescription,
                post.content,
                post.categoryId,
                post.isActive,
                post.publishDate,
                post.expiryDate ?? null,
                post.coverImageUrl,
                post.id,
            ]
        );

        revalidatePath("/adminTioBen/posts");
        // Nota: Idem a addPostAction, retorna a row bruta do post.
        return result.rows.length > 0 ? normalizePost(result.rows[0]) : null;
    } catch (error) {
        console.error(`ERRO NEON/UPDATE: Falha ao atualizar post ${post.id}:`, error);
        throw new Error("Falha na operação de atualização do post.");
    }
}

/**
 * -------------------
 * Rota: DELETE (Excluir um post)
 * -------------------
 */
export async function deletePostAction(id: string): Promise<boolean> {
    if (!id) return false;

    try {
        await sql.query(`DELETE FROM posts WHERE id = $1;`, [id]);
        revalidatePath("/adminTioBen/posts");
        return true;
    } catch (error) {
        console.error(`ERRO NEON/DELETE: Falha ao deletar post ${id}:`, error);
        throw new Error("Falha ao excluir post no banco de dados.");
    }
}
