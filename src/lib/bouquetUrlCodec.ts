/**
 * Encode / decode bouquet data into a compact URL-safe base64 string.
 * No backend required — everything lives in the URL.
 *
 * Encoding format (pipe-delimited, then base64url):
 *   senderName|receiverName|message|flowersCompact|layoutSeed|greeneryCode
 *
 * flowersCompact: each flower is its short code + count, e.g. "r3d2a1"
 * greeneryCode:   c=classic  w=wild  e=eucalyptus
 *
 * Backwards-compatible: if decoding fails the new way, falls back to the
 * old JSON base64 format so existing shared links keep working.
 */

export interface BouquetUrlData {
  senderName: string;
  receiverName: string;
  message: string;
  flowers: Record<string, number>;
  layoutSeed: number;
  greeneryStyle: "classic" | "wild" | "eucalyptus";
}

// ── Lookup tables ────────────────────────────────────────────────────────────
const FLOWER_TO_CODE: Record<string, string> = {
  roses:      "r",
  dahlia:     "d",
  anemone:    "a",
  daisies:    "dy",
  sunflowers: "s",
  lily:       "l",
  tulips:     "t",
  lavender:   "lv",
};

const CODE_TO_FLOWER: Record<string, string> = Object.fromEntries(
  Object.entries(FLOWER_TO_CODE).map(([k, v]) => [v, k])
);

const GREENERY_TO_CODE: Record<string, string> = {
  classic:    "c",
  wild:       "w",
  eucalyptus: "e",
};
const CODE_TO_GREENERY: Record<string, BouquetUrlData["greeneryStyle"]> = {
  c: "classic",
  w: "wild",
  e: "eucalyptus",
};

// ── Base64url helpers ────────────────────────────────────────────────────────
const toB64 = (str: string) =>
  btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const fromB64 = (str: string) =>
  decodeURIComponent(escape(atob(str.replace(/-/g, "+").replace(/_/g, "/"))));

// ── Flower compact encode/decode ─────────────────────────────────────────────
// "roses:3, dahlia:2" → "r3d2"
const encodeFlowers = (flowers: Record<string, number>): string =>
  Object.entries(flowers)
    .filter(([, n]) => n > 0)
    .map(([key, n]) => (FLOWER_TO_CODE[key] ?? key) + n)
    .join("");

// "r3d2a1" → { roses:3, dahlia:2, anemone:1 }
const decodeFlowers = (str: string): Record<string, number> => {
  const result: Record<string, number> = {};
  // Match: one or two lowercase letters followed by digits
  const matches = str.matchAll(/([a-z]{1,2})(\d+)/g);
  for (const [, code, count] of matches) {
    const key = CODE_TO_FLOWER[code] ?? code;
    result[key] = parseInt(count, 10);
  }
  return result;
};

// ── Public API ───────────────────────────────────────────────────────────────
export const encodeBouquetUrl = (data: BouquetUrlData): string => {
  try {
    const parts = [
      data.senderName,
      data.receiverName,
      data.message,
      encodeFlowers(data.flowers),
      String(data.layoutSeed),
      GREENERY_TO_CODE[data.greeneryStyle] ?? "c",
    ];
    return toB64(parts.join("|"));
  } catch {
    return "";
  }
};

export const decodeBouquetUrl = (encoded: string): BouquetUrlData | null => {
  // ── Try new compact format first ──
  try {
    const raw = fromB64(encoded);
    const parts = raw.split("|");
    if (parts.length === 6) {
      const [senderName, receiverName, message, flowersStr, seedStr, greeneryCode] = parts;
      const flowers = decodeFlowers(flowersStr);
      const layoutSeed = parseInt(seedStr, 10);
      const greeneryStyle = CODE_TO_GREENERY[greeneryCode] ?? "classic";
      if (receiverName && Object.keys(flowers).length > 0 && !isNaN(layoutSeed)) {
        return { senderName, receiverName, message, flowers, layoutSeed, greeneryStyle };
      }
    }
  } catch {
    // fall through to legacy
  }

  // ── Legacy fallback: old JSON base64 format ──
  try {
    const json = fromB64(encoded);
    const parsed = JSON.parse(json) as BouquetUrlData;
    if (parsed.flowers && parsed.receiverName) return parsed;
  } catch {
    // ignore
  }

  return null;
};