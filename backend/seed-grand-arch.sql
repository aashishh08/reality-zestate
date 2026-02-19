-- ============================================================================
-- COMPREHENSIVE SEED DATA FOR "GRAND ARCH" PROPERTY
-- This seed includes ALL sections required by the frontend property details page
-- ============================================================================

-- Step 1: Create the main property
INSERT INTO properties (id, slug, title, "propertyType", "developerId", "locationId", status, "priceMin", "priceMax", "isPublished", "createdAt", "updatedAt")
VALUES (
  '650e8400-e29b-41d4-a716-446655470099'::uuid,
  'grand-arch',
  'Grand Arch',
  'residential',
  '550e8400-e29b-41d4-a716-446655440001'::uuid,  -- Lodha Group
  '550e8400-e29b-41d4-a716-446655450010'::uuid,  -- Sector 27, Gurgaon
  'active',
  35000000,  -- ₹3.5 Cr
  75000000,  -- ₹7.5 Cr
  true,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  "priceMin" = EXCLUDED."priceMin",
  "priceMax" = EXCLUDED."priceMax",
  "isPublished" = EXCLUDED."isPublished",
  "updatedAt" = NOW();

-- Step 2: Link to Luxury category
INSERT INTO property_categories (id, "propertyId", "categoryId", "createdAt", "updatedAt")
VALUES (
  '650e8400-e29b-41d4-a716-446655480099'::uuid,
  '650e8400-e29b-41d4-a716-446655470099'::uuid,
  '550e8400-e29b-41d4-a716-446655460003'::uuid,  -- Luxury category
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

-- Step 3: Delete existing sections for this property (if re-running)
DELETE FROM property_sections WHERE "propertyId" = '650e8400-e29b-41d4-a716-446655470099'::uuid;

-- ============================================================================
-- SECTION 1: HERO IMAGE
-- ============================================================================
INSERT INTO property_sections (id, "propertyId", type, title, "order", "isVisible", data, "createdAt", "updatedAt")
VALUES (
  '650e8400-e29b-41d4-a716-446655490101'::uuid,
  '650e8400-e29b-41d4-a716-446655470099'::uuid,
  'heroImage',
  'Hero Image',
  1,
  true,
  '{
    "image": "/images/grand-arch-hero.jpg",
    "subtitle": "Ultra-Luxury Residences in the Heart of Gurgaon"
  }'::jsonb,
  NOW(),
  NOW()
);

-- ============================================================================
-- SECTION 2: INTRO TEXT
-- ============================================================================
INSERT INTO property_sections (id, "propertyId", type, title, "order", "isVisible", data, "createdAt", "updatedAt")
VALUES (
  '650e8400-e29b-41d4-a716-446655490102'::uuid,
  '650e8400-e29b-41d4-a716-446655470099'::uuid,
  'intro',
  'Introduction',
  2,
  true,
  '{
    "text": "Grand Arch represents the pinnacle of luxury living in Gurgaon. This architectural masterpiece combines contemporary design with world-class amenities, offering an unparalleled lifestyle experience. Nestled in the prestigious Sector 58, Grand Arch redefines opulent living with its meticulously crafted residences and state-of-the-art facilities."
  }'::jsonb,
  NOW(),
  NOW()
);

-- ============================================================================
-- SECTION 3: HIGHLIGHTS
-- ============================================================================
INSERT INTO property_sections (id, "propertyId", type, title, "order", "isVisible", data, "createdAt", "updatedAt")
VALUES (
  '650e8400-e29b-41d4-a716-446655490103'::uuid,
  '650e8400-e29b-41d4-a716-446655470099'::uuid,
  'highlights',
  'Key Highlights',
  3,
  true,
  '{
    "landArea": "5.2 Acres",
    "possession": "Dec 2026",
    "rera": "GGM/650/382/2022/111",
    "configuration": "3, 4 & 5 BHK",
    "priceRange": "₹3.5 Cr - ₹7.5 Cr",
    "totalUnits": "280 Units",
    "features": [
      "Premium Construction Quality",
      "World-class Amenities",
      "Excellent Connectivity",
      "Luxury Lifestyle",
      "Vastu Compliant",
      "Earthquake Resistant Structure"
    ]
  }'::jsonb,
  NOW(),
  NOW()
);

-- ============================================================================
-- SECTION 4: AMENITIES
-- ============================================================================
INSERT INTO property_sections (id, "propertyId", type, title, "order", "isVisible", data, "createdAt", "updatedAt")
VALUES (
  '650e8400-e29b-41d4-a716-446655490104'::uuid,
  '650e8400-e29b-41d4-a716-446655470099'::uuid,
  'amenities',
  'World-Class Amenities',
  4,
  true,
  '{
    "items": [
      {
        "name": "Infinity Swimming Pool",
        "icon": "🏊",
        "image": "/images/project-1.jpg"
      },
      {
        "name": "State-of-the-art Gymnasium",
        "icon": "💪",
        "image": "/images/project-2.jpg"
      },
      {
        "name": "Luxury Clubhouse",
        "icon": "🏛️",
        "image": "/images/project-3.jpg"
      },
      {
        "name": "Landscaped Gardens",
        "icon": "🌳",
        "image": "/images/project-4.jpg"
      },
      {
        "name": "Children Play Area",
        "icon": "🎪",
        "image": "/images/project-1.jpg"
      },
      {
        "name": "Yoga & Meditation Center",
        "icon": "🧘",
        "image": "/images/project-2.jpg"
      },
      {
        "name": "Indoor Games Room",
        "icon": "🎮",
        "image": "/images/project-3.jpg"
      },
      {
        "name": "24/7 Security with CCTV",
        "icon": "🔒",
        "image": "/images/project-4.jpg"
      },
      {
        "name": "Power Backup",
        "icon": "⚡",
        "image": "/images/project-1.jpg"
      },
      {
        "name": "Multi-level Parking",
        "icon": "🚗",
        "image": "/images/project-2.jpg"
      },
      {
        "name": "Jogging Track",
        "icon": "🏃",
        "image": "/images/project-3.jpg"
      },
      {
        "name": "Amphitheater",
        "icon": "🎭",
        "image": "/images/project-4.jpg"
      }
    ]
  }'::jsonb,
  NOW(),
  NOW()
);

-- ============================================================================
-- SECTION 5: KEY TAKEAWAYS
-- ============================================================================
INSERT INTO property_sections (id, "propertyId", type, title, "order", "isVisible", data, "createdAt", "updatedAt")
VALUES (
  '650e8400-e29b-41d4-a716-446655490105'::uuid,
  '650e8400-e29b-41d4-a716-446655470099'::uuid,
  'keyTakeaways',
  'Key Takeaways',
  5,
  true,
  '{
    "takeaways": [
      "Prime location in Sector 58, Gurgaon with excellent connectivity",
      "5.2 acres of meticulously planned development with 70% open spaces",
      "280 ultra-luxury residences across 3 iconic towers",
      "RERA registered project (GGM/650/382/2022/111)",
      "Possession scheduled for December 2026",
      "World-class amenities spread across 50,000 sq.ft.",
      "Designed by award-winning international architects",
      "Vastu-compliant homes with premium specifications",
      "24/7 security with advanced surveillance systems",
      "Flexible payment plans with attractive pre-launch pricing"
    ]
  }'::jsonb,
  NOW(),
  NOW()
);

-- ============================================================================
-- SECTION 6: WHY INVEST
-- ============================================================================
INSERT INTO property_sections (id, "propertyId", type, title, "order", "isVisible", data, "createdAt", "updatedAt")
VALUES (
  '650e8400-e29b-41d4-a716-446655490106'::uuid,
  '650e8400-e29b-41d4-a716-446655470099'::uuid,
  'whyInvest',
  'Why Invest in Grand Arch',
  6,
  true,
  '{
    "reasons": [
      {
        "title": "Prime Location Appreciation",
        "subtitle": "Strategic location in Sector 58 with high appreciation potential",
        "icon": "location"
      },
      {
        "title": "Brand Legacy",
        "subtitle": "Developed by Lodha Group with 40+ years of trust",
        "icon": "award"
      },
      {
        "title": "Strong Investment Returns",
        "subtitle": "Expected rental yield of 3-4% with capital appreciation",
        "icon": "trending"
      },
      {
        "title": "Pre-Launch Advantage",
        "subtitle": "Early bird pricing with significant upside potential",
        "icon": "calendar"
      },
      {
        "title": "Infrastructure Growth",
        "subtitle": "Upcoming metro connectivity and highway expansion",
        "icon": "building"
      },
      {
        "title": "Limited Supply",
        "subtitle": "Exclusive luxury segment with limited competition",
        "icon": "star"
      }
    ],
    "analysis": "Grand Arch presents a compelling investment opportunity in one of Gurgaon''s most sought-after micro-markets. Sector 58 has emerged as a premium residential destination, commanding some of the highest property values in the National Capital Region.\n\nThe strategic location ensures excellent connectivity to major business hubs including Cyber City (10 mins), Golf Course Road (8 mins), and IGI Airport (25 mins). The upcoming metro extension and highway widening projects will further enhance accessibility, driving significant appreciation in property values.\n\nLodha Group''s reputation as India''s premier real estate developer adds substantial credibility to this investment. With a proven track record of delivering over 100 million sq.ft. across 40+ years, the group ensures timely possession and quality construction. Their projects have consistently delivered superior returns compared to market averages.\n\nFrom an appreciation perspective, Sector 58 has demonstrated consistent growth of 8-12% annually over the past five years. The micro-market benefits from limited land availability, premium positioning, and strong demand from corporate executives and HNIs. Historical data indicates that luxury properties in this corridor have outperformed broader market indices by 3-5% annually.\n\nRental yield potential is equally attractive. The location commands premium rents due to proximity to corporate offices, international schools, and lifestyle amenities. Luxury apartments in this area typically generate rental yields in the range of 3-4%, providing steady cash flow for investors while capital appreciates.\n\nThe current pre-launch phase presents an optimal entry point from a pricing perspective. Early investors in Lodha''s previous projects have benefited from 15-25% appreciation by the time of possession. Combined with flexible payment plans and construction-linked options, this timing advantage significantly enhances the overall investment proposition.\n\nAdditionally, the project''s focus on sustainability, premium specifications, and world-class amenities ensures it will remain a preferred choice for discerning buyers, supporting long-term value retention and appreciation."
  }'::jsonb,
  NOW(),
  NOW()
);

-- ============================================================================
-- SECTION 7: FAQs
-- ============================================================================
INSERT INTO property_sections (id, "propertyId", type, title, "order", "isVisible", data, "createdAt", "updatedAt")
VALUES (
  '650e8400-e29b-41d4-a716-446655490107'::uuid,
  '650e8400-e29b-41d4-a716-446655470099'::uuid,
  'faqs',
  'Frequently Asked Questions',
  7,
  true,
  '{
    "faqs": [
      {
        "question": "What is the RERA registration number for Grand Arch?",
        "answer": "Grand Arch is registered under RERA number GGM/650/382/2022/111, ensuring complete transparency and regulatory compliance.",
        "category": "Legal"
      },
      {
        "question": "What configurations are available?",
        "answer": "Grand Arch offers spacious 3 BHK (2,200-2,500 sq.ft.), 4 BHK (3,000-3,500 sq.ft.), and 5 BHK (4,000-4,500 sq.ft.) luxury apartments with premium finishes and modern amenities.",
        "category": "Units"
      },
      {
        "question": "What are the payment plans available?",
        "answer": "We offer flexible payment plans including: 20-40-40 Plan (20% on booking, 40% during construction, 40% on possession), Progressive Payment Plan (linked to construction milestones), and Down Payment Plan (30% down payment, balance on possession).",
        "category": "Payment"
      },
      {
        "question": "When is the expected possession date?",
        "answer": "The project is scheduled for possession in December 2026. Lodha Group has a strong track record of timely deliveries.",
        "category": "Possession"
      },
      {
        "question": "What amenities are included?",
        "answer": "Grand Arch features over 50,000 sq.ft. of world-class amenities including infinity pool, state-of-the-art gymnasium, luxury clubhouse, landscaped gardens, yoga center, indoor games room, amphitheater, jogging track, and 24/7 security.",
        "category": "Amenities"
      },
      {
        "question": "Is the project Vastu compliant?",
        "answer": "Yes, all residences at Grand Arch are designed to be Vastu compliant, ensuring positive energy flow and harmony in your living spaces.",
        "category": "Design"
      },
      {
        "question": "What is the car parking provision?",
        "answer": "Each apartment comes with 2-3 dedicated covered parking spaces depending on the configuration. Additional visitor parking is available.",
        "category": "Parking"
      },
      {
        "question": "Are there any additional charges?",
        "answer": "Additional charges include EDC/IDC, PLC (Preferred Location Charges) for specific floors/views, club membership, and maintenance security deposit. Our sales team will provide detailed cost breakup.",
        "category": "Pricing"
      },
      {
        "question": "What is the loan approval status?",
        "answer": "Grand Arch is pre-approved by all major banks and financial institutions including HDFC, ICICI, SBI, and Axis Bank, ensuring easy home loan processing.",
        "category": "Financing"
      },
      {
        "question": "Can I customize my apartment interiors?",
        "answer": "Yes, we offer customization options for flooring, kitchen fittings, bathroom fixtures, and wall finishes. Our design team will assist you with the customization process.",
        "category": "Customization"
      }
    ]
  }'::jsonb,
  NOW(),
  NOW()
);

-- ============================================================================
-- SECTION 8: MASTER PLAN
-- ============================================================================
INSERT INTO property_sections (id, "propertyId", type, title, "order", "isVisible", data, "createdAt", "updatedAt")
VALUES (
  '650e8400-e29b-41d4-a716-446655490108'::uuid,
  '650e8400-e29b-41d4-a716-446655470099'::uuid,
  'masterPlan',
  'Master Plan',
  8,
  true,
  '{
    "image": "/images/grand-arch-location.jpg",
    "description": [
      "The master plan of Grand Arch showcases a meticulously designed layout that maximizes open spaces while ensuring optimal utilization of the 5.2-acre land parcel. With 70% open areas, the development offers a perfect balance between built-up spaces and green landscapes.",
      "The three residential towers are strategically positioned to ensure maximum privacy, natural light, and ventilation for all apartments. Each tower is designed with premium specifications and features dedicated lobbies with double-height entrances.",
      "State-of-the-art infrastructure including underground utilities, rainwater harvesting systems, sewage treatment plant, and sustainable design elements are integrated seamlessly into the master plan, making this a truly modern and eco-friendly development.",
      "The central amenity zone spanning 50,000 sq.ft. is thoughtfully placed to be easily accessible from all towers while maintaining the tranquility of residential spaces. Landscaped gardens, water features, and themed zones create a resort-like ambiance within the premises."
    ]
  }'::jsonb,
  NOW(),
  NOW()
);

-- ============================================================================
-- SECTION 9: GALLERY (Images & Video)
-- ============================================================================
INSERT INTO property_sections (id, "propertyId", type, title, "order", "isVisible", data, "createdAt", "updatedAt")
VALUES (
  '650e8400-e29b-41d4-a716-446655490109'::uuid,
  '650e8400-e29b-41d4-a716-446655470099'::uuid,
  'gallery',
  'Project Gallery',
  9,
  true,
  '{
    "images": [
      "/images/project-1.jpg",
      "/images/project-2.jpg",
      "/images/project-3.jpg",
      "/images/project-4.jpg",
      "/images/grand-arch-location.jpg"
    ],
    "videoUrl": "https://www.youtube.com/embed/ScMzIvxBSi4"
  }'::jsonb,
  NOW(),
  NOW()
);

-- ============================================================================
-- SECTION 10: LOCATION & CONNECTIVITY
-- ============================================================================
INSERT INTO property_sections (id, "propertyId", type, title, "order", "isVisible", data, "createdAt", "updatedAt")
VALUES (
  '650e8400-e29b-41d4-a716-446655490110'::uuid,
  '650e8400-e29b-41d4-a716-446655470099'::uuid,
  'location',
  'Location & Connectivity',
  10,
  true,
  '{
    "address": "Sector 58, Golf Course Extension Road, Gurgaon, Haryana 122011",
    "mapImage": "/images/grand-arch-location.jpg",
    "nearby": [
      {
        "category": "Educational Institutions",
        "icon": "education",
        "items": [
          { "name": "Delhi Public School - 2 km" },
          { "name": "DPS International - 3 km" },
          { "name": "The Shri Ram School - 4 km" },
          { "name": "Heritage School - 2.5 km" },
          { "name": "Amity International School - 3.5 km" }
        ]
      },
      {
        "category": "Healthcare Facilities",
        "icon": "healthcare",
        "items": [
          { "name": "Artemis Hospital - 5 km" },
          { "name": "Fortis Memorial Hospital - 6 km" },
          { "name": "Max Hospital - 7 km" },
          { "name": "Medanta Medicity - 8 km" },
          { "name": "Columbia Asia Hospital - 4 km" }
        ]
      },
      {
        "category": "Shopping & Entertainment",
        "icon": "shopping",
        "items": [
          { "name": "Sahara Mall - 3 km" },
          { "name": "MGF Metropolitan Mall - 4 km" },
          { "name": "DLF Cyber Hub - 6 km" },
          { "name": "Ambience Mall - 5 km" },
          { "name": "Good Earth City Centre - 3.5 km" }
        ]
      },
      {
        "category": "Business Hubs",
        "icon": "building",
        "items": [
          { "name": "Cyber City - 6 km" },
          { "name": "Udyog Vihar - 7 km" },
          { "name": "Sohna Road IT Park - 8 km" },
          { "name": "Golf Course Road Offices - 4 km" }
        ]
      }
    ],
    "connectivity": [
      {
        "place": "IGI Airport",
        "icon": "airport",
        "time": "25 mins"
      },
      {
        "place": "Cyber City",
        "icon": "building",
        "time": "10 mins"
      },
      {
        "place": "Golf Course Road",
        "icon": "location",
        "time": "8 mins"
      },
      {
        "place": "NH-8 Highway",
        "icon": "location",
        "time": "5 mins"
      },
      {
        "place": "Sector 54 Metro (Upcoming)",
        "icon": "location",
        "time": "7 mins"
      },
      {
        "place": "Huda City Centre Metro",
        "icon": "location",
        "time": "12 mins"
      }
    ]
  }'::jsonb,
  NOW(),
  NOW()
);

-- ============================================================================
-- SECTION 11: FLOOR PLANS
-- ============================================================================
INSERT INTO property_sections (id, "propertyId", type, title, "order", "isVisible", data, "createdAt", "updatedAt")
VALUES (
  '650e8400-e29b-41d4-a716-446655490111'::uuid,
  '650e8400-e29b-41d4-a716-446655470099'::uuid,
  'floorPlans',
  'Floor Plans',
  11,
  true,
  '{
    "plans": [
      {
        "type": "3 BHK",
        "superArea": "2,200 sq.ft",
        "carpetArea": "1,650 sq.ft",
        "price": "₹3.5 Cr",
        "image": "/images/3bhk-plan.png",
        "bedrooms": 3,
        "bathrooms": 3,
        "balconies": 2,
        "features": [
          "Master bedroom with walk-in closet",
          "Spacious living and dining area",
          "Modular kitchen with utility",
          "Servant room with toilet",
          "2 covered parking spaces"
        ]
      },
      {
        "type": "4 BHK",
        "superArea": "3,000 sq.ft",
        "carpetArea": "2,250 sq.ft",
        "price": "₹5 Cr",
        "image": "/images/4bhk-plan.png",
        "bedrooms": 4,
        "bathrooms": 4,
        "balconies": 3,
        "features": [
          "Master suite with private lounge",
          "Expansive living and dining spaces",
          "Premium modular kitchen",
          "Study room",
          "Servant quarters",
          "3 covered parking spaces"
        ]
      },
      {
        "type": "5 BHK Penthouse",
        "superArea": "4,500 sq.ft",
        "carpetArea": "3,400 sq.ft",
        "price": "₹7.5 Cr",
        "image": "/images/5bhk-plan.png",
        "bedrooms": 5,
        "bathrooms": 5,
        "balconies": 4,
        "features": [
          "Private terrace garden",
          "Master suite with jacuzzi",
          "Home theater room",
          "Designer kitchen with island",
          "Private lift lobby",
          "4 covered parking spaces"
        ]
      }
    ]
  }'::jsonb,
  NOW(),
  NOW()
);

-- ============================================================================
-- SECTION 12: PAYMENT PLANS
-- ============================================================================
INSERT INTO property_sections (id, "propertyId", type, title, "order", "isVisible", data, "createdAt", "updatedAt")
VALUES (
  '650e8400-e29b-41d4-a716-446655490112'::uuid,
  '650e8400-e29b-41d4-a716-446655470099'::uuid,
  'paymentPlans',
  'Payment Plans',
  12,
  true,
  '{
    "plans": [
      {
        "title": "20-40-40 Payment Plan",
        "type": "Standard",
        "description": "20% on booking, 40% during construction, 40% on possession",
        "details": [
          "20% payment at the time of booking",
          "40% payment linked to construction milestones",
          "40% payment on possession",
          "No pre-EMI burden during construction",
          "Flexible milestone-based payments"
        ]
      },
      {
        "title": "Progressive Payment Plan",
        "type": "Construction Linked",
        "description": "Payments linked to construction milestones throughout the project",
        "details": [
          "10% on booking",
          "10% on completion of foundation",
          "15% on completion of 5th floor",
          "15% on completion of 10th floor",
          "20% on completion of 15th floor",
          "15% on completion of structure",
          "15% on possession"
        ]
      },
      {
        "title": "Down Payment Plan",
        "type": "Flexible",
        "description": "30% down payment with balance on possession",
        "details": [
          "30% down payment within 60 days of booking",
          "70% balance on possession",
          "Ideal for investors",
          "Maximum time to arrange finances",
          "Special discount on this plan"
        ]
      },
      {
        "title": "Subvention Scheme",
        "type": "Special Offer",
        "description": "Developer pays interest during construction period",
        "details": [
          "20% payment on booking",
          "Developer pays EMI till possession",
          "Balance 80% through home loan",
          "Move in immediately after possession",
          "No rental burden during construction"
        ]
      }
    ]
  }'::jsonb,
  NOW(),
  NOW()
);

-- ============================================================================
-- SECTION 13: DESIGN & CONSTRUCTION TEAM
-- ============================================================================
INSERT INTO property_sections (id, "propertyId", type, title, "order", "isVisible", data, "createdAt", "updatedAt")
VALUES (
  '650e8400-e29b-41d4-a716-446655490113'::uuid,
  '650e8400-e29b-41d4-a716-446655470099'::uuid,
  'team',
  'Design & Construction Team',
  13,
  true,
  '{
    "members": [
      {
        "role": "Master Architect",
        "name": "Hafeez Contractor",
        "color": "#3B82F6",
        "description": "India''s most renowned architect bringing international design standards to Grand Arch with award-winning contemporary architecture.",
        "achievements": [
          "Padma Bhushan awardee",
          "300+ million sq.ft. designed globally",
          "Specialized in luxury high-rise developments",
          "40+ years of architectural excellence"
        ]
      },
      {
        "role": "Landscape Design",
        "name": "Sitetectonix",
        "color": "#10B981",
        "description": "Award-winning landscape architects creating sustainable outdoor spaces that enhance the living experience with themed gardens and water features.",
        "achievements": [
          "25+ years of landscape design excellence",
          "Projects across 15+ countries",
          "Focus on sustainable and eco-friendly landscaping",
          "Multiple international design awards"
        ]
      },
      {
        "role": "Structural Engineering",
        "name": "Arup India",
        "color": "#F97316",
        "description": "Global engineering consultancy ensuring world-class structural integrity with earthquake-resistant design and innovative construction techniques.",
        "achievements": [
          "75+ years of global engineering expertise",
          "Iconic projects worldwide",
          "Advanced seismic design capabilities",
          "ISO certified quality processes"
        ]
      },
      {
        "role": "MEP Consultant",
        "name": "J. Roger Preston",
        "color": "#8B5CF6",
        "description": "Leading MEP consultants providing energy-efficient and sustainable building services design for optimal comfort and reduced operational costs.",
        "achievements": [
          "50+ years in MEP consulting",
          "LEED certified green building expertise",
          "Smart building automation systems",
          "Energy optimization specialists"
        ]
      }
    ],
    "highlights": [
      {
        "title": "Global Expertise",
        "subtitle": "International design and engineering standards"
      },
      {
        "title": "Proven Track Record",
        "subtitle": "500+ million sq.ft. delivered worldwide"
      },
      {
        "title": "Award Winning",
        "subtitle": "Multiple national and international accolades"
      },
      {
        "title": "Sustainable Design",
        "subtitle": "LEED pre-certified green building"
      }
    ]
  }'::jsonb,
  NOW(),
  NOW()
);

-- ============================================================================
-- SECTION 14: USP (Unique Selling Points)
-- ============================================================================
INSERT INTO property_sections (id, "propertyId", type, title, "order", "isVisible", data, "createdAt", "updatedAt")
VALUES (
  '650e8400-e29b-41d4-a716-446655490114'::uuid,
  '650e8400-e29b-41d4-a716-446655470099'::uuid,
  'usp',
  'Unique Selling Points',
  14,
  true,
  '{
    "points": [
      "Prime location in Sector 58 with excellent connectivity to Cyber City and Golf Course Road",
      "Developed by Lodha Group - India''s No. 1 real estate developer with 40+ years of trust",
      "70% open spaces with beautifully landscaped gardens and water features",
      "World-class amenities spread across 50,000 sq.ft. including infinity pool and luxury clubhouse",
      "Designed by Hafeez Contractor - Padma Bhushan awardee and India''s most celebrated architect",
      "RERA registered project ensuring transparency and timely delivery",
      "Earthquake-resistant structure with advanced engineering by Arup India",
      "Vastu-compliant homes with premium specifications and high-quality finishes",
      "LEED pre-certified green building with sustainable and eco-friendly features",
      "Smart home automation with app-based controls for lighting, AC, and security",
      "Double-height entrance lobbies with designer interiors in each tower",
      "Dedicated concierge services for residents'' convenience",
      "Pre-approved by all major banks for easy home loan processing",
      "Flexible payment plans with attractive pre-launch pricing and discounts"
    ]
  }'::jsonb,
  NOW(),
  NOW()
);

-- ============================================================================
-- SECTION 15: OVERVIEW (Additional content for overview section)
-- ============================================================================
INSERT INTO property_sections (id, "propertyId", type, title, "order", "isVisible", data, "createdAt", "updatedAt")
VALUES (
  '650e8400-e29b-41d4-a716-446655490115'::uuid,
  '650e8400-e29b-41d4-a716-446655470099'::uuid,
  'overview',
  'Project Overview',
  15,
  true,
  '{
    "heading": "Overview of Grand Arch",
    "content": [
      "Grand Arch is a landmark residential development by Lodha Group, offering ultra-luxury 3, 4, and 5 BHK apartments in the heart of Gurgaon. Spread across 5.2 acres, this architectural marvel features three iconic towers with 280 meticulously designed residences.",
      "The project is strategically located in Sector 58, one of Gurgaon''s most prestigious addresses, offering excellent connectivity to Cyber City, Golf Course Road, and IGI Airport. The location provides the perfect balance of urban convenience and serene living.",
      "Designed by the legendary architect Hafeez Contractor, Grand Arch showcases contemporary architecture with premium specifications. Every residence is crafted to offer spacious layouts, abundant natural light, and stunning views of the landscaped surroundings.",
      "With 70% open spaces, world-class amenities, and sustainable design features, Grand Arch redefines luxury living in the NCR. The development is LEED pre-certified and incorporates rainwater harvesting, sewage treatment, and energy-efficient systems."
    ],
    "features": [
      "Premium Construction Quality",
      "World-class Amenities",
      "Excellent Connectivity",
      "Luxury Lifestyle",
      "Vastu Compliant",
      "Earthquake Resistant",
      "LEED Certified",
      "Smart Home Ready"
    ]
  }'::jsonb,
  NOW(),
  NOW()
);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
SELECT 
  p.slug,
  p.title,
  p."priceMin",
  p."priceMax",
  COUNT(ps.id) as section_count
FROM properties p
LEFT JOIN property_sections ps ON p.id = ps."propertyId"
WHERE p.slug = 'grand-arch'
GROUP BY p.id, p.slug, p.title, p."priceMin", p."priceMax";

SELECT 
  type,
  title,
  "order",
  "isVisible"
FROM property_sections
WHERE "propertyId" = '650e8400-e29b-41d4-a716-446655470099'::uuid
ORDER BY "order";

-- Success message
SELECT 'Grand Arch seed data created successfully with 15 comprehensive sections!' as status;
