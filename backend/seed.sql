-- Clear existing data (optional, be careful in production)
-- TRUNCATE TABLE leads, property_sections, property_categories, properties, blogs, categories, locations, developers CASCADE;

-- Insert Developers
INSERT INTO developers (id, name, slug, logo, "createdAt", "updatedAt")
VALUES
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, 'Lodha Group', 'lodha-group', 'https://via.placeholder.com/150', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440002'::uuid, 'DLF Limited', 'dlf-limited', 'https://via.placeholder.com/150', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440003'::uuid, 'Emaar India', 'emaar-india', 'https://via.placeholder.com/150', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440004'::uuid, 'Godrej Properties', 'godrej-properties', 'https://via.placeholder.com/150', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Insert Locations (Country Level)
INSERT INTO locations (id, name, slug, type, "parentId", "createdAt", "updatedAt")
VALUES
  ('550e8400-e29b-41d4-a716-446655450001'::uuid, 'India', 'india', 'country', NULL, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Insert States
INSERT INTO locations (id, name, slug, type, "parentId", "createdAt", "updatedAt")
VALUES
  ('550e8400-e29b-41d4-a716-446655450002'::uuid, 'Delhi', 'delhi', 'state', '550e8400-e29b-41d4-a716-446655450001'::uuid, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655450003'::uuid, 'Haryana', 'haryana', 'state', '550e8400-e29b-41d4-a716-446655450001'::uuid, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655450004'::uuid, 'Maharashtra', 'maharashtra', 'state', '550e8400-e29b-41d4-a716-446655450001'::uuid, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Insert Cities
INSERT INTO locations (id, name, slug, type, "parentId", "createdAt", "updatedAt")
VALUES
  ('550e8400-e29b-41d4-a716-446655450005'::uuid, 'New Delhi', 'new-delhi', 'city', '550e8400-e29b-41d4-a716-446655450002'::uuid, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655450006'::uuid, 'Gurgaon', 'gurgaon', 'city', '550e8400-e29b-41d4-a716-446655450003'::uuid, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655450007'::uuid, 'Mumbai', 'mumbai', 'city', '550e8400-e29b-41d4-a716-446655450004'::uuid, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655450008'::uuid, 'Pune', 'pune', 'city', '550e8400-e29b-41d4-a716-446655450004'::uuid, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Insert Localities
INSERT INTO locations (id, name, slug, type, "parentId", "createdAt", "updatedAt")
VALUES
  ('550e8400-e29b-41d4-a716-446655450009'::uuid, 'Connaught Place', 'connaught-place', 'locality', '550e8400-e29b-41d4-a716-446655450005'::uuid, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655450010'::uuid, 'Sector 27', 'sector-27', 'locality', '550e8400-e29b-41d4-a716-446655450006'::uuid, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655450011'::uuid, 'Bandra', 'bandra', 'locality', '550e8400-e29b-41d4-a716-446655450007'::uuid, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655450012'::uuid, 'Koregaon Park', 'koregaon-park', 'locality', '550e8400-e29b-41d4-a716-446655450008'::uuid, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Insert Categories - Residential
INSERT INTO categories (id, name, slug, "propertyType", "parentId", "createdAt", "updatedAt")
VALUES
  ('550e8400-e29b-41d4-a716-446655460001'::uuid, 'Residential', 'residential', 'residential', NULL, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655460002'::uuid, 'Commercial', 'commercial', 'commercial', NULL, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Insert Residential Sub-categories
INSERT INTO categories (id, name, slug, "propertyType", "parentId", "createdAt", "updatedAt")
VALUES
  ('550e8400-e29b-41d4-a716-446655460003'::uuid, 'Luxury', 'luxury', 'residential', '550e8400-e29b-41d4-a716-446655460001'::uuid, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655460004'::uuid, 'Premium', 'premium', 'residential', '550e8400-e29b-41d4-a716-446655460001'::uuid, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655460005'::uuid, 'Mid-Range', 'mid-range', 'residential', '550e8400-e29b-41d4-a716-446655460001'::uuid, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655460006'::uuid, 'Budget', 'budget', 'residential', '550e8400-e29b-41d4-a716-446655460001'::uuid, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Insert Commercial Sub-categories
INSERT INTO categories (id, name, slug, "propertyType", "parentId", "createdAt", "updatedAt")
VALUES
  ('550e8400-e29b-41d4-a716-446655460007'::uuid, 'Office', 'office', 'commercial', '550e8400-e29b-41d4-a716-446655460002'::uuid, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655460008'::uuid, 'Retail', 'retail', 'commercial', '550e8400-e29b-41d4-a716-446655460002'::uuid, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655460009'::uuid, 'Industrial', 'industrial', 'commercial', '550e8400-e29b-41d4-a716-446655460002'::uuid, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Insert Properties
INSERT INTO properties (id, slug, title, "propertyType", "developerId", "locationId", status, "priceMin", "priceMax", "isPublished", "createdAt", "updatedAt")
VALUES
  (
    '550e8400-e29b-41d4-a716-446655470001'::uuid,
    'lodha-world-towers',
    'Lodha World Towers',
    'residential',
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    '550e8400-e29b-41d4-a716-446655450009'::uuid,
    'active',
    50000000,
    150000000,
    true,
    NOW(),
    NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655470002'::uuid,
    'dlf-sector-27',
    'DLF Sector 27 Premium',
    'residential',
    '550e8400-e29b-41d4-a716-446655440002'::uuid,
    '550e8400-e29b-41d4-a716-446655450010'::uuid,
    'active',
    30000000,
    80000000,
    true,
    NOW(),
    NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655470003'::uuid,
    'emaar-bandra-lumiere',
    'Emaar Bandra Lumiere',
    'residential',
    '550e8400-e29b-41d4-a716-446655440003'::uuid,
    '550e8400-e29b-41d4-a716-446655450011'::uuid,
    'active',
    40000000,
    200000000,
    true,
    NOW(),
    NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655470004'::uuid,
    'godrej-koregaon',
    'Godrej Reserve Koregaon Park',
    'residential',
    '550e8400-e29b-41d4-a716-446655440004'::uuid,
    '550e8400-e29b-41d4-a716-446655450012'::uuid,
    'active',
    25000000,
    60000000,
    true,
    NOW(),
    NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655470005'::uuid,
    'dlf-cyber-hub',
    'DLF Cyber Hub',
    'commercial',
    '550e8400-e29b-41d4-a716-446655440002'::uuid,
    '550e8400-e29b-41d4-a716-446655450010'::uuid,
    'active',
    5000000,
    50000000,
    true,
    NOW(),
    NOW()
  )
ON CONFLICT DO NOTHING;

-- Insert Property-Category Associations
INSERT INTO property_categories (id, "propertyId", "categoryId", "createdAt", "updatedAt")
VALUES
  ('550e8400-e29b-41d4-a716-446655480001'::uuid, '550e8400-e29b-41d4-a716-446655470001'::uuid, '550e8400-e29b-41d4-a716-446655460003'::uuid, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655480002'::uuid, '550e8400-e29b-41d4-a716-446655470002'::uuid, '550e8400-e29b-41d4-a716-446655460004'::uuid, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655480003'::uuid, '550e8400-e29b-41d4-a716-446655470003'::uuid, '550e8400-e29b-41d4-a716-446655460003'::uuid, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655480004'::uuid, '550e8400-e29b-41d4-a716-446655470004'::uuid, '550e8400-e29b-41d4-a716-446655460005'::uuid, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655480005'::uuid, '550e8400-e29b-41d4-a716-446655470005'::uuid, '550e8400-e29b-41d4-a716-446655460007'::uuid, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Insert Property Sections (dynamic content)
INSERT INTO property_sections (id, "propertyId", type, title, "order", "isVisible", data, "createdAt", "updatedAt")
VALUES
  (
    '550e8400-e29b-41d4-a716-446655490001'::uuid,
    '550e8400-e29b-41d4-a716-446655470001'::uuid,
    'overview',
    'Property Overview',
    1,
    true,
    '{"description": "Luxurious residential towers with world-class amenities", "highlights": ["3 towers", "600+ apartments", "Multi-level parking"]}'::jsonb,
    NOW(),
    NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655490002'::uuid,
    '550e8400-e29b-41d4-a716-446655470001'::uuid,
    'amenities',
    'Amenities',
    2,
    true,
    '{"list": ["Swimming Pool", "Gymnasium", "Clubhouse", "Kids Play Area", "Landscaped Garden", "24/7 Security"]}'::jsonb,
    NOW(),
    NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655490003'::uuid,
    '550e8400-e29b-41d4-a716-446655470001'::uuid,
    'specifications',
    'Specifications',
    3,
    true,
    '{"types": ["2 BHK", "3 BHK", "4 BHK"], "sizes": ["1200-1500 sqft", "1500-2000 sqft", "2000-2500 sqft"]}'::jsonb,
    NOW(),
    NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655490004'::uuid,
    '550e8400-e29b-41d4-a716-446655470002'::uuid,
    'overview',
    'Property Overview',
    1,
    true,
    '{"description": "Premium residential development in the heart of Gurgaon", "highlights": ["Gated community", "500+ units", "Integrated retail"]}',
    NOW(),
    NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655490005'::uuid,
    '550e8400-e29b-41d4-a716-446655470005'::uuid,
    'overview',
    'Commercial Overview',
    1,
    true,
    '{"description": "Premium office spaces in the tech hub of Gurgaon", "highlights": ["IT-ready infrastructure", "High-speed connectivity", "Modern architecture"]}'::jsonb,
    NOW(),
    NOW()
  )
ON CONFLICT DO NOTHING;

-- Verify insertions
SELECT COUNT(*) as developers_count FROM developers;
SELECT COUNT(*) as locations_count FROM locations;
SELECT COUNT(*) as categories_count FROM categories;
SELECT COUNT(*) as properties_count FROM properties;
SELECT COUNT(*) as sections_count FROM property_sections;
