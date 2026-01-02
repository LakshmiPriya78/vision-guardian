import { Smartphone, AlertTriangle, CheckCircle } from "lucide-react";
import { DeviceAngleVisual } from "./DeviceAngleVisual";
import { cn } from "@/lib/utils";

interface PosturePanelProps {
  tiltAngle: number;
  safeAngle?: number;
  duration: number;
  className?: string;
}

export function PosturePanel({ tiltAngle, safeAngle = 45, duration, className }: PosturePanelProps) {
  const isUnsafe = tiltAngle < safeAngle;
  const durationMinutes = Math.floor(duration / 60);
  const durationSeconds = duration % 60;

  return (
    <div className={cn("glass rounded-2xl p-6 border border-border/50", className)}>
      <div className="flex items-center gap-3 mb-6">
        <div className={cn(
          "p-2 rounded-lg",
          isUnsafe ? "bg-warning/10" : "bg-success/10"
        )}>
          <Smartphone className={cn("w-5 h-5", isUnsafe ? "text-warning" : "text-success")} />
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg tracking-wide">Posture Monitoring</h2>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Device Tilt Angle θ_DT</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex justify-center">
          <DeviceAngleVisual angle={tiltAngle} safeAngle={safeAngle} />
        </div>

        <div className="space-y-4">
          {/* Status indicator */}
          <div className={cn(
            "p-4 rounded-xl border transition-colors duration-300",
            isUnsafe 
              ? "bg-warning/10 border-warning/30" 
              : "bg-success/10 border-success/30"
          )}>
            <div className="flex items-center gap-3">
              {isUnsafe ? (
                <AlertTriangle className="w-6 h-6 text-warning" />
              ) : (
                <CheckCircle className="w-6 h-6 text-success" />
              )}
              <div>
                <p className={cn(
                  "font-semibold",
                  isUnsafe ? "text-warning" : "text-success"
                )}>
                  {isUnsafe ? "Posture Alert" : "Good Posture"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isUnsafe 
                    ? "Raise your device to reduce neck strain" 
                    : "Maintaining healthy viewing angle"}
                </p>
              </div>
            </div>
          </div>

          {/* Duration tracker */}
          <div className="p-4 rounded-xl bg-secondary/30 border border-border/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Current Position</span>
              <span className="text-sm font-display font-semibold text-foreground">
                {durationMinutes}:{durationSeconds.toString().padStart(2, '0')}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Safe angle threshold: {safeAngle}°
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-secondary/20 text-center">
              <p className="text-xl font-display font-bold text-primary">{tiltAngle}°</p>
              <p className="text-xs text-muted-foreground uppercase">Current</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/20 text-center">
              <p className="text-xl font-display font-bold text-success">{safeAngle}°</p>
              <p className="text-xs text-muted-foreground uppercase">Target</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
