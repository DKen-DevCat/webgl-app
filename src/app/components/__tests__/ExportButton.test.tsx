/**
 * ExportButtonコンポーネントのテスト
 *
 * 仕様:
 * - ボタンが正しく表示されること
 * - クリック時にonClickが呼ばれること
 * - disabledプロパティが正しく機能すること
 * - isExportingプロパティに応じてテキストが変わること
 */

import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import ExportButton from "../ExportButton";

describe("ExportButton", () => {
  describe("ボタンの表示", () => {
    it("通常状態で「MP4動画をエクスポート」と表示されること", () => {
      // Given: 通常状態のボタン
      const onClick = jest.fn();

      // When: コンポーネントをレンダリング
      render(
        <ExportButton onClick={onClick} disabled={false} isExporting={false} />
      );

      // Then: 「MP4動画をエクスポート」と表示される
      expect(screen.getByText("MP4動画をエクスポート")).toBeInTheDocument();
    });

    it("エクスポート中は「エクスポート中...」と表示されること", () => {
      // Given: エクスポート中のボタン
      const onClick = jest.fn();

      // When: コンポーネントをレンダリング
      render(
        <ExportButton onClick={onClick} disabled={false} isExporting={true} />
      );

      // Then: 「エクスポート中...」と表示される
      expect(screen.getByText("エクスポート中...")).toBeInTheDocument();
    });
  });

  describe("ボタンのクリック", () => {
    it("クリック時にonClickが呼ばれること", () => {
      // Given: onClickハンドラをモック
      const onClick = jest.fn();

      // When: ボタンをクリック
      render(
        <ExportButton onClick={onClick} disabled={false} isExporting={false} />
      );

      const button = screen.getByText("MP4動画をエクスポート");
      fireEvent.click(button);

      // Then: onClickが1回呼ばれる
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("disabledがtrueの場合はクリックできないこと", () => {
      // Given: disabledがtrueのボタン
      const onClick = jest.fn();

      // When: ボタンをクリックしようとする
      render(
        <ExportButton onClick={onClick} disabled={true} isExporting={false} />
      );

      const button = screen.getByText("MP4動画をエクスポート");
      fireEvent.click(button);

      // Then: onClickが呼ばれない
      expect(onClick).not.toHaveBeenCalled();
      expect(button).toBeDisabled();
    });
  });

  describe("ボタンのスタイル", () => {
    it("disabledがtrueの場合はopacityが0.5になること", () => {
      // Given: disabledがtrueのボタン
      const onClick = jest.fn();

      // When: コンポーネントをレンダリング
      render(
        <ExportButton onClick={onClick} disabled={true} isExporting={false} />
      );

      // Then: opacityが0.5になる
      const button = screen.getByText("MP4動画をエクスポート");
      expect(button).toHaveStyle({ opacity: "0.5" });
    });

    it("disabledがfalseの場合はopacityが1になること", () => {
      // Given: disabledがfalseのボタン
      const onClick = jest.fn();

      // When: コンポーネントをレンダリング
      render(
        <ExportButton onClick={onClick} disabled={false} isExporting={false} />
      );

      // Then: opacityが1になる
      const button = screen.getByText("MP4動画をエクスポート");
      expect(button).toHaveStyle({ opacity: "1" });
    });
  });
});
