import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ProgressBarProps {
  value: number;
  max: number;
  variant?: "primary" | "success" | "warning" | "accent";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const variantStyles = {
  primary: "bg-primary shadow-[0_0_10px_hsl(185,100%,50%,0.5)]",
  success: "bg-success shadow-[0_0_10px_hsl(150,100%,45%,0.5)]",
  warning: "bg-warning shadow-[0_0_10px_hsl(35,100%,55%,0.5)]",
  accent: "bg-accent shadow-[0_0_10px_hsl(320,100%,60%,0.5)]",
};

export function ProgressBar({
  value,
  max,
  variant = "primary",
  showLabel = true,
  label,
  className,
}: ProgressBarProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const percentage = Math.min((animatedValue / max) * 100, 100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className={cn("space-y-2", className)}>
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className="text-sm font-display font-semibold text-foreground">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-1000 ease-out", variantStyles[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
