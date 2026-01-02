import { useRef, useEffect, useState, useCallback } from "react";
import { Camera, CameraOff, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CameraFeedProps {
  onFrame?: (imageData: string) => void;
  onFaceDetected?: (detected: boolean, landmarks?: any) => void;
  isActive: boolean;
  className?: string;
}

export function CameraFeed({ onFrame, onFaceDetected, isActive, className }: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startCamera = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30 },
        },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setHasPermission(true);
    } catch (err: any) {
      console.error("Camera error:", err);
      setHasPermission(false);
      if (err.name === "NotAllowedError") {
        setError("Camera access denied. Please enable camera permissions.");
      } else if (err.name === "NotFoundError") {
        setError("No camera found on this device.");
      } else {
        setError("Unable to access camera. Please check your device.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    return canvas.toDataURL("image/jpeg", 0.8).split(",")[1];
  }, []);

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isActive, startCamera, stopCamera]);

  // Frame capture loop
  useEffect(() => {
    if (!isActive || !hasPermission || !onFrame) return;

    const interval = setInterval(() => {
      const frame = captureFrame();
      if (frame) {
        onFrame(frame);
      }
    }, 1000); // Capture every second

    return () => clearInterval(interval);
  }, [isActive, hasPermission, onFrame, captureFrame]);

  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-secondary/50", className)}>
      {/* Video feed */}
      <video
        ref={videoRef}
        className={cn(
          "w-full h-full object-cover scale-x-[-1]",
          !isActive || !hasPermission ? "opacity-0" : "opacity-100"
        )}
        playsInline
        muted
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Scanning overlay */}
      {isActive && hasPermission && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Scan line animation */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60 animate-scan" />
          
          {/* Corner brackets */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary" />
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary" />

          {/* Eye detection zone */}
          <div className="absolute top-1/4 left-1/4 right-1/4 h-1/4 border border-primary/30 rounded-lg">
            <div className="absolute inset-0 bg-primary/5" />
            <span className="absolute -top-6 left-0 text-xs text-primary uppercase tracking-wider">Eye Detection Zone</span>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-muted-foreground">Initializing camera...</span>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90">
          <div className="flex flex-col items-center gap-3 p-6 text-center">
            <AlertCircle className="w-10 h-10 text-destructive" />
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      )}

      {/* Inactive state */}
      {!isActive && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90">
          <div className="flex flex-col items-center gap-3">
            <CameraOff className="w-10 h-10 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Camera inactive</span>
          </div>
        </div>
      )}

      {/* Status indicator */}
      {isActive && hasPermission && (
        <div className="absolute top-3 right-3 flex items-center gap-2 px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-foreground font-medium">LIVE</span>
        </div>
      )}
    </div>
  );
}
