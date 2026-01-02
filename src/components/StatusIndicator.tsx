import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: "active" | "warning" | "critical" | "inactive";
  label: string;
  className?: string;
}

const statusConfig = {
  active: {
    color: "bg-success",
    glow: "shadow-[0_0_10px_hsl(150,100%,45%)]",
    text: "text-success",
    label: "ACTIVE",
  },
  warning: {
    color: "bg-warning",
    glow: "shadow-[0_0_10px_hsl(35,100%,55%)]",
    text: "text-warning",
    label: "WARNING",
  },
  critical: {
    color: "bg-destructive",
    glow: "shadow-[0_0_10px_hsl(0,85%,55%)]",
    text: "text-destructive",
    label: "CRITICAL",
  },
  inactive: {
    color: "bg-muted-foreground",
    glow: "",
    text: "text-muted-foreground",
    label: "INACTIVE",
  },
};

export function StatusIndicator({ status, label, className }: StatusIndicatorProps) {
  const config = statusConfig[status];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative">
        <div className={cn("w-3 h-3 rounded-full", config.color, config.glow)} />
        {status !== "inactive" && (
          <div className={cn("absolute inset-0 w-3 h-3 rounded-full animate-ping", config.color, "opacity-50")} />
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
        <span className={cn("text-sm font-semibold", config.text)}>{config.label}</span>
      </div>
    </div>
  );
}
