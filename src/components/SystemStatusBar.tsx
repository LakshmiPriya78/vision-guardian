import { Cpu, Camera, Activity, Gauge } from "lucide-react";
import { cn } from "@/lib/utils";

interface SystemStatusBarProps {
  fps: number;
  npuLoad: number;
  imuStatus: boolean;
  className?: string;
}

export function SystemStatusBar({ fps, npuLoad, imuStatus, className }: SystemStatusBarProps) {
  return (
    <div className={cn(
      "glass rounded-xl p-4 border border-border/30",
      className
    )}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-6">
          {/* Camera FPS */}
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground uppercase">Camera</p>
              <p className="text-sm font-display font-semibold text-foreground">{fps} FPS</p>
            </div>
          </div>

          <div className="w-px h-8 bg-border" />

          {/* NPU Load */}
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-accent" />
            <div>
              <p className="text-xs text-muted-foreground uppercase">NPU Load</p>
              <div className="flex items-center gap-2">
                <p className={cn(
                  "text-sm font-display font-semibold",
                  npuLoad > 80 ? "text-warning" : "text-foreground"
                )}>
                  {npuLoad}%
                </p>
                <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      npuLoad > 80 ? "bg-warning" : "bg-accent"
                    )}
                    style={{ width: `${npuLoad}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-px h-8 bg-border" />

          {/* IMU Status */}
          <div className="flex items-center gap-2">
            <Activity className={cn("w-4 h-4", imuStatus ? "text-success" : "text-muted-foreground")} />
            <div>
              <p className="text-xs text-muted-foreground uppercase">IMU</p>
              <div className="flex items-center gap-1">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  imuStatus ? "bg-success animate-pulse" : "bg-muted-foreground"
                )} />
                <p className={cn(
                  "text-sm font-semibold",
                  imuStatus ? "text-success" : "text-muted-foreground"
                )}>
                  {imuStatus ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/30">
          <Gauge className="w-4 h-4 text-success" />
          <span className="text-xs font-semibold text-success uppercase tracking-wider">Optimal</span>
        </div>
      </div>
    </div>
  );
}
