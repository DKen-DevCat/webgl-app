/**
 * useVideoExporterフックのテスト
 *
 * 仕様:
 * - 初期状態でisExportingがfalseであること
 * - exportToMP4が正しく動作すること
 * - フレームが空の場合はエクスポートが実行されないこと
 * - エクスポート中はisExportingがtrueになること
 */

import "@testing-library/jest-dom";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useVideoExporter } from "../useVideoExporter";

// FFmpegとutilをモック
jest.mock("@ffmpeg/ffmpeg", () => ({
  FFmpeg: jest.fn(),
}));

jest.mock("@ffmpeg/util", () => ({
  fetchFile: jest.fn(),
  toBlobURL: jest.fn(),
}));

// frameConverterをモック（jsdom環境ではCanvas APIが使えないため）
jest.mock("../utils/frameConverter", () => ({
  imageDataToBlob: jest
    .fn()
    .mockResolvedValue(new Blob(["test"], { type: "image/png" })),
  getFrameFileName: jest.fn(
    (i: number) => `frame_${i.toString().padStart(3, "0")}.png`
  ),
}));

// downloadFileをモック
jest.mock("../utils/downloadFile", () => ({
  downloadBlob: jest.fn(),
}));

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

const mockFFmpeg = {
  load: jest.fn(),
  writeFile: jest.fn(),
  exec: jest.fn(),
  readFile: jest.fn(),
  deleteFile: jest.fn(),
};

const mockFetchFile = fetchFile as jest.MockedFunction<typeof fetchFile>;
const mockToBlobURL = toBlobURL as jest.MockedFunction<typeof toBlobURL>;

beforeEach(() => {
  jest.clearAllMocks();
  (FFmpeg as jest.MockedClass<typeof FFmpeg>).mockImplementation(
    () => mockFFmpeg as any
  );
  mockToBlobURL.mockResolvedValue("blob:mock-url");
  mockFetchFile.mockResolvedValue(new Uint8Array());
  mockFFmpeg.load.mockResolvedValue(undefined);
  mockFFmpeg.writeFile.mockResolvedValue(undefined);
  mockFFmpeg.exec.mockResolvedValue(undefined);
  mockFFmpeg.readFile.mockResolvedValue(new Uint8Array([1, 2, 3]));
  mockFFmpeg.deleteFile.mockResolvedValue(undefined);

  // URL.createObjectURLとdocument.createElementをモック
  global.URL.createObjectURL = jest.fn(() => "blob:test-url");
  global.URL.revokeObjectURL = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("useVideoExporter", () => {
  describe("初期状態", () => {
    it("初期状態でisExportingがfalseであること", () => {
      // Given: フックを初期化
      // When: フックを実行
      const { result } = renderHook(() => useVideoExporter());

      // Then: isExportingがfalseである
      expect(result.current.isExporting).toBe(false);
      expect(result.current.exportToMP4).toBeDefined();
    });
  });

  describe("exportToMP4", () => {
    it("フレームが空の場合はエクスポートが実行されないこと", async () => {
      // Given: 空のフレーム配列
      const { result } = renderHook(() => useVideoExporter());

      // When: exportToMP4を呼ぶ
      await act(async () => {
        await result.current.exportToMP4([], 200, 200);
      });

      // Then: FFmpegのloadが呼ばれない
      expect(mockFFmpeg.load).not.toHaveBeenCalled();
      expect(result.current.isExporting).toBe(false);
    });

    it("フレームがある場合はエクスポートが実行されること", async () => {
      // Given: フレーム配列を準備
      const { result } = renderHook(() => useVideoExporter());
      const mockFrames = [
        new ImageData(new Uint8ClampedArray([255, 255, 255, 255]), 1, 1),
      ];

      // When: exportToMP4を呼ぶ
      await act(async () => {
        await result.current.exportToMP4(mockFrames, 200, 200);
      });

      // Then: FFmpegのloadが呼ばれる
      await waitFor(() => {
        expect(mockFFmpeg.load).toHaveBeenCalled();
      });
    });

    it("エクスポート中はisExportingがtrueになること", async () => {
      // Given: フレーム配列を準備
      const { result } = renderHook(() => useVideoExporter());
      const mockFrames = [
        new ImageData(new Uint8ClampedArray([255, 255, 255, 255]), 1, 1),
      ];

      // loadを遅延させる
      mockFFmpeg.load.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      // When: exportToMP4を呼ぶ（awaitしない）
      act(() => {
        result.current.exportToMP4(mockFrames, 200, 200);
      });

      // Then: isExportingがtrueになる
      await waitFor(() => {
        expect(result.current.isExporting).toBe(true);
      });
    });

    it("エクスポート完了後はisExportingがfalseになること", async () => {
      // Given: フレーム配列を準備
      const { result } = renderHook(() => useVideoExporter());
      const mockFrames = [
        new ImageData(new Uint8ClampedArray([255, 255, 255, 255]), 1, 1),
      ];

      // When: exportToMP4を呼ぶ
      await act(async () => {
        await result.current.exportToMP4(mockFrames, 200, 200);
      });

      // Then: isExportingがfalseになる
      await waitFor(() => {
        expect(result.current.isExporting).toBe(false);
      });
    });
  });
});
