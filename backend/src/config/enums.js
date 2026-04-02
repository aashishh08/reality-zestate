
export const CITIES = [
  // NCR
  { slug: 'gurgaon',       label: 'Gurgaon'       },
  { slug: 'delhi',         label: 'Delhi'          },
  { slug: 'new-delhi',     label: 'New Delhi'      },
  { slug: 'noida',         label: 'Noida'          },
  { slug: 'greater-noida', label: 'Greater Noida'  },
  { slug: 'faridabad',     label: 'Faridabad'      },
  { slug: 'ghaziabad',     label: 'Ghaziabad'      },
  // West & South
  { slug: 'mumbai',        label: 'Mumbai'         },
  { slug: 'thane',         label: 'Thane'          },
  { slug: 'navi-mumbai',   label: 'Navi Mumbai'    },
  { slug: 'pune',          label: 'Pune'           },
  { slug: 'ahmedabad',     label: 'Ahmedabad'      },
  // South
  { slug: 'bangalore',     label: 'Bangalore'      },
  { slug: 'hyderabad',     label: 'Hyderabad'      },
  { slug: 'chennai',       label: 'Chennai'        },
  // North
  { slug: 'chandigarh',    label: 'Chandigarh'     },
  { slug: 'jaipur',        label: 'Jaipur'         },
];

export const CITY_SLUGS = CITIES.map(c => c.slug);

// ── Localities ────────────────────────────────────────────────────────────────
// Each locality belongs to exactly one city (via `city` slug).
export const LOCALITIES = [
  // ── Gurgaon ───────────────────────────────────────────────────────────────
  { slug: 'golf-course-road',          label: 'Golf Course Road',           city: 'gurgaon' },
  { slug: 'golf-course-ext-road',      label: 'Golf Course Extension Road', city: 'gurgaon' }, // legacy slug
  { slug: 'golf-course-road-extension',label: 'Golf Course Extension Road', city: 'gurgaon' }, // seeder slug
  { slug: 'dwarka-expressway',         label: 'Dwarka Expressway',          city: 'gurgaon' },
  { slug: 'southern-periphery-road',   label: 'Southern Periphery Road',    city: 'gurgaon' },
  { slug: 'sohna-road',                label: 'Sohna Road',                 city: 'gurgaon' },
  { slug: 'mg-road',                   label: 'MG Road',                    city: 'gurgaon' }, // legacy slug
  { slug: 'mg-road-gurgaon',           label: 'MG Road',                    city: 'gurgaon' }, // seeder slug
  { slug: 'nh-48-gurgaon',             label: 'NH-48 (Delhi–Jaipur Hwy)',   city: 'gurgaon' },
  { slug: 'new-gurgaon',               label: 'New Gurgaon',                city: 'gurgaon' },
  { slug: 'palam-vihar',               label: 'Palam Vihar',                city: 'gurgaon' },
  { slug: 'udyog-vihar',               label: 'Udyog Vihar',                city: 'gurgaon' },
  { slug: 'sector-56',                 label: 'Sector 56',                  city: 'gurgaon' }, // legacy
  { slug: 'sector-56-gurgaon',         label: 'Sector 56',                  city: 'gurgaon' }, // seeder
  { slug: 'sector-57',                 label: 'Sector 57',                  city: 'gurgaon' },
  { slug: 'sector-65',                 label: 'Sector 65',                  city: 'gurgaon' }, // legacy
  { slug: 'sector-65-gurgaon',         label: 'Sector 65',                  city: 'gurgaon' }, // seeder
  { slug: 'sector-67',                 label: 'Sector 67',                  city: 'gurgaon' },
  { slug: 'sector-68',                 label: 'Sector 68',                  city: 'gurgaon' },
  { slug: 'sector-69',                 label: 'Sector 69',                  city: 'gurgaon' },
  { slug: 'sector-70',                 label: 'Sector 70',                  city: 'gurgaon' },
  { slug: 'sector-82-gurgaon',         label: 'Sector 82',                  city: 'gurgaon' },
  { slug: 'sector-84-gurgaon',         label: 'Sector 84',                  city: 'gurgaon' },
  { slug: 'sector-92-gurgaon',         label: 'Sector 92',                  city: 'gurgaon' },
  { slug: 'sector-102-gurgaon',        label: 'Sector 102',                 city: 'gurgaon' },
  { slug: 'sector-108-gurgaon',        label: 'Sector 108',                 city: 'gurgaon' },
  { slug: 'sector-113-gurgaon',        label: 'Sector 113',                 city: 'gurgaon' },

  // ── Delhi ─────────────────────────────────────────────────────────────────
  { slug: 'vasant-kunj',               label: 'Vasant Kunj',                city: 'delhi' },
  { slug: 'south-delhi',               label: 'South Delhi',                city: 'delhi' },
  { slug: 'saket',                     label: 'Saket',                      city: 'delhi' },
  { slug: 'lajpat-nagar',              label: 'Lajpat Nagar',               city: 'delhi' },
  { slug: 'rohini',                    label: 'Rohini',                     city: 'delhi' },
  { slug: 'dwarka',                    label: 'Dwarka',                     city: 'delhi' },

  // ── New Delhi ─────────────────────────────────────────────────────────────
  { slug: 'connaught-place',           label: 'Connaught Place',            city: 'new-delhi' },
  { slug: 'chanakyapuri',              label: 'Chanakyapuri',               city: 'new-delhi' },
  { slug: 'defence-colony',            label: 'Defence Colony',             city: 'new-delhi' },

  // ── Noida ─────────────────────────────────────────────────────────────────
  { slug: 'sector-18-noida',           label: 'Sector 18',                  city: 'noida' },
  { slug: 'sector-44-noida',           label: 'Sector 44',                  city: 'noida' },
  { slug: 'sector-62-noida',           label: 'Sector 62',                  city: 'noida' },
  { slug: 'sector-75-noida',           label: 'Sector 75',                  city: 'noida' },
  { slug: 'sector-76-noida',           label: 'Sector 76',                  city: 'noida' },
  { slug: 'sector-77-noida',           label: 'Sector 77',                  city: 'noida' },
  { slug: 'sector-78-noida',           label: 'Sector 78',                  city: 'noida' },
  { slug: 'sector-93-noida',           label: 'Sector 93',                  city: 'noida' },
  { slug: 'sector-128-noida',          label: 'Sector 128',                 city: 'noida' },
  { slug: 'sector-137-noida',          label: 'Sector 137',                 city: 'noida' },
  { slug: 'sector-143-noida',          label: 'Sector 143',                 city: 'noida' },
  { slug: 'sector-150-noida',          label: 'Sector 150',                 city: 'noida' },
  { slug: 'expressway-noida',          label: 'Noida Expressway',           city: 'noida' }, // legacy
  { slug: 'noida-expressway',          label: 'Noida Expressway',           city: 'noida' }, // seeder
  { slug: 'greater-noida-west',        label: 'Greater Noida West',         city: 'noida' },
  { slug: 'knowledge-park',            label: 'Knowledge Park',             city: 'noida' },
  { slug: 'yamuna-expressway',         label: 'Yamuna Expressway',          city: 'noida' },

  // ── Greater Noida ─────────────────────────────────────────────────────────
  { slug: 'sector-mu-greater-noida',   label: 'Sector Mu',                  city: 'greater-noida' },
  { slug: 'sector-pi-greater-noida',   label: 'Sector Pi',                  city: 'greater-noida' },
  { slug: 'sector-omicron',            label: 'Sector Omicron',             city: 'greater-noida' },

  // ── Mumbai ────────────────────────────────────────────────────────────────
  { slug: 'bandra',                    label: 'Bandra',                     city: 'mumbai' },
  { slug: 'andheri',                   label: 'Andheri',                    city: 'mumbai' },
  { slug: 'powai',                     label: 'Powai',                      city: 'mumbai' },
  { slug: 'worli',                     label: 'Worli',                      city: 'mumbai' },
  { slug: 'lower-parel',               label: 'Lower Parel',                city: 'mumbai' },
  { slug: 'juhu',                      label: 'Juhu',                       city: 'mumbai' },

  // ── Thane ─────────────────────────────────────────────────────────────────
  { slug: 'ghodbunder-road',           label: 'Ghodbunder Road',            city: 'thane' },
  { slug: 'manpada',                   label: 'Manpada',                    city: 'thane' },

  // ── Navi Mumbai ───────────────────────────────────────────────────────────
  { slug: 'kharghar',                  label: 'Kharghar',                   city: 'navi-mumbai' },
  { slug: 'vashi',                     label: 'Vashi',                      city: 'navi-mumbai' },
  { slug: 'belapur',                   label: 'Belapur',                    city: 'navi-mumbai' },

  // ── Pune ──────────────────────────────────────────────────────────────────
  { slug: 'hinjewadi',                 label: 'Hinjewadi',                  city: 'pune' },
  { slug: 'wakad',                     label: 'Wakad',                      city: 'pune' },
  { slug: 'baner',                     label: 'Baner',                      city: 'pune' },
  { slug: 'kharadi',                   label: 'Kharadi',                    city: 'pune' },
  { slug: 'viman-nagar',               label: 'Viman Nagar',                city: 'pune' },

  // ── Ahmedabad ─────────────────────────────────────────────────────────────
  { slug: 'sg-highway',                label: 'SG Highway',                 city: 'ahmedabad' },
  { slug: 'prahlad-nagar',             label: 'Prahlad Nagar',              city: 'ahmedabad' },
  { slug: 'bodakdev',                  label: 'Bodakdev',                   city: 'ahmedabad' },
  { slug: 'thaltej',                   label: 'Thaltej',                    city: 'ahmedabad' },

  // ── Bangalore ─────────────────────────────────────────────────────────────
  { slug: 'whitefield',                label: 'Whitefield',                 city: 'bangalore' },
  { slug: 'koramangala',               label: 'Koramangala',                city: 'bangalore' },
  { slug: 'indiranagar',               label: 'Indiranagar',                city: 'bangalore' },
  { slug: 'sarjapur-road',             label: 'Sarjapur Road',              city: 'bangalore' },
  { slug: 'electronic-city',           label: 'Electronic City',            city: 'bangalore' },
  { slug: 'hebbal',                    label: 'Hebbal',                     city: 'bangalore' },
  { slug: 'yelahanka',                 label: 'Yelahanka',                  city: 'bangalore' },

  // ── Hyderabad ─────────────────────────────────────────────────────────────
  { slug: 'gachibowli',                label: 'Gachibowli',                 city: 'hyderabad' },
  { slug: 'hitech-city',               label: 'HITECH City',                city: 'hyderabad' },
  { slug: 'kondapur',                  label: 'Kondapur',                   city: 'hyderabad' },
  { slug: 'jubilee-hills',             label: 'Jubilee Hills',              city: 'hyderabad' },
  { slug: 'banjara-hills',             label: 'Banjara Hills',              city: 'hyderabad' },

  // ── Chennai ───────────────────────────────────────────────────────────────
  { slug: 'anna-nagar',                label: 'Anna Nagar',                 city: 'chennai' },
  { slug: 'velachery',                 label: 'Velachery',                  city: 'chennai' },
  { slug: 'omr',                       label: 'OMR (Old Mahabalipuram Rd)', city: 'chennai' },
  { slug: 'porur',                     label: 'Porur',                      city: 'chennai' },

  // ── Chandigarh ────────────────────────────────────────────────────────────
  { slug: 'sector-17-chandigarh',      label: 'Sector 17',                  city: 'chandigarh' },
  { slug: 'sector-22-chandigarh',      label: 'Sector 22',                  city: 'chandigarh' },
  { slug: 'mohali',                    label: 'Mohali',                     city: 'chandigarh' },
  { slug: 'panchkula',                 label: 'Panchkula',                  city: 'chandigarh' },
  { slug: 'zirakpur',                  label: 'Zirakpur',                   city: 'chandigarh' },

  // ── Jaipur ────────────────────────────────────────────────────────────────
  { slug: 'vaishali-nagar',            label: 'Vaishali Nagar',             city: 'jaipur' },
  { slug: 'mansarovar',                label: 'Mansarovar',                 city: 'jaipur' },
  { slug: 'malviya-nagar-jaipur',      label: 'Malviya Nagar',              city: 'jaipur' },
  { slug: 'jagatpura',                 label: 'Jagatpura',                  city: 'jaipur' },
  { slug: 'tonk-road',                 label: 'Tonk Road',                  city: 'jaipur' },
];

export const LOCALITY_SLUGS = LOCALITIES.map(l => l.slug);

/**
 * Given a city slug, return all localities that belong to it.
 */
export function getLocalitiesForCity(citySlug) {
  return LOCALITIES.filter(l => l.city === citySlug);
}

// ── Developers (canonical list — keep in sync with DB + seeders) ────────────
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
