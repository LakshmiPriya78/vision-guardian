import { Eye, Activity, Timer, Sparkles } from "lucide-react";
import { RadialGauge } from "./RadialGauge";
import { MetricCard } from "./MetricCard";
import { ProgressBar } from "./ProgressBar";
import { cn } from "@/lib/utils";

interface DESIPanelProps {
  desiValue: number;
  pupilDiameter: number;
  blinkRate: number;
  reflexLatency: number;
  className?: string;
}

export function DESIPanel({
  desiValue,
  pupilDiameter,
  blinkRate,
  reflexLatency,
  className,
}: DESIPanelProps) {
  const getStatus = (value: number) => {
    if (value < 30) return "success";
    if (value < 60) return "warning";
    return "critical";
  };

  const status = getStatus(desiValue);
  const statusLabel = status === "success" ? "Healthy" : status === "warning" ? "Moderate Strain" : "High Strain";

  return (
    <div className={cn("glass rounded-2xl p-6 border border-border/50", className)}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Eye className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg tracking-wide">Digital Eye Strain Index</h2>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Real-time ophthalmic analysis</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
        {/* Main gauge */}
        <div className="flex flex-col items-center">
          <RadialGauge
            value={desiValue}
            max={100}
            label="DESI Score"
            size="lg"
            variant={status === "success" ? "success" : status === "warning" ? "warning" : "accent"}
          />
          <div className="mt-4 px-4 py-2 rounded-full bg-secondary/50 border border-border/50">
            <span className={cn(
              "text-sm font-semibold uppercase tracking-wider",
              status === "success" ? "text-success" : status === "warning" ? "text-warning" : "text-destructive"
            )}>
              {statusLabel}
            </span>
          </div>
        </div>

        {/* Sub metrics */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          <MetricCard
            title="Pupil Diameter"
            value={`${pupilDiameter.toFixed(1)}mm`}
            icon={Sparkles}
            status={pupilDiameter > 4 ? "warning" : "normal"}
            subtitle="P_D measurement"
          >
            <ProgressBar value={pupilDiameter} max={8} variant="primary" showLabel={false} />
          </MetricCard>

          <MetricCard
            title="Blink Rate"
            value={`${blinkRate}/min`}
            icon={Activity}
            status={blinkRate < 10 ? "warning" : "success"}
            subtitle="B_R variability"
          >
            <ProgressBar value={blinkRate} max={30} variant={blinkRate < 10 ? "warning" : "success"} showLabel={false} />
          </MetricCard>

          <MetricCard
            title="Reflex Latency"
            value={`${reflexLatency}ms`}
            icon={Timer}
            status={reflexLatency > 300 ? "warning" : "normal"}
            subtitle="L_R response time"
          >
            <ProgressBar value={reflexLatency} max={500} variant={reflexLatency > 300 ? "warning" : "primary"} showLabel={false} />
          </MetricCard>
        </div>
      </div>
    </div>
  );
}
