# Escape Atelier

React + TypeScript + Vite で作る、スマートフォン縦画面向けの静止画クリック型脱出ゲームシリーズです。

収録作品:

- Escape Atelier #001 音楽室からの脱出
- Escape Atelier #002 黄昏の温室からの脱出

## 起動

```bash
npm install
npm run dev
```

## ビルド・確認

```bash
npm run lint
npm run test
npm run build
```

## 作品選択

`src/app/SeriesApp.tsx` がシリーズ選択を担当します。第1作は既存の `GameProvider` と `App` をそのまま利用し、第2作は `GreenhouseProvider` と `GreenhouseApp` で独立して起動します。

セーブキーは分離しています。

- #001: `escape-atelier-001-save`
- #002: `escape-atelier-002-save`

## 第2作の構成

第2作のデータと進行処理は `src/games/escape-atelier-002` に集約しています。

- `data/gameConfig.ts`: 作品情報、保存キー、保存バージョン
- `data/scenes.ts`: 温室ホットスポットと調査画面
- `data/items.ts`: アイテム定義
- `data/puzzles.ts`: 謎の正解、純粋判定関数
- `data/hints.ts`: 3段階ヒント
- `data/story.ts`: プロローグとエンディング
- `state`: 第2作用 reducer、初期状態、localStorage 復旧処理
- `puzzles`: Phaser で動く操作パズル

## React と Phaser の責務

React はタイトル、プロローグ、探索、ホットスポット、インベントリ、設定、ヒント、色順入力、エンディング、保存を担当します。

Phaser は以下の操作系パズルだけで使用します。

- 水差しの破片をドラッグして修復
- 植木鉢をドラッグして並べ替え
- 鏡をタップして光を反射

共通ラッパーは `src/engine/phaser/PhaserPuzzle.tsx` です。Reactから初期状態を渡し、Phaserは `onStateChange` と `onComplete` で途中状態・完了状態をReactへ返します。Phaser内部だけに進行状態を保持しない方針です。

## Phaser パズルの追加方法

1. `src/games/<episode>/data/puzzles.ts` に正解と判定関数を追加します。
2. `src/games/<episode>/puzzles/<puzzle-name>/config.ts` に `PhaserPuzzleConfigFactory<TState>` を実装します。
3. React側で `<PhaserPuzzle />` を開き、`initialState`、`onCancel`、`onComplete` を接続します。
4. 完了時の報酬付与と `SOLVE_PUZZLE` はReact reducer経由で実行します。

## 第2作の素材差し替え

第2作の画像参照は `src/games/escape-atelier-002/data/imageAssets.ts` にまとめています。公開時は `public/assets/escape-atelier-002/` に以下のようなファイルを配置できます。

- `title-bg.webp`
- `greenhouse-main.webp`
- `greenhouse-tree.webp`
- `greenhouse-fountain.webp`
- `greenhouse-door-open.webp`
- `ending-bg.webp`

現状はCSSプレースホルダーとPhaser描画で進行できる仮実装です。画像が不足してもゲーム進行は停止しません。

音声は第1作の `src/services/audioService.ts` の設計を再利用可能です。第2作用の音源名は後から `bgm-greenhouse-title.mp3`、`se-mirror-turn.mp3` などを追加する想定です。現状は未配置でも停止しません。

## 正解・ホットスポット調整

- 花の色順: `src/games/escape-atelier-002/data/puzzles.ts` の `flowerColorAnswer`
- 植木鉢: `correctPotOrder`
- 鏡角度: `mirrorDefinitions`
- ホットスポット: `src/games/escape-atelier-002/data/scenes.ts` の `greenhouseHotspots`

ホットスポット座標は画像全体に対するパーセント指定です。`VITE_DEBUG_HOTSPOTS=true` を使うとデバッグ表示を足しやすい構成です。

## セーブデータのバージョン管理

第2作の保存バージョンは `GREENHOUSE_SAVE_VERSION` で管理します。不正なJSON、古いバージョン、不明なIDは `state/saveService.ts` で初期状態へ復旧します。

保存対象には、現在シーン、インベントリ、使用済みアイテム、調査済みポイント、解決済みパズル、フラグ、各Phaserパズルの途中状態、ヒント閲覧、設定、クリア状態を含みます。

## GitHub Pages

Vite の `base` は既存どおり環境変数で切り替えます。

```bash
VITE_BASE_PATH=/repository-name/ npm run build
```

外部ルーターに依存しない単一ページ構成なので、公開環境でのリロード404を避けやすい形です。

## 既知の制約

- 第2作の背景・アイテム画像は仮表示です。
- 第2作の音源ファイルは未配置です。
- Phaserパズルは初回実装として成立性を優先し、演出は控えめです。
- 実機スマートフォンでは、ドラッグ時の指の隠れ方と縦画面でのキャンバス高さを追加確認してください。
