/**
 * useFrameGeneratorのテスト
 *
 * 仕様:
 * - generateFramesが正しい数のフレームを生成すること
 * - デフォルト設定で10個のフレームが生成されること
 * - カスタム設定が適用されること
 */

import {
  generateFrames,
  DEFAULT_FRAME_CONFIG,
  FrameGeneratorConfig,
} from "../useFrameGenerator";

// Canvasコンテキストをモック
const mockGetImageData = jest.fn();
const mockFillRect = jest.fn();
const mockBeginPath = jest.fn();
const mockArc = jest.fn();
const mockFill = jest.fn();

const mockCtx = {
  fillStyle: "",
  fillRect: mockFillRect,
  beginPath: mockBeginPath,
  arc: mockArc,
  fill: mockFill,
  getImageData: mockGetImageData,
} as unknown as CanvasRenderingContext2D;

beforeEach(() => {
  jest.clearAllMocks();
  mockGetImageData.mockImplementation((x, y, width, height) => {
    return new ImageData(new Uint8ClampedArray(width * height * 4), width, height);
  });
});

describe("generateFrames", () => {
  describe("フレーム生成", () => {
    it("デフォルト設定で10個のフレームが生成されること", () => {
      // Given: デフォルト設定
      // When: generateFramesを呼ぶ
      const frames = generateFrames(mockCtx, 200, 200);

      // Then: 10個のフレームが生成される
      expect(frames).toHaveLength(10);
    });

    it("カスタムframeCountで正しい数のフレームが生成されること", () => {
      // Given: カスタム設定
      const config: FrameGeneratorConfig = {
        ...DEFAULT_FRAME_CONFIG,
        frameCount: 5,
      };

      // When: generateFramesを呼ぶ
      const frames = generateFrames(mockCtx, 200, 200, config);

      // Then: 5個のフレームが生成される
      expect(frames).toHaveLength(5);
    });

    it("各フレームでgetImageDataが呼ばれること", () => {
      // Given: デフォルト設定
      // When: generateFramesを呼ぶ
      generateFrames(mockCtx, 200, 200);

      // Then: 10回getImageDataが呼ばれる
      expect(mockGetImageData).toHaveBeenCalledTimes(10);
    });
  });

  describe("描画処理", () => {
    it("各フレームで背景が描画されること", () => {
      // Given: デフォルト設定
      // When: generateFramesを呼ぶ
      generateFrames(mockCtx, 200, 200);

      // Then: 10回fillRectが呼ばれる（背景の塗りつぶし）
      expect(mockFillRect).toHaveBeenCalledTimes(10);
    });

    it("各フレームで円が描画されること", () => {
      // Given: デフォルト設定
      // When: generateFramesを呼ぶ
      generateFrames(mockCtx, 200, 200);

      // Then: 10回arcが呼ばれる（円の描画）
      expect(mockArc).toHaveBeenCalledTimes(10);
    });

    it("円のx座標がフレームごとに増加すること", () => {
      // Given: デフォルト設定
      // When: generateFramesを呼ぶ
      generateFrames(mockCtx, 200, 200);

      // Then: x座標が正しく計算される
      const arcCalls = mockArc.mock.calls;
      expect(arcCalls[0][0]).toBe(20); // frame 0: x = 20 + 0 * 15
      expect(arcCalls[1][0]).toBe(35); // frame 1: x = 20 + 1 * 15
      expect(arcCalls[9][0]).toBe(155); // frame 9: x = 20 + 9 * 15
    });
  });
});

