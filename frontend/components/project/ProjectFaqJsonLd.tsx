/** Server-only FAQPage JSON-LD for property detail SEO (pairs with SSR FAQ markup). */

export type FaqForJsonLd = { question: string; answer: string };

function stripHtmlToPlainText(html: string): string {
  if (!html) return "";
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function ProjectFaqJsonLd({ faqs }: { faqs: FaqForJsonLd[] }) {
  const items = (faqs ?? []).filter(
    (f) => f.question?.trim() && f.answer?.trim(),
  );
  if (items.length === 0) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question.trim(),
      acceptedAnswer: {
        "@type": "Answer",
        text: stripHtmlToPlainText(f.answer),
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- JSON-LD requires inline script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
