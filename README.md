# webgl-app

Canvas 上でフレーム（`ImageData[]`）を生成し、`ffmpeg.wasm`（`@ffmpeg/ffmpeg`）で **MP4 にエクスポートしてダウンロード**する Next.js アプリです。

## 機能

- **Canvas 描画 → フレーム生成**: `CanvasRenderer` が `generateFrames()` を呼び、フレーム配列を生成
- **MP4 エクスポート**: `useVideoExporter` がフレームを PNG 化して ffmpeg に投入し、`output.mp4` を生成してダウンロード
- **テスト**: Jest + Testing Library（Canvas/FFmpeg はモック）

## 動作イメージ（処理フロー）

1. `CanvasRenderer` が Canvas へ図形を描画（デフォルトは「円が右に移動」）
2. 各フレームで `ctx.getImageData()` を取得し `ImageData[]` を作る
3. `useVideoExporter.exportToMP4()` が `ImageData` を一旦 PNG Blob に変換して ffmpeg の仮想 FS に保存
4. ffmpeg を実行して `output.mp4` を生成
5. `output.mp4` を `Blob` として読み出し、ブラウザでダウンロード

## セットアップ

```bash
npm install
```

## 開発起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開き、**「MP4 動画をエクスポート」**をクリックします。

### Turbopack / Webpack について

Next.js 16 では Turbopack がデフォルトですが、`@ffmpeg/ffmpeg` は環境によって **「Cannot find module as expression is too dynamic」** で失敗することがあります。

その場合は、まず Webpack モードでの起動を試してください：

```bash
npm run dev -- --webpack
```

## 仕様（現状のデフォルト）

- **Canvas サイズ**: 200x200（`src/app/page.tsx`）
- **フレーム数**: 10（`DEFAULT_FRAME_CONFIG.frameCount`）
- **動画生成コマンド**: `-framerate 1` で `frame_%03d.png` を入力し、H.264 + `yuv420p` で `output.mp4` を生成
- **FFmpeg core 読み込み**: CDN（unpkg）から `@ffmpeg/core@0.12.6` をロード

## 重要: Cross-Origin Isolation（COOP/COEP）

`ffmpeg.wasm` が `SharedArrayBuffer` を使うため、**Cross-Origin Isolation** が必要です。

このリポジトリでは `next.config.ts` で以下ヘッダーを全ルートに付与しています：

- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`

※ Vercel 等にデプロイする場合も、同様のヘッダーが返ることを確認してください（プロキシ/CDN を挟む場合に欠けやすいです）。

## ディレクトリ構成（主要ファイル）

- `src/app/page.tsx`: 画面。`CanvasRenderer` + `ExportButton` を組み立て
- `src/app/components/CanvasRenderer.tsx`: Canvas を描画して `ImageData[]` を生成（`willReadFrequently: true`）
- `src/app/components/hooks/useFrameGenerator.ts`: フレーム生成ロジック（描画 →`getImageData`）
- `src/app/components/hooks/useCanvasFrames.ts`: フレーム配列の状態管理
- `src/app/components/useVideoExporter.ts`: ffmpeg ロード・PNG 書き込み・MP4 生成・ダウンロード・クリーンアップ
- `src/app/components/utils/frameConverter.ts`: `ImageData -> PNG Blob` / `frame_%03d.png` 命名
- `src/app/components/utils/downloadFile.ts`: `Blob` ダウンロード

## テスト

```bash
npm test
```

- テスト方針や一覧は `TEST_README.md` を参照してください
- jsdom 環境で `ImageData` が無い場合に備えて `jest.setup.js` で簡易実装を注入しています

## 技術スタック

- **Next.js** 16（App Router）
- **React** 19
- **TypeScript**
- **ffmpeg.wasm**: `@ffmpeg/ffmpeg`, `@ffmpeg/util`
- **Jest / Testing Library**

## 参考リンク

- Next.js: [Next.js Documentation](https://nextjs.org/docs)
- FFmpeg.wasm: `@ffmpeg/ffmpeg`（パッケージの README / examples を参照）
