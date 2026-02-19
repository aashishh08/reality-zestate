/**
 * Seed Script for Grand Arch Property
 * Run this with: node src/scripts/seed-grand-arch.js
 */

import db from '../models/index.js';

const { Property, PropertySection, PropertyCategory } = db;

async function seedGrandArch() {
    try {
        console.log('🌱 Starting Grand Arch seed...');

        // Step 1: Create or update the property
        const [property, created] = await Property.upsert({
            id: '650e8400-e29b-41d4-a716-446655470099',
            slug: 'grand-arch',
            title: 'Grand Arch',
            propertyType: 'residential',
            developerId: '550e8400-e29b-41d4-a716-446655440001', // Lodha Group
            locationId: '550e8400-e29b-41d4-a716-446655450010', // Sector 27, Gurgaon
            status: 'active',
            priceMin: 35000000, // ₹3.5 Cr
            priceMax: 75000000, // ₹7.5 Cr
            isPublished: true,
        });

        console.log(`✅ Property ${created ? 'created' : 'updated'}: ${property.slug}`);

        // Step 2: Delete existing sections
        await PropertySection.destroy({
            where: { propertyId: property.id }
        });
        console.log('🗑️  Cleared existing sections');

        // Step 3: Create all sections
        const sections = [
            // SECTION 1: HERO IMAGE
            {
                propertyId: property.id,
                type: 'heroImage',
                title: 'Hero Image',
                order: 1,
                isVisible: true,
                data: {
                    image: '/images/grand-arch-hero.jpg',
                    subtitle: 'Ultra-Luxury Residences in the Heart of Gurgaon'
                }
            },

            // SECTION 2: INTRO TEXT
            {
                propertyId: property.id,
                type: 'intro',
                title: 'Introduction',
                order: 2,
                isVisible: true,
                data: {
                    text: 'Grand Arch represents the pinnacle of luxury living in Gurgaon. This architectural masterpiece combines contemporary design with world-class amenities, offering an unparalleled lifestyle experience. Nestled in the prestigious Sector 58, Grand Arch redefines opulent living with its meticulously crafted residences and state-of-the-art facilities.'
                }
            },

            // SECTION 3: HIGHLIGHTS
            {
                propertyId: property.id,
                type: 'highlights',
                title: 'Key Highlights',
                order: 3,
                isVisible: true,
                data: {
                    landArea: '5.2 Acres',
                    possession: 'Dec 2026',
                    rera: 'GGM/650/382/2022/111',
                    configuration: '3, 4 & 5 BHK',
                    priceRange: '₹3.5 Cr - ₹7.5 Cr',
                    totalUnits: '280 Units',
                    features: [
                        'Premium Construction Quality',
                        'World-class Amenities',
                        'Excellent Connectivity',
                        'Luxury Lifestyle',
                        'Vastu Compliant',
                        'Earthquake Resistant Structure'
                    ]
                }
            },

            // SECTION 4: AMENITIES
            {
                propertyId: property.id,
                type: 'amenities',
                title: 'World-Class Amenities',
                order: 4,
                isVisible: true,
                data: {
                    items: [
                        { name: 'Infinity Swimming Pool', icon: '🏊', image: '/images/project-1.jpg' },
                        { name: 'State-of-the-art Gymnasium', icon: '💪', image: '/images/project-2.jpg' },
                        { name: 'Luxury Clubhouse', icon: '🏛️', image: '/images/project-3.jpg' },
                        { name: 'Landscaped Gardens', icon: '🌳', image: '/images/project-4.jpg' },
                        { name: 'Children Play Area', icon: '🎪', image: '/images/project-1.jpg' },
                        { name: 'Yoga & Meditation Center', icon: '🧘', image: '/images/project-2.jpg' },
                        { name: 'Indoor Games Room', icon: '🎮', image: '/images/project-3.jpg' },
                        { name: '24/7 Security with CCTV', icon: '🔒', image: '/images/project-4.jpg' },
                        { name: 'Power Backup', icon: '⚡', image: '/images/project-1.jpg' },
                        { name: 'Multi-level Parking', icon: '🚗', image: '/images/project-2.jpg' },
                        { name: 'Jogging Track', icon: '🏃', image: '/images/project-3.jpg' },
                        { name: 'Amphitheater', icon: '🎭', image: '/images/project-4.jpg' }
                    ]
                }
            },

            // SECTION 5: KEY TAKEAWAYS
            {
                propertyId: property.id,
                type: 'keyTakeaways',
                title: 'Key Takeaways',
                order: 5,
                isVisible: true,
                data: {
                    takeaways: [
                        'Prime location in Sector 58, Gurgaon with excellent connectivity',
                        '5.2 acres of meticulously planned development with 70% open spaces',
                        '280 ultra-luxury residences across 3 iconic towers',
                        'RERA registered project (GGM/650/382/2022/111)',
                        'Possession scheduled for December 2026',
                        'World-class amenities spread across 50,000 sq.ft.',
                        'Designed by award-winning international architects',
                        'Vastu-compliant homes with premium specifications',
                        '24/7 security with advanced surveillance systems',
                        'Flexible payment plans with attractive pre-launch pricing'
                    ]
                }
            },

            // SECTION 6: WHY INVEST
            {
                propertyId: property.id,
                type: 'whyInvest',
                title: 'Why Invest in Grand Arch',
                order: 6,
                isVisible: true,
                data: {
                    reasons: [
                        {
                            title: 'Prime Location Appreciation',
                            subtitle: 'Strategic location in Sector 58 with high appreciation potential',
                            icon: 'location'
                        },
                        {
                            title: 'Brand Legacy',
                            subtitle: 'Developed by Lodha Group with 40+ years of trust',
                            icon: 'award'
                        },
                        {
                            title: 'Strong Investment Returns',
                            subtitle: 'Expected rental yield of 3-4% with capital appreciation',
                            icon: 'trending'
                        },
                        {
                            title: 'Pre-Launch Advantage',
                            subtitle: 'Early bird pricing with significant upside potential',
                            icon: 'calendar'
                        }
                    ],
                    analysis: `Grand Arch presents a compelling investment opportunity in one of Gurgaon's most sought-after micro-markets. Sector 58 has emerged as a premium residential destination, commanding some of the highest property values in the National Capital Region.

The strategic location ensures excellent connectivity to major business hubs including Cyber City (10 mins), Golf Course Road (8 mins), and IGI Airport (25 mins). The upcoming metro extension and highway widening projects will further enhance accessibility, driving significant appreciation in property values.

From an appreciation perspective, Sector 58 has demonstrated consistent growth of 8-12% annually over the past five years. The micro-market benefits from limited land availability, premium positioning, and strong demand from corporate executives and HNIs.`
                }
            },

            // SECTION 7: FAQs
            {
                propertyId: property.id,
                type: 'faqs',
                title: 'Frequently Asked Questions',
                order: 7,
                isVisible: true,
                data: {
                    faqs: [
                        {
                            question: 'What is the RERA registration number for Grand Arch?',
                            answer: 'Grand Arch is registered under RERA number GGM/650/382/2022/111, ensuring complete transparency and regulatory compliance.',
                            category: 'Legal'
                        },
                        {
                            question: 'What configurations are available?',
                            answer: 'Grand Arch offers spacious 3 BHK (2,200-2,500 sq.ft.), 4 BHK (3,000-3,500 sq.ft.), and 5 BHK (4,000-4,500 sq.ft.) luxury apartments.',
                            category: 'Units'
                        },
                        {
                            question: 'What are the payment plans available?',
                            answer: 'We offer flexible payment plans including 20-40-40 Plan, Progressive Payment Plan, and Down Payment Plan.',
                            category: 'Payment'
                        },
                        {
                            question: 'When is the expected possession date?',
                            answer: 'The project is scheduled for possession in December 2026.',
                            category: 'Possession'
                        }
                    ]
                }
            },

            // SECTION 8: MASTER PLAN
            {
                propertyId: property.id,
                type: 'masterPlan',
                title: 'Master Plan',
                order: 8,
                isVisible: true,
                data: {
                    image: '/images/grand-arch-location.jpg',
                    description: [
                        'The master plan showcases a meticulously designed layout that maximizes open spaces while ensuring optimal utilization of the 5.2-acre land parcel.',
                        'State-of-the-art infrastructure including underground utilities, rainwater harvesting systems, and sustainable design elements.'
                    ]
                }
            },

            // SECTION 9: GALLERY
            {
                propertyId: property.id,
                type: 'gallery',
                title: 'Project Gallery',
                order: 9,
                isVisible: true,
                data: {
                    images: [
                        '/images/project-1.jpg',
                        '/images/project-2.jpg',
                        '/images/project-3.jpg',
                        '/images/project-4.jpg'
                    ],
                    videoUrl: 'https://www.youtube.com/embed/ScMzIvxBSi4'
                }
            },

            // SECTION 10: LOCATION
            {
                propertyId: property.id,
                type: 'location',
                title: 'Location & Connectivity',
                order: 10,
                isVisible: true,
                data: {
                    address: 'Sector 58, Golf Course Extension Road, Gurgaon',
                    mapImage: '/images/grand-arch-location.jpg',
                    nearby: [
                        {
                            category: 'Educational Institutions',
                            icon: 'education',
                            items: [
                                { name: 'Delhi Public School - 2 km' },
                                { name: 'The Shri Ram School - 4 km' }
                            ]
                        },
                        {
                            category: 'Healthcare Facilities',
                            icon: 'healthcare',
                            items: [
                                { name: 'Artemis Hospital - 5 km' },
                                { name: 'Fortis Hospital - 6 km' }
                            ]
                        }
                    ],
                    connectivity: [
                        { place: 'IGI Airport', icon: 'airport', time: '25 mins' },
                        { place: 'Cyber City', icon: 'building', time: '10 mins' }
                    ]
                }
            },

            // SECTION 11: FLOOR PLANS
            {
                propertyId: property.id,
                type: 'floorPlans',
                title: 'Floor Plans',
                order: 11,
                isVisible: true,
                data: {
                    plans: [
                        {
                            type: '3 BHK',
                            superArea: '2,200 sq.ft',
                            price: '₹3.5 Cr',
                            image: '/images/3bhk-plan.png'
                        },
                        {
                            type: '4 BHK',
                            superArea: '3,000 sq.ft',
                            price: '₹5 Cr',
                            image: '/images/4bhk-plan.png'
                        }
                    ]
                }
            },

            // SECTION 12: PAYMENT PLANS
            {
                propertyId: property.id,
                type: 'paymentPlans',
                title: 'Payment Plans',
                order: 12,
                isVisible: true,
                data: {
                    plans: [
                        {
                            title: '20-40-40 Payment Plan',
                            type: 'Standard',
                            description: '20% on booking, 40% during construction, 40% on possession'
                        },
                        {
                            title: 'Progressive Payment Plan',
                            type: 'Construction Linked',
                            description: 'Payments linked to construction milestones'
                        }
                    ]
                }
            },

            // SECTION 13: TEAM
            {
                propertyId: property.id,
                type: 'team',
                title: 'Design & Construction Team',
                order: 13,
                isVisible: true,
                data: {
                    members: [
                        {
                            role: 'Master Architect',
                            name: 'Hafeez Contractor',
                            color: '#3B82F6',
                            description: 'India\'s most renowned architect',
                            achievements: [
                                'Padma Bhushan awardee',
                                '300+ million sq.ft. designed'
                            ]
                        }
                    ],
                    highlights: [
                        { title: 'Global Expertise', subtitle: 'International standards' },
                        { title: 'Award Winning', subtitle: 'Multiple accolades' }
                    ]
                }
            },

            // SECTION 14: USP
            {
                propertyId: property.id,
                type: 'usp',
                title: 'Unique Selling Points',
                order: 14,
                isVisible: true,
                data: {
                    points: [
                        'Prime location in Sector 58 with excellent connectivity',
                        'Developed by Lodha Group - India\'s No. 1 developer',
                        '70% open spaces with landscaped gardens',
                        'World-class amenities across 50,000 sq.ft.',
                        'Designed by Hafeez Contractor',
                        'RERA registered project',
                        'Earthquake-resistant structure',
                        'Vastu-compliant homes'
                    ]
                }
            },

            // SECTION 15: OVERVIEW
            {
                propertyId: property.id,
                type: 'overview',
                title: 'Project Overview',
                order: 15,
                isVisible: true,
                data: {
                    heading: 'Overview of Grand Arch',
                    content: [
                        'Grand Arch is a landmark residential development offering ultra-luxury apartments in Gurgaon.',
                        'Strategically located in Sector 58 with excellent connectivity.',
                        'Designed by legendary architect Hafeez Contractor.',
                        'LEED pre-certified with sustainable features.'
                    ],
                    features: [
                        'Premium Construction',
                        'World-class Amenities',
                        'Excellent Connectivity',
                        'LEED Certified'
                    ]
                }
            }
        ];

        await PropertySection.bulkCreate(sections);
        console.log(`✅ Created ${sections.length} sections`);

        // Verify
        const sectionCount = await PropertySection.count({
            where: { propertyId: property.id }
        });

        console.log('\n🎉 Grand Arch seed completed successfully!');
        console.log(`📊 Property: ${property.title}`);
        console.log(`📄 Sections: ${sectionCount}`);
        console.log(`🔗 Slug: ${property.slug}`);
        console.log(`\n✨ Visit: http://localhost:3000/projects/${property.slug}`);

    } catch (error) {
        console.error('❌ Seed failed:', error);
        throw error;
    }
}

// Run the seed
seedGrandArch()
    .then(() => {
        console.log('\n✅ Seed script completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Seed script failed:', error);
        process.exit(1);
    });
