import { Shield, Wifi, Battery, Signal } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="glass-strong sticky top-0 z-50 border-b border-border/50">
      <div className="container py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="w-8 h-8 text-primary" />
              <div className="absolute inset-0 w-8 h-8 bg-primary/30 blur-lg animate-pulse" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg tracking-wider text-foreground">AEGIS</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">Biometric Shield</p>
            </div>
          </div>

          {/* Status indicators */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Signal className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground">5G</span>
            </div>
            <div className="flex items-center gap-1">
              <Wifi className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-center gap-1">
              <Battery className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground">87%</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-medium text-success uppercase tracking-wider">Protected</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
