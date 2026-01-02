import { Moon, Sun, Zap } from "lucide-react";
import { RadialGauge } from "./RadialGauge";
import { ProgressBar } from "./ProgressBar";
import { cn } from "@/lib/utils";

interface MSRFPanelProps {
  msrfValue: number;
  blueLightExposure: number;
  isNightMode: boolean;
  className?: string;
}

export function MSRFPanel({ msrfValue, blueLightExposure, isNightMode, className }: MSRFPanelProps) {
  const isSuppressed = msrfValue > 70;

  return (
    <div className={cn("glass rounded-2xl p-6 border border-border/50", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <Moon className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg tracking-wide">Melatonin Suppression</h2>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">MSRF Neurological Protection</p>
          </div>
        </div>
        {isSuppressed && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 border border-accent/30 animate-pulse">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">Blue Light Suppressed</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col items-center">
          <RadialGauge
            value={msrfValue}
            max={100}
            label="MSRF Level"
            unit="%"
            size="md"
            variant={msrfValue < 50 ? "success" : msrfValue < 70 ? "warning" : "accent"}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
            <div className="flex items-center gap-2">
              {isNightMode ? (
                <Moon className="w-4 h-4 text-accent" />
              ) : (
                <Sun className="w-4 h-4 text-warning" />
              )}
              <span className="text-sm text-muted-foreground">Ambient Light</span>
            </div>
            <span className="text-sm font-semibold text-foreground">
              {isNightMode ? "Low Light" : "Normal"}
            </span>
          </div>

          <div className="space-y-3">
            <ProgressBar
              value={blueLightExposure}
              max={100}
              variant={blueLightExposure > 60 ? "accent" : "primary"}
              label="Blue Light (450-495nm)"
            />

            <div className="p-3 rounded-lg bg-secondary/20 border border-border/30">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Emission Filter</span>
                <span className={cn(
                  "text-xs font-semibold uppercase tracking-wider",
                  isSuppressed ? "text-accent" : "text-muted-foreground"
                )}>
                  {isSuppressed ? "80% Suppressed" : "Standby"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
