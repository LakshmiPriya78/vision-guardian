import { useState, useCallback } from "react";
import { Eye, Brain, Scan, Loader2, AlertTriangle, CheckCircle, Activity } from "lucide-react";
import { CameraFeed } from "./CameraFeed";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface EyeScannerProps {
  eyeMetrics: {
    pupilDiameter: number;
    blinkRate: number;
    reflexLatency: number;
    desiScore: number;
    msrfLevel: number;
  };
  className?: string;
}

type AnalysisType = "ophthalmic" | "neurological";

export function EyeScanner({ eyeMetrics, className }: EyeScannerProps) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentFrame, setCurrentFrame] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [analysisType, setAnalysisType] = useState<AnalysisType>("ophthalmic");
  const { toast } = useToast();

  const handleFrame = useCallback((imageData: string) => {
    setCurrentFrame(imageData);
  }, []);

  const runAnalysis = async () => {
    if (!currentFrame) {
      toast({
        title: "No image captured",
        description: "Please wait for the camera to capture a frame.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const { data, error } = await supabase.functions.invoke("eye-analysis", {
        body: {
          imageBase64: currentFrame,
          eyeMetrics: {
            pupilDiameter: eyeMetrics.pupilDiameter,
            blinkRate: eyeMetrics.blinkRate,
            reflexLatency: eyeMetrics.reflexLatency,
            desiScore: eyeMetrics.desiScore,
            msrfLevel: eyeMetrics.msrfLevel,
          },
          analysisType,
        },
      });

      if (error) throw error;

      setAnalysis(data.analysis);
      toast({
        title: "Analysis Complete",
        description: `${analysisType === "ophthalmic" ? "Ophthalmic" : "Neurological"} assessment generated.`,
      });
    } catch (err: any) {
      console.error("Analysis error:", err);
      toast({
        title: "Analysis Failed",
        description: err.message || "Unable to complete analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className={cn("glass rounded-2xl p-6 border border-border/50", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Scan className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg tracking-wide">AI Eye Scanner</h2>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Ophthalmic & Neurological Analysis</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera section */}
        <div className="space-y-4">
          <CameraFeed
            isActive={isCameraActive}
            onFrame={handleFrame}
            className="aspect-[4/3] w-full"
          />

          <div className="flex gap-3">
            <Button
              variant={isCameraActive ? "destructive" : "default"}
              onClick={() => setIsCameraActive(!isCameraActive)}
              className="flex-1 gap-2"
            >
              {isCameraActive ? (
                <>
                  <Eye className="w-4 h-4" />
                  Stop Camera
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Start Camera
                </>
              )}
            </Button>
          </div>

          {/* Analysis type selector */}
          <div className="flex gap-2">
            <Button
              variant={analysisType === "ophthalmic" ? "default" : "outline"}
              size="sm"
              onClick={() => setAnalysisType("ophthalmic")}
              className="flex-1 gap-2"
            >
              <Eye className="w-4 h-4" />
              Ophthalmic
            </Button>
            <Button
              variant={analysisType === "neurological" ? "default" : "outline"}
              size="sm"
              onClick={() => setAnalysisType("neurological")}
              className="flex-1 gap-2"
            >
              <Brain className="w-4 h-4" />
              Neurological
            </Button>
          </div>

          <Button
            onClick={runAnalysis}
            disabled={!isCameraActive || !currentFrame || isAnalyzing}
            className="w-full gap-2"
            variant="default"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Activity className="w-4 h-4" />
                Run {analysisType === "ophthalmic" ? "Ophthalmic" : "Neurological"} Analysis
              </>
            )}
          </Button>
        </div>

        {/* Analysis results */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-secondary/30 border border-border/30 min-h-[300px] max-h-[500px] overflow-y-auto">
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="relative">
                  <Brain className="w-12 h-12 text-primary animate-pulse" />
                  <div className="absolute inset-0 w-12 h-12 bg-primary/30 blur-xl animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">AI Analysis in Progress</p>
                  <p className="text-xs text-muted-foreground">Processing biometric data...</p>
                </div>
              </div>
            ) : analysis ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-border/30">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="text-sm font-semibold text-success uppercase tracking-wider">
                    Analysis Complete
                  </span>
                </div>
                <div className="prose prose-invert prose-sm max-w-none">
                  <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                    {analysis}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <Scan className="w-12 h-12 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">No Analysis Yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Start the camera and click "Run Analysis" to begin
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className="p-3 rounded-lg bg-warning/10 border border-warning/30">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-warning">Disclaimer:</span> This AI analysis is for
                educational and informational purposes only. It is not a substitute for professional
                medical diagnosis. Please consult a healthcare provider for any health concerns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
