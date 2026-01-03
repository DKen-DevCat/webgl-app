/**
 * frameConverterユーティリティのテスト
 *
 * 仕様:
 * - getFrameFileNameが正しいファイル名を生成すること
 * - imageDataToBlobがBlobを生成すること
 */

import { getFrameFileName } from "../frameConverter";

describe("frameConverter", () => {
  describe("getFrameFileName", () => {
    it("フレーム番号0で'frame_000.png'を返すこと", () => {
      // Given: フレーム番号0
      // When: getFrameFileNameを呼ぶ
      const result = getFrameFileName(0);

      // Then: 正しいファイル名が返される
      expect(result).toBe("frame_000.png");
    });

    it("フレーム番号9で'frame_009.png'を返すこと", () => {
      // Given: フレーム番号9
      // When: getFrameFileNameを呼ぶ
      const result = getFrameFileName(9);

      // Then: 正しいファイル名が返される
      expect(result).toBe("frame_009.png");
    });

    it("フレーム番号99で'frame_099.png'を返すこと", () => {
      // Given: フレーム番号99
      // When: getFrameFileNameを呼ぶ
      const result = getFrameFileName(99);

      // Then: 正しいファイル名が返される
      expect(result).toBe("frame_099.png");
    });

    it("フレーム番号100で'frame_100.png'を返すこと", () => {
      // Given: フレーム番号100
      // When: getFrameFileNameを呼ぶ
      const result = getFrameFileName(100);

      // Then: 正しいファイル名が返される
      expect(result).toBe("frame_100.png");
    });
  });
});

