/**
 * Recursively merge partial `patch` into `base`.
 * - Objects: merged key-by-key
 * - Arrays & scalars on `patch`: replace `base` entirely
 * - `undefined` values in `patch`: skip (keep `base`)
 */

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? U[]
    : T[P] extends object | undefined
      ? DeepPartial<NonNullable<T[P]>>
      : T[P];
};

export function deepMerge<T extends Record<string, unknown>>(
  base: T,
  patch: DeepPartial<T>,
): T {
  const out = { ...base } as T;
  for (const key of Object.keys(patch as object) as (keyof T)[]) {
    const p = patch[key];
    if (p === undefined) continue;
    const b = base[key];

    if (Array.isArray(p)) {
      (out as Record<string, unknown>)[key as string] = p as unknown[];
      continue;
    }
    if (
      p !== null &&
      typeof p === 'object' &&
      typeof b === 'object' &&
      b !== null &&
      !Array.isArray(b)
    ) {
      (out as Record<string, unknown>)[key as string] = deepMerge(
        b as Record<string, unknown>,
        p as DeepPartial<Record<string, unknown>>,
      );
    } else {
      (out as Record<string, unknown>)[key as string] = p as unknown;
    }
  }
  return out;
}
