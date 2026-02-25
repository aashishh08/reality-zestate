/**
 * Seed: Reference Data
 * Seeds the foundational lookup data needed before any property can be created
 * through the admin panel.
 *
 * Location hierarchy (4 levels):
 *   country → state → city → locality
 *
 * Properties are NOT seeded — they are created through the admin panel.
 */

import { randomUUID } from 'crypto';

// Helper to build and insert a location, returning its id
async function insertLocation(queryInterface, { name, slug, type, parentId }) {
  const newId = randomUUID();
  const rows = await queryInterface.sequelize.query(
    `INSERT INTO "locations" ("id", "name", "slug", "type", "parentId", "createdAt", "updatedAt")
     VALUES (:id, :name, :slug, :type, :parentId, NOW(), NOW())
     ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "updatedAt" = NOW()
     RETURNING "id"`,
    {
      replacements: { id: newId, name, slug, type, parentId: parentId || null },
      type: queryInterface.sequelize.QueryTypes.SELECT
    }
  );
  return rows[0].id;
}

export async function up(queryInterface) {
  // ─── 1. Country ────────────────────────────────────────────────────────────
  const indiaId = await insertLocation(queryInterface, {
    name: 'India', slug: 'india', type: 'country', parentId: null,
  });

  // ─── 2. States ─────────────────────────────────────────────────────────────
  const S = {}; // stateIds keyed by slug

  for (const state of [
    { name: 'Haryana', slug: 'haryana' },
    { name: 'Uttar Pradesh', slug: 'uttar-pradesh' },
    { name: 'Delhi', slug: 'delhi' },
    { name: 'Maharashtra', slug: 'maharashtra' },
    { name: 'Karnataka', slug: 'karnataka' },
    { name: 'Telangana', slug: 'telangana' },
    { name: 'Tamil Nadu', slug: 'tamil-nadu' },
    { name: 'Rajasthan', slug: 'rajasthan' },
    { name: 'Gujarat', slug: 'gujarat' },
    { name: 'Punjab', slug: 'punjab' },
  ]) {
    S[state.slug] = await insertLocation(queryInterface, {
      ...state, type: 'state', parentId: indiaId,
    });
  }

  // ─── 3. Cities ─────────────────────────────────────────────────────────────
  const C = {}; // cityIds keyed by slug

  for (const city of [
    // Delhi NCR
    { name: 'Gurgaon', slug: 'gurgaon', state: 'haryana' },
    { name: 'Noida', slug: 'noida', state: 'uttar-pradesh' },
    { name: 'Greater Noida', slug: 'greater-noida', state: 'uttar-pradesh' },
    { name: 'New Delhi', slug: 'new-delhi', state: 'delhi' },
    { name: 'Faridabad', slug: 'faridabad', state: 'haryana' },
    { name: 'Ghaziabad', slug: 'ghaziabad', state: 'uttar-pradesh' },

    // Maharashtra
    { name: 'Mumbai', slug: 'mumbai', state: 'maharashtra' },
    { name: 'Pune', slug: 'pune', state: 'maharashtra' },
    { name: 'Thane', slug: 'thane', state: 'maharashtra' },
    { name: 'Navi Mumbai', slug: 'navi-mumbai', state: 'maharashtra' },

    // South India
    { name: 'Bangalore', slug: 'bangalore', state: 'karnataka' },
    { name: 'Hyderabad', slug: 'hyderabad', state: 'telangana' },
    { name: 'Chennai', slug: 'chennai', state: 'tamil-nadu' },

    // Others
    { name: 'Jaipur', slug: 'jaipur', state: 'rajasthan' },
    { name: 'Ahmedabad', slug: 'ahmedabad', state: 'gujarat' },
    { name: 'Chandigarh', slug: 'chandigarh', state: 'punjab' },
  ]) {
    C[city.slug] = await insertLocation(queryInterface, {
      name: city.name, slug: city.slug, type: 'city', parentId: S[city.state],
    });
  }

  // ─── 4. Localities (Sub-locations within cities) ────────────────────────────

  // ── Gurgaon micro-markets ───────────────────────────────────────────────────
  for (const locality of [
    { name: 'Golf Course Road (GCR)', slug: 'golf-course-road' },
    { name: 'Golf Course Road Extension (GCRE)', slug: 'golf-course-road-extension' },
    { name: 'Dwarka Expressway (DWAY)', slug: 'dwarka-expressway' },
    { name: 'Southern Periphery Road (SPR)', slug: 'southern-periphery-road' },
    { name: 'Sohna Road', slug: 'sohna-road' },
    { name: 'MG Road', slug: 'mg-road-gurgaon' },
    { name: 'NH-48 (Delhi-Jaipur Highway)', slug: 'nh-48-gurgaon' },
    { name: 'Sector 56', slug: 'sector-56-gurgaon' },
    { name: 'Sector 65', slug: 'sector-65-gurgaon' },
    { name: 'Sector 82', slug: 'sector-82-gurgaon' },
    { name: 'Sector 84', slug: 'sector-84-gurgaon' },
    { name: 'Sector 92', slug: 'sector-92-gurgaon' },
    { name: 'Sector 102', slug: 'sector-102-gurgaon' },
    { name: 'Sector 108', slug: 'sector-108-gurgaon' },
    { name: 'Sector 113', slug: 'sector-113-gurgaon' },
  ]) {
    await insertLocation(queryInterface, {
      ...locality, type: 'locality', parentId: C['gurgaon'],
    });
  }

  // ── Noida sectors ───────────────────────────────────────────────────────────
  for (const locality of [
    { name: 'Sector 44', slug: 'sector-44-noida' },
    { name: 'Sector 75', slug: 'sector-75-noida' },
    { name: 'Sector 76', slug: 'sector-76-noida' },
    { name: 'Sector 77', slug: 'sector-77-noida' },
    { name: 'Sector 78', slug: 'sector-78-noida' },
    { name: 'Sector 93', slug: 'sector-93-noida' },
    { name: 'Sector 128', slug: 'sector-128-noida' },
    { name: 'Sector 137', slug: 'sector-137-noida' },
    { name: 'Sector 143', slug: 'sector-143-noida' },
    { name: 'Sector 150', slug: 'sector-150-noida' },
    { name: 'Expressway', slug: 'noida-expressway' },
  ]) {
    await insertLocation(queryInterface, {
      ...locality, type: 'locality', parentId: C['noida'],
    });
  }

  // ── Greater Noida localities ────────────────────────────────────────────────
  for (const locality of [
    { name: 'Greater Noida West', slug: 'greater-noida-west' },
    { name: 'Knowledge Park', slug: 'knowledge-park' },
    { name: 'Yamuna Expressway', slug: 'yamuna-expressway' },
    { name: 'Sector Mu', slug: 'sector-mu-greater-noida' },
    { name: 'Sector Pi', slug: 'sector-pi-greater-noida' },
    { name: 'Sector Omicron', slug: 'sector-omicron' },
  ]) {
    await insertLocation(queryInterface, {
      ...locality, type: 'locality', parentId: C['greater-noida'],
    });
  }

  // ─── 5. Developers (Builders) ──────────────────────────────────────────────
  for (const dev of [
    { name: 'DLF', slug: 'dlf' },
    { name: 'Max Estates', slug: 'max-estates' },
    { name: 'Experion', slug: 'experion' },
    { name: 'Eldeco', slug: 'eldeco' },
    { name: 'Conscient', slug: 'conscient' },
    { name: 'Kreeva', slug: 'kreeva' },
    { name: 'Godrej Properties', slug: 'godrej-properties' },
    { name: 'Oberoi Realty', slug: 'oberoi-realty' },
    { name: 'Adani Realty', slug: 'adani-realty' },
    { name: 'AIPL', slug: 'aipl' },
    { name: 'Prestige Group', slug: 'prestige-group' },
    { name: 'M3M India', slug: 'm3m-india' },
    { name: 'Smartworld Developers', slug: 'smartworld-developers' },
    { name: 'Shapoorji Pallonji', slug: 'shapoorji-pallonji' },
    { name: 'Eldeco Terra Grande', slug: 'eldeco-terra-grande' },
  ]) {
    await queryInterface.sequelize.query(
      `INSERT INTO "developers" ("id", "name", "slug", "logo", "createdAt", "updatedAt")
       VALUES (:id, :name, :slug, NULL, NOW(), NOW())
       ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "updatedAt" = NOW()`,
      {
        replacements: { id: randomUUID(), name: dev.name, slug: dev.slug }
      }
    );
  }

  // ─── 6. Categories ─────────────────────────────────────────────────────────
  for (const cat of [
    // Residential
    { name: 'Luxury', slug: 'luxury', propertyType: 'residential' },
    { name: 'Ultra Luxury', slug: 'ultra-luxury', propertyType: 'residential' },
    { name: 'Affordable', slug: 'affordable', propertyType: 'residential' },
    { name: 'Mid Segment', slug: 'mid-segment', propertyType: 'residential' },
    { name: 'Senior Living', slug: 'senior-living', propertyType: 'residential' },
    { name: 'Plotted', slug: 'plotted', propertyType: 'residential' },
    { name: 'Villa', slug: 'villa', propertyType: 'residential' },
    // Commercial
    { name: 'Commercial', slug: 'commercial', propertyType: 'commercial' },
    { name: 'Office Space', slug: 'office-space', propertyType: 'commercial' },
    { name: 'Retail', slug: 'retail', propertyType: 'commercial' },
    { name: 'Co-working', slug: 'co-working', propertyType: 'commercial' },
    { name: 'Industrial', slug: 'industrial', propertyType: 'commercial' },
  ]) {
    await queryInterface.sequelize.query(
      `INSERT INTO "categories" ("id", "name", "slug", "propertyType", "parentId", "createdAt", "updatedAt")
       VALUES (:id, :name, :slug, :propertyType, NULL, NOW(), NOW())
       ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "propertyType" = EXCLUDED."propertyType", "updatedAt" = NOW()`,
      {
        replacements: { id: randomUUID(), name: cat.name, slug: cat.slug, propertyType: cat.propertyType }
      }
    );
  }
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('categories', {}, {});
  await queryInterface.bulkDelete('developers', {}, {});
  await queryInterface.bulkDelete('locations', {}, {}); // cascades localities → cities → states → country
}
