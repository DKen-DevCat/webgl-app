"use client";

/**
 * フレーム生成設定
 */
export interface FrameGeneratorConfig {
  frameCount: number;
  backgroundColor: string;
  circleColor: string;
  circleRadius: number;
  startX: number;
  stepX: number;
  y: number;
}

/**
 * デフォルトのフレーム生成設定
 */
export const DEFAULT_FRAME_CONFIG: FrameGeneratorConfig = {
  frameCount: 10,
  backgroundColor: "#ffffff",
  circleColor: "#000000",
  startX: 20,
  stepX: 15,
  y: 50,
  circleRadius: 20,
};

/**
 * フレームを生成する関数
 * 責務: Canvas上に図形を描画し、ImageDataを生成する
 */
export function generateFrames(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  config: FrameGeneratorConfig = DEFAULT_FRAME_CONFIG
): ImageData[] {
  const frameData: ImageData[] = [];

  for (let frame = 0; frame < config.frameCount; frame++) {
    // 背景を塗りつぶす
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 円を描画
    const x = config.startX + frame * config.stepX;
    ctx.fillStyle = config.circleColor;
    ctx.beginPath();
    ctx.arc(x, config.y, config.circleRadius, 0, Math.PI * 2);
    ctx.fill();

    // フレームデータをキャプチャ
    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    frameData.push(imageData);
  }

  return frameData;
}

