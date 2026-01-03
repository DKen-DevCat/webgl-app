/**
 * CanvasRendererコンポーネントのテスト
 *
 * 仕様:
 * - Canvas要素が正しくレンダリングされること
 * - widthとheightプロパティが正しく適用されること
 * - 描画後にonFramesCapturedが呼ばれること
 * - 10個のフレームが生成されること
 */

import { render, waitFor } from "@testing-library/react";
import CanvasRenderer from "../CanvasRenderer";

// CanvasのgetContextをモック
const mockGetContext = jest.fn();
const mockGetImageData = jest.fn();
const mockFillRect = jest.fn();
const mockBeginPath = jest.fn();
const mockArc = jest.fn();
const mockFill = jest.fn();

beforeEach(() => {
  // モック関数をリセット
  jest.clearAllMocks();

  mockGetContext.mockReturnValue({
    fillStyle: "",
    fillRect: mockFillRect,
    beginPath: mockBeginPath,
    arc: mockArc,
    fill: mockFill,
    getImageData: mockGetImageData,
  });

  // HTMLCanvasElement.prototype.getContextをモック
  jest
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockImplementation(mockGetContext);

  // ImageDataをモック
  mockGetImageData.mockImplementation((x, y, width, height) => {
    return new ImageData(
      new Uint8ClampedArray(width * height * 4),
      width,
      height
    );
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("CanvasRenderer", () => {
  describe("Canvas要素のレンダリング", () => {
    it("Canvas要素が正しくレンダリングされること", () => {
      // Given: コンポーネントを準備
      // When: コンポーネントをレンダリング
      const { container } = render(<CanvasRenderer />);

      // Then: Canvas要素が存在する
      const canvas = container.querySelector("canvas");
      expect(canvas).toBeInTheDocument();
    });

    it("デフォルトのwidthとheightが200であること", () => {
      // Given: デフォルトプロパティでコンポーネントを準備
      // When: コンポーネントをレンダリング
      const { container } = render(<CanvasRenderer />);

      // Then: widthとheightが200である
      const canvas = container.querySelector("canvas");
      expect(canvas).toHaveAttribute("width", "200");
      expect(canvas).toHaveAttribute("height", "200");
    });

    it("カスタムのwidthとheightが適用されること", () => {
      // Given: カスタムプロパティでコンポーネントを準備
      // When: コンポーネントをレンダリング
      const { container } = render(<CanvasRenderer width={300} height={400} />);

      // Then: カスタムのwidthとheightが適用される
      const canvas = container.querySelector("canvas");
      expect(canvas).toHaveAttribute("width", "300");
      expect(canvas).toHaveAttribute("height", "400");
    });

    it("スタイルが正しく適用されること", () => {
      // Given: コンポーネントを準備
      // When: コンポーネントをレンダリング
      const { container } = render(<CanvasRenderer />);

      // Then: スタイルが適用される
      const canvas = container.querySelector("canvas");
      expect(canvas).toHaveStyle({ border: "1px solid #ccc" });
    });
  });

  describe("フレームのキャプチャ", () => {
    it("描画後にonFramesCapturedが呼ばれること", async () => {
      // Given: onFramesCapturedコールバックをモック
      const onFramesCaptured = jest.fn();

      // When: コンポーネントをレンダリング
      render(<CanvasRenderer onFramesCaptured={onFramesCaptured} />);

      // Then: onFramesCapturedが呼ばれ、10個のフレームが渡される
      await waitFor(() => {
        expect(onFramesCaptured).toHaveBeenCalled();
        const capturedFrames = onFramesCaptured.mock.calls[0][0];
        expect(capturedFrames).toHaveLength(10);
      });
    });

    it("onFramesCapturedが未指定でもエラーが発生しないこと", async () => {
      // Given: onFramesCapturedを指定しない
      // When: コンポーネントをレンダリング
      // Then: エラーが発生しない
      expect(() => {
        render(<CanvasRenderer />);
      }).not.toThrow();
    });

    it("10個のフレームが生成されること", async () => {
      // Given: onFramesCapturedコールバックをモック
      const onFramesCaptured = jest.fn();

      // When: コンポーネントをレンダリング
      render(<CanvasRenderer onFramesCaptured={onFramesCaptured} />);

      // Then: 10回getImageDataが呼ばれる（10個のフレーム）
      await waitFor(() => {
        expect(mockGetImageData).toHaveBeenCalledTimes(10);
      });
    });
  });

  describe("Canvas描画の実行", () => {
    it("描画処理が正しく実行されること", async () => {
      // Given: コンポーネントを準備
      // When: コンポーネントをレンダリング
      render(<CanvasRenderer />);

      // Then: 描画メソッドが呼ばれる
      await waitFor(() => {
        expect(mockFillRect).toHaveBeenCalled();
        expect(mockBeginPath).toHaveBeenCalled();
        expect(mockArc).toHaveBeenCalled();
        expect(mockFill).toHaveBeenCalled();
      });
    });

    it("各フレームで円が描画されること", async () => {
      // Given: コンポーネントを準備
      // When: コンポーネントをレンダリング
      render(<CanvasRenderer />);

      // Then: 10回arcが呼ばれる（10個の円）
      await waitFor(() => {
        expect(mockArc).toHaveBeenCalledTimes(10);
      });

      // 各フレームでx座標が異なることを確認
      const arcCalls = mockArc.mock.calls;
      expect(arcCalls[0][0]).toBe(20); // frame 0: x = 20 + 0 * 15
      expect(arcCalls[1][0]).toBe(35); // frame 1: x = 20 + 1 * 15
      expect(arcCalls[9][0]).toBe(155); // frame 9: x = 20 + 9 * 15
    });
  });
});
