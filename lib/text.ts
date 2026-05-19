// Set of double-quote characters we normalise to Ukrainian guillemets
// «…». Apostrophe-shaped marks (`'`, `'`, `'`, `ʼ`, etc.) are intentionally
// NOT included — they're used inside Ukrainian words (e.g. «Прав'я»,
// «м'ясо»), and we don't want to mangle them.
//
//  U+0022  "  ASCII double quote
//  U+201C  "  left double quotation mark
//  U+201D  "  right double quotation mark
//  U+201E  „  double low-9 quotation mark
//  U+201F  ‟  double high-reversed-9 quotation mark
//  U+00AB  «  left-pointing angle quotation mark (target opener)
//  U+00BB  »  right-pointing angle quotation mark (target closer)
const QUOTE_CHARS = /["“”„‟«»]/g;

// Normalise every double-quote pair in `s` to Ukrainian «...».
// Strategy: walk the string and alternate opener/closer for each quote
// glyph encountered. So `ТОВ "Агровет"` → `ТОВ «Агровет»` and
// `Назва "X" "Y"` → `Назва «X» «Y»`. Already-correct `«...»` pass
// through unchanged because the alternation lands on the right glyph.
export function normalizeQuotes(value: string): string {
  let isOpening = true;
  return value.replace(QUOTE_CHARS, () => {
    const ch = isOpening ? "«" : "»";
    isOpening = !isOpening;
    return ch;
  });
}
