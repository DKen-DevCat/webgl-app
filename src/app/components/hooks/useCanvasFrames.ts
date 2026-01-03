"use client";

import { useState, useCallback } from "react";

/**
 * フレーム状態を管理するカスタムフック
 * 責務: ImageData配列の状態管理のみ
 */
export function useCanvasFrames() {
  const [frames, setFrames] = useState<ImageData[]>([]);

  const handleFramesCaptured = useCallback((capturedFrames: ImageData[]) => {
    setFrames(capturedFrames);
  }, []);

  const clearFrames = useCallback(() => {
    setFrames([]);
  }, []);

  return {
    frames,
    frameCount: frames.length,
    handleFramesCaptured,
    clearFrames,
  };
}

