import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  status?: "normal" | "warning" | "critical" | "success";
  trend?: "up" | "down" | "stable";
  className?: string;
  children?: React.ReactNode;
}

const statusColors = {
  normal: "border-primary/30 bg-primary/5",
  warning: "border-warning/30 bg-warning/5",
  critical: "border-destructive/30 bg-destructive/5",
  success: "border-success/30 bg-success/5",
};

const statusIconColors = {
  normal: "text-primary bg-primary/10",
  warning: "text-warning bg-warning/10",
  critical: "text-destructive bg-destructive/10",
  success: "text-success bg-success/10",
};

const statusTextColors = {
  normal: "text-primary",
  warning: "text-warning",
  critical: "text-destructive",
  success: "text-success",
};

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  status = "normal",
  className,
  children,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-xl p-4 transition-all duration-300 hover:scale-[1.02]",
        "border",
        statusColors[status],
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn("p-2 rounded-lg", statusIconColors[status])}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-1">
          <div className={cn("w-2 h-2 rounded-full animate-pulse", statusTextColors[status].replace("text-", "bg-"))} />
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Live</span>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{title}</h3>
        <p className={cn("text-2xl font-display font-bold", statusTextColors[status])}>{value}</p>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
