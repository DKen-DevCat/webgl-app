"use client";

import { useState, useCallback } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { imageDataToBlob, getFrameFileName } from "./utils/frameConverter";
import { downloadBlob } from "./utils/downloadFile";

/**
 * FFmpegをロードする
 * 責務: FFmpegの初期化
 * 
 * 注意: umdビルドを使用して動的インポートの問題を回避
 */
async function loadFFmpeg(ffmpeg: FFmpeg): Promise<void> {
  console.log("Loading FFmpeg...");
  
  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
  
  try {
    await ffmpeg.load({
      coreURL: `${baseURL}/ffmpeg-core.js`,
      wasmURL: `${baseURL}/ffmpeg-core.wasm`,
    });
    console.log("FFmpeg loaded successfully");
  } catch (error) {
    console.error("FFmpeg load error:", error);
    throw error;
  }
}

/**
 * フレームをFFmpegに書き込む
 * 責務: ImageData配列をFFmpegファイルシステムに保存
 */
async function writeFramesToFFmpeg(
  ffmpeg: FFmpeg,
  frames: ImageData[],
  canvasWidth: number,
  canvasHeight: number
): Promise<void> {
  for (let i = 0; i < frames.length; i++) {
    const blob = await imageDataToBlob(frames[i], canvasWidth, canvasHeight);
    const frameFileName = getFrameFileName(i);
    await ffmpeg.writeFile(frameFileName, await fetchFile(blob));
  }
}

/**
 * MP4を生成する
 * 責務: ffmpegコマンドの実行
 */
async function generateMP4(ffmpeg: FFmpeg): Promise<void> {
  await ffmpeg.exec([
    "-framerate",
    "1",
    "-i",
    "frame_%03d.png",
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-y",
    "output.mp4",
  ]);
}

/**
 * 生成したファイルをダウンロードする
 * 責務: FFmpegからMP4を読み取りダウンロード
 */
async function downloadMP4(ffmpeg: FFmpeg, frameCount: number): Promise<void> {
  const data = await ffmpeg.readFile("output.mp4");
  const uint8Array =
    data instanceof Uint8Array ? data : new TextEncoder().encode(data);
  const blob = new Blob([uint8Array.buffer as ArrayBuffer], {
    type: "video/mp4",
  });
  downloadBlob(blob, `frames_${frameCount}_export.mp4`);
}

/**
 * 一時ファイルをクリーンアップする
 * 責務: FFmpegファイルシステムのクリーンアップ
 */
async function cleanupFiles(ffmpeg: FFmpeg, frameCount: number): Promise<void> {
  for (let i = 0; i < frameCount; i++) {
    const frameFileName = getFrameFileName(i);
    await ffmpeg.deleteFile(frameFileName);
  }
  await ffmpeg.deleteFile("output.mp4");
}

/**
 * 動画エクスポート機能を提供するカスタムフック
 * 責務: エクスポート状態の管理とエクスポート処理の実行
 */
export function useVideoExporter() {
  const [isExporting, setIsExporting] = useState(false);

  const exportToMP4 = useCallback(
    async (
      frames: ImageData[],
      canvasWidth: number,
      canvasHeight: number
    ): Promise<void> => {
      if (frames.length === 0) return;

      setIsExporting(true);
      const ffmpeg = new FFmpeg();

      try {
        await loadFFmpeg(ffmpeg);
        await writeFramesToFFmpeg(ffmpeg, frames, canvasWidth, canvasHeight);
        await generateMP4(ffmpeg);
        await downloadMP4(ffmpeg, frames.length);
        await cleanupFiles(ffmpeg, frames.length);
      } catch (error) {
        console.error("Export error:", error);
        alert("エクスポートに失敗しました");
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  return { exportToMP4, isExporting };
}
