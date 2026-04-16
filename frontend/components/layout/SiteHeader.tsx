import { ConditionalMarketingHeader } from "@/components/layout/ConditionalMarketingHeader";
import { getHeaderNavData } from "@/lib/header-nav-data";

/** Server-fetches nav data; client layer skips `/admin/*` (no `headers()` → no DYNAMIC_SERVER_USAGE). */
export async function SiteHeader() {
  const { locations, developers, categories } = await getHeaderNavData();
  return (
    <ConditionalMarketingHeader
      locations={locations}
      developers={developers}
      categories={categories}
    />
  );
}
