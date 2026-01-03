# テストについて

このプロジェクトでは、t-wada のテスト手法を参考に、各機能が正しく動作することを確認するテストを作成しています。

## テストの構成

### 単体テスト

- **`src/app/components/__tests__/ExportButton.test.tsx`**

  - ExportButton コンポーネントのテスト
  - ボタンの表示、クリック、disabled 状態のテスト

- **`src/app/components/__tests__/useCanvasFrames.test.tsx`**

  - useCanvasFrames フックのテスト
  - フレーム状態管理のテスト

- **`src/app/components/__tests__/CanvasRenderer.test.tsx`**

  - CanvasRenderer コンポーネントのテスト
  - Canvas 描画とフレームキャプチャのテスト

- **`src/app/components/__tests__/useVideoExporter.test.ts`**
  - useVideoExporter フックのテスト
  - MP4 エクスポート機能のテスト

### 統合テスト

- **`src/app/__tests__/page.test.tsx`**
  - Page コンポーネントの統合テスト
  - 各コンポーネントの連携テスト

## テストの実行方法

```bash
# すべてのテストを実行
npm test

# ウォッチモードで実行
npm run test:watch

# カバレッジレポートを生成
npm run test:coverage
```

## テストの原則（t-wada の手法を参考）

1. **テストは仕様書として機能する**

   - テスト名で何をテストしているか明確に
   - Given-When-Then パターンを使用

2. **テストは読みやすく、理解しやすい**

   - コメントで仕様を明記
   - テストケースごとに独立した説明

3. **テストは独立している**

   - 各テストは独立して実行可能
   - テスト間で状態を共有しない

4. **テストは高速に実行できる**

   - モックを適切に使用
   - 非同期処理は適切に待機

5. **テストは保守しやすい**
   - テストヘルパー関数を使用
   - 重複を避ける

## 注意事項

- Canvas API のテストにはモックを使用しています
- FFmpeg のテストにはモックを使用しています（実際の FFmpeg は実行されません）
- ブラウザ環境が必要なテストは jsdom 環境で実行されます
