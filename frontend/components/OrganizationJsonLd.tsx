/**
 * Site-wide Organization JSON-LD — rendered once from root layout.
 * Gives Google and AI systems a clear entity signal for "Superluxere":
 * who they are, where, how to contact them.
 */
import { getSiteUrl } from "@/lib/site-url";
import { CONTACT_INFO } from "@/lib/constants";
import { SITE_LOGO_PATH } from "@/lib/seo";

export function OrganizationJsonLd() {
  const base = getSiteUrl();

  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${base}/#organization`,
    name: "Superluxere",
    url: base,
    logo: {
      "@type": "ImageObject",
      url: `${base}${SITE_LOGO_PATH}`,
      width: 1024,
      height: 1024,
    },
    description:
      "India's premier luxury real estate portal, curating premium residential and commercial properties across Gurgaon, Delhi, Mumbai, Bengaluru, Hyderabad, and other major Indian cities.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: CONTACT_INFO.PHONE_NUMBER,
      contactType: "customer service",
      availableLanguage: ["English", "Hindi"],
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        description: CONTACT_INFO.HOURS,
      },
    },
    email: CONTACT_INFO.EMAIL,
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT_INFO.ADDRESS,
      addressLocality: "Noida",
      addressRegion: "Uttar Pradesh",
      addressCountry: "IN",
    },
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    sameAs: [
      "https://www.instagram.com/superluxere",
      "https://www.linkedin.com/company/superluxere",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
