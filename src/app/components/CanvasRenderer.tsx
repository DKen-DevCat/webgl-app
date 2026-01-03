"use client";

import { useEffect, useRef } from "react";
import {
  generateFrames,
  FrameGeneratorConfig,
  DEFAULT_FRAME_CONFIG,
} from "./hooks/useFrameGenerator";

/**
 * CanvasRendererのプロパティ
 */
interface CanvasRendererProps {
  width?: number;
  height?: number;
  frameConfig?: FrameGeneratorConfig;
  onFramesCaptured?: (frames: ImageData[]) => void;
}

/**
 * Canvasを表示し、フレームを生成するコンポーネント
 * 責務: Canvas要素のレンダリングとフレーム生成の実行
 */
export default function CanvasRenderer({
  width = 200,
  height = 200,
  frameConfig = DEFAULT_FRAME_CONFIG,
  onFramesCaptured,
}: CanvasRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const onFramesCapturedRef = useRef(onFramesCaptured);

  useEffect(() => {
    onFramesCapturedRef.current = onFramesCaptured;
  }, [onFramesCaptured]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const frameData = generateFrames(
      ctx,
      canvas.width,
      canvas.height,
      frameConfig
    );
    onFramesCapturedRef.current?.(frameData);
  }, [frameConfig]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ border: "1px solid #ccc" }}
    />
  );
}

// 後方互換性のためにuseCanvasFramesを再エクスポート
export { useCanvasFrames } from "./hooks/useCanvasFrames";
