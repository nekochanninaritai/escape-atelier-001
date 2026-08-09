# Escape Atelier

React + TypeScript + Vite + Phaser 3 で実装する、スマートフォン縦画面向けの静止画クリック型脱出ゲームシリーズです。

収録作品:

- Escape Atelier #001 音楽室からの脱出
- Escape Atelier #002 黄昏の温室からの脱出
- Escape Atelier #003 星降る天文台からの脱出
- Escape Atelier #004 忘れられた書斎からの脱出

## 起動

```bash
npm install
npm run dev
```

## 確認

```bash
npm run lint
npm run test
npm run build
```

## 作品選択とセーブ

`src/app/SeriesApp.tsx` がシリーズ選択画面です。#001 は既存の `GameProvider`、#002 は `GreenhouseProvider`、#003 は `ObservatoryProvider` で独立して起動します。

作品別セーブキー:

- #001: `escape-atelier-001-save`
- #002: `escape-atelier-002-save`
- #003: `escape-atelier-003-save`
- #004: `escape-atelier-004-save`

#003 のセーブバージョンは `src/games/escape-atelier-003/data/gameConfig.ts` の `OBSERVATORY_SAVE_VERSION` で管理します。破損 JSON、旧バージョン、不正な area/scene/item/star/rotation/globe position は `state/saveService.ts` で初期値へ復旧します。

## 第3作の概要

Escape Atelier #003 星降る天文台からの脱出は、洋館最上階の天文台を舞台にした 2階層探索型の脱出ゲームです。下階には望遠鏡、天球儀、星時計、机、星座図、月の模型、螺旋階段があり、上階には天窓、観測用の小窓、星時計上部機構があります。

基本フロー:

1. 星座盤の破片を3つ集める
2. Phaser の星座盤修復パズルで修復した星座盤を得る
3. React の月相パズルで真鍮の歯車を得る
4. 歯車を星時計へ取り付ける
5. Phaser の天球儀パズルで望遠鏡を解禁し、小さなレンズを得る
6. レンズを望遠鏡へ取り付ける
7. Phaser の望遠鏡パズルで3つの星を観測し、星の記録紙を得る
8. Phaser の星座線パズルで星時計を起動する
9. React の時刻入力で夜明けの鍵を得る
10. 夜明けの鍵で天窓を開き、エンディングへ進む

## 第3作の構成

第3作は `src/games/escape-atelier-003` に閉じています。

- `data/gameConfig.ts`: 作品情報、セーブキー、セーブバージョン
- `data/scenes.ts`: 下階/上階ホットスポット、拡大シーン文言
- `data/items.ts`: アイテム定義
- `data/puzzles.ts`: 月相、天球儀、星座盤、最終時刻の正解データと判定関数
- `data/stars.ts`: 星の座標、観測対象、星座線の正解順
- `data/hints.ts`: 進行状況に応じて出す3段階ヒント
- `data/imageAssets.ts`: 画像パス
- `state`: 初期状態、reducer、localStorage 復旧
- `puzzles`: Phaser パズル4種
- `ObservatoryApp.tsx`: React 側の探索、インベントリ、物語、時刻入力、エンディング

## React と Phaser の責務

React が担当:

- 作品選択、タイトル、プロローグ、エンディング
- 下階/上階探索、シーン切り替え、インベントリ
- アイテム取得/使用、調査メッセージ、ヒント、設定
- 月の満ち欠け、星時計表示、最終時刻入力
- ゲーム全体の状態管理と localStorage 保存

Phaser が担当:

- 星座盤のドラッグと90度回転
- 天球儀の左右回転
- 望遠鏡の視界移動と照準
- 星同士を順番に結ぶ操作

共通ラッパーは `src/engine/phaser/PhaserPuzzle.tsx` です。React が保存済み状態を `initialState` として渡し、Phaser は `onStateChange` と `onComplete` で途中状態と完了状態を React へ返します。進行フラグや報酬付与は React reducer 側だけで行います。

## 第3作パズルデータの変更

- 月相正解: `src/games/escape-atelier-003/data/puzzles.ts` の `moonPhaseOrder`
- 天球儀正解位置: `correctGlobePosition`
- 最終時刻: `dawnTimeAnswer`
- 星の位置: `src/games/escape-atelier-003/data/stars.ts` の `telescopeStars`
- 観測対象: `requiredObservedStarIds`
- 星座線順序: `correctConstellationOrder`
- 星座盤の正解スロット/角度: `plateTargets`

判定ロジックは同じファイルの純粋関数として分離しており、Vitest で確認しています。

## 画像と音声の差し替え

第3作の画像参照は `src/games/escape-atelier-003/data/imageAssets.ts` にまとめています。公開時は `public/assets/escape-atelier-003/` に以下のような WebP を置いてください。未配置でも `GameImage` のフォールバックと CSS 背景でゲーム進行は止まりません。

- `title-bg.webp`
- `observatory-lower-main.webp`
- `observatory-upper-main.webp`
- `observatory-telescope.webp`
- `observatory-celestial-globe.webp`
- `observatory-star-clock.webp`
- `observatory-skylight-open.webp`
- `ending-bg.webp`
- `item-plate-piece-01.webp` などのアイテム画像

現状、第3作の音声ファイルは参照実装を追加していません。既存の音声管理を使う場合は、BGM/SE 名を作品データへ追加し、ファイル未配置時に失敗しない既存方針に合わせてください。

## GitHub Pages

Vite の `base` は既存通り `VITE_BASE_PATH` で切り替えます。

```bash
VITE_BASE_PATH=/repository-name/ npm run build
```

外部ルーターに依存しない単一ページ構成なので、公開環境でのリロード 404 を避けやすい構成です。第3作の素材パスも `import.meta.env.BASE_URL` を通すため、GitHub Pages の base に追従します。

## 第4作以降への流用

#003 の構成をテンプレートにして、作品フォルダ内に `data`、`state`、`puzzles`、`<Episode>App.tsx` を追加してください。共通側へ追加するのは `SeriesApp.tsx` の登録だけにすると、既存作品のセーブや進行を壊しにくくなります。

## 既知の制約

- 第3作の背景、アイテム、音声は仮素材前提です。
- Phaser パズルは図形描画で成立するようにしており、演出は控えめです。
- 実機スマートフォンでは、320px 幅、ドラッグ中スクロール、タップ対象サイズ、長文表示、画面回転を追加確認してください。
- build 時に Phaser の静的 import によるチャンクサイズ警告が出ます。既存の第2作も同じ構成で Phaser を静的 import しているため、今回は挙動維持を優先しています。

## Escape Atelier #004

`src/games/escape-atelier-004` に「忘れられた書斎からの脱出」を実装しています。テーマは本・記憶、想定プレイ時間は 40-60 分、難易度は 4 / 5 です。

- save key: `escape-atelier-004-save`
- save version: `STUDY_SAVE_VERSION`
- canonical scenes: `study-main`, `exit-door` など
- canonical puzzles: `diary-repair`, `globe`, `typewriter`, `overlay-paper`, `bookshelf`, `portrait-time`
- shared systems: inventory, item combine/use rules, notebook, investigation log, Phaser puzzle API

基本フロー:

1. 日記の破れたページを3枚集め、本棚で Phaser の日記復元パズルを解く
2. 封蝋された手紙を暖炉で温め、ペーパーナイフで開封する
3. 手紙の方角に従って Phaser の地球儀パズルを解く
4. インクリボンをタイプライターへ戻し、暗号表から得た言葉を入力する
5. タイプライターの紙と半透明の紙を Phaser の重ね合わせパズルで合わせる
6. BOOK / PAGE の手掛かりで本棚を開き、肖像画の時刻を得る
7. 肖像画の時刻を合わせて書斎の鍵を入手し、出口の扉を開ける

保存データは `normalizeStudyState` で旧 ID や壊れた値を安全な初期値へ補正します。#004 の背景・アイテム WebP と短い WAV BGM/SE は `public/assets/escape-atelier-004/` に配置しています。謎の答えは画像へ焼き込まず、`src/games/escape-atelier-004/data/puzzles.ts` を正として管理します。

関連 docs:

- `docs/escape-atelier-004-architecture.md`
- `docs/escape-atelier-004-image-prompts.md`
- `docs/escape-atelier-004-audio-assets.md`
- `docs/escape-atelier-004-release-checklist.md`
- `docs/puzzle-api.md`

第5作以降を追加する場合は、#004 の `data/puzzles.ts` に相当する正解データと純粋関数、`state/saveService.ts` の normalize、`studyDataIntegrity.test.ts` 型の参照整合性テストを先に作ると、進行不能を早く検知できます。
