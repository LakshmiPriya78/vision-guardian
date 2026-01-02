import { Header } from "@/components/Header";
import { DESIPanel } from "@/components/DESIPanel";
import { MSRFPanel } from "@/components/MSRFPanel";
import { PosturePanel } from "@/components/PosturePanel";
import { ChildProtectionPanel } from "@/components/ChildProtectionPanel";
import { SystemStatusBar } from "@/components/SystemStatusBar";
import { useBiometricData } from "@/hooks/useBiometricData";
import { Button } from "@/components/ui/button";
import { ToggleLeft, ToggleRight } from "lucide-react";

const Index = () => {
  const { data, toggleChildDetection } = useBiometricData();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-6 space-y-6">
        {/* System status bar */}
        <SystemStatusBar
          fps={Math.round(data.cameraFps)}
          npuLoad={Math.round(data.npuLoad)}
          imuStatus={data.imuStatus}
        />

        {/* Main panels grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DESIPanel
            desiValue={data.desiValue}
            pupilDiameter={data.pupilDiameter}
            blinkRate={Math.round(data.blinkRate)}
            reflexLatency={Math.round(data.reflexLatency)}
          />

          <MSRFPanel
            msrfValue={data.msrfValue}
            blueLightExposure={data.blueLightExposure}
            isNightMode={data.isNightMode}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PosturePanel
            tiltAngle={Math.round(data.tiltAngle)}
            duration={data.postureDuration}
          />

          <ChildProtectionPanel
            isChildDetected={data.isChildDetected}
            confidenceScore={Math.round(data.childConfidence)}
            isLocked={data.isDeviceLocked}
          />
        </div>

        {/* Demo controls */}
        <div className="glass rounded-xl p-4 border border-border/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Demo Controls</p>
              <p className="text-xs text-muted-foreground">Toggle states to preview different scenarios</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleChildDetection}
              className="gap-2"
            >
              {data.isChildDetected ? (
                <ToggleRight className="w-4 h-4 text-accent" />
              ) : (
                <ToggleLeft className="w-4 h-4" />
              )}
              Child Detection: {data.isChildDetected ? "ON" : "OFF"}
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="glass-strong border-t border-border/50 py-4">
        <div className="container">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-display tracking-wider">AEGIS BIOMETRIC SHIELD v1.0</span>
            <span>All processing performed locally • No data transmitted</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
