import { BlogPost, BlogListResponse, BlogFilters, BlogCategory } from '@/types/blog';

// This will be replaced with actual API calls when CRM is ready
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Fetch all blog posts with optional filters
 * This function will be used with ISR for optimal performance
 */
export async function getBlogPosts(filters?: BlogFilters): Promise<BlogListResponse> {
    try {
        const params = new URLSearchParams();
        if (filters?.category) params.append('category', filters.category);
        if (filters?.tag) params.append('tag', filters.tag);
        if (filters?.search) params.append('search', filters.search);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());

        const url = `${API_BASE_URL}/blogs?${params.toString()}`;

        // For now, return mock data. Replace with actual fetch when API is ready
        // const response = await fetch(url, { next: { revalidate: 3600 } }); // ISR: revalidate every hour
        // return response.json();

        return getMockBlogPosts(filters);
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        throw error;
    }
}

/**
 * Fetch a single blog post by slug
 * This function will be used with SSR for fresh content
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
        // For now, return mock data. Replace with actual fetch when API is ready
        // const response = await fetch(`${API_BASE_URL}/blogs/${slug}`, { cache: 'no-store' }); // SSR
        // if (!response.ok) return null;
        // return response.json();

        const mockPosts = getMockBlogPosts();
        return mockPosts.posts.find(post => post.slug === slug) || null;
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return null;
    }
}

/**
 * Fetch all blog categories
 */
export async function getBlogCategories(): Promise<BlogCategory[]> {
    try {
        // For now, return mock data. Replace with actual fetch when API is ready
        // const response = await fetch(`${API_BASE_URL}/blogs/categories`, { next: { revalidate: 86400 } }); // Cache for 24 hours
        // return response.json();

        return getMockCategories();
    } catch (error) {
        console.error('Error fetching blog categories:', error);
        throw error;
    }
}

/**
 * Get all blog slugs for static generation
 */
export async function getAllBlogSlugs(): Promise<string[]> {
    try {
        const posts = await getBlogPosts({ pageSize: 1000 });
        return posts.posts.map(post => post.slug);
    } catch (error) {
        console.error('Error fetching blog slugs:', error);
        return [];
    }
}

// Mock data functions (to be removed when API is ready)
function getMockCategories(): BlogCategory[] {
    return [
        { id: '1', name: 'Luxury Living', slug: 'luxury-living', description: 'Insights into luxury real estate and premium living' },
        { id: '2', name: 'Investment Guide', slug: 'investment-guide', description: 'Expert advice on property investment' },
        { id: '3', name: 'Market Trends', slug: 'market-trends', description: 'Latest trends in the real estate market' },
        { id: '4', name: 'Design & Architecture', slug: 'design-architecture', description: 'Beautiful designs and architectural marvels' },
    ];
}

function getMockBlogPosts(filters?: BlogFilters): BlogListResponse {
    const allPosts: BlogPost[] = [
        {
            id: '1',
            slug: 'luxury-penthouses-gurgaon-2026',
            title: 'Top 10 Luxury Penthouses in Gurgaon for 2026',
            excerpt: 'Discover the most exclusive penthouses in Gurgaon that redefine luxury living with breathtaking views and world-class amenities.',
            content: `<p>Gurgaon has emerged as one of India's premier destinations for luxury real estate...</p>`,
            author: {
                name: 'Priya Sharma',
                bio: 'Luxury Real Estate Consultant with 10+ years of experience'
            },
            publishedAt: '2026-01-10T10:00:00Z',
            featuredImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
            category: { id: '1', name: 'Luxury Living', slug: 'luxury-living' },
            tags: ['penthouses', 'gurgaon', 'luxury', 'investment'],
            readTime: 8,
            seo: {
                metaTitle: 'Top 10 Luxury Penthouses in Gurgaon 2026 | Opulnz Abode',
                metaDescription: 'Explore the most exclusive luxury penthouses in Gurgaon. Premium properties with world-class amenities and stunning views.',
                keywords: ['luxury penthouses gurgaon', 'premium apartments', 'gurgaon real estate'],
                ogImage: '/images/blog/luxury-penthouse-og.jpg'
            }
        },
        {
            id: '2',
            slug: 'real-estate-investment-guide-2026',
            title: 'Real Estate Investment Guide: Where to Invest in 2026',
            excerpt: 'A comprehensive guide to making smart real estate investments in India\'s top cities with expert insights and market analysis.',
            content: `<p>The Indian real estate market is poised for significant growth in 2026...</p>`,
            author: {
                name: 'Rajesh Kumar',
                bio: 'Investment Advisor specializing in Real Estate'
            },
            publishedAt: '2026-01-08T14:30:00Z',
            featuredImage: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            category: { id: '2', name: 'Investment Guide', slug: 'investment-guide' },
            tags: ['investment', 'guide', 'market analysis', '2026'],
            readTime: 12,
            seo: {
                metaTitle: 'Real Estate Investment Guide 2026 | Expert Tips & Analysis',
                metaDescription: 'Make informed real estate investment decisions with our comprehensive 2026 guide. Expert insights on India\'s top property markets.',
                keywords: ['real estate investment', 'property investment guide', 'india real estate 2026'],
            }
        },
        {
            id: '3',
            slug: 'sustainable-luxury-homes-india',
            title: 'The Rise of Sustainable Luxury Homes in India',
            excerpt: 'How eco-friendly design and sustainable practices are shaping the future of luxury real estate in India.',
            content: `<p>Sustainability is no longer just a buzzword in the luxury real estate sector...</p>`,
            author: {
                name: 'Anita Desai',
                bio: 'Sustainable Architecture Specialist'
            },
            publishedAt: '2026-01-05T09:00:00Z',
            featuredImage: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            category: { id: '4', name: 'Design & Architecture', slug: 'design-architecture' },
            tags: ['sustainable', 'eco-friendly', 'luxury homes', 'green architecture'],
            readTime: 10,
            seo: {
                metaTitle: 'Sustainable Luxury Homes in India | Eco-Friendly Living',
                metaDescription: 'Discover how sustainable design is revolutionizing luxury real estate in India. Eco-friendly homes with premium amenities.',
                keywords: ['sustainable luxury homes', 'eco-friendly real estate', 'green architecture india'],
            }
        },
        {
            id: '4',
            slug: 'mumbai-real-estate-market-trends-2026',
            title: 'Mumbai Real Estate Market Trends for 2026',
            excerpt: 'An in-depth analysis of Mumbai\'s real estate market, including price trends, emerging localities, and investment opportunities.',
            content: `<p>Mumbai continues to be India's most dynamic real estate market...</p>`,
            author: {
                name: 'Vikram Mehta',
                bio: 'Real Estate Market Analyst'
            },
            publishedAt: '2026-01-03T11:00:00Z',
            featuredImage: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            category: { id: '3', name: 'Market Trends', slug: 'market-trends' },
            tags: ['mumbai', 'market trends', 'analysis', 'investment'],
            readTime: 15,
            seo: {
                metaTitle: 'Mumbai Real Estate Market Trends 2026 | Market Analysis',
                metaDescription: 'Complete analysis of Mumbai real estate market trends for 2026. Price forecasts, emerging areas, and investment insights.',
                keywords: ['mumbai real estate', 'market trends 2026', 'mumbai property market'],
            }
        },
    ];

    let filteredPosts = [...allPosts];

    // Apply filters
    if (filters?.category) {
        filteredPosts = filteredPosts.filter(post => post.category.slug === filters.category);
    }
    if (filters?.tag) {
        filteredPosts = filteredPosts.filter(post => post.tags.includes(filters.tag!));
    }
    if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredPosts = filteredPosts.filter(post =>
            post.title.toLowerCase().includes(searchLower) ||
            post.excerpt.toLowerCase().includes(searchLower)
        );
    }

    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    return {
        posts: paginatedPosts,
        total: filteredPosts.length,
        page,
        pageSize,
        totalPages: Math.ceil(filteredPosts.length / pageSize),
    };
}
