// Cyrillic → Latin lookalikes used on Ukrainian plates. DozoR may store
// the same plate in either alphabet, so we fold to Latin before comparing.
// Only the 12 letters that visually overlap with Latin are mapped; other
// Cyrillic glyphs are dropped along with whitespace and punctuation.
const CYRILLIC_TO_LATIN: Record<string, string> = {
  А: "A",
  В: "B",
  Е: "E",
  І: "I",
  Ї: "I",
  К: "K",
  М: "M",
  Н: "H",
  О: "O",
  Р: "P",
  С: "C",
  Т: "T",
  Х: "X",
};

// Normalize plates / gov-numbers / tracker names for comparison: uppercase,
// fold Cyrillic lookalikes to Latin, then strip everything that isn't a
// Latin letter or digit. So "AA 1234 BB", "aa1234bb", and Ukrainian
// Cyrillic "АА 1234 ВВ" all collapse to "AA1234BB". A descriptive name
// like "MAN TGS - ВО 3258 СС" collapses to "MANTGSBO3258CC".
export function normalizePlate(value: string | null | undefined): string {
  if (!value) return "";
  let out = "";
  for (const ch of value.toUpperCase()) {
    out += CYRILLIC_TO_LATIN[ch] ?? ch;
  }
  return out.replace(/[^0-9A-Z]/g, "");
}

// Levenshtein distance — number of single-character edits (insert, delete,
// substitute) needed to turn `a` into `b`. Used for "close enough" matching.
export function plateEditDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  if (Math.abs(a.length - b.length) > 4) return 99;

  const m = a.length;
  const n = b.length;
  let prev: number[] = Array.from({ length: n + 1 }, (_, i) => i);
  let curr: number[] = new Array(n + 1).fill(0);

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        curr[j - 1] + 1, // insertion
        prev[j] + 1, // deletion
        prev[j - 1] + cost, // substitution
      );
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

const MIN_PLATE_LENGTH = 5;
const MAX_DISTANCE = 2;

// Approximate substring distance: minimum Levenshtein distance between
// `target` and any contiguous window in `text`. Windows of length
// target.length ± 1 are tried, so one missing or extra character within
// the embedded plate is tolerated.
//
// Why this matters: a DozoR tracker name like "МАN ВО3250СС/ВО4506ХР"
// normalizes to "MANBO3250CCBO4506XP" and we want it to match a vehicle
// whose plate is "ВО 3258 СС" → "BO3258CC". Full-text Levenshtein would
// score 11+ (lots of extra chars), but the embedded window "BO3250CC" is
// distance 1 from "BO3258CC". The sliding window catches that.
function approxSubstringDistance(target: string, text: string): number {
  if (text.length < target.length - 1) return 99;
  if (text === target) return 0;
  if (text.includes(target)) return 0;

  let min = Infinity;
  const lens = [target.length - 1, target.length, target.length + 1].filter(
    (n) => n > 0,
  );
  for (let i = 0; i < text.length; i++) {
    for (const len of lens) {
      if (i + len > text.length) continue;
      const window = text.substring(i, i + len);
      const d = plateEditDistance(target, window);
      if (d < min) {
        min = d;
        if (min === 0) return 0;
      }
    }
  }
  return min;
}

// Find the candidate whose text (typically the DozoR tracker `name`)
// best matches the target plate. Match strategy:
//
//   1. Normalize both sides (uppercase, Cyrillic→Latin lookalikes, strip
//      punctuation/whitespace).
//   2. For each candidate, compute approx-substring-distance: the min
//      edit distance from the plate to any window inside the name.
//   3. Pick the candidate with the lowest distance (≤ 2). On a tie,
//      prefer the candidate whose normalized text is shortest (i.e.
//      closer to being just-the-plate, not a long descriptive name).
//      If two candidates remain tied even then, return undefined — we
//      refuse to silently link the wrong tracker.
//
// Examples (target plate normalizes to "BO3258CC"):
//   "BO3258CC"               → distance 0 (exact)
//   "MAN BO3258CC"           → distance 0 (substring)
//   "МАN ВО3258СС/ВО4506ХР"  → distance 0 (substring after folding)
//   "МАN ВО3250СС/ВО4506ХР"  → distance 1 (one-digit typo in substring)
//   "Volvo АА1234ВВ"         → no window within 2 → no match
export function findPlateMatch<T>(
  targetPlate: string | null | undefined,
  candidates: readonly T[],
  getText: (c: T) => string,
): T | undefined {
  const target = normalizePlate(targetPlate);
  if (!target || target.length < MIN_PLATE_LENGTH) return undefined;

  let best: T | undefined = undefined;
  let bestDistance = Infinity;
  let bestTextLength = Infinity;
  let ambiguous = false;

  for (const c of candidates) {
    const text = normalizePlate(getText(c));
    if (!text || text.length < MIN_PLATE_LENGTH) continue;

    const d = approxSubstringDistance(target, text);
    if (d > MAX_DISTANCE) continue;

    if (d < bestDistance) {
      best = c;
      bestDistance = d;
      bestTextLength = text.length;
      ambiguous = false;
    } else if (d === bestDistance) {
      if (text.length < bestTextLength) {
        best = c;
        bestTextLength = text.length;
        ambiguous = false;
      } else if (text.length === bestTextLength) {
        ambiguous = true;
      }
    }
  }

  return ambiguous ? undefined : best;
}
