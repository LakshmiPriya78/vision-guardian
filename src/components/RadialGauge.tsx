import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface RadialGaugeProps {
  value: number;
  max: number;
  label: string;
  unit?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "success" | "warning" | "accent";
  showValue?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: { width: 100, stroke: 6, fontSize: "text-lg" },
  md: { width: 140, stroke: 8, fontSize: "text-2xl" },
  lg: { width: 180, stroke: 10, fontSize: "text-3xl" },
};

const variantColors = {
  primary: "stroke-primary",
  success: "stroke-success",
  warning: "stroke-warning",
  accent: "stroke-accent",
};

const variantGlows = {
  primary: "drop-shadow-[0_0_8px_hsl(185,100%,50%)]",
  success: "drop-shadow-[0_0_8px_hsl(150,100%,45%)]",
  warning: "drop-shadow-[0_0_8px_hsl(35,100%,55%)]",
  accent: "drop-shadow-[0_0_8px_hsl(320,100%,60%)]",
};

const variantTextColors = {
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  accent: "text-accent",
};

export function RadialGauge({
  value,
  max,
  label,
  unit = "",
  size = "md",
  variant = "primary",
  showValue = true,
  className,
}: RadialGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const config = sizeConfig[size];
  const radius = (config.width - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((animatedValue / max) * 100, 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: config.width, height: config.width }}>
        {/* Background ring */}
        <svg className="absolute inset-0 -rotate-90" viewBox={`0 0 ${config.width} ${config.width}`}>
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={config.stroke}
            className="opacity-30"
          />
        </svg>

        {/* Animated progress ring */}
        <svg
          className={cn("absolute inset-0 -rotate-90 transition-all duration-1000", variantGlows[variant])}
          viewBox={`0 0 ${config.width} ${config.width}`}
        >
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            className={cn(variantColors[variant], "transition-all duration-1000")}
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>

        {/* Center content */}
        {showValue && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("font-display font-bold", config.fontSize, variantTextColors[variant])}>
              {Math.round(animatedValue)}
            </span>
            {unit && <span className="text-xs text-muted-foreground uppercase tracking-wider">{unit}</span>}
          </div>
        )}
      </div>
      <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{label}</span>
    </div>
  );
}
