export const PROJECT_CATEGORIES = ["client", "personal", "tool", "opensource"] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  client: "Client work",
  personal: "Side projects",
  tool: "Free tools",
  opensource: "Open source",
};

/** Values stored before a category was renamed. */
const LEGACY: Record<string, ProjectCategory> = { utility: "tool" };

export function categoryOf(value: string | null | undefined): ProjectCategory {
  if (value && LEGACY[value]) return LEGACY[value];
  return PROJECT_CATEGORIES.includes(value as ProjectCategory)
    ? (value as ProjectCategory)
    : "client";
}
