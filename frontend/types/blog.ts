export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    author: {
        name: string;
        avatar?: string;
        bio?: string;
    };
    publishedAt: string;
    createdAt?: string;
    updatedAt?: string;
    featuredImage: string;
    category: BlogCategory;
    tags: string[];
    readTime: number; // in minutes
    seo?: {
        metaTitle?: string;
        metaDescription?: string;
        keywords?: string[];
        ogImage?: string;
    };
}

export interface BlogCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
}

export interface BlogListResponse {
    posts: BlogPost[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface BlogFilters {
    category?: string;
    tag?: string;
    search?: string;
    page?: number;
    pageSize?: number;
}
