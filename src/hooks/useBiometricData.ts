import { useState, useEffect } from "react";

interface BiometricData {
  // DESI metrics
  desiValue: number;
  pupilDiameter: number;
  blinkRate: number;
  reflexLatency: number;

  // MSRF metrics
  msrfValue: number;
  blueLightExposure: number;
  isNightMode: boolean;

  // Posture metrics
  tiltAngle: number;
  postureDuration: number;

  // Child detection
  isChildDetected: boolean;
  childConfidence: number;
  isDeviceLocked: boolean;

  // System metrics
  cameraFps: number;
  npuLoad: number;
  imuStatus: boolean;
}

// Simulates realistic biometric data fluctuations
function generateRealisticData(prev: BiometricData): BiometricData {
  const fluctuate = (value: number, min: number, max: number, variance: number) => {
    const change = (Math.random() - 0.5) * variance;
    return Math.max(min, Math.min(max, value + change));
  };

  const hour = new Date().getHours();
  const isNightTime = hour < 6 || hour > 20;

  return {
    desiValue: fluctuate(prev.desiValue, 10, 85, 5),
    pupilDiameter: fluctuate(prev.pupilDiameter, 2.5, 7, 0.3),
    blinkRate: fluctuate(prev.blinkRate, 6, 25, 2),
    reflexLatency: fluctuate(prev.reflexLatency, 150, 400, 20),

    msrfValue: fluctuate(prev.msrfValue, 20, 90, 4),
    blueLightExposure: fluctuate(prev.blueLightExposure, 30, 85, 3),
    isNightMode: isNightTime,

    tiltAngle: fluctuate(prev.tiltAngle, 15, 80, 8),
    postureDuration: prev.postureDuration + 1,

    isChildDetected: prev.isChildDetected,
    childConfidence: prev.isChildDetected 
      ? fluctuate(prev.childConfidence, 85, 98, 2)
      : fluctuate(prev.childConfidence, 5, 25, 3),
    isDeviceLocked: prev.isChildDetected && prev.childConfidence > 90,

    cameraFps: fluctuate(prev.cameraFps, 58, 62, 1),
    npuLoad: fluctuate(prev.npuLoad, 35, 75, 5),
    imuStatus: true,
  };
}

const initialData: BiometricData = {
  desiValue: 35,
  pupilDiameter: 4.2,
  blinkRate: 15,
  reflexLatency: 220,
  msrfValue: 45,
  blueLightExposure: 55,
  isNightMode: false,
  tiltAngle: 52,
  postureDuration: 0,
  isChildDetected: false,
  childConfidence: 12,
  isDeviceLocked: false,
  cameraFps: 60,
  npuLoad: 52,
  imuStatus: true,
};

export function useBiometricData() {
  const [data, setData] = useState<BiometricData>(initialData);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => generateRealisticData(prev));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleChildDetection = () => {
    setData(prev => ({
      ...prev,
      isChildDetected: !prev.isChildDetected,
      childConfidence: !prev.isChildDetected ? 92 : 15,
    }));
  };

  return { data, toggleChildDetection };
}
