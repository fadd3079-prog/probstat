const KNOWN_ACRONYMS = new Set(["BNI", "FT", "UNSOED", "VIP"]);
const ROMAN_NUMERALS = new Set([
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
]);

export function normalizeWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function normalizeKosName(value: string): string {
  return normalizeWhitespace(value)
    .split(" ")
    .map(normalizeNameToken)
    .join(" ");
}

export function normalizeAreaName(value?: string | null): string | null {
  if (!value) {
    return null;
  }

  const normalizedValue = normalizeWhitespace(value);

  if (normalizedValue.length === 0) {
    return null;
  }

  return normalizedValue.split(" ").map(normalizeNameToken).join(" ");
}

function normalizeNameToken(token: string): string {
  return token.split("-").map(normalizeWord).join("-");
}

function normalizeWord(word: string): string {
  if (word.length === 0) {
    return word;
  }

  const upperWord = word.toLocaleUpperCase("id-ID");

  if (KNOWN_ACRONYMS.has(upperWord) || ROMAN_NUMERALS.has(upperWord)) {
    return upperWord;
  }

  const lowerWord = word.toLocaleLowerCase("id-ID");

  return `${lowerWord.charAt(0).toLocaleUpperCase("id-ID")}${lowerWord.slice(1)}`;
}
