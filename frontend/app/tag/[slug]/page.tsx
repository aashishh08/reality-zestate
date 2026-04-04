/**
 * Tag Properties Page
 * Route: /tag/[slug]
 *
 * Displays all properties that carry a specific tag.
 * Works for any tag — upcoming, trending, featured, new-launch, etc.
 * Simply add a new tag via the Admin API and the page auto-exists.
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PropertyListingTemplate } from '@/components/PropertyListingTemplate';
import {
    getTagBySlug,
    getAllTagSlugs,
    fetchTagProperties,
    Tag,
} from '@/lib/api/properties-listing';
import { PropertyFilters } from '@/types/property-listing';

// ─────────────────────────────────────────────────────────────────────────────
// Metadata
// ─────────────────────────────────────────────────────────────────────────────
export async function generateMetadata({
    params: paramsPromise,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await paramsPromise;
    const tag = await getTagBySlug(slug);

    if (!tag) {
        return { title: 'Tag Not Found' };
    }

    return {
        title: `${tag.name} Properties | Reality Estate`,
        description: tag.description
            ? `${tag.description} Browse ${tag.name.toLowerCase()} properties with detailed pricing, amenities and location info.`
            : `Explore all ${tag.name} properties on Reality Estate.`,
        keywords: [tag.name, 'properties', 'real estate', 'buy', 'invest'],
        openGraph: {
            title: `${tag.name} Properties`,
            description: tag.description ?? `Browse ${tag.name} properties on Reality Estate.`,
            type: 'website',
            url: `/tag/${tag.slug}`,
        },
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// Static params — pre-generates pages for every known tag at build time
// ─────────────────────────────────────────────────────────────────────────────
export async function generateStaticParams() {
    try {
        const slugs = await getAllTagSlugs();
        return slugs.map((slug: string) => ({ slug }));
    } catch {
        return [];
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero banner specific to this tag
// ─────────────────────────────────────────────────────────────────────────────
function TagHero({ tag }: { tag: Tag }) {
    return (
        <div
            className="relative overflow-hidden py-20 px-8"
            style={{
                background: `linear-gradient(135deg, ${tag.color ?? '#F59E0B'}22 0%, ${tag.color ?? '#F59E0B'}08 100%)`,
                borderBottom: `2px solid ${tag.color ?? '#F59E0B'}30`,
            }}
        >
            {/* Decorative blur blob */}
            <div
                className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20"
                style={{ background: tag.color ?? '#F59E0B' }}
            />

            <div className="relative max-w-4xl mx-auto text-center">
                {/* Tag badge */}
                <div className="inline-flex items-center space-x-2 mb-6">
                    <span
                        className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg"
                        style={{ background: `${tag.color ?? '#F59E0B'}22`, color: tag.color ?? '#F59E0B', border: `1px solid ${tag.color ?? '#F59E0B'}40` }}
                    >
                        <span className="mr-1.5">🏷</span>
                        {tag.name}
                    </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                    {tag.name} Properties
                </h1>

                {tag.description && (
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        {tag.description}
                    </p>
                )}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default async function TagPage({
    params: paramsPromise,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await paramsPromise;

    const tag = await getTagBySlug(slug);
    if (!tag) notFound();

    // Initial data load
    const initialData = await fetchTagProperties(slug, { limit: 12, offset: 0 });

    // Server action for filter/sort/pagination — passes the tag slug through
    const handleFetchProperties = async (filters: PropertyFilters) => {
        'use server';
        return fetchTagProperties(slug, {
            ...filters,
            limit: filters.limit ?? 12,
            offset: filters.offset ?? 0,
        });
    };

    return (
        <PropertyListingTemplate
            key={slug}
            initialData={initialData}
            onFetchProperties={handleFetchProperties}
            title={`${tag.name} Properties`}
            subtitle={tag.description ?? `Browse all ${tag.name.toLowerCase()} properties`}
            heroComponent={<TagHero tag={tag} />}
            contextFilters={{}}
            itemsPerPage={12}
            noResultsMessage={`No properties found under "${tag.name}" tag yet.`}
        />
    );
}

// ISR: revalidate every hour; new tags get picked up immediately via dynamicParams
export const revalidate = 3600;
export const dynamicParams = true;
