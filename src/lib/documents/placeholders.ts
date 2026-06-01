/*
 * Tiny template language for contract clauses:
 *   {{name}}                    replaced with the value
 *   {{#name}}…{{/name}}         kept only when name has a value
 *   {{^name}}…{{/name}}         kept only when name is empty
 */

export type PlaceholderVars = Record<string, string>;

const SECTION_RE = /\{\{([#^])\s*(\w+)\s*\}\}([\s\S]*?)\{\{\/\s*\2\s*\}\}/g;
const VAR_RE = /\{\{\s*(\w+)\s*\}\}/g;

export const BLANK = "__________";

export type FillResult = {
  text: string;
  /** Known placeholders that have no value yet. */
  missing: string[];
  /** Placeholders that don't exist (likely typos). */
  unknown: string[];
};

export function fillPlaceholders(
  text: string,
  vars: PlaceholderVars,
  blank: string = BLANK,
): FillResult {
  const missing = new Set<string>();
  const unknown = new Set<string>();
  const has = (key: string) => (vars[key] ?? "").trim() !== "";

  const withSections = text.replace(SECTION_RE, (_, kind: string, key: string, body: string) => {
    if (!(key in vars)) unknown.add(key);
    return (kind === "#") === has(key) ? body : "";
  });

  const filled = withSections.replace(VAR_RE, (token, key: string) => {
    if (!(key in vars)) {
      unknown.add(key);
      return token;
    }
    if (!has(key)) {
      missing.add(key);
      return blank;
    }
    return vars[key];
  });

  return { text: filled, missing: [...missing], unknown: [...unknown] };
}
