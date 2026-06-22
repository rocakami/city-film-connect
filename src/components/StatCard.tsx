import type { LucideIcon } from "lucide-react";
import { ArrowDown, ArrowUp } from "lucide-react";

type Tone = "violet" | "green" | "amber" | "red" | "blue";

const toneBg: Record<Tone, string> = {
  violet: "bg-stat-violet",
  green: "bg-stat-green",
  amber: "bg-stat-amber",
  red: "bg-stat-red",
  blue: "bg-stat-blue",
};

interface Props {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone: Tone;
  caption?: string;
  delta?: { value: string; direction: "up" | "down"; label?: string };
}

export function StatCard({ label, value, icon: Icon, tone, caption, delta }: Props) {
  return (
    <div className="rounded-2xl bg-card border border-border p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className={`size-14 shrink-0 rounded-full grid place-items-center text-white ${toneBg[tone]}`}>
          <Icon className="size-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">{value}</p>
          {caption && <p className="text-xs text-muted-foreground mt-0.5">{caption}</p>}
          {delta && (
            <p className="mt-2 flex items-center gap-1.5 text-xs">
              {delta.direction === "up" ? (
                <ArrowUp className="size-3 text-emerald-600" />
              ) : (
                <ArrowDown className="size-3 text-rose-600" />
              )}
              <span className={delta.direction === "up" ? "text-emerald-600 font-medium" : "text-rose-600 font-medium"}>
                {delta.value}
              </span>
              <span className="text-muted-foreground">{delta.label ?? "from last month"}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
