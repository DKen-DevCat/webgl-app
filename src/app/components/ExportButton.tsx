"use client";

interface ExportButtonProps {
  onClick: () => void;
  disabled: boolean;
  isExporting: boolean;
}

export default function ExportButton({
  onClick,
  disabled,
  isExporting,
}: ExportButtonProps) {
  return (
    <div style={{ marginTop: "16px" }}>
      <button
        onClick={onClick}
        disabled={disabled}
        style={{
          padding: "8px 16px",
          fontSize: "14px",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {isExporting ? "エクスポート中..." : "MP4動画をエクスポート"}
      </button>
    </div>
  );
}

