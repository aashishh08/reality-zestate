/**
 * Squashed baseline: full schema + one-time data fixes (blog HTML strip, key takeaways,
 * canonical developers). Safe on empty DBs and on DBs that already ran the older
 * migration chain: if core tables exist, only missing columns / indexes are applied.
 *
 * Does not drop or truncate any table. `down` is intentionally disabled.
 */

import { randomUUID } from 'crypto';

async function tableExists(queryInterface, name) {
  const [rows] = await queryInterface.sequelize.query(
    `SELECT EXISTS (
       SELECT 1 FROM information_schema.tables
       WHERE table_schema = 'public' AND table_name = :name
     ) AS e`,
    { replacements: { name } },
  );
  return Boolean(rows[0]?.e);
}

function stripHtmlDocumentWrapper(content) {
  if (!content || typeof content !== 'string') return content;
  let result = content;
  const bodyMatch = result.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) return bodyMatch[1].trim();
  result = result.replace(/<!DOCTYPE[^>]*>/gi, '');
  result = result.replace(/<html[^>]*>/gi, '').replace(/<\/html>/gi, '');
  const headOpen = result.toLowerCase().indexOf('<head');
  if (headOpen !== -1) {
    const headClose = result.toLowerCase().indexOf('</head>');
    if (headClose !== -1) result = result.slice(0, headOpen) + result.slice(headClose + 7);
  }
  return result.trim();
}

async function createFullSchema(queryInterface, Sequelize) {
  await queryInterface.createTable('users', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    email: { type: Sequelize.STRING, allowNull: false, unique: true },
    password: { type: Sequelize.STRING, allowNull: false },
    role: {
      type: Sequelize.ENUM('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER'),
      allowNull: false,
      defaultValue: 'VIEWER',
    },
    createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
  });
  await queryInterface.addIndex('users', ['email']);

  await queryInterface.createTable('developers', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    name: { type: Sequelize.STRING, allowNull: false },
    slug: { type: Sequelize.STRING, allowNull: false, unique: true },
    logo: { type: Sequelize.STRING, allowNull: true },
    createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
  });
  await queryInterface.addIndex('developers', ['slug']);

  await queryInterface.createTable('locations', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    name: { type: Sequelize.STRING, allowNull: false },
    slug: { type: Sequelize.STRING, allowNull: false, unique: true },
    type: {
      type: Sequelize.ENUM('country', 'state', 'city', 'locality', 'sector'),
      allowNull: false,
    },
    parentId: {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'locations', key: 'id' },
      onDelete: 'SET NULL',
    },
    createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
  });
  await queryInterface.addIndex('locations', ['slug']);
  await queryInterface.addIndex('locations', ['parentId']);

  await queryInterface.createTable('categories', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    name: { type: Sequelize.STRING, allowNull: false },
    slug: { type: Sequelize.STRING, allowNull: false, unique: true },
    propertyType: {
      type: Sequelize.ENUM('residential', 'commercial'),
      allowNull: false,
    },
    parentId: {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'categories', key: 'id' },
      onDelete: 'SET NULL',
    },
    createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
  });
  await queryInterface.addIndex('categories', ['slug']);
  await queryInterface.addIndex('categories', ['parentId']);

  await queryInterface.createTable('properties', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    slug: { type: Sequelize.STRING, allowNull: false, unique: true },
    title: { type: Sequelize.STRING, allowNull: false },
    propertyType: {
      type: Sequelize.ENUM('residential', 'commercial'),
      allowNull: false,
    },
    developerId: {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'developers', key: 'id' },
      onDelete: 'RESTRICT',
    },
    locationId: {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'locations', key: 'id' },
      onDelete: 'RESTRICT',
    },
    citySlug: { type: Sequelize.STRING(100), allowNull: true },
    localitySlug: { type: Sequelize.STRING(100), allowNull: true },
    developerSlug: { type: Sequelize.STRING(100), allowNull: true },
    status: { type: Sequelize.STRING, allowNull: false, defaultValue: 'draft' },
    priceMin: { type: Sequelize.DECIMAL(15, 2), allowNull: true },
    priceMax: { type: Sequelize.DECIMAL(15, 2), allowNull: true },
    isPublished: { type: Sequelize.BOOLEAN, defaultValue: false },
    seoTitle: { type: Sequelize.STRING(90), allowNull: true },
    h1Heading: { type: Sequelize.STRING(120), allowNull: true },
    metaDescription: { type: Sequelize.STRING(158), allowNull: true },
    createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
  });
  await queryInterface.addIndex('properties', ['slug']);
  await queryInterface.addIndex('properties', ['developerId']);
  await queryInterface.addIndex('properties', ['locationId']);
  await queryInterface.addIndex('properties', ['propertyType']);
  await queryInterface.addIndex('properties', ['citySlug'], { name: 'properties_city_slug_idx' });
  await queryInterface.addIndex('properties', ['localitySlug'], { name: 'properties_locality_slug_idx' });
  await queryInterface.addIndex('properties', ['developerSlug'], { name: 'properties_developer_slug_idx' });
  await queryInterface.addIndex('properties', ['citySlug', 'localitySlug'], { name: 'properties_city_locality_idx' });

  await queryInterface.createTable('property_categories', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    propertyId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: 'properties', key: 'id' },
      onDelete: 'CASCADE',
    },
    categoryId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: 'categories', key: 'id' },
      onDelete: 'CASCADE',
    },
    createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
  });
  await queryInterface.addIndex('property_categories', ['propertyId']);
  await queryInterface.addIndex('property_categories', ['categoryId']);
  await queryInterface.addIndex('property_categories', ['propertyId', 'categoryId'], {
    unique: true,
    name: 'unique_property_category',
  });

  await queryInterface.createTable('property_sections', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    propertyId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: 'properties', key: 'id' },
      onDelete: 'CASCADE',
    },
    type: { type: Sequelize.STRING, allowNull: false },
    title: { type: Sequelize.STRING, allowNull: false },
    order: { type: Sequelize.INTEGER, defaultValue: 0 },
    isVisible: { type: Sequelize.BOOLEAN, defaultValue: true },
    data: { type: Sequelize.JSONB, allowNull: true },
    createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
  });
  await queryInterface.addIndex('property_sections', ['propertyId']);
  await queryInterface.addIndex('property_sections', ['order']);

  await queryInterface.createTable('blogs', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    title: { type: Sequelize.STRING, allowNull: false },
    slug: { type: Sequelize.STRING, allowNull: false, unique: true },
    content: { type: Sequelize.TEXT, allowNull: false },
    excerpt: { type: Sequelize.TEXT, allowNull: true },
    authorName: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'Team Superluxere',
    },
    featuredImage: { type: Sequelize.STRING, allowNull: true },
    metaTitle: { type: Sequelize.STRING, allowNull: true },
    metaDescription: { type: Sequelize.TEXT, allowNull: true },
    tags: { type: Sequelize.ARRAY(Sequelize.STRING), allowNull: true, defaultValue: [] },
    isPublished: { type: Sequelize.BOOLEAN, defaultValue: false },
    createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
  });
  await queryInterface.addIndex('blogs', ['slug']);
  await queryInterface.addIndex('blogs', ['isPublished']);

  await queryInterface.createTable('leads', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    name: { type: Sequelize.STRING, allowNull: false },
    email: { type: Sequelize.STRING, allowNull: false },
    phone: { type: Sequelize.STRING, allowNull: false },
    status: { type: Sequelize.STRING, allowNull: false, defaultValue: 'new' },
    source: { type: Sequelize.STRING, allowNull: true },
    propertyId: {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'properties', key: 'id' },
      onDelete: 'SET NULL',
    },
    createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
  });
  await queryInterface.addIndex('leads', ['email']);
  await queryInterface.addIndex('leads', ['propertyId']);
  await queryInterface.addIndex('leads', ['status']);

  await queryInterface.createTable('tags', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    name: { type: Sequelize.STRING, allowNull: false },
    slug: { type: Sequelize.STRING, allowNull: false },
    description: { type: Sequelize.TEXT, allowNull: true },
    color: { type: Sequelize.STRING(20), allowNull: true },
    icon: { type: Sequelize.STRING(50), allowNull: true },
    createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
  });
  await queryInterface.addIndex('tags', ['slug'], { unique: true, name: 'tags_slug_unique' });

  await queryInterface.createTable('property_tags', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    propertyId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: 'properties', key: 'id' },
      onDelete: 'CASCADE',
    },
    tagId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: 'tags', key: 'id' },
      onDelete: 'CASCADE',
    },
    createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
  });
  await queryInterface.addIndex('property_tags', ['propertyId', 'tagId'], {
    unique: true,
    name: 'unique_property_tag',
  });
  await queryInterface.addIndex('property_tags', ['propertyId'], { name: 'property_tags_propertyId' });
  await queryInterface.addIndex('property_tags', ['tagId'], { name: 'property_tags_tagId' });
}

async function ensureSchemaUpgrades(queryInterface) {
  const q = queryInterface.sequelize;
  await q.query('ALTER TABLE "properties" ALTER COLUMN "developerId" DROP NOT NULL');
  await q.query('ALTER TABLE "properties" ALTER COLUMN "locationId" DROP NOT NULL');

  await q.query('ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "seoTitle" VARCHAR(90)');
  await q.query('ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "h1Heading" VARCHAR(120)');
  await q.query('ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "metaDescription" VARCHAR(158)');
  await q.query('ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "citySlug" VARCHAR(100)');
  await q.query('ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "localitySlug" VARCHAR(100)');
  await q.query('ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "developerSlug" VARCHAR(100)');

  await q.query(
    'CREATE INDEX IF NOT EXISTS "properties_city_slug_idx" ON "properties" ("citySlug")',
  );
  await q.query(
    'CREATE INDEX IF NOT EXISTS "properties_locality_slug_idx" ON "properties" ("localitySlug")',
  );
  await q.query(
    'CREATE INDEX IF NOT EXISTS "properties_developer_slug_idx" ON "properties" ("developerSlug")',
  );
  await q.query(
    'CREATE INDEX IF NOT EXISTS "properties_city_locality_idx" ON "properties" ("citySlug", "localitySlug")',
  );
}

async function normalizeBlogHtml(queryInterface) {
  const [blogs] = await queryInterface.sequelize.query(
    `SELECT id, content FROM blogs WHERE content ILIKE '%<body%' OR content ILIKE '%</html>%'`,
  );
  for (const blog of blogs) {
    const cleaned = stripHtmlDocumentWrapper(blog.content);
    if (cleaned !== blog.content) {
      await queryInterface.sequelize.query(
        `UPDATE blogs SET content = :content, "updatedAt" = NOW() WHERE id = :id`,
        { replacements: { content: cleaned, id: blog.id } },
      );
    }
  }
}

async function keyTakeawaysStructuredData(queryInterface) {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.sequelize.query(
      `
        UPDATE property_sections
        SET data = '{
          "status":         "Active / Ready to Move",
          "type":           "Residential",
          "area":           "12 Acres",
          "configuration":  "3, 4 & 5 BHK",
          "sizes":          "Upon Request",
          "towers":         "Upon Request",
          "floors":         "Upon Request",
          "totalUnits":     "320 Units",
          "clubhouse":      "Upon Request",
          "priceRange":     "Upon Request",
          "reraNo":         "RERA Registered",
          "launchDate":     "Upon Request",
          "possessionDate": "OC Ready (Select Floors)",
          "phases":         "Upon Request",
          "developer":      "DLF",
          "address":        "DLF, Gurgaon, Haryana"
        }'::jsonb,
        "updatedAt" = NOW()
        WHERE "propertyId" = (
          SELECT id FROM properties WHERE slug = 'the-grand-arch-dlf-gurgaon' LIMIT 1
        )
        AND type = 'keyTakeaways';
      `,
      { transaction },
    );

    await queryInterface.sequelize.query(
      `
        DO $$
        DECLARE
          v_property_id UUID;
          v_exists BOOLEAN;
        BEGIN
          SELECT id INTO v_property_id FROM properties WHERE slug = 'sobha-crescent-sector-63a-gurgaon' LIMIT 1;

          IF v_property_id IS NULL THEN
            RETURN;
          END IF;

          SELECT EXISTS(
            SELECT 1 FROM property_sections
            WHERE "propertyId" = v_property_id AND type = 'keyTakeaways'
          ) INTO v_exists;

          IF v_exists THEN
            UPDATE property_sections
            SET data = '{
              "status":         "Pre-Launch",
              "type":           "Residential",
              "area":           "12 Acres",
              "configuration":  "3 BHK & 4 BHK",
              "sizes":          "2,200 sq.ft – 2,966 sq.ft",
              "towers":         "4 Towers",
              "floors":         "G+42 Floors",
              "totalUnits":     "~750 Units",
              "clubhouse":      "75,000 sq.ft",
              "priceRange":     "Rs.5.50 Cr – Rs.7.42 Cr",
              "reraNo":         "RERA Applied",
              "launchDate":     "April 2026",
              "possessionDate": "Dec 2030",
              "phases":         "1 Phase",
              "developer":      "Sobha Limited",
              "address":        "Sector 63A, Golf Course Extension Road, Gurgaon, Haryana 122002"
            }'::jsonb,
            "updatedAt" = NOW()
            WHERE "propertyId" = v_property_id AND type = 'keyTakeaways';
          ELSE
            INSERT INTO property_sections (id, "propertyId", type, title, "order", "isVisible", data, "createdAt", "updatedAt")
            VALUES (
              gen_random_uuid(),
              v_property_id,
              'keyTakeaways',
              'Key Takeaways',
              5,
              true,
              '{
                "status":         "Pre-Launch",
                "type":           "Residential",
                "area":           "12 Acres",
                "configuration":  "3 BHK & 4 BHK",
                "sizes":          "2,200 sq.ft – 2,966 sq.ft",
                "towers":         "4 Towers",
                "floors":         "G+42 Floors",
                "totalUnits":     "~750 Units",
                "clubhouse":      "75,000 sq.ft",
                "priceRange":     "Rs.5.50 Cr – Rs.7.42 Cr",
                "reraNo":         "RERA Applied",
                "launchDate":     "April 2026",
                "possessionDate": "Dec 2030",
                "phases":         "1 Phase",
                "developer":      "Sobha Limited",
                "address":        "Sector 63A, Golf Course Extension Road, Gurgaon, Haryana 122002"
              }'::jsonb,
              NOW(),
              NOW()
            );
          END IF;
        END $$;
      `,
      { transaction },
    );

    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
}

const CANONICAL_DEVELOPERS = [
  { name: 'Max Estates', slug: 'max-estates' },
  { name: 'DLF', slug: 'dlf' },
  { name: 'Sobha', slug: 'sobha' },
  { name: 'Elevate', slug: 'elevate' },
  { name: 'Conscient Hines Elevate', slug: 'conscient-hines-elevate' },
  { name: 'Eldeco', slug: 'eldeco' },
  { name: 'Experion Developers', slug: 'experion-developers' },
  { name: 'Godrej Properties', slug: 'godrej-properties' },
  { name: 'Oberoi Realty', slug: 'oberoi-realty' },
  { name: 'Kreeva', slug: 'kreeva' },
  { name: 'Terra Grande', slug: 'terra-grande' },
  { name: 'Central Park', slug: 'central-park' },
  { name: 'Trac', slug: 'trac' },
  { name: 'trump tower', slug: 'trump-tower' },
  { name: 'm3m, smartworld', slug: 'm3m-smartworld' },
  { name: 'ats', slug: 'ats' },
  { name: 'Silver glades', slug: 'silver-glades' },
  { name: 'Adani Realty', slug: 'adani-realty' },
  { name: 'prestige group', slug: 'prestige-group' },
  { name: 'AIPL', slug: 'aipl' },
  { name: 'Max Antara', slug: 'max-antara' },
];

async function canonicalDevelopersOnly(queryInterface) {
  const ALLOWED_SLUGS_SQL = CANONICAL_DEVELOPERS.map((d) => `'${d.slug.replace(/'/g, "''")}'`).join(', ');
  await queryInterface.sequelize.query(
    'ALTER TABLE "properties" ALTER COLUMN "developerId" DROP NOT NULL',
  );

  for (const dev of CANONICAL_DEVELOPERS) {
    await queryInterface.sequelize.query(
      `INSERT INTO "developers" ("id", "name", "slug", "logo", "createdAt", "updatedAt")
       VALUES (:id, :name, :slug, NULL, NOW(), NOW())
       ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "updatedAt" = NOW()`,
      { replacements: { id: randomUUID(), name: dev.name, slug: dev.slug } },
    );
  }

  await queryInterface.sequelize.query(`
    UPDATE "properties"
    SET "developerSlug" = CASE "developerSlug"
      WHEN 'godrej' THEN 'godrej-properties'
      WHEN 'm3m-india' THEN 'm3m-smartworld'
      WHEN 'm3m' THEN 'm3m-smartworld'
      WHEN 'smartworld-developers' THEN 'm3m-smartworld'
      WHEN 'experion' THEN 'experion-developers'
      WHEN 'conscient' THEN 'conscient-hines-elevate'
      WHEN 'shapoorji-pallonji' THEN 'central-park'
      WHEN 'eldeco-terra-grande' THEN 'terra-grande'
      WHEN 'prestige' THEN 'prestige-group'
      ELSE "developerSlug"
    END
    WHERE "developerSlug" IS NOT NULL
  `);

  await queryInterface.sequelize.query(`
    UPDATE "properties" p
    SET "developerSlug" = d.slug
    FROM "developers" d
    WHERE p."developerId" = d.id AND (p."developerSlug" IS NULL OR p."developerSlug" = '')
  `);

  await queryInterface.sequelize.query(`
    UPDATE "properties" p
    SET "developerId" = d.id
    FROM "developers" d
    WHERE p."developerSlug" = d.slug
  `);

  await queryInterface.sequelize.query(`
    UPDATE "properties"
    SET "developerId" = NULL, "developerSlug" = NULL
    WHERE "developerId" IN (
      SELECT id FROM "developers" WHERE slug NOT IN (${ALLOWED_SLUGS_SQL})
    )
  `);

  await queryInterface.sequelize.query(`
    UPDATE "properties"
    SET "developerId" = NULL, "developerSlug" = NULL
    WHERE "developerSlug" IS NOT NULL
      AND "developerSlug" NOT IN (${ALLOWED_SLUGS_SQL})
  `);

  await queryInterface.sequelize.query(`
    DELETE FROM "developers" WHERE slug NOT IN (${ALLOWED_SLUGS_SQL})
  `);
}

export async function up(queryInterface, Sequelize) {
  if (!(await tableExists(queryInterface, 'users'))) {
    await createFullSchema(queryInterface, Sequelize);
  } else {
    await ensureSchemaUpgrades(queryInterface);
  }

  if (await tableExists(queryInterface, 'blogs')) {
    await normalizeBlogHtml(queryInterface);
  }

  if (await tableExists(queryInterface, 'property_sections')) {
    await keyTakeawaysStructuredData(queryInterface);
  }

  if (await tableExists(queryInterface, 'developers')) {
    await canonicalDevelopersOnly(queryInterface);
  }
}

export async function down() {
  throw new Error(
    'baseline-schema migration cannot be reversed from here; restore from backup if needed.',
  );
}
