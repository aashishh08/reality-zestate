/**
 * Launch geography — cities and localities are stored in the `locations` table (source of truth).
 * This file keeps seed data for `src/seeders/*` and developer enums for admin dropdowns.
 * Runtime validation and GET /api/enums read cities/localities from the database.
 */
export const CITIES = [
  { slug: 'gurgaon', label: 'Gurgaon' },
  { slug: 'noida', label: 'Noida' },
  { slug: 'new-delhi', label: 'Delhi' },
  { slug: 'mumbai', label: 'Mumbai' },
];

export const CITY_SLUGS = CITIES.map((c) => c.slug);

// Each locality belongs to exactly one city (`city` = city slug).
export const LOCALITIES = [
  { slug: 'golf-course-road', label: 'Golf Course Road', city: 'gurgaon' },
  { slug: 'golf-course-road-extension', label: 'Golf Course Extension Road', city: 'gurgaon' },
  { slug: 'dwarka-expressway', label: 'Dwarka Expressway', city: 'gurgaon' },
  { slug: 'noida-expressway', label: 'Noida Expressway', city: 'noida' },
  { slug: 'kamla-nagar', label: 'Kamla Nagar', city: 'new-delhi' },
  { slug: 'new-friends-colony', label: 'New Friends Colony', city: 'new-delhi' },
  { slug: 'south-delhi', label: 'South Delhi', city: 'new-delhi' },
  { slug: 'dwarka', label: 'Dwarka', city: 'new-delhi' },
  { slug: 'kirti-nagar', label: 'Kirti Nagar', city: 'new-delhi' },
  { slug: 'moti-nagar', label: 'Moti Nagar', city: 'new-delhi' },
  { slug: 'patel-road', label: 'Patel Road', city: 'new-delhi' },
  { slug: 'connaught-place', label: 'Connaught Place', city: 'new-delhi' },
];

export const LOCALITY_SLUGS = LOCALITIES.map(l => l.slug);

/**
 * Given a city slug, return all localities that belong to it.
 */
export function getLocalitiesForCity(citySlug) {
  return LOCALITIES.filter(l => l.city === citySlug);
}

// ── Developers — seeded into `developers` from this list (see reference seeder) ─
export const DEVELOPERS = [
  { slug: 'max-estates',             label: 'Max Estates'               },
  { slug: 'dlf',                     label: 'DLF'                       },
  { slug: 'sobha',                   label: 'Sobha'                     },
  { slug: 'elevate',                 label: 'Elevate'                   },
  { slug: 'conscient-hines-elevate', label: 'Conscient Hines Elevate'   },
  { slug: 'eldeco',                  label: 'Eldeco'                    },
  { slug: 'experion-developers',     label: 'Experion Developers'       },
  { slug: 'godrej-properties',       label: 'Godrej Properties'         },
  { slug: 'oberoi-realty',           label: 'Oberoi Realty'             },
  { slug: 'kreeva',                  label: 'Kreeva'                    },
  { slug: 'terra-grande',            label: 'Terra Grande'              },
  { slug: 'central-park',            label: 'Central Park'              },
  { slug: 'trac',                    label: 'Trac'                      },
  { slug: 'trump-tower',             label: 'trump tower'               },
  { slug: 'm3m-smartworld',          label: 'm3m, smartworld'           },
  { slug: 'ats',                     label: 'ats'                       },
  { slug: 'silver-glades',           label: 'Silver glades'             },
  { slug: 'adani-realty',            label: 'Adani Realty'              },
  { slug: 'prestige-group',          label: 'prestige group'            },
  { slug: 'aipl',                    label: 'AIPL'                      },
  { slug: 'max-antara',              label: 'Max Antara'                },
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
