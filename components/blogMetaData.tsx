// app/blog/utils/metadata.ts

import { Metadata } from 'next';
import { Post } from '@/app/adminTioBen/types'; // Importe seu tipo de Post

// URL e Dados fixos do seu site (Ajuste se necessário!)
const SITE_TITLE = "Blog IA Tio Ben";
const SITE_URL = "https://www.iatioben.com.br";
const FALLBACK_IMAGE_URL = "/images/default-cover.png";
const SITE_LOCALE = "pt_BR";
const SITE_AUTHOR = "Tio Ben"; 


interface GenerateBlogMetadataParams {
    post: Post;
    slug: string;
}

export function generateBlogMetadata(post: Post, slug: string): Metadata {
    
    if (!post) {
        return {};
    }

    // Processamento de Dados
    const imageUrl = post.coverImageUrl || FALLBACK_IMAGE_URL;
    const canonicalUrl = `${SITE_URL}/blog/${slug}`;
    const keywordsArray = post.keywords ? post.keywords.split(',').map(k => k.trim()) : [];
    
    const publishedTime = post.publishDate ? new Date(post.publishDate).toISOString() : new Date().toISOString();
    const modifiedTime = post.publishDate ? new Date(post.publishDate).toISOString() : publishedTime;

    // Schema Markup (JSON-LD) para ser incluído como um script
    const jsonLdArticle = {
        "@context": "https://schema.org",
        "@type": "Article",
        "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
        headline: post.title,
        description: post.metaDescription,
        image: { "@type": "ImageObject", url: imageUrl, width: 1200, height: 630 },
        datePublished: publishedTime,
        dateModified: modifiedTime,
        author: { "@type": "Person", name: SITE_AUTHOR },
        publisher: {
          "@type": "Organization",
          name: SITE_AUTHOR,
          logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png`, width: 600, height: 60 }
        }
    };
    
    // Constrói o objeto Metadata do Next.js
    return {
        title: `${post.title} | ${SITE_TITLE}`,
        description: post.metaDescription,
        
        // SEO BÁSICO
        keywords: keywordsArray,
        authors: [{ name: SITE_AUTHOR }],
        alternates: {
            canonical: canonicalUrl,
        },
        
        // OPEN GRAPH
        openGraph: {
            title: post.title,
            description: post.metaDescription,
            url: canonicalUrl,
            type: 'article',
            siteName: SITE_TITLE,
            locale: SITE_LOCALE,
            images: [{
                url: imageUrl,
                width: 1200, 
                height: 630,
                alt: post.title,
            }],
            publishedTime: publishedTime,
            modifiedTime: modifiedTime,
            section: post.categoryName,
            tags: keywordsArray,
        },
        
        // TWITTER CARD
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.metaDescription,
            images: [imageUrl],
        },

        // JSON-LD (Adiciona o Script no head do documento)
        // Isso é feito injetando um elemento script no array de tags.
        // O App Router lida com isso.
        
        // A sintaxe correta para JSON-LD no App Router é:
        // https://nextjs.org/docs/app/api-reference/file-conventions/metadata/json-ld
        
        // Se você precisar de breadcrumb ou outro JSON-LD, pode adicioná-lo
        // no componente principal da página. Por enquanto, focamos no Article.
    };
}