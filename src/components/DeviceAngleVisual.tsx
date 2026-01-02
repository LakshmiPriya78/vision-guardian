import { cn } from "@/lib/utils";

interface DeviceAngleVisualProps {
  angle: number;
  safeAngle?: number;
  className?: string;
}

export function DeviceAngleVisual({ angle, safeAngle = 45, className }: DeviceAngleVisualProps) {
  const isUnsafe = angle < safeAngle;
  const displayAngle = Math.min(Math.max(angle, 0), 90);

  return (
    <div className={cn("relative w-full aspect-square max-w-[200px]", className)}>
      {/* Grid background */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-px bg-primary/30"
            style={{ top: `${(i + 1) * 20}%` }}
          />
        ))}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute h-full w-px bg-primary/30"
            style={{ left: `${(i + 1) * 20}%` }}
          />
        ))}
      </div>

      {/* Safe zone arc */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="safeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(150, 100%, 45%)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(150, 100%, 45%)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path
          d={`M 50 90 L 50 50 L ${50 + 40 * Math.cos((90 - safeAngle) * Math.PI / 180)} ${50 - 40 * Math.sin((90 - safeAngle) * Math.PI / 180)} A 40 40 0 0 1 50 10 L 50 50 Z`}
          fill="url(#safeGradient)"
          className="opacity-50"
        />
      </svg>

      {/* Device representation */}
      <div
        className="absolute left-1/2 bottom-[10%] origin-bottom transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-50%) rotate(${90 - displayAngle}deg)` }}
      >
        <div
          className={cn(
            "w-4 h-20 rounded-sm border-2 transition-colors duration-300",
            isUnsafe
              ? "border-warning bg-warning/20 shadow-[0_0_15px_hsl(35,100%,55%,0.5)]"
              : "border-success bg-success/20 shadow-[0_0_15px_hsl(150,100%,45%,0.5)]"
          )}
        >
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-1 rounded-full bg-current opacity-50" />
        </div>
      </div>

      {/* Angle indicator */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
        <span
          className={cn(
            "text-3xl font-display font-bold transition-colors duration-300",
            isUnsafe ? "text-warning" : "text-success"
          )}
        >
          {displayAngle}°
        </span>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
          {isUnsafe ? "Adjust Posture" : "Good Posture"}
        </p>
      </div>
    </div>
  );
}
