import { cache } from "react";
import { getLocations, getDevelopers, getCategories } from "@/lib";
import type { Location } from "@/lib/api/locations";
import type { Developer } from "@/lib/api/developers";
import type { Category } from "@/lib/api/categories";

function normalise(res: unknown): unknown[] {
  if (Array.isArray(res)) return res;
  if (res && typeof res === "object" && "data" in res && Array.isArray((res as { data: unknown[] }).data)) {
    return (res as { data: unknown[] }).data;
  }
  return [];
}

/** Deduped per request; same limits as the home page header data. */
export const getHeaderNavData = cache(async (): Promise<{
  locations: Location[];
  developers: Developer[];
  categories: Category[];
}> => {
  try {
    const [locationsRes, developersRes, categoriesRes] = await Promise.all([
      getLocations({ limit: 20, offset: 0 }, 3600).catch(() => ({ data: [] as Location[] })),
      getDevelopers({ limit: 12, offset: 0 }, 3600).catch(() => ({ data: [] as Developer[] })),
      getCategories({ limit: 120, offset: 0 }, 3600).catch(() => ({ data: [] as Category[] })),
    ]);
    return {
      locations: normalise(locationsRes) as Location[],
      developers: normalise(developersRes) as Developer[],
      categories: normalise(categoriesRes) as Category[],
    };
  } catch {
    return { locations: [], developers: [], categories: [] };
  }
});
