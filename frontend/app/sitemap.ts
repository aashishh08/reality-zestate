import { MetadataRoute } from 'next';
import { getBlogs } from '@/lib/api/blogs';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://opulnzabode.com';

    // Get all blog posts
    let blogPosts: any[] = [];
    try {
        const blogResponse = await getBlogs({ limit: 1000 }, false);
        blogPosts = blogResponse.data || [];
    } catch (error) {
        console.error('Error fetching blogs for sitemap:', error);
    }

    // Static pages
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/blogs`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
    ];

    // Blog post pages
    const blogPages = blogPosts.map((post) => ({
        url: `${baseUrl}/blogs/${post.slug}`,
        lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [...staticPages, ...blogPages];
}
