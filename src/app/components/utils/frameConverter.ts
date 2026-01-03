/**
 * ImageDataをBlobに変換するユーティリティ
 * 責務: ImageDataからPNG Blobへの変換
 */
export async function imageDataToBlob(
  imageData: ImageData,
  width: number,
  height: number
): Promise<Blob> {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext("2d");

  if (!tempCtx) {
    throw new Error("Failed to get 2D context");
  }

  tempCtx.putImageData(imageData, 0, 0);

  return new Promise<Blob>((resolve, reject) => {
    tempCanvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Failed to convert canvas to blob"));
      }
    }, "image/png");
  });
}

/**
 * フレーム番号からファイル名を生成
 * 責務: フレーム番号のフォーマット
 */
export function getFrameFileName(frameIndex: number): string {
  return `frame_${frameIndex.toString().padStart(3, "0")}.png`;
}

