import { Baby, Lock, Unlock, Shield, Fingerprint } from "lucide-react";
import { WaveformVisual } from "./WaveformVisual";
import { StatusIndicator } from "./StatusIndicator";
import { cn } from "@/lib/utils";

interface ChildProtectionPanelProps {
  isChildDetected: boolean;
  confidenceScore: number;
  isLocked: boolean;
  className?: string;
}

export function ChildProtectionPanel({
  isChildDetected,
  confidenceScore,
  isLocked,
  className,
}: ChildProtectionPanelProps) {
  return (
    <div className={cn(
      "glass rounded-2xl p-6 border transition-all duration-500",
      isChildDetected 
        ? "border-accent/50 bg-accent/5" 
        : "border-border/50"
    )}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            isChildDetected ? "bg-accent/20" : "bg-primary/10"
          )}>
            <Baby className={cn("w-5 h-5", isChildDetected ? "text-accent" : "text-primary")} />
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg tracking-wide">Child Detection</h2>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Zero-Light Protection Mode</p>
          </div>
        </div>
        
        {isLocked && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/20 border border-destructive/30">
            <Lock className="w-4 h-4 text-destructive" />
            <span className="text-xs font-semibold text-destructive uppercase tracking-wider">Locked</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Detection status */}
          <div className={cn(
            "p-4 rounded-xl border",
            isChildDetected 
              ? "bg-accent/10 border-accent/30" 
              : "bg-secondary/30 border-border/30"
          )}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Detection Status</span>
              <StatusIndicator 
                status={isChildDetected ? "warning" : "inactive"} 
                label="Neural Analysis"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground uppercase">Confidence</span>
                  <span className={cn(
                    "text-sm font-semibold",
                    confidenceScore > 80 ? "text-accent" : "text-muted-foreground"
                  )}>
                    {confidenceScore}%
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      confidenceScore > 80 
                        ? "bg-accent shadow-[0_0_10px_hsl(320,100%,60%,0.5)]" 
                        : "bg-primary"
                    )}
                    style={{ width: `${confidenceScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Biometric indicators */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-secondary/20 border border-border/30">
              <p className="text-xs text-muted-foreground uppercase mb-1">Iris Ratio</p>
              <p className="text-lg font-display font-semibold text-foreground">
                {isChildDetected ? "0.42" : "0.38"}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/20 border border-border/30">
              <p className="text-xs text-muted-foreground uppercase mb-1">Reflex Pattern</p>
              <p className="text-lg font-display font-semibold text-foreground">
                {isChildDetected ? "Juvenile" : "Adult"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Neural processing visual */}
          <div className="p-4 rounded-xl bg-secondary/20 border border-border/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Neural Processing</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs text-primary">Active</span>
              </div>
            </div>
            <WaveformVisual active variant={isChildDetected ? "accent" : "primary"} />
          </div>

          {/* Unlock prompt */}
          {isLocked && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30">
              <div className="flex items-center gap-3">
                <Fingerprint className="w-8 h-8 text-destructive" />
                <div>
                  <p className="font-semibold text-destructive">Adult Auth Required</p>
                  <p className="text-xs text-muted-foreground">
                    Authenticate to unlock device
                  </p>
                </div>
              </div>
            </div>
          )}

          {!isLocked && !isChildDetected && (
            <div className="p-4 rounded-xl bg-success/10 border border-success/30">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-success" />
                <div>
                  <p className="font-semibold text-success">Adult User Verified</p>
                  <p className="text-xs text-muted-foreground">Full device access granted</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
