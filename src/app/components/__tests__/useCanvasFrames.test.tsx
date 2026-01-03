/**
 * useCanvasFramesフックのテスト
 * 
 * 仕様:
 * - 初期状態でframesが空配列であること
 * - handleFramesCapturedを呼ぶとframesが更新されること
 */

import { renderHook, act } from '@testing-library/react';
import { useCanvasFrames } from '../CanvasRenderer';

describe('useCanvasFrames', () => {
  describe('初期状態', () => {
    it('初期状態でframesが空配列であること', () => {
      // Given: フックを初期化
      // When: フックを実行
      const { result } = renderHook(() => useCanvasFrames());
      
      // Then: framesが空配列である
      expect(result.current.frames).toEqual([]);
      expect(result.current.handleFramesCaptured).toBeDefined();
    });
  });

  describe('フレームのキャプチャ', () => {
    it('handleFramesCapturedを呼ぶとframesが更新されること', () => {
      // Given: フックを初期化
      const { result } = renderHook(() => useCanvasFrames());
      
      // When: handleFramesCapturedを呼ぶ
      const mockFrames = [
        new ImageData(new Uint8ClampedArray([255, 255, 255, 255]), 1, 1),
        new ImageData(new Uint8ClampedArray([0, 0, 0, 255]), 1, 1),
      ];
      
      act(() => {
        result.current.handleFramesCaptured(mockFrames);
      });
      
      // Then: framesが更新される
      expect(result.current.frames).toEqual(mockFrames);
      expect(result.current.frames).toHaveLength(2);
    });

    it('複数回handleFramesCapturedを呼ぶとframesが更新されること', () => {
      // Given: フックを初期化
      const { result } = renderHook(() => useCanvasFrames());
      
      // When: handleFramesCapturedを複数回呼ぶ
      const firstFrames = [
        new ImageData(new Uint8ClampedArray([255, 255, 255, 255]), 1, 1),
      ];
      const secondFrames = [
        new ImageData(new Uint8ClampedArray([0, 0, 0, 255]), 1, 1),
        new ImageData(new Uint8ClampedArray([128, 128, 128, 255]), 1, 1),
      ];
      
      act(() => {
        result.current.handleFramesCaptured(firstFrames);
      });
      
      act(() => {
        result.current.handleFramesCaptured(secondFrames);
      });
      
      // Then: 最後に設定したframesが保持される
      expect(result.current.frames).toEqual(secondFrames);
      expect(result.current.frames).toHaveLength(2);
    });
  });
});

