import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ffmpeg.wasmがSharedArrayBufferを使用するために必要なヘッダー
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
        ],
      },
    ];
  },
  // Turbopack を明示的に使用（Next.js 16のデフォルト）
  turbopack: {},
};

export default nextConfig;
