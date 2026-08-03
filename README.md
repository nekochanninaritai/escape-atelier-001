# Escape Atelier #001 音楽室からの脱出

React + TypeScript + Viteで作成した、スマートフォン縦画面向けの静止画クリック型脱出ゲームです。第2作以降で作品データを差し替えやすいよう、ゲーム進行ロジックと作品固有データを分離しています。

## 開発環境の起動

```bash
npm install
npm run dev
```

## ビルド

```bash
npm run build
```

## GitHub Pagesへの公開

Viteの`base`は環境変数で変更できます。リポジトリ名が`escape-atelier-001`の場合:

```bash
VITE_BASE_PATH=/escape-atelier-001/ npm run build
```

生成された`dist`をGitHub Pagesの公開対象にしてください。外部ルーティングは使わず、ゲーム状態で画面を切り替えるため、リロード時の404が起きにくい構成です。

## 画像の差し替え

画像は`src/assets/images`配下に置き、`src/data/imageAssets.ts`で一元管理します。コンポーネントへ画像パスを直接散在させないでください。

- `room-main.webp`
- `room-piano.webp`
- `room-clock.webp`
- `room-desk.webp`
- `room-bookshelf.webp`
- `room-music-box.webp`
- `room-door.webp`
- `item-sheet-piece-01.webp`
- `item-winding-key.webp`
- `item-completed-sheet.webp`
- `item-door-key.webp`

画像読み込みに失敗した場合は`GameImage`がCSSプレースホルダーへフォールバックするため、ゲーム進行は止まりません。

生成・変換プロンプトは`docs/image-prompts.md`と`assets/image-generation-prompts.md`に記録しています。画像を再生成した場合は、必要に応じて以下を実行してください。

```bash
node scripts/prepare-assets.mjs
```

## 音声の差し替え

`src/services/audioService.ts`の`audioFiles`に音声ファイルのパスをまとめています。`public/audio`に以下のようなファイルを置くと差し替えやすくなります。

- `bgm-title.mp3`
- `bgm-room.mp3`
- `bgm-ending.mp3`
- `se-tap.mp3`
- `se-item.mp3`
- `se-success.mp3`
- `se-fail.mp3`
- `se-door-open.mp3`

音源が存在しない場合も、再生失敗を握りつぶしてゲームは継続します。

## 謎の正解変更

`src/data/puzzles.ts`に3つの謎の正解を集約しています。

- 楽譜並べ替え: `sheetOrder.answer`
- 時計とオルゴール: `clockMusicBox.answer`
- ピアノ入力: `pianoMelody.answer`

ヒントは`src/data/hints.ts`、表示文は`src/data/messages.ts`で変更します。

## 調査ポイントの位置変更

音楽室全体の透明タップ領域は`src/data/scenes.ts`の`roomHotspots`で管理します。`x`、`y`、`width`、`height`は画像全体に対するパーセントです。開発中は`import.meta.env.DEV`により調査領域が可視化されます。

## セーブデータのバージョン管理

保存キーとバージョンは`src/data/gameConfig.ts`にあります。

- `SAVE_KEY`
- `SAVE_VERSION`

`SAVE_VERSION`を変更すると、古い保存データは安全に初期化されます。不正なJSONやlocalStorageが使えない環境でもゲームが止まらないようにしています。

## 第2作へ流用する方法

1. `src/data/gameConfig.ts`で作品名とエピソード番号を変更します。
2. `src/data/items.ts`でアイテムを差し替えます。
3. `src/data/puzzles.ts`で謎と正解を差し替えます。
4. `src/data/hints.ts`と`src/data/messages.ts`で物語とヒントを差し替えます。
5. `src/data/scenes.ts`で調査ポイントを差し替えます。
6. 必要に応じて`src/scenes/FocusScene.tsx`の各調査画面だけを作品用に調整します。

共通テンプレートとして維持したい処理は、`src/context`、`src/reducers`、`src/services`、`src/components`側へ寄せてください。
