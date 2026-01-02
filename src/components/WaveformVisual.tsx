import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface WaveformVisualProps {
  active?: boolean;
  variant?: "primary" | "accent";
  className?: string;
}

export function WaveformVisual({ active = true, variant = "primary", className }: WaveformVisualProps) {
  const [bars, setBars] = useState<number[]>(Array(20).fill(20));

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      setBars(prev => prev.map(() => Math.random() * 80 + 20));
    }, 150);

    return () => clearInterval(interval);
  }, [active]);

  const barColor = variant === "primary" ? "bg-primary" : "bg-accent";
  const glowColor = variant === "primary" 
    ? "shadow-[0_0_5px_hsl(185,100%,50%)]" 
    : "shadow-[0_0_5px_hsl(320,100%,60%)]";

  return (
    <div className={cn("flex items-end justify-center gap-1 h-16", className)}>
      {bars.map((height, i) => (
        <div
          key={i}
          className={cn(
            "w-1 rounded-full transition-all duration-150",
            active ? barColor : "bg-muted",
            active && glowColor
          )}
          style={{ height: active ? `${height}%` : "20%" }}
        />
      ))}
    </div>
  );
}
