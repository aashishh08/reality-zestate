'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/lib/contexts/AdminAuthContext';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import {
    createPropertyFull, fetchTags, fetchCategories, fetchEnums,
    RefTag, RefCategory, SectionPayload, EnumsData,
} from '@/lib/api/properties-admin';
import { revalidatePropertyCaches } from '@/app/actions/revalidate-homepage';
import { orderCategoriesWithCuratedFirst } from '@/lib/constants';
import { sortTagsForAdmin } from '@/lib/status-tags';
import {
    Building2, Plus, TrendingUp, FileText, LogOut, Menu, X, Home,
    ChevronRight, ChevronLeft, CheckCircle2, XCircle, RefreshCw, Trash2, Eye, AlertTriangle,
} from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ImageUploadInput } from '@/components/admin/ImageUploadInput';
import { HtmlRenderer } from '@/components/ui/HtmlRenderer';


// ─── Step definitions ─────────────────────────────────────────────────────────
const STEPS = [
    'Basic Info',             // step 0  – meta (slug, title, developer…)
    'Hero & Intro',           // step 1  → Hero · Intro Text · Highlights bar
    'Key Takeaways',          // step 2  → 16 structured spec fields
    'Why Invest',             // step 3  → Reasons + long-form analysis
    'Overview',               // step 4  → Heading + content paragraphs + features
    'Gallery',                // step 5  → Image URLs
    'Master Plan',            // step 6  → Master plan image + description bullets
    'Location',               // step 7  → Address · map · nearby · connectivity
    'Amenities & Floor Plans',// step 8  → Amenities + Floor Plans
    'Payment Plans',          // step 9  → Payment plan items
    'Team',                   // step 10 → Team members + team highlights
    'FAQs & More',            // step 11 → FAQs
];

// ─── Preset Amenities Catalog ─────────────────────────────────────────────────
type PresetAmenity = { name: string; icon: string; category: string };
const PRESET_AMENITIES: PresetAmenity[] = [
    // Sports & Fitness
    { name: 'Swimming Pool', icon: '🏊', category: 'Sports & Fitness' },
    { name: 'Gymnasium', icon: '💪', category: 'Sports & Fitness' },
    { name: 'Tennis Court', icon: '🎾', category: 'Sports & Fitness' },
    { name: 'Badminton Court', icon: '🏸', category: 'Sports & Fitness' },
    { name: 'Basketball Court', icon: '🏀', category: 'Sports & Fitness' },
    { name: 'Cricket Net', icon: '🏏', category: 'Sports & Fitness' },
    { name: 'Squash Court', icon: '🎱', category: 'Sports & Fitness' },
    { name: 'Yoga & Meditation Centre', icon: '🧘', category: 'Sports & Fitness' },
    { name: 'Cycling Track', icon: '🚴', category: 'Sports & Fitness' },
    { name: 'Jogging Track', icon: '🏃', category: 'Sports & Fitness' },
    { name: 'Indoor Games Room', icon: '🎮', category: 'Sports & Fitness' },
    // Leisure & Entertainment
    { name: 'Clubhouse', icon: '🏛️', category: 'Leisure & Entertainment' },
    { name: 'Party Lawn', icon: '🎉', category: 'Leisure & Entertainment' },
    { name: 'Amphitheatre', icon: '🎭', category: 'Leisure & Entertainment' },
    { name: 'Mini Theatre', icon: '🎬', category: 'Leisure & Entertainment' },
    { name: 'Library', icon: '📚', category: 'Leisure & Entertainment' },
    { name: 'Board Games Lounge', icon: '♟️', category: 'Leisure & Entertainment' },
    { name: 'Rooftop Lounge', icon: '🌆', category: 'Leisure & Entertainment' },
    { name: 'Sky Deck', icon: '🌤️', category: 'Leisure & Entertainment' },
    // Kids & Family
    { name: "Children's Play Area", icon: '🎪', category: 'Kids & Family' },
    { name: 'Kids Pool', icon: '🛁', category: 'Kids & Family' },
    { name: 'Creche / Day Care', icon: '👶', category: 'Kids & Family' },
    { name: 'Teen Zone', icon: '🎵', category: 'Kids & Family' },
    // Wellness & Spa
    { name: 'Spa & Wellness Centre', icon: '💆', category: 'Wellness & Spa' },
    { name: 'Sauna', icon: '🧖', category: 'Wellness & Spa' },
    { name: 'Steam Room', icon: '💨', category: 'Wellness & Spa' },
    { name: 'Jacuzzi', icon: '🛀', category: 'Wellness & Spa' },
    { name: 'Salon & Grooming', icon: '💇', category: 'Wellness & Spa' },
    // Nature & Outdoors
    { name: 'Landscaped Gardens', icon: '🌳', category: 'Nature & Outdoors' },
    { name: 'Terrace Garden', icon: '🌿', category: 'Nature & Outdoors' },
    { name: 'Reflexology Path', icon: '🪨', category: 'Nature & Outdoors' },
    { name: 'Butterfly Garden', icon: '🦋', category: 'Nature & Outdoors' },
    { name: 'Senior Citizen Seating Area', icon: '🪑', category: 'Nature & Outdoors' },
    { name: 'Pet Park', icon: '🐾', category: 'Nature & Outdoors' },
    { name: 'Barbeque Area', icon: '🔥', category: 'Nature & Outdoors' },
    // Dining & Retail
    { name: 'Café / Coffee Shop', icon: '☕', category: 'Dining & Retail' },
    { name: 'Restaurant', icon: '🍽️', category: 'Dining & Retail' },
    { name: 'Convenience Store', icon: '🛒', category: 'Dining & Retail' },
    { name: 'ATM', icon: '🏧', category: 'Dining & Retail' },
    // Safety & Infrastructure
    { name: '24/7 Security', icon: '🔒', category: 'Safety & Infrastructure' },
    { name: 'CCTV Surveillance', icon: '📷', category: 'Safety & Infrastructure' },
    { name: 'Power Backup', icon: '⚡', category: 'Safety & Infrastructure' },
    { name: 'Covered Parking', icon: '🚗', category: 'Safety & Infrastructure' },
    { name: 'EV Charging Station', icon: '🔌', category: 'Safety & Infrastructure' },
    { name: 'Visitor Parking', icon: '🅿️', category: 'Safety & Infrastructure' },
    { name: 'High-Speed Elevators', icon: '🛗', category: 'Safety & Infrastructure' },
    { name: 'Rainwater Harvesting', icon: '🌧️', category: 'Safety & Infrastructure' },
    { name: 'Sewage Treatment Plant', icon: '♻️', category: 'Safety & Infrastructure' },
    { name: 'Solar Panels', icon: '☀️', category: 'Safety & Infrastructure' },
    { name: 'Intercom Facility', icon: '📞', category: 'Safety & Infrastructure' },
    { name: 'Video Door Phone', icon: '📹', category: 'Safety & Infrastructure' },
];
// Group amenities by category for display
const AMENITY_CATEGORIES = Array.from(new Set(PRESET_AMENITIES.map(a => a.category)));

// ─── Small reusable UI pieces ─────────────────────────────────────────────────
const Input = ({ label, ...p }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
        <label className="block text-xs text-gray-400 mb-1 font-medium">{label}</label>
        <input {...p} className={`w-full px-3 py-2.5 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition ${p.className || ''}`} />
    </div>
);
const Textarea = ({ label, ...p }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <div>
        <label className="block text-xs text-gray-400 mb-1 font-medium">{label}</label>
        <textarea {...p} rows={3} className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition resize-none" />
    </div>
);
const Select = ({ label, children, ...p }: { label: string } & React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) => (
    <div>
        <label className="block text-xs text-gray-400 mb-1 font-medium">{label}</label>
        <select {...p} className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 text-white rounded-xl text-sm focus:outline-none focus:border-amber-500 transition">
            {children}
        </select>
    </div>
);
const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-700/60 bg-gray-800">
            <h3 className="text-white font-semibold text-sm">{title}</h3>
        </div>
        <div className="p-5 space-y-4">{children}</div>
    </div>
);
const AddBtn = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button type="button" onClick={onClick}
        className="flex items-center space-x-1.5 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg text-xs font-medium transition">
        <Plus className="w-3.5 h-3.5" /><span>{label}</span>
    </button>
);
const RemoveBtn = ({ onClick }: { onClick: () => void }) => (
    <button type="button" onClick={onClick} className="text-gray-500 hover:text-red-400 transition p-1">
        <Trash2 className="w-4 h-4" />
    </button>
);

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CreatePropertyPage() {
    const router = useRouter();
    const { token, user, logout } = useAdminAuth();
    const [step, setStep] = useState(0);
    const [saving, setSaving] = useState(false);
    const [done, setDone] = useState<any>(null);
    const [formError, setFormError] = useState('');

    // Reference data
    const [tags, setTags] = useState<RefTag[]>([]);
    const [categories, setCategories] = useState<RefCategory[]>([]);
    const [enums, setEnums] = useState<EnumsData>({ cities: [], localities: [], developers: [] });

    // ── Step 1: Basic Info ───────────────────────────────────────────────────────
    const [basic, setBasic] = useState({
        slug: '', title: '', propertyType: 'residential' as 'residential' | 'commercial',
        status: 'draft',
        citySlug: '', localitySlug: '', sublocality: '', developerSlug: '',
        priceMin: '', priceMax: '', isPublished: false,
        tagSlugs: [] as string[], categorySlugs: [] as string[],
        seoTitle: '', h1Heading: '', metaDescription: '',
    });

    // ── Step 2: Hero & Intro ─────────────────────────────────────────────────────
    const [hero, setHero] = useState({ heroImage: '', subtitle: '', videoUrl: '' });
    const [intro, setIntro] = useState({ introText: '' });

    // ── Step 3: Highlights, Key Takeaways & Overview ──────────────────────────────
    const [highlights, setHighlights] = useState({ landArea: '', possession: '', rera: '', configuration: '', priceRange: '', totalUnits: '' });
    const [keyTakeaways, setKeyTakeaways] = useState({
        status: '', type: '', area: '', configuration: '', sizes: '',
        towers: '', floors: '', totalUnits: '', clubhouse: '',
        priceRange: '', reraNo: '', launchDate: '', possessionDate: '',
        phases: '', developer: '', address: '',
    });
    const [overview, setOverview] = useState({ heading: '', content: [''], features: ['', ''] });

    // ── Step 4: Gallery ───────────────────────────────────────────────────────
    const [gallery, setGallery] = useState(['']);

    // ── Step 5: Amenities & Floor Plans ──────────────────────────────────────────
    // selectedPresetAmenities: Set of amenity names from the preset catalog that are checked
    const [selectedPresetAmenities, setSelectedPresetAmenities] = useState<Set<string>>(new Set());
    // customAmenities: additional amenities not in the preset list
    const [customAmenities, setCustomAmenities] = useState([{ name: '', icon: '', imageUrl: '' }]);

    // Derived: the actual amenities array used in buildSections() is the union of preset + custom
    const amenities = [
        ...PRESET_AMENITIES.filter(a => selectedPresetAmenities.has(a.name)).map(a => ({ name: a.name, icon: a.icon, imageUrl: '' })),
        ...customAmenities.filter(a => a.name.trim()),
    ];

    const [floorPlans, setFloorPlans] = useState([{ type: '', superArea: '', price: '', imageUrl: '' }]);

    // ── Step 6: Payment Plans & Why Invest ───────────────────────────────────────
    const [paymentPlans, setPaymentPlans] = useState([{ title: '', type: '', description: '' }]);
    const [whyInvest, setWhyInvest] = useState([{ title: '', subtitle: '', icon: '' }]);
    const [whyInvestIntro, setWhyInvestIntro] = useState('');
    const [investmentText, setInvestmentText] = useState('');

    // ── Step 7: Location ─────────────────────────────────────────────────────────
    const [locSection, setLocSection] = useState({ address: '', mapImage: '' });
    const [locationIntro, setLocationIntro] = useState('');
    const [nearby, setNearby] = useState([{ category: '', icon: '', items: ['', ''] }]);
    const [connectivity, setConnectivity] = useState([{ place: '', icon: '', time: '' }]);

    // ── Step 8: FAQs / Team / USP / Specs / MasterPlan ───────────────────────────
    const [masterPlan, setMasterPlan] = useState({ imageUrl: '', description: '' });
    const [faqs, setFaqs] = useState([{ question: '', answer: '', category: '' }]);
    const [teamMembers, setTeamMembers] = useState([{ role: '', name: '', color: '#3B82F6', description: '', achievements: [''] }]);
    const [teamHighlights, setTeamHighlights] = useState([{ title: '', subtitle: '' }]);
    const [whyInvestStats, setWhyInvestStats] = useState({
        annualAppreciation: '12-15%', rentalYield: '3.5-4.5%', preLaunchGain: '25-30%',
    });
    const [amenitiesStats, setAmenitiesStats] = useState({
        clubhouseSqFt: '100K', amenitiesCount: '25+', swimmingPools: '5', diningOptions: '5',
    });
    const [amenitiesIntro, setAmenitiesIntro] = useState('');
    const [masterPlanIntro, setMasterPlanIntro] = useState('');
    const [floorPlansIntro, setFloorPlansIntro] = useState('');
    const [paymentPlansIntro, setPaymentPlansIntro] = useState('');
    const [teamIntro, setTeamIntro] = useState('');
    const [faqsIntro, setFaqsIntro] = useState('');
    const [floorPlanPanelQuote, setFloorPlanPanelQuote] = useState('');
    const [floorPlanDescSections, setFloorPlanDescSections] = useState([
        { heading: 'Premium Design', body: '' },
        { heading: 'Smart Layouts', body: '' },
    ]);
    const [sectionTitles, setSectionTitles] = useState({
        keyTakeaways: 'Key Takeaways',
        whyInvest: 'Why Invest',
        gallery: 'Project Gallery',
        amenities: 'Amenities',
        floorPlans: 'Sizes, Prices & Layouts',
        paymentPlans: 'Payment Plans',
        location: 'Location Advantage',
        masterPlan: 'Master Plan',
        faqs: 'Frequently Asked Questions',
        team: 'Design & Construction Team',
    });

    // ── Load reference data ──────────────────────────────────────────────────────
    useEffect(() => {
        fetchTags().then((t) => setTags(sortTagsForAdmin(t))).catch(() => { });
        fetchCategories()
            .then((c) => setCategories(orderCategoriesWithCuratedFirst(c)))
            .catch(() => { });
        fetchEnums().then(setEnums).catch(() => { });
    }, []);

    const handleLogout = () => { logout(); router.push('/admin/login'); };

    // ── Build sections array from all step data ──────────────────────────────────
    const buildSections = useCallback((): SectionPayload[] => {
        const sec: SectionPayload[] = [];
        let order = 0;
        if (hero.heroImage || hero.subtitle || hero.videoUrl?.trim())
            sec.push({ type: 'heroImage', title: 'Hero', order: order++, data: { image: hero.heroImage, subtitle: hero.subtitle, videoUrl: hero.videoUrl } });
        if (intro.introText)
            sec.push({ type: 'intro', title: 'Intro', order: order++, data: { text: intro.introText } });
        if (Object.values(highlights).some(v => v))
            sec.push({ type: 'highlights', title: 'Highlights', order: order++, data: { ...highlights } });
        // Key Takeaways: only include if at least one field is filled
        const ktData: Record<string, string> = {};
        Object.entries(keyTakeaways).forEach(([k, v]) => { if (v.trim()) ktData[k] = v.trim(); });
        if (Object.keys(ktData).length > 0)
            sec.push({ type: 'keyTakeaways', title: sectionTitles.keyTakeaways, order: order++, data: { ...ktData, sectionHeading: sectionTitles.keyTakeaways } });
        const contentArr = overview.content.filter(Boolean);
        if (contentArr.length)
            sec.push({ type: 'overview', title: 'Overview', order: order++, data: { heading: overview.heading, content: contentArr, features: overview.features.filter(Boolean) } });
        const gallArr = gallery.filter(Boolean);
        if (gallArr.length)
            sec.push({ type: 'gallery', title: sectionTitles.gallery, order: order++, data: { images: gallArr, sectionHeading: sectionTitles.gallery } });
        const amenArr = amenities.filter(a => a.name);
        if (amenArr.length)
            sec.push({ type: 'amenities', title: sectionTitles.amenities, order: order++, data: { items: amenArr.map(a => ({ name: a.name, icon: a.icon, image: a.imageUrl })), stats: amenitiesStats, sectionHeading: sectionTitles.amenities, intro: amenitiesIntro.trim() } });
        const fpArr = floorPlans.filter(f => f.type || f.superArea || f.price || f.imageUrl);
        if (fpArr.length)
            sec.push({
                type: 'floorPlans',
                title: sectionTitles.floorPlans,
                order: order++,
                data: {
                    plans: fpArr.map(f => ({ type: f.type, superArea: f.superArea, price: f.price, image: f.imageUrl })),
                    descriptionSections: floorPlanDescSections.filter(s => (s.heading || '').trim() || (s.body || '').trim()),
                    panelQuote: floorPlanPanelQuote,
                    sectionHeading: sectionTitles.floorPlans,
                    intro: floorPlansIntro.trim(),
                },
            });
        const ppArr = paymentPlans.filter(p => p.title || p.description);
        if (ppArr.length)
            sec.push({ type: 'paymentPlans', title: sectionTitles.paymentPlans, order: order++, data: { plans: ppArr, sectionHeading: sectionTitles.paymentPlans, intro: paymentPlansIntro.trim() } });
        const wiArr = whyInvest.filter(w => w.title);
        if (wiArr.length || investmentText || whyInvestIntro.trim())
            sec.push({
                type: 'whyInvest',
                title: sectionTitles.whyInvest,
                order: order++,
                data: {
                    reasons: wiArr,
                    analysis: investmentText,
                    stats: whyInvestStats,
                    sectionHeading: sectionTitles.whyInvest,
                    intro: whyInvestIntro.trim(),
                },
            });
        if (locSection.address || nearby.some(n => n.category) || connectivity.some(c => c.place))
            sec.push({ type: 'location', title: sectionTitles.location, order: order++, data: { address: locSection.address, mapImage: locSection.mapImage, nearby: nearby.filter(n => n.category).map(n => ({ category: n.category, icon: n.icon, items: n.items.filter(Boolean).map(name => ({ name })) })), connectivity: connectivity.filter(c => c.place), sectionHeading: sectionTitles.location, intro: locationIntro.trim() } });
        if (masterPlan.imageUrl?.trim() || masterPlan.description?.trim())
            sec.push({ type: 'masterPlan', title: sectionTitles.masterPlan, order: order++, data: { image: masterPlan.imageUrl || '', description: masterPlan.description, sectionHeading: sectionTitles.masterPlan, intro: masterPlanIntro.trim() } });
        const faqArr = faqs.filter(f => f.question || f.answer);
        if (faqArr.length)
            sec.push({ type: 'faqs', title: sectionTitles.faqs, order: order++, data: { faqs: faqArr, sectionHeading: sectionTitles.faqs, intro: faqsIntro.trim() } });
        const membArr = teamMembers.filter(m => m.role);
        if (membArr.length)
            sec.push({ type: 'team', title: sectionTitles.team, order: order++, data: { members: membArr.map(m => ({ ...m, achievements: m.achievements.filter(Boolean) })), highlights: teamHighlights.filter(th => th.title), sectionHeading: sectionTitles.team, intro: teamIntro.trim() } });
        return sec;
    }, [hero, intro, highlights, keyTakeaways, overview, gallery, selectedPresetAmenities, customAmenities, floorPlans, floorPlanPanelQuote, paymentPlans, whyInvest, whyInvestIntro, investmentText, locSection, locationIntro, nearby, connectivity, masterPlan, masterPlanIntro, faqs, faqsIntro, teamMembers, teamHighlights, teamIntro, whyInvestStats, amenitiesStats, amenitiesIntro, floorPlansIntro, paymentPlansIntro, floorPlanDescSections, sectionTitles]);

    const publishSeoWarnings = useMemo(() => {
        if (!basic.isPublished) return [];
        const warnings: string[] = [];
        if (!basic.metaDescription?.trim()) {
            warnings.push('Missing meta description — search snippets may be auto-generated.');
        }
        const overviewText = overview.content.filter(Boolean).join(' ');
        if (!overviewText.trim()) {
            warnings.push('No overview content — add project details for better SEO.');
        }
        const faqCount = faqs.filter((f) => f.question?.trim() && f.answer?.trim()).length;
        if (!faqCount) {
            warnings.push('No FAQs — FAQ rich results will not appear in search.');
        }
        return warnings;
    }, [basic.isPublished, basic.metaDescription, overview.content, faqs]);

    // ── Submit ───────────────────────────────────────────────────────────────────
    const handleSubmit = async () => {
        if (!token) return;
        setFormError(''); setSaving(true);
        try {
            const result = await createPropertyFull({
                ...basic,
                priceMin: basic.priceMin ? Number(basic.priceMin) : null,
                priceMax: basic.priceMax ? Number(basic.priceMax) : null,
                sections: buildSections(),
            }, token);
            await revalidatePropertyCaches(result.data?.property?.slug ?? basic.slug);
            setDone(result);
        } catch (e: any) {
            setFormError(e.message || 'Failed to create property');
        } finally { setSaving(false); }
    };

    // ── List helpers ─────────────────────────────────────────────────────────────
    const addItem = (setter: any, newItem: any) => setter((prev: any[]) => [...prev, newItem]);
    const removeItem = (setter: any, idx: number) => setter((prev: any[]) => prev.filter((_: any, i: number) => i !== idx));
    const updateItem = (setter: any, idx: number, val: any) => setter((prev: any[]) => prev.map((x: any, i: number) => i === idx ? val : x));
    const updateItemField = (setter: any, idx: number, field: string, val: string) =>
        setter((prev: any[]) => prev.map((x: any, i: number) => i === idx ? { ...x, [field]: val } : x));

    // ── Done screen ──────────────────────────────────────────────────────────────
    if (done) {
        return (
            <ProtectedAdminRoute>
                <div className="flex h-screen bg-gray-900 items-center justify-center p-8">
                    <div className="max-w-lg w-full bg-gray-800 rounded-2xl border border-emerald-500/30 p-8 text-center space-y-6">
                        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Property Created!</h2>
                            <p className="text-gray-400 mt-2 text-sm">{done.message || `"${done.data?.property?.title}" is ready.`}</p>
                        </div>
                        <div className="bg-gray-900 rounded-xl p-4 text-left space-y-2">
                            <InfoRow label="Title" value={done.data?.property?.title} />
                            <InfoRow label="Slug" value={done.data?.property?.slug} mono />
                            <InfoRow label="Sections" value={`${done.data?.sectionsCreated} created`} />
                            <InfoRow label="Status" value={done.data?.property?.isPublished ? '✅ Published' : '📝 Draft'} />
                        </div>
                        <div className="flex gap-3 justify-center flex-wrap">
                            <a href={`/projects/${done.data?.property?.slug}`} target="_blank" rel="noopener noreferrer"
                                className="flex items-center space-x-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-white rounded-xl text-sm font-semibold transition">
                                <Eye className="w-4 h-4" /><span>View Property</span>
                            </a>
                            <button onClick={() => { setDone(null); setStep(0); setBasic({ slug: '', title: '', propertyType: 'residential', status: 'draft', citySlug: '', localitySlug: '', sublocality: '', developerSlug: '', priceMin: '', priceMax: '', isPublished: false, tagSlugs: [], categorySlugs: [], seoTitle: '', h1Heading: '', metaDescription: '' }); }}
                                className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm font-semibold transition">
                                Create Another
                            </button>
                            <Link href="/admin/properties"
                                className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm font-semibold transition">
                                All Properties
                            </Link>
                        </div>
                    </div>
                </div>
            </ProtectedAdminRoute>
        );
    }

    return (
        <ProtectedAdminRoute>
            <div className="flex h-screen bg-gray-900 overflow-hidden">

                <AdminSidebar />

                {/* Main */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-8 flex-shrink-0">
                        <div className="flex items-center space-x-3">
                            <Building2 className="w-5 h-5 text-amber-500" />
                            <h1 className="text-xl font-bold text-white">Create Property</h1>
                            <span className="text-gray-500 text-sm">— {STEPS[step]}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            {STEPS.map((_, i) => (
                                <button key={i} onClick={() => setStep(i)}
                                    className={`w-2.5 h-2.5 rounded-full transition ${i === step ? 'bg-amber-500' : i < step ? 'bg-emerald-500' : 'bg-gray-600'}`} />
                            ))}
                        </div>
                    </div>

                    {/* Stepper bar */}
                    <div className="bg-gray-800/50 border-b border-gray-700/50 px-8 py-3 flex items-center space-x-1 overflow-x-auto flex-shrink-0">
                        {STEPS.map((s, i) => (
                            <button key={i} onClick={() => setStep(i)}
                                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${i === step ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : i < step ? 'text-emerald-400' : 'text-gray-500 hover:text-gray-300'}`}>
                                {i < step && <CheckCircle2 className="w-3.5 h-3.5" />}
                                <span>{i + 1}. {s}</span>
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="max-w-4xl mx-auto p-8 space-y-6">

                            {/* STEP 1: Basic Info */}
                            {step === 0 && (
                                <div className="space-y-6">
                                    <SectionCard title="🏠 Core Details">
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input label="Property Title *" value={basic.title} onChange={e => setBasic(b => ({ ...b, title: e.target.value }))} placeholder="e.g. Mahindra Origins Pune" />
                                            <Input label="Slug *" value={basic.slug} onChange={e => setBasic(b => ({ ...b, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))} placeholder="e.g. mahindra-origins-pune" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Select label="Property Type *" value={basic.propertyType} onChange={e => setBasic(b => ({ ...b, propertyType: e.target.value as any }))}>
                                                <option value="residential">Residential</option>
                                                <option value="commercial">Commercial</option>
                                            </Select>
                                            <div className="flex flex-col justify-end">
                                                <label className="flex items-center space-x-2 cursor-pointer mt-1">
                                                    <input
                                                        type="checkbox"
                                                        checked={basic.isPublished}
                                                        onChange={e => {
                                                            const pub = e.target.checked;
                                                            setBasic(b => ({ ...b, isPublished: pub, status: pub ? 'published' : 'draft' }));
                                                        }}
                                                        className="w-4 h-4 accent-amber-500"
                                                    />
                                                    <span className="text-sm text-gray-300">Published (live)</span>
                                                </label>
                                            </div>
                                        </div>
                                        {/* ── Enum Slug Classification ───────────────────── */}
                                        <div className="pt-2 border-t border-gray-700/50">
                                            <p className="text-xs text-amber-400 font-semibold mb-3">📍 City, Locality &amp; Developer Classification</p>
                                            <div className="grid grid-cols-3 gap-4">
                                                <Select
                                                    label="City *"
                                                    value={basic.citySlug}
                                                    onChange={e => setBasic(b => ({ ...b, citySlug: e.target.value, localitySlug: '' }))}
                                                >
                                                    <option value="">— Select City —</option>
                                                    {enums.cities.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
                                                </Select>
                                                <Select
                                                    label="Locality *"
                                                    value={basic.localitySlug}
                                                    onChange={e => setBasic(b => ({ ...b, localitySlug: e.target.value }))}
                                                    disabled={!basic.citySlug}
                                                >
                                                    <option value="">{basic.citySlug ? '— Select Locality —' : '← Pick a city first'}</option>
                                                    {enums.localities
                                                        .filter(l => l.city === basic.citySlug)
                                                        .map(l => <option key={l.slug} value={l.slug}>{l.label}</option>)}
                                                </Select>
                                                <Select
                                                    label="Developer (Enum) *"
                                                    value={basic.developerSlug}
                                                    onChange={e => setBasic(b => ({ ...b, developerSlug: e.target.value }))}
                                                >
                                                    <option value="">— Select Developer —</option>
                                                    {enums.developers.map(d => <option key={d.slug} value={d.slug}>{d.label}</option>)}
                                                </Select>
                                            </div>
                                            <Input
                                                label="Sublocality (optional)"
                                                value={basic.sublocality}
                                                onChange={e => setBasic(b => ({ ...b, sublocality: e.target.value }))}
                                                placeholder="e.g. Sector 57, near Metro — shown on project page only"
                                            />
                                            {(basic.citySlug || basic.localitySlug || basic.developerSlug) && (
                                                <p className="text-xs text-gray-500 mt-2">
                                                    ✓ {[basic.developerSlug, basic.localitySlug, basic.citySlug].filter(Boolean).join(' · ')}
                                                </p>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input label="Price Min (₹)" type="number" value={basic.priceMin} onChange={e => setBasic(b => ({ ...b, priceMin: e.target.value }))} placeholder="e.g. 15000000" />
                                            <Input label="Price Max (₹)" type="number" value={basic.priceMax} onChange={e => setBasic(b => ({ ...b, priceMax: e.target.value }))} placeholder="e.g. 35000000" />
                                        </div>
                                    </SectionCard>

                                    <SectionCard title="🏷️ Tags & Categories">
                                        <div>
                                            <p className="text-xs text-gray-400 mb-2 font-medium">Tags (select all that apply)</p>
                                            <p className="text-xs text-gray-500 mb-3">
                                                Listing filters use these slugs first: New Launch, Upcoming, Under Construction, Ready to Move — pick at least one status tag when relevant.
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {tags.map(t => {
                                                    const sel = basic.tagSlugs.includes(t.slug);
                                                    return (
                                                        <button key={t.slug} type="button" onClick={() => setBasic(b => ({ ...b, tagSlugs: sel ? b.tagSlugs.filter(s => s !== t.slug) : [...b.tagSlugs, t.slug] }))}
                                                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${sel ? 'bg-amber-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                                                            {t.name}
                                                        </button>
                                                    );
                                                })}
                                                {tags.length === 0 && <p className="text-gray-500 text-xs">No tags found. Create tags via the API first.</p>}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 mb-2 font-medium">Categories (select all that apply)</p>
                                            <div className="flex flex-wrap gap-2">
                                                {categories.map(c => {
                                                    const sel = basic.categorySlugs.includes(c.slug);
                                                    return (
                                                        <button key={c.slug} type="button" onClick={() => setBasic(b => ({ ...b, categorySlugs: sel ? b.categorySlugs.filter(s => s !== c.slug) : [...b.categorySlugs, c.slug] }))}
                                                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${sel ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                                                            {c.name}
                                                        </button>
                                                    );
                                                })}
                                                {categories.length === 0 && <p className="text-gray-500 text-xs">No categories found.</p>}
                                            </div>
                                        </div>
                                    </SectionCard>

                                    <SectionCard title="🔍 SEO Settings">
                                        <p className="text-xs text-gray-500 -mt-1">Overrides default SEO values for search engines. Leave blank to auto-generate from title.</p>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1 font-medium">SEO Title Tag (max 90 chars)</label>
                                            <input
                                                value={basic.seoTitle}
                                                onChange={e => setBasic(b => ({ ...b, seoTitle: e.target.value.slice(0, 90) }))}
                                                placeholder="e.g. Mahindra Origins Pune | Luxury 3 & 4 BHK Apartments"
                                                className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition"
                                            />
                                            <p className="text-xs text-gray-500 mt-1 text-right">{basic.seoTitle.length}/90</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1 font-medium">H1 Heading (max 120 chars)</label>
                                            <input
                                                value={basic.h1Heading}
                                                onChange={e => setBasic(b => ({ ...b, h1Heading: e.target.value.slice(0, 120) }))}
                                                placeholder="e.g. Mahindra Origins — 3 & 4 BHK on Dwarka Expressway"
                                                className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition"
                                            />
                                            <p className="text-xs text-gray-500 mt-1 text-right">{basic.h1Heading.length}/120</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1 font-medium">Meta Description (max 158 chars)</label>
                                            <textarea
                                                value={basic.metaDescription}
                                                onChange={e => setBasic(b => ({ ...b, metaDescription: e.target.value.slice(0, 158) }))}
                                                placeholder="e.g. Discover Mahindra Origins Pune — premium 3 & 4 BHK residences on Dwarka Expressway. Book now."
                                                rows={3}
                                                className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition resize-none"
                                            />
                                            <p className="text-xs text-gray-500 mt-1 text-right">{basic.metaDescription.length}/158</p>
                                        </div>
                                    </SectionCard>
                                </div>
                            )}

                            {/* ── STEP 2: Hero & Intro (+ Highlights bar) ─────────────────── */}
                            {step === 1 && (
                                <div className="space-y-6">
                                    <SectionCard title="🏠 Hero Section">
                                        <ImageUploadInput label="Hero Image URL" value={hero.heroImage} onChange={url => setHero(h => ({ ...h, heroImage: url }))} placeholder="/images/hero.jpg" />
                                        <Input label="Subtitle" value={hero.subtitle} onChange={e => setHero(h => ({ ...h, subtitle: e.target.value }))} placeholder="Premium Residences in the Heart of Pune" />
                                        <Input label="Video URL (YouTube embed)" value={hero.videoUrl} onChange={e => setHero(h => ({ ...h, videoUrl: e.target.value }))} placeholder="https://www.youtube.com/embed/..." />
                                    </SectionCard>
                                    <SectionCard title="📝 Introduction Text">
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="block text-xs text-gray-400 font-medium">
                                                    Introduction Text <span className="text-amber-400">(HTML supported)</span>
                                                </label>
                                                <button type="button" onClick={() => { const el = document.getElementById('intro-preview'); if (el) el.classList.toggle('hidden'); }}
                                                    className="text-xs text-amber-400 hover:text-amber-300 transition underline">
                                                    Toggle preview
                                                </button>
                                            </div>
                                            <textarea value={intro.introText} onChange={e => setIntro({ introText: e.target.value })} rows={6}
                                                placeholder={`Write a compelling introduction for this property.\n\nSupports plain text or HTML:\n<p>This development...</p>\n<p><strong>Highlight</strong> key details here.</p>`}
                                                className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition resize-y font-mono" />
                                            <div id="intro-preview" className="hidden mt-2 rounded-xl border border-amber-500/30 bg-white p-4 max-h-64 overflow-y-auto">
                                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Preview</p>
                                                {intro.introText
                                                    ? <HtmlRenderer html={intro.introText} fontSize="text-sm" />
                                                    : <p className="text-gray-400 text-xs italic">Nothing to preview yet…</p>}
                                            </div>
                                        </div>
                                    </SectionCard>
                                    <SectionCard title="✨ Highlights (Quick-Stat Bar)">
                                        <p className="text-xs text-gray-500 -mt-1">These 6 values appear in the stat bar directly beneath the hero image.</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input label="Land Area" value={highlights.landArea} onChange={e => setHighlights(h => ({ ...h, landArea: e.target.value }))} placeholder="20 Acres" />
                                            <Input label="Possession Date" value={highlights.possession} onChange={e => setHighlights(h => ({ ...h, possession: e.target.value }))} placeholder="Dec 2027" />
                                            <Input label="RERA Number" value={highlights.rera} onChange={e => setHighlights(h => ({ ...h, rera: e.target.value }))} placeholder="P52100040555" />
                                            <Input label="Configuration" value={highlights.configuration} onChange={e => setHighlights(h => ({ ...h, configuration: e.target.value }))} placeholder="2, 3 & 4 BHK" />
                                            <Input label="Price Range (display)" value={highlights.priceRange} onChange={e => setHighlights(h => ({ ...h, priceRange: e.target.value }))} placeholder="₹ 1.5 Cr – ₹ 3.5 Cr" />
                                            <Input label="Total Units" value={highlights.totalUnits} onChange={e => setHighlights(h => ({ ...h, totalUnits: e.target.value }))} placeholder="1200" />
                                        </div>
                                    </SectionCard>
                                </div>
                            )}

                            {/* ── STEP 3: Key Takeaways ────────────────────────────────────── */}
                            {step === 2 && (
                                <div className="space-y-6">
                                    <SectionCard title="📋 Key Takeaways">
                                        <Input label="Section Heading" value={sectionTitles.keyTakeaways} onChange={e => setSectionTitles(t => ({ ...t, keyTakeaways: e.target.value }))} placeholder="Key Takeaways" />
                                        <p className="text-xs text-gray-500 -mt-1">Fill only the fields that apply. Empty fields are hidden on the property page.</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input label="Status" value={keyTakeaways.status} onChange={e => setKeyTakeaways(k => ({ ...k, status: e.target.value }))} placeholder="Upon Request / Under Construction" />
                                            <Input label="Type" value={keyTakeaways.type} onChange={e => setKeyTakeaways(k => ({ ...k, type: e.target.value }))} placeholder="Residential / Commercial" />
                                            <Input label="Area" value={keyTakeaways.area} onChange={e => setKeyTakeaways(k => ({ ...k, area: e.target.value }))} placeholder="12 Acres" />
                                            <Input label="Configuration" value={keyTakeaways.configuration} onChange={e => setKeyTakeaways(k => ({ ...k, configuration: e.target.value }))} placeholder="3 BHK & 4 BHK" />
                                            <Input label="Sizes" value={keyTakeaways.sizes} onChange={e => setKeyTakeaways(k => ({ ...k, sizes: e.target.value }))} placeholder="2200 sq.ft – 2966 sq.ft" />
                                            <Input label="Towers" value={keyTakeaways.towers} onChange={e => setKeyTakeaways(k => ({ ...k, towers: e.target.value }))} placeholder="4 Towers" />
                                            <Input label="Floors" value={keyTakeaways.floors} onChange={e => setKeyTakeaways(k => ({ ...k, floors: e.target.value }))} placeholder="G+42" />
                                            <Input label="Total Units" value={keyTakeaways.totalUnits} onChange={e => setKeyTakeaways(k => ({ ...k, totalUnits: e.target.value }))} placeholder="~750 Units" />
                                            <Input label="Clubhouse" value={keyTakeaways.clubhouse} onChange={e => setKeyTakeaways(k => ({ ...k, clubhouse: e.target.value }))} placeholder="75,000 sq.ft" />
                                            <Input label="Price Range" value={keyTakeaways.priceRange} onChange={e => setKeyTakeaways(k => ({ ...k, priceRange: e.target.value }))} placeholder="₹5.50 Cr – ₹7.42 Cr" />
                                            <Input label="Rera No." value={keyTakeaways.reraNo} onChange={e => setKeyTakeaways(k => ({ ...k, reraNo: e.target.value }))} placeholder="RERA Applied / GGM/650/382/2022/111" />
                                            <Input label="Launch Date" value={keyTakeaways.launchDate} onChange={e => setKeyTakeaways(k => ({ ...k, launchDate: e.target.value }))} placeholder="April 2026" />
                                            <Input label="Possession Date" value={keyTakeaways.possessionDate} onChange={e => setKeyTakeaways(k => ({ ...k, possessionDate: e.target.value }))} placeholder="Dec 2030" />
                                            <Input label="Phases" value={keyTakeaways.phases} onChange={e => setKeyTakeaways(k => ({ ...k, phases: e.target.value }))} placeholder="Phase 1 / 2 Phases" />
                                            <Input label="Developer" value={keyTakeaways.developer} onChange={e => setKeyTakeaways(k => ({ ...k, developer: e.target.value }))} placeholder="Sobha Limited" />
                                        </div>
                                        <div className="mt-2">
                                            <Input label="Address (full width)" value={keyTakeaways.address} onChange={e => setKeyTakeaways(k => ({ ...k, address: e.target.value }))} placeholder="Sector 63A, Golf Course Extension Road, Gurgaon" />
                                        </div>
                                    </SectionCard>
                                </div>
                            )}

                            {/* ── STEP 4: Why Invest ───────────────────────────────────────── */}
                            {step === 3 && (
                                <div className="space-y-6">
                                    <SectionCard title="📈 Why Invest — Reason Cards">
                                        <Input label="Section Heading" value={sectionTitles.whyInvest} onChange={e => setSectionTitles(t => ({ ...t, whyInvest: e.target.value }))} placeholder="Why Invest" />
                                        <div className="mt-3">
                                            <label className="block text-xs text-gray-400 font-medium mb-1">
                                                Intro paragraph <span className="text-gray-500">(gray text under the main title on the property page)</span>
                                            </label>
                                            <textarea
                                                value={whyInvestIntro}
                                                onChange={e => setWhyInvestIntro(e.target.value)}
                                                rows={3}
                                                placeholder="Discover the compelling reasons why this project represents one of the finest investment opportunities in Gurgaon"
                                                className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition resize-y"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 -mt-1">Icon options: <code className="text-amber-400">location · award · trending · calendar</code></p>
                                        <div className="space-y-3">
                                            {whyInvest.map((w, i) => (
                                                <div key={i} className="grid grid-cols-3 gap-2 items-center">
                                                    <input value={w.title} onChange={e => updateItemField(setWhyInvest, i, 'title', e.target.value)} placeholder="Prime Location"
                                                        className="px-3 py-2 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition" />
                                                    <input value={w.subtitle} onChange={e => updateItemField(setWhyInvest, i, 'subtitle', e.target.value)} placeholder="12–15% annual appreciation"
                                                        className="px-3 py-2 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition" />
                                                    <div className="flex gap-2">
                                                        <input value={w.icon} onChange={e => updateItemField(setWhyInvest, i, 'icon', e.target.value)} placeholder="location"
                                                            className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition" />
                                                        {whyInvest.length > 1 && <RemoveBtn onClick={() => removeItem(setWhyInvest, i)} />}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <AddBtn label="Add Reason" onClick={() => addItem(setWhyInvest, { title: '', subtitle: '', icon: '' })} />
                                        {/* Investment Analysis — long-form, supports HTML */}
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="block text-xs text-gray-400 font-medium">
                                                    Investment Analysis <span className="text-amber-400">(long-form · HTML supported)</span>
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const el = document.getElementById('inv-preview');
                                                        if (el) el.classList.toggle('hidden');
                                                    }}
                                                    className="text-xs text-amber-400 hover:text-amber-300 transition underline"
                                                >
                                                    Toggle HTML preview
                                                </button>
                                            </div>
                                            <textarea
                                                value={investmentText}
                                                onChange={e => setInvestmentText(e.target.value)}
                                                rows={10}
                                                placeholder={`Write long-form investment analysis here.\n\nSupports plain text (paragraphs separated by blank lines) OR HTML tags:\n<h2>Why Invest?</h2>\n<p>This development...</p>\n<ul><li>Strong returns</li></ul>`}
                                                className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition resize-y font-mono"
                                            />
                                            {/* Live preview */}
                                            <div id="inv-preview" className="hidden mt-2 rounded-xl border border-amber-500/30 bg-white p-4 max-h-64 overflow-y-auto">
                                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">HTML Preview</p>
                                                {investmentText
                                                    ? <HtmlRenderer html={investmentText} fontSize="text-sm" />
                                                    : <p className="text-gray-400 text-xs italic">Nothing to preview yet…</p>}
                                            </div>
                                        </div>
                                    </SectionCard>
                                    <SectionCard title="📊 Investment Statistics">
                                        <p className="text-xs text-gray-500 -mt-1">These 3 stat cards appear in the Why Invest section.</p>
                                        <div className="grid grid-cols-3 gap-4">
                                            <Input label="Annual Appreciation %" value={whyInvestStats.annualAppreciation} onChange={e => setWhyInvestStats(s => ({ ...s, annualAppreciation: e.target.value }))} placeholder="12-15%" />
                                            <Input label="Rental Yield %" value={whyInvestStats.rentalYield} onChange={e => setWhyInvestStats(s => ({ ...s, rentalYield: e.target.value }))} placeholder="3.5-4.5%" />
                                            <Input label="Pre-Launch Gain %" value={whyInvestStats.preLaunchGain} onChange={e => setWhyInvestStats(s => ({ ...s, preLaunchGain: e.target.value }))} placeholder="25-30%" />
                                        </div>
                                    </SectionCard>
                                </div>
                            )}

                            {/* ── STEP 5: Overview ──────────────────────────────────────────── */}
                            {step === 4 && (
                                <div className="space-y-6">
                                    <SectionCard title="📋 Project Overview">
                                        <Input label="Section Heading" value={overview.heading} onChange={e => setOverview(o => ({ ...o, heading: e.target.value }))} placeholder="Overview of the Project" />
                                        {/* Single HTML-aware content block */}
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="text-xs text-gray-400 font-medium">
                                                    Content <span className="text-amber-400">(HTML supported — use tags for structure)</span>
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const el = document.getElementById('ov-preview-0');
                                                        if (el) el.classList.toggle('hidden');
                                                    }}
                                                    className="text-xs text-amber-400 hover:text-amber-300 transition underline"
                                                >
                                                    Toggle preview
                                                </button>
                                            </div>
                                            <textarea
                                                value={overview.content[0] ?? ''}
                                                onChange={e => setOverview(o => ({ ...o, content: [e.target.value] }))}
                                                rows={12}
                                                placeholder={`Write the full overview here — plain text or HTML:\n\n<h3>About the Project</h3>\n<p>This development...</p>\n<ul>\n  <li>Feature one</li>\n  <li>Feature two</li>\n</ul>`}
                                                className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition resize-y font-mono"
                                            />
                                            <div id="ov-preview-0" className="hidden mt-2 rounded-xl border border-amber-500/30 bg-white p-4 max-h-64 overflow-y-auto">
                                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Preview</p>
                                                {overview.content[0]
                                                    ? <HtmlRenderer html={overview.content[0]} fontSize="text-sm" />
                                                    : <p className="text-gray-400 text-xs italic">Nothing to preview yet…</p>}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-xs text-gray-400 font-medium">Feature Bullet Points</label>
                                                <AddBtn label="Add Feature" onClick={() => setOverview(o => ({ ...o, features: [...o.features, ''] }))} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                {overview.features.map((f, i) => (
                                                    <div key={i} className="flex gap-2">
                                                        <input value={f} onChange={e => setOverview(o => ({ ...o, features: o.features.map((x, j) => j === i ? e.target.value : x) }))}
                                                            placeholder={`Feature ${i + 1}`} className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition" />
                                                        {overview.features.length > 1 && <RemoveBtn onClick={() => setOverview(o => ({ ...o, features: o.features.filter((_, j) => j !== i) }))} />}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </SectionCard>
                                </div>
                            )}

                            {/* ── STEP 6: Gallery ───────────────────────────────────────────── */}
                            {step === 5 && (
                                <div className="space-y-6">
                                    <SectionCard title="🖼️ Gallery Images">
                                        <Input label="Section Heading" value={sectionTitles.gallery} onChange={e => setSectionTitles(t => ({ ...t, gallery: e.target.value }))} placeholder="Project Gallery" />
                                        <div className="space-y-2">
                                            {gallery.map((g, i) => (
                                                <div key={i} className="flex gap-2 items-center">
                                                    <ImageUploadInput
                                                        value={g}
                                                        onChange={url => updateItem(setGallery, i, url)}
                                                        placeholder="/images/gallery-1.jpg"
                                                        showPreview={false}
                                                        className="flex-1"
                                                    />
                                                    {gallery.length > 1 && <RemoveBtn onClick={() => removeItem(setGallery, i)} />}
                                                </div>
                                            ))}
                                        </div>
                                        <AddBtn label="Add Image URL" onClick={() => addItem(setGallery, '')} />
                                    </SectionCard>
                                </div>
                            )}

                            {/* ── STEP 7: Master Plan ───────────────────────────────────────── */}
                            {step === 6 && (
                                <div className="space-y-6">
                                    <SectionCard title="🗺️ Master Plan">
                                        <Input label="Section Heading" value={sectionTitles.masterPlan} onChange={e => setSectionTitles(t => ({ ...t, masterPlan: e.target.value }))} placeholder="Master Plan" />
                                        <div className="mt-3">
                                            <label className="block text-xs text-gray-400 font-medium mb-1">
                                                Intro paragraph <span className="text-gray-500">(description under the master plan title on the property page)</span>
                                            </label>
                                            <textarea
                                                value={masterPlanIntro}
                                                onChange={e => setMasterPlanIntro(e.target.value)}
                                                rows={3}
                                                placeholder="Explore the comprehensive layout and thoughtful design of our premium development"
                                                className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition resize-y"
                                            />
                                        </div>
                                        <ImageUploadInput label="Master Plan Image URL" value={masterPlan.imageUrl} onChange={url => setMasterPlan(m => ({ ...m, imageUrl: url }))} placeholder="/images/masterplan.jpg" />
                                        {/* Single HTML-aware description */}
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="text-xs text-gray-400 font-medium">
                                                    Description <span className="text-amber-400">(HTML supported — use tags for structure)</span>
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const el = document.getElementById('mp-preview');
                                                        if (el) el.classList.toggle('hidden');
                                                    }}
                                                    className="text-xs text-amber-400 hover:text-amber-300 transition underline"
                                                >
                                                    Toggle preview
                                                </button>
                                            </div>
                                            <textarea
                                                value={masterPlan.description}
                                                onChange={e => setMasterPlan(m => ({ ...m, description: e.target.value }))}
                                                rows={12}
                                                placeholder={`Describe the master plan — plain text or HTML:\n\n<h3>Thoughtfully Designed Layout</h3>\n<p>The master plan showcases...</p>\n<ul>\n  <li>Green corridors</li>\n  <li>Wide internal roads</li>\n</ul>`}
                                                className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition resize-y font-mono"
                                            />
                                            <div id="mp-preview" className="hidden mt-2 rounded-xl border border-amber-500/30 bg-white p-4 max-h-64 overflow-y-auto">
                                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Preview</p>
                                                {masterPlan.description
                                                    ? <HtmlRenderer html={masterPlan.description} fontSize="text-sm" />
                                                    : <p className="text-gray-400 text-xs italic">Nothing to preview yet…</p>}
                                            </div>
                                        </div>
                                    </SectionCard>
                                </div>
                            )}

                            {/* ── STEP 8: Location ──────────────────────────────────────────── */}
                            {step === 7 && (
                                <div className="space-y-6">
                                    <SectionCard title="📍 Location Details">
                                        <Input label="Section Heading" value={sectionTitles.location} onChange={e => setSectionTitles(t => ({ ...t, location: e.target.value }))} placeholder="Location Advantage" />
                                        <div className="mt-3">
                                            <label className="block text-xs text-gray-400 font-medium mb-1">
                                                Intro paragraph <span className="text-gray-500">(description under the location title on the property page)</span>
                                            </label>
                                            <textarea
                                                value={locationIntro}
                                                onChange={e => setLocationIntro(e.target.value)}
                                                rows={3}
                                                placeholder="Strategically located, offering unmatched connectivity to business districts, airports, and lifestyle destinations"
                                                className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition resize-y"
                                            />
                                        </div>
                                        <Input label="Full Address" value={locSection.address} onChange={e => setLocSection(l => ({ ...l, address: e.target.value }))} placeholder="Maan, Hinjewadi Phase II, Pune – 411057" />
                                        <ImageUploadInput label="Map Image URL" value={locSection.mapImage} onChange={url => setLocSection(l => ({ ...l, mapImage: url }))} placeholder="/images/map.jpg" />
                                    </SectionCard>
                                    <SectionCard title="🏢 Nearby Places">
                                        <div className="space-y-4">
                                            {nearby.map((n, i) => (
                                                <div key={i} className="bg-gray-900 rounded-xl p-4 space-y-3 relative">
                                                    {nearby.length > 1 && <div className="absolute top-3 right-3"><RemoveBtn onClick={() => removeItem(setNearby, i)} /></div>}
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <input value={n.category} onChange={e => updateItemField(setNearby, i, 'category', e.target.value)} placeholder="IT & Business Parks"
                                                            className="px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition" />
                                                        <input value={n.icon} onChange={e => updateItemField(setNearby, i, 'icon', e.target.value)} placeholder="building"
                                                            className="px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition" />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {n.items.map((item, j) => (
                                                            <input key={j} value={item} onChange={e => setNearby(prev => prev.map((x, xi) => xi === i ? { ...x, items: x.items.map((it, ji) => ji === j ? e.target.value : it) } : x))}
                                                                placeholder={`Place ${j + 1}`} className="px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition" />
                                                        ))}
                                                    </div>
                                                    <button type="button" onClick={() => setNearby(prev => prev.map((x, xi) => xi === i ? { ...x, items: [...x.items, ''] } : x))}
                                                        className="text-xs text-amber-400 hover:text-amber-300 transition">+ Add place</button>
                                                </div>
                                            ))}
                                        </div>
                                        <AddBtn label="Add Category" onClick={() => addItem(setNearby, { category: '', icon: '', items: ['', ''] })} />
                                    </SectionCard>
                                    <SectionCard title="🚗 Connectivity">
                                        <div className="space-y-2">
                                            {connectivity.map((c, i) => (
                                                <div key={i} className="grid grid-cols-3 gap-2 items-center">
                                                    <input value={c.place} onChange={e => updateItemField(setConnectivity, i, 'place', e.target.value)} placeholder="Pune Airport"
                                                        className="px-3 py-2 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition" />
                                                    <input value={c.icon} onChange={e => updateItemField(setConnectivity, i, 'icon', e.target.value)} placeholder="airport"
                                                        className="px-3 py-2 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition" />
                                                    <div className="flex gap-2">
                                                        <input value={c.time} onChange={e => updateItemField(setConnectivity, i, 'time', e.target.value)} placeholder="30 mins"
                                                            className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition" />
                                                        {connectivity.length > 1 && <RemoveBtn onClick={() => removeItem(setConnectivity, i)} />}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <AddBtn label="Add Connectivity" onClick={() => addItem(setConnectivity, { place: '', icon: '', time: '' })} />
                                    </SectionCard>
                                </div>
                            )}

                            {/* ── STEP 9: Amenities & Floor Plans ──────────────────────────── */}
                            {step === 8 && (
                                <div className="space-y-6">
                                    <SectionCard title="🏊 Amenities">
                                        <Input label="Section Heading" value={sectionTitles.amenities} onChange={e => setSectionTitles(t => ({ ...t, amenities: e.target.value }))} placeholder="Amenities" />
                                        <div className="mt-3">
                                            <label className="block text-xs text-gray-400 font-medium mb-1">
                                                Intro paragraph <span className="text-gray-500">(description under the amenities title on the property page)</span>
                                            </label>
                                            <textarea
                                                value={amenitiesIntro}
                                                onChange={e => setAmenitiesIntro(e.target.value)}
                                                rows={3}
                                                placeholder="Experience a lifestyle of unparalleled luxury with our comprehensive range of world-class amenities designed for your comfort and well-being"
                                                className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition resize-y"
                                            />
                                        </div>
                                        {/* ── Selected count ── */}
                                        <div className="flex items-center justify-between -mt-1">
                                            <p className="text-xs text-gray-400">
                                                Check all amenities available at this property.
                                                <span className="ml-2 px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full font-semibold">
                                                    {selectedPresetAmenities.size} selected
                                                </span>
                                            </p>
                                            {selectedPresetAmenities.size > 0 && (
                                                <button type="button"
                                                    onClick={() => setSelectedPresetAmenities(new Set())}
                                                    className="text-xs text-red-400 hover:text-red-300 transition">
                                                    Clear all
                                                </button>
                                            )}
                                        </div>

                                        {/* ── Preset amenities by category ── */}
                                        <div className="space-y-5">
                                            {AMENITY_CATEGORIES.map(cat => (
                                                <div key={cat}>
                                                    <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">{cat}</p>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                        {PRESET_AMENITIES.filter(a => a.category === cat).map(amenity => {
                                                            const isChecked = selectedPresetAmenities.has(amenity.name);
                                                            return (
                                                                <button
                                                                    key={amenity.name}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setSelectedPresetAmenities(prev => {
                                                                            const next = new Set(prev);
                                                                            if (isChecked) next.delete(amenity.name);
                                                                            else next.add(amenity.name);
                                                                            return next;
                                                                        });
                                                                    }}
                                                                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                                                                        isChecked
                                                                            ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-sm shadow-amber-500/10'
                                                                            : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'
                                                                    }`}
                                                                >
                                                                    <span className="text-base flex-shrink-0">{amenity.icon}</span>
                                                                    <span className="leading-tight">{amenity.name}</span>
                                                                    {isChecked && (
                                                                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 ml-auto flex-shrink-0" />
                                                                    )}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* ── Custom amenities ── */}
                                        <div className="pt-3 border-t border-gray-700/60">
                                            <p className="text-xs font-semibold text-gray-400 mb-2">➕ Custom Amenities (not in the list above)</p>
                                            <div className="space-y-2">
                                                {customAmenities.map((a, i) => (
                                                    <div key={i} className="grid grid-cols-3 gap-2 items-center">
                                                        <input value={a.name} onChange={e => setCustomAmenities(prev => prev.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} placeholder="Custom Amenity Name"
                                                            className="px-3 py-2 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition" />
                                                        <input value={a.icon} onChange={e => setCustomAmenities(prev => prev.map((x, j) => j === i ? { ...x, icon: e.target.value } : x))} placeholder="Emoji e.g. 🌟"
                                                            className="px-3 py-2 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition" />
                                                        <div className="flex gap-2 items-center">
                                                            <ImageUploadInput
                                                                value={a.imageUrl}
                                                                onChange={url => setCustomAmenities(prev => prev.map((x, j) => j === i ? { ...x, imageUrl: url } : x))}
                                                                placeholder="/images/amenity.jpg"
                                                                showPreview={false}
                                                                className="flex-1"
                                                            />
                                                            {customAmenities.length > 1 && <RemoveBtn onClick={() => setCustomAmenities(prev => prev.filter((_, j) => j !== i))} />}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <AddBtn label="Add Custom Amenity" onClick={() => setCustomAmenities(prev => [...prev, { name: '', icon: '', imageUrl: '' }])} />
                                        </div>
                                    </SectionCard>
                                    <SectionCard title="📐 Floor Plans">
                                        <Input label="Section Heading" value={sectionTitles.floorPlans} onChange={e => setSectionTitles(t => ({ ...t, floorPlans: e.target.value }))} placeholder="Sizes, Prices & Layouts" />
                                        <div className="mt-3">
                                            <label className="block text-xs text-gray-400 font-medium mb-1">
                                                Intro paragraph <span className="text-gray-500">(description under the floor plans title on the property page)</span>
                                            </label>
                                            <textarea
                                                value={floorPlansIntro}
                                                onChange={e => setFloorPlansIntro(e.target.value)}
                                                rows={3}
                                                placeholder="Choose from our range of meticulously designed residences, each offering unparalleled luxury and comfort"
                                                className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition resize-y"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            {floorPlans.map((f, i) => (
                                                <div key={i} className="grid grid-cols-4 gap-2 items-center">
                                                    <input value={f.type} onChange={e => updateItemField(setFloorPlans, i, 'type', e.target.value)} placeholder="2 BHK"
                                                        className="px-3 py-2 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition" />
                                                    <input value={f.superArea} onChange={e => updateItemField(setFloorPlans, i, 'superArea', e.target.value)} placeholder="1050 sq.ft"
                                                        className="px-3 py-2 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition" />
                                                    <input value={f.price} onChange={e => updateItemField(setFloorPlans, i, 'price', e.target.value)} placeholder="₹ 1.5 Cr"
                                                        className="px-3 py-2 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition" />
                                                    <div className="flex gap-2 items-center">
                                                        <ImageUploadInput
                                                            value={f.imageUrl}
                                                            onChange={url => updateItemField(setFloorPlans, i, 'imageUrl', url)}
                                                            placeholder="/images/plan.jpg"
                                                            showPreview={false}
                                                            className="flex-1"
                                                        />
                                                        {floorPlans.length > 1 && <RemoveBtn onClick={() => removeItem(setFloorPlans, i)} />}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-xs text-gray-500">Type · Super Area · Price · Image URL</div>
                                        <AddBtn label="Add Floor Plan" onClick={() => addItem(setFloorPlans, { type: '', superArea: '', price: '', imageUrl: '' })} />
                                        <div className="pt-2 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs text-gray-400 font-medium">
                                                    Left panel quote (below Download) <span className="text-amber-400">(HTML supported)</span>
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const el = document.getElementById('fp-panel-quote-preview-create');
                                                        if (el) el.classList.toggle('hidden');
                                                    }}
                                                    className="text-xs text-amber-400 hover:text-amber-300 transition underline"
                                                >
                                                    Toggle preview
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                Leave empty to use the default line with the active unit type (2 BHK / 4 BHK, etc.).
                                            </p>
                                            <textarea
                                                value={floorPlanPanelQuote}
                                                onChange={e => setFloorPlanPanelQuote(e.target.value)}
                                                rows={3}
                                                placeholder={`<p class="italic">"Custom quote…"</p>`}
                                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition resize-y font-mono"
                                            />
                                            <div id="fp-panel-quote-preview-create" className="hidden mt-2 rounded-xl border border-amber-500/30 bg-white p-4 max-h-48 overflow-y-auto">
                                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Preview</p>
                                                {floorPlanPanelQuote.trim() ? (
                                                    <HtmlRenderer html={floorPlanPanelQuote} fontSize="text-sm" />
                                                ) : (
                                                    <p className="text-gray-500 text-sm italic">Default quote will show on the site (varies by selected unit type).</p>
                                                )}
                                            </div>
                                        </div>
                                    </SectionCard>
                                    <SectionCard title="📊 Amenities Stats Bar">
                                        <p className="text-xs text-gray-500 -mt-1">4 numbers shown in the dark bar at the bottom of the Amenities section.</p>
                                        <div className="grid grid-cols-4 gap-4">
                                            <Input label="Clubhouse Sq Ft" value={amenitiesStats.clubhouseSqFt} onChange={e => setAmenitiesStats(s => ({ ...s, clubhouseSqFt: e.target.value }))} placeholder="100K" />
                                            <Input label="Total Amenities" value={amenitiesStats.amenitiesCount} onChange={e => setAmenitiesStats(s => ({ ...s, amenitiesCount: e.target.value }))} placeholder="25+" />
                                            <Input label="Swimming Pools" value={amenitiesStats.swimmingPools} onChange={e => setAmenitiesStats(s => ({ ...s, swimmingPools: e.target.value }))} placeholder="5" />
                                            <Input label="Dining Options" value={amenitiesStats.diningOptions} onChange={e => setAmenitiesStats(s => ({ ...s, diningOptions: e.target.value }))} placeholder="5" />
                                        </div>
                                    </SectionCard>
                                    <SectionCard title="📝 Floor Plan Descriptions">
                                        <p className="text-xs text-gray-500 -mt-1">Scrollable description sections below the floor plan image.</p>
                                        <div className="space-y-4">
                                            {floorPlanDescSections.map((s, i) => (
                                                <div key={i} className="bg-gray-900 rounded-xl p-3 space-y-2 relative">
                                                    {floorPlanDescSections.length > 1 && <div className="absolute top-2 right-2"><RemoveBtn onClick={() => removeItem(setFloorPlanDescSections, i)} /></div>}
                                                    <input value={s.heading} onChange={e => updateItemField(setFloorPlanDescSections, i, 'heading', e.target.value)} placeholder="Section Heading"
                                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition" />
                                                    <div className="space-y-1">
                                                        <div className="flex items-center justify-between">
                                                            <label className="text-xs text-gray-400 font-medium">
                                                                Body <span className="text-amber-400">(HTML supported)</span>
                                                            </label>
                                                            <button type="button"
                                                                onClick={() => { const el = document.getElementById(`fp-desc-preview-${i}`); if (el) el.classList.toggle('hidden'); }}
                                                                className="text-xs text-amber-400 hover:text-amber-300 transition underline">
                                                                Toggle preview
                                                            </button>
                                                        </div>
                                                        <textarea value={s.body} onChange={e => updateItemField(setFloorPlanDescSections, i, 'body', e.target.value)} rows={4}
                                                            placeholder={`Plain text or HTML:\n<p>Premium 3 BHK residences...</p>\n<ul>\n  <li>Spacious layouts</li>\n</ul>`}
                                                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition resize-y font-mono" />
                                                        <div id={`fp-desc-preview-${i}`} className="hidden mt-2 rounded-xl border border-amber-500/30 bg-white p-4 max-h-48 overflow-y-auto">
                                                            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Preview</p>
                                                            {s.body
                                                                ? <HtmlRenderer html={s.body} fontSize="text-sm" />
                                                                : <p className="text-gray-400 text-xs italic">Nothing to preview yet…</p>}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <AddBtn label="Add Description Section" onClick={() => addItem(setFloorPlanDescSections, { heading: '', body: '' })} />
                                    </SectionCard>
                                </div>
                            )}

                            {/* ── STEP 10: Payment Plans ────────────────────────────────────── */}
                            {step === 9 && (
                                <div className="space-y-6">
                                    <SectionCard title="💳 Payment Plans">
                                        <Input label="Section Heading" value={sectionTitles.paymentPlans} onChange={e => setSectionTitles(t => ({ ...t, paymentPlans: e.target.value }))} placeholder="Payment Plans" />
                                        <div className="mt-3">
                                            <label className="block text-xs text-gray-400 font-medium mb-1">
                                                Intro paragraph <span className="text-gray-500">(description under the payment plans title on the property page)</span>
                                            </label>
                                            <textarea
                                                value={paymentPlansIntro}
                                                onChange={e => setPaymentPlansIntro(e.target.value)}
                                                rows={3}
                                                placeholder="Flexible payment options designed to suit your financial planning."
                                                className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition resize-y"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            {paymentPlans.map((p, i) => (
                                                <div key={i} className="bg-gray-900 rounded-xl p-4 space-y-3 relative">
                                                    {paymentPlans.length > 1 && <div className="absolute top-3 right-3"><RemoveBtn onClick={() => removeItem(setPaymentPlans, i)} /></div>}
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <input value={p.title} onChange={e => updateItemField(setPaymentPlans, i, 'title', e.target.value)} placeholder="10-90 Construction Linked Plan"
                                                            className="px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition" />
                                                        <input value={p.type} onChange={e => updateItemField(setPaymentPlans, i, 'type', e.target.value)} placeholder="CLP / DP / No EMI…"
                                                            className="px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition" />
                                                    </div>
                                                    <textarea value={p.description} onChange={e => updateItemField(setPaymentPlans, i, 'description', e.target.value)} rows={2} placeholder="Description of this payment plan…"
                                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition resize-none" />
                                                </div>
                                            ))}
                                        </div>
                                        <AddBtn label="Add Payment Plan" onClick={() => addItem(setPaymentPlans, { title: '', type: '', description: '' })} />
                                    </SectionCard>
                                </div>
                            )}

                            {/* ── STEP 11: Team ─────────────────────────────────────────────── */}
                            {step === 10 && (
                                <div className="space-y-6">
                                    <SectionCard title="👷 Design & Construction Team">
                                        <Input label="Section Heading" value={sectionTitles.team} onChange={e => setSectionTitles(t => ({ ...t, team: e.target.value }))} placeholder="Design & Construction Team" />
                                        <div className="mt-3">
                                            <label className="block text-xs text-gray-400 font-medium mb-1">
                                                Intro paragraph <span className="text-gray-500">(description under the team title on the property page)</span>
                                            </label>
                                            <textarea
                                                value={teamIntro}
                                                onChange={e => setTeamIntro(e.target.value)}
                                                rows={3}
                                                placeholder="World-class professionals coming together to create an architectural masterpiece"
                                                className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition resize-y"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            {teamMembers.map((m, i) => (
                                                <div key={i} className="bg-gray-900 rounded-xl p-4 space-y-3 relative">
                                                    {teamMembers.length > 1 && <div className="absolute top-3 right-3"><RemoveBtn onClick={() => removeItem(setTeamMembers, i)} /></div>}
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <Input label="Role" value={m.role} onChange={e => updateItemField(setTeamMembers, i, 'role', e.target.value)} placeholder="Architect" />
                                                        <Input label="Name / Firm" value={m.name} onChange={e => updateItemField(setTeamMembers, i, 'name', e.target.value)} placeholder="Renowned Architecture Firm" />
                                                    </div>
                                                    <Select label="Card Colour" value={m.color} onChange={e => updateItemField(setTeamMembers, i, 'color', e.target.value)}>
                                                        <option value="#3B82F6">Blue</option>
                                                        <option value="#10B981">Green</option>
                                                        <option value="#F97316">Orange</option>
                                                        <option value="#8B5CF6">Purple</option>
                                                        <option value="#EF4444">Red</option>
                                                        <option value="#C9A961">Gold</option>
                                                    </Select>
                                                </div>
                                            ))}
                                        </div>
                                        <AddBtn label="Add Team Member" onClick={() => addItem(setTeamMembers, { role: '', name: '', color: '#3B82F6', description: '', achievements: [''] })} />

                                        <div className="mt-6 border-t border-gray-700/60 pt-4">
                                            <h4 className="text-white font-medium text-sm mb-3">Team Highlights (the dark stat row at the bottom)</h4>
                                            <div className="space-y-3">
                                                {teamHighlights.map((th, i) => (
                                                    <div key={i} className="flex gap-2 relative pr-8">
                                                        <input value={th.title} onChange={e => updateItemField(setTeamHighlights, i, 'title', e.target.value)} placeholder="Highlight Title"
                                                            className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition" />
                                                        <input value={th.subtitle} onChange={e => updateItemField(setTeamHighlights, i, 'subtitle', e.target.value)} placeholder="Highlight Subtitle"
                                                            className="flex-[2] px-3 py-2 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition" />
                                                        {teamHighlights.length > 1 && <div className="absolute right-0 top-2"><RemoveBtn onClick={() => removeItem(setTeamHighlights, i)} /></div>}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-2">
                                                <AddBtn label="Add Highlight" onClick={() => addItem(setTeamHighlights, { title: '', subtitle: '' })} />
                                            </div>
                                        </div>
                                    </SectionCard>
                                </div>
                            )}

                            {/* ── STEP 12: FAQs & More (FAQs · USP · Specs) ────────────────── */}
                            {step === 11 && (
                                <div className="space-y-6">
                                    <SectionCard title="❓ FAQs">
                                        <Input label="Section Heading" value={sectionTitles.faqs} onChange={e => setSectionTitles(t => ({ ...t, faqs: e.target.value }))} placeholder="Frequently Asked Questions" />
                                        <div className="mt-3">
                                            <label className="block text-xs text-gray-400 font-medium mb-1">
                                                Intro paragraph <span className="text-gray-500">(description under the FAQs title on the property page)</span>
                                            </label>
                                            <textarea
                                                value={faqsIntro}
                                                onChange={e => setFaqsIntro(e.target.value)}
                                                rows={3}
                                                placeholder="Find answers to commonly asked questions about this project"
                                                className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition resize-y"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            {faqs.map((f, i) => (
                                                <div key={i} className="bg-gray-900 rounded-xl p-4 space-y-2 relative">
                                                    {faqs.length > 1 && <div className="absolute top-3 right-3"><RemoveBtn onClick={() => removeItem(setFaqs, i)} /></div>}
                                                    <input value={f.question} onChange={e => updateItemField(setFaqs, i, 'question', e.target.value)} placeholder="Question"
                                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition" />
                                                    <textarea value={f.answer} onChange={e => updateItemField(setFaqs, i, 'answer', e.target.value)} rows={2} placeholder="Answer"
                                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition resize-none" />
                                                    <input value={f.category} onChange={e => updateItemField(setFaqs, i, 'category', e.target.value)} placeholder="Category (e.g. General)"
                                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition" />
                                                </div>
                                            ))}
                                        </div>
                                        <AddBtn label="Add FAQ" onClick={() => addItem(setFaqs, { question: '', answer: '', category: '' })} />
                                    </SectionCard>
                                </div>
                            )}

                            {/* Error */}
                            {formError && (
                                <div className="flex items-start space-x-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-red-400 font-medium text-sm">Error</p>
                                        <p className="text-red-400/80 text-sm mt-0.5">{formError}</p>
                                    </div>
                                </div>
                            )}

                            {publishSeoWarnings.length > 0 && (
                                <div className="flex items-start space-x-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                                    <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-amber-300 font-medium text-sm">SEO recommendations</p>
                                        <ul className="mt-1 space-y-1">
                                            {publishSeoWarnings.map((warning) => (
                                                <li key={warning} className="text-amber-200/90 text-sm">{warning}</li>
                                            ))}
                                        </ul>
                                        <p className="text-amber-200/70 text-xs mt-2">These are hints only — publishing is not blocked.</p>
                                    </div>
                                </div>
                            )}

                            {/* Nav buttons */}
                            <div className="flex items-center justify-between pt-2 pb-8">
                                <button type="button" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
                                    className="flex items-center space-x-2 px-5 py-2.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-40 text-white rounded-xl text-sm font-semibold transition">
                                    <ChevronLeft className="w-4 h-4" /><span>Back</span>
                                </button>

                                {step < STEPS.length - 1 ? (
                                    <button type="button" onClick={() => setStep(s => s + 1)}
                                        className="flex items-center space-x-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-white rounded-xl text-sm font-semibold transition">
                                        <span>Next: {STEPS[step + 1]}</span><ChevronRight className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button type="button" onClick={handleSubmit} disabled={saving}
                                        className="flex items-center space-x-2 px-8 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition">
                                        {saving ? <><RefreshCw className="w-4 h-4 animate-spin" /><span>Creating…</span></>
                                            : <><CheckCircle2 className="w-4 h-4" /><span>Create Property</span></>}
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </ProtectedAdminRoute>
    );
}

function InfoRow({ label, value, mono }: { label: string; value?: string; mono?: boolean }) {
    return (
        <div className="flex items-center space-x-3">
            <span className="text-gray-400 text-sm w-24 flex-shrink-0">{label}</span>
            <span className={`text-white text-sm ${mono ? 'font-mono bg-gray-800 px-2 py-0.5 rounded text-xs' : ''}`}>{value}</span>
        </div>
    );
}
