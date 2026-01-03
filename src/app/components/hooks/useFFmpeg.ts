"use client";

import { useRef, useState, useCallback } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

const FFMPEG_BASE_URL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";

/**
 * FFmpegのロードと管理を行うカスタムフック
 * 責務: FFmpegインスタンスのライフサイクル管理
 */
export function useFFmpeg() {
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const load = useCallback(async (): Promise<FFmpeg> => {
    if (ffmpegRef.current && isLoaded) {
      return ffmpegRef.current;
    }

    setIsLoading(true);
    const ffmpeg = new FFmpeg();
    ffmpegRef.current = ffmpeg;

    try {
      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${FFMPEG_BASE_URL}/ffmpeg-core.js`,
          "text/javascript"
        ),
        wasmURL: await toBlobURL(
          `${FFMPEG_BASE_URL}/ffmpeg-core.wasm`,
          "application/wasm"
        ),
      });
      setIsLoaded(true);
      return ffmpeg;
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded]);

  const getFFmpeg = useCallback(() => ffmpegRef.current, []);

  return {
    load,
    getFFmpeg,
    isLoaded,
    isLoading,
  };
}

