export const PROJECT_CATEGORIES = ["client", "utility", "opensource"] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  client: "Client work",
  utility: "Utility apps",
  opensource: "Open source",
};

export function categoryOf(value: string | null | undefined): ProjectCategory {
  return PROJECT_CATEGORIES.includes(value as ProjectCategory)
    ? (value as ProjectCategory)
    : "client";
}
