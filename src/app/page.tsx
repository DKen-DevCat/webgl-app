"use client";

import CanvasRenderer, { useCanvasFrames } from "./components/CanvasRenderer";
import { useVideoExporter } from "./components/useVideoExporter";
import ExportButton from "./components/ExportButton";

export default function Page() {
  const { frames, handleFramesCaptured } = useCanvasFrames();
  const { exportToMP4, isExporting } = useVideoExporter();

  const handleExport = () => {
    exportToMP4(frames, 200, 200);
  };

  return (
    <div>
      <CanvasRenderer
        width={200}
        height={200}
        onFramesCaptured={handleFramesCaptured}
      />
      <ExportButton
        onClick={handleExport}
        disabled={isExporting || frames.length === 0}
        isExporting={isExporting}
      />
    </div>
  );
}
