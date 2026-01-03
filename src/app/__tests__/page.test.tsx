/**
 * Pageコンポーネントの統合テスト
 * 
 * 仕様:
 * - CanvasRendererとExportButtonが正しくレンダリングされること
 * - フレームがキャプチャされた後にエクスポートボタンが有効になること
 * - エクスポート機能が正しく動作すること
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Page from '../page';

// コンポーネントをモック
jest.mock('../components/CanvasRenderer', () => {
  const actual = jest.requireActual('../components/CanvasRenderer');
  return {
    ...actual,
    __esModule: true,
    default: jest.fn(({ onFramesCaptured }) => {
      // モックフレームを生成
      const mockFrames = [
        new ImageData(new Uint8ClampedArray([255, 255, 255, 255]), 1, 1),
        new ImageData(new Uint8ClampedArray([0, 0, 0, 255]), 1, 1),
      ];
      
      // レンダリング後にonFramesCapturedを呼ぶ
      setTimeout(() => {
        onFramesCaptured?.(mockFrames);
      }, 0);
      
      return <canvas data-testid="canvas" width={200} height={200} />;
    }),
  };
});

jest.mock('../components/useVideoExporter', () => ({
  useVideoExporter: jest.fn(() => ({
    exportToMP4: jest.fn(),
    isExporting: false,
  })),
}));

import { useVideoExporter } from '../components/useVideoExporter';

const mockUseVideoExporter = useVideoExporter as jest.MockedFunction<typeof useVideoExporter>;

describe('Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseVideoExporter.mockReturnValue({
      exportToMP4: jest.fn(),
      isExporting: false,
    });
  });

  describe('コンポーネントのレンダリング', () => {
    it('CanvasRendererがレンダリングされること', () => {
      // Given: ページコンポーネントを準備
      // When: コンポーネントをレンダリング
      render(<Page />);
      
      // Then: Canvasが表示される
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('ExportButtonがレンダリングされること', async () => {
      // Given: ページコンポーネントを準備
      // When: コンポーネントをレンダリング
      render(<Page />);
      
      // Then: エクスポートボタンが表示される
      await waitFor(() => {
        expect(screen.getByText('MP4動画をエクスポート')).toBeInTheDocument();
      });
    });
  });

  describe('フレームキャプチャとエクスポート', () => {
    it('フレームがキャプチャされた後にエクスポートボタンが有効になること', async () => {
      // Given: ページコンポーネントを準備
      const mockExportToMP4 = jest.fn();
      mockUseVideoExporter.mockReturnValue({
        exportToMP4: mockExportToMP4,
        isExporting: false,
      });
      
      // When: コンポーネントをレンダリング
      render(<Page />);
      
      // Then: フレームがキャプチャされた後、ボタンが有効になる
      await waitFor(() => {
        const button = screen.getByText('MP4動画をエクスポート');
        expect(button).not.toBeDisabled();
      });
    });

    it('エクスポートボタンをクリックするとexportToMP4が呼ばれること', async () => {
      // Given: ページコンポーネントを準備
      const user = userEvent.setup();
      const mockExportToMP4 = jest.fn();
      mockUseVideoExporter.mockReturnValue({
        exportToMP4: mockExportToMP4,
        isExporting: false,
      });
      
      render(<Page />);
      
      // When: エクスポートボタンをクリック
      await waitFor(async () => {
        const button = screen.getByText('MP4動画をエクスポート');
        await user.click(button);
      });
      
      // Then: exportToMP4が呼ばれる
      await waitFor(() => {
        expect(mockExportToMP4).toHaveBeenCalled();
      });
    });

    it('エクスポート中はボタンが無効になること', async () => {
      // Given: エクスポート中の状態
      const mockExportToMP4 = jest.fn();
      mockUseVideoExporter.mockReturnValue({
        exportToMP4: mockExportToMP4,
        isExporting: true,
      });
      
      // When: コンポーネントをレンダリング
      render(<Page />);
      
      // Then: ボタンが無効になる
      await waitFor(() => {
        const button = screen.getByText('エクスポート中...');
        expect(button).toBeDisabled();
      });
    });
  });

  describe('エクスポートパラメータ', () => {
    it('exportToMP4が正しいパラメータで呼ばれること', async () => {
      // Given: ページコンポーネントを準備
      const user = userEvent.setup();
      const mockExportToMP4 = jest.fn();
      mockUseVideoExporter.mockReturnValue({
        exportToMP4: mockExportToMP4,
        isExporting: false,
      });
      
      render(<Page />);
      
      // When: エクスポートボタンをクリック
      await waitFor(async () => {
        const button = screen.getByText('MP4動画をエクスポート');
        await user.click(button);
      });
      
      // Then: exportToMP4が正しいパラメータで呼ばれる
      await waitFor(() => {
        expect(mockExportToMP4).toHaveBeenCalledWith(
          expect.any(Array),
          200,
          200
        );
      });
    });
  });
});

