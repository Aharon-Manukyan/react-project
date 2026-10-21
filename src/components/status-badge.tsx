import { statusLabel } from "@/lib/types";

export function StatusBadge({ status }: { status: string }) {
  const palette =
    status === "shipped"
      ? "bg-sage/15 text-sage"
      : status === "in-progress"
        ? "bg-ember/15 text-ember"
        : "bg-gold/15 text-gold";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide uppercase ${palette}`}
    >
      {statusLabel(status)}
    </span>
  );
}
