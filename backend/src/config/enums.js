
export const CITIES = [
  { slug: 'gurgaon',   label: 'Gurgaon' },
  { slug: 'delhi',     label: 'Delhi' },
  { slug: 'noida',     label: 'Noida' },
  { slug: 'faridabad', label: 'Faridabad' },
  { slug: 'ghaziabad', label: 'Ghaziabad' },
  { slug: 'mumbai',    label: 'Mumbai' },
  { slug: 'pune',      label: 'Pune' },
  { slug: 'bangalore', label: 'Bangalore' },
  { slug: 'hyderabad', label: 'Hyderabad' },
  { slug: 'chennai',   label: 'Chennai' },
];

export const CITY_SLUGS = CITIES.map(c => c.slug);

// ── Localities ────────────────────────────────────────────────────────────────
// Each locality belongs to exactly one city (via `city` slug).
export const LOCALITIES = [
  // Gurgaon
  { slug: 'golf-course-road',          label: 'Golf Course Road',          city: 'gurgaon' },
  { slug: 'golf-course-ext-road',      label: 'Golf Course Extension Road', city: 'gurgaon' },
  { slug: 'dwarka-expressway',         label: 'Dwarka Expressway',          city: 'gurgaon' },
  { slug: 'sohna-road',                label: 'Sohna Road',                 city: 'gurgaon' },
  { slug: 'mg-road',                   label: 'MG Road',                    city: 'gurgaon' },
  { slug: 'new-gurgaon',               label: 'New Gurgaon',                city: 'gurgaon' },
  { slug: 'sector-56',                 label: 'Sector 56',                  city: 'gurgaon' },
  { slug: 'sector-57',                 label: 'Sector 57',                  city: 'gurgaon' },
  { slug: 'sector-65',                 label: 'Sector 65',                  city: 'gurgaon' },
  { slug: 'sector-67',                 label: 'Sector 67',                  city: 'gurgaon' },
  { slug: 'sector-68',                 label: 'Sector 68',                  city: 'gurgaon' },
  { slug: 'sector-69',                 label: 'Sector 69',                  city: 'gurgaon' },
  { slug: 'sector-70',                 label: 'Sector 70',                  city: 'gurgaon' },
  { slug: 'palam-vihar',               label: 'Palam Vihar',                city: 'gurgaon' },
  { slug: 'udyog-vihar',               label: 'Udyog Vihar',                city: 'gurgaon' },

  // Delhi
  { slug: 'vasant-kunj',               label: 'Vasant Kunj',                city: 'delhi' },
  { slug: 'south-delhi',               label: 'South Delhi',                city: 'delhi' },
  { slug: 'saket',                     label: 'Saket',                      city: 'delhi' },
  { slug: 'lajpat-nagar',              label: 'Lajpat Nagar',               city: 'delhi' },
  { slug: 'rohini',                    label: 'Rohini',                     city: 'delhi' },
  { slug: 'dwarka',                    label: 'Dwarka',                     city: 'delhi' },

  // Noida
  { slug: 'sector-18-noida',           label: 'Sector 18',                  city: 'noida' },
  { slug: 'sector-62-noida',           label: 'Sector 62',                  city: 'noida' },
  { slug: 'expressway-noida',          label: 'Noida Expressway',           city: 'noida' },
  { slug: 'greater-noida-west',        label: 'Greater Noida West',         city: 'noida' },

  // Mumbai
  { slug: 'bandra',                    label: 'Bandra',                     city: 'mumbai' },
  { slug: 'andheri',                   label: 'Andheri',                    city: 'mumbai' },
  { slug: 'powai',                     label: 'Powai',                      city: 'mumbai' },
  { slug: 'worli',                     label: 'Worli',                      city: 'mumbai' },
  { slug: 'thane',                     label: 'Thane',                      city: 'mumbai' },

  // Bangalore
  { slug: 'whitefield',                label: 'Whitefield',                 city: 'bangalore' },
  { slug: 'koramangala',               label: 'Koramangala',                city: 'bangalore' },
  { slug: 'indiranagar',               label: 'Indiranagar',                city: 'bangalore' },
  { slug: 'sarjapur-road',             label: 'Sarjapur Road',              city: 'bangalore' },
  { slug: 'electronic-city',           label: 'Electronic City',            city: 'bangalore' },
];

export const LOCALITY_SLUGS = LOCALITIES.map(l => l.slug);

/**
 * Given a city slug, return all localities that belong to it.
 */
export function getLocalitiesForCity(citySlug) {
  return LOCALITIES.filter(l => l.city === citySlug);
}

// ── Developers ────────────────────────────────────────────────────────────────
export const DEVELOPERS = [
  { slug: 'dlf',             label: 'DLF' },
  { slug: 'godrej',          label: 'Godrej Properties' },
  { slug: 'sobha',           label: 'Sobha Realty' },
  { slug: 'brigade',         label: 'Brigade Group' },
  { slug: 'prestige',        label: 'Prestige Group' },
  { slug: 'lodha',           label: 'Lodha Group' },
  { slug: 'emaar',           label: 'Emaar India' },
  { slug: 'tata-housing',    label: 'Tata Housing' },
  { slug: 'mahindra',        label: 'Mahindra Lifespaces' },
  { slug: 'm3m',             label: 'M3M India' },
  { slug: 'signature-global',label: 'Signature Global' },
  { slug: 'vatika',          label: 'Vatika Group' },
  { slug: 'ireo',            label: 'IREO' },
  { slug: 'gaurs',           label: 'Gaurs Group' },
  { slug: 'ansal',           label: 'Ansal API' },
  { slug: 'unitech',         label: 'Unitech' },
  { slug: 'supertech',       label: 'Supertech' },
  { slug: 'ace-group',       label: 'ACE Group' },
  { slug: 'ats',             label: 'ATS Infrastructure' },
  { slug: 'puri',            label: 'Puri Constructions' },
];

export const DEVELOPER_SLUGS = DEVELOPERS.map(d => d.slug);

/**
 * Validate that a city slug is known.
 * @returns {boolean}
 */
export function isValidCity(slug) {
  return CITY_SLUGS.includes(slug);
}

/**
 * Validate that a locality slug is known and (optionally) belongs to the given city.
 * @param {string} localitySlug
 * @param {string|null} [citySlug]   - pass to also verify parent-city membership
 * @returns {boolean}
 */
export function isValidLocality(localitySlug, citySlug = null) {
  const locality = LOCALITIES.find(l => l.slug === localitySlug);
  if (!locality) return false;
  if (citySlug && locality.city !== citySlug) return false;
  return true;
}

/**
 * Validate that a developer slug is known.
 * @returns {boolean}
 */
export function isValidDeveloper(slug) {
  return DEVELOPER_SLUGS.includes(slug);
}
