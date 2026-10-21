export type ProjectStatus = "shipped" | "in-progress" | "concept";

export const PROJECT_STATUSES = ["shipped", "in-progress", "concept"] as const;

export const COVER_TONES = ["ember", "sage", "ink", "sand"] as const;
export type CoverTone = (typeof COVER_TONES)[number];

export function parseStack(stack: string) {
  return stack
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function statusLabel(status: string) {
  switch (status) {
    case "shipped":
      return "Запущено";
    case "in-progress":
      return "В работе";
    case "concept":
      return "Концепт";
    default:
      return status;
  }
}
