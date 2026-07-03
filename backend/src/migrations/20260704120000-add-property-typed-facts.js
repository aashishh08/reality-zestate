/**
 * Promote key facts from PropertySection JSONB into typed columns on properties.
 * Backfills from keyTakeaways, highlights, and location sections where possible.
 */

import { DataTypes } from 'sequelize';

/** @param {import('sequelize').QueryInterface} queryInterface */
export async function up(queryInterface) {
  const table = 'properties';

  await queryInterface.addColumn(table, 'bedrooms', {
    type: DataTypes.INTEGER,
    allowNull: true,
  });
  await queryInterface.addColumn(table, 'bathrooms', {
    type: DataTypes.INTEGER,
    allowNull: true,
  });
  await queryInterface.addColumn(table, 'areaSqftMin', {
    type: DataTypes.INTEGER,
    allowNull: true,
  });
  await queryInterface.addColumn(table, 'areaSqftMax', {
    type: DataTypes.INTEGER,
    allowNull: true,
  });
  await queryInterface.addColumn(table, 'reraNumber', {
    type: DataTypes.STRING(120),
    allowNull: true,
  });
  await queryInterface.addColumn(table, 'possessionDate', {
    type: DataTypes.DATEONLY,
    allowNull: true,
  });
  await queryInterface.addColumn(table, 'launchDate', {
    type: DataTypes.DATEONLY,
    allowNull: true,
  });
  await queryInterface.addColumn(table, 'latitude', {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: true,
  });
  await queryInterface.addColumn(table, 'longitude', {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: true,
  });

  await backfillTypedFacts(queryInterface);
}

/** @param {import('sequelize').QueryInterface} queryInterface */
export async function down(queryInterface) {
  const table = 'properties';
  const cols = [
    'bedrooms', 'bathrooms', 'areaSqftMin', 'areaSqftMax',
    'reraNumber', 'possessionDate', 'launchDate', 'latitude', 'longitude',
  ];
  for (const col of cols) {
    await queryInterface.removeColumn(table, col);
  }
}

/** @param {import('sequelize').QueryInterface} queryInterface */
async function backfillTypedFacts(queryInterface) {
  const [properties] = await queryInterface.sequelize.query(
    `SELECT id FROM properties`,
  );

  for (const { id } of properties) {
    const [sections] = await queryInterface.sequelize.query(
      `SELECT type, data FROM property_sections
       WHERE "propertyId" = :id AND "isVisible" IS NOT FALSE
       ORDER BY "order" ASC`,
      { replacements: { id } },
    );

    const updates = {};
    let keyTakeaways = null;
    let highlights = null;
    let locationData = null;

    for (const row of sections) {
      if (row.type === 'keyTakeaways' && row.data && !row.data.takeaways) {
        keyTakeaways = row.data;
      }
      if (row.type === 'highlights' && row.data) highlights = row.data;
      if (row.type === 'location' && row.data) locationData = row.data;
    }

    if (keyTakeaways) {
      const config = keyTakeaways.configuration || keyTakeaways.sizes;
      const bhk = parseBhk(config);
      if (bhk != null) updates.bedrooms = bhk;

      const area = parseAreaSqft(keyTakeaways.sizes || keyTakeaways.area);
      if (area.min != null) updates.areaSqftMin = area.min;
      if (area.max != null) updates.areaSqftMax = area.max;

      const rera = keyTakeaways.reraNo || keyTakeaways.rera;
      if (typeof rera === 'string' && rera.trim()) {
        updates.reraNumber = rera.trim().slice(0, 120);
      }

      const possession = parseMonthYearDate(keyTakeaways.possessionDate);
      if (possession) updates.possessionDate = possession;

      const launch = parseMonthYearDate(keyTakeaways.launchDate);
      if (launch) updates.launchDate = launch;
    }

    if (!updates.reraNumber && highlights?.rera) {
      const r = String(highlights.rera).trim();
      if (r) updates.reraNumber = r.slice(0, 120);
    }

    if (!updates.possessionDate && highlights?.possession) {
      const d = parseMonthYearDate(highlights.possession);
      if (d) updates.possessionDate = d;
    }

    const geo = extractGeo(locationData?.address, locationData?.mapImage);
    if (geo) {
      updates.latitude = geo.lat;
      updates.longitude = geo.lng;
    }

    if (Object.keys(updates).length === 0) continue;

    const setClauses = Object.keys(updates).map((k) => `"${k}" = :${k}`).join(', ');
    await queryInterface.sequelize.query(
      `UPDATE properties SET ${setClauses}, "updatedAt" = NOW() WHERE id = :id`,
      { replacements: { id, ...updates } },
    );
  }
}

function parseBhk(text) {
  if (!text || typeof text !== 'string') return null;
  const matches = [...text.matchAll(/(\d+)\s*BHK/gi)];
  if (!matches.length) return null;
  return Math.min(...matches.map((m) => parseInt(m[1], 10)));
}

function parseAreaSqft(text) {
  if (!text || typeof text !== 'string') return { min: null, max: null };
  const nums = [...text.matchAll(/([\d,]+(?:\.\d+)?)\s*(?:sq\.?\s*ft|sqft)/gi)]
    .map((m) => parseInt(m[1].replace(/,/g, ''), 10))
    .filter((n) => Number.isFinite(n) && n > 0);
  if (!nums.length) return { min: null, max: null };
  return { min: Math.min(...nums), max: Math.max(...nums) };
}

const MONTHS = {
  jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3,
  apr: 4, april: 4, may: 5, jun: 6, june: 6, jul: 7, july: 7,
  aug: 8, august: 8, sep: 9, sept: 9, september: 9,
  oct: 10, october: 10, nov: 11, november: 11, dec: 12, december: 12,
};

function parseMonthYearDate(text) {
  if (!text || typeof text !== 'string') return null;
  const s = text.trim();
  if (!s || /applied|tbd|na\b|on request/i.test(s)) return null;

  const named = s.match(/([A-Za-z]+)\s+(\d{4})/);
  if (named) {
    const m = MONTHS[named[1].toLowerCase()];
    if (m) return `${named[2]}-${String(m).padStart(2, '0')}-01`;
  }

  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) return s;

  const yearOnly = s.match(/\b(20\d{2})\b/);
  if (yearOnly) return `${yearOnly[1]}-01-01`;

  return null;
}

function extractGeo(...sources) {
  for (const raw of sources) {
    const s = raw?.trim?.();
    if (!s) continue;

    const at = s.match(/@(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
    if (at) return { lat: at[1], lng: at[2] };

    const ll = s.match(/[?&]ll=(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/i);
    if (ll) return { lat: ll[1], lng: ll[2] };
  }
  return null;
}
