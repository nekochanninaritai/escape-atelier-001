# Escape Atelier #001 画像生成プロンプト

このファイルは、画像ファイルそのものを再生成できない場合や、差し替え用素材を外部ツールで制作する場合の指示書です。

## 共通アートディレクション

- 作品: `Escape Atelier #001 音楽室からの脱出`
- 形式: スマートフォン縦画面向け静止画クリック型脱出ゲーム
- 画風: 高品質なデジタルイラスト。写実寄りだが写真ではなく、上品なゲーム背景向け。
- 色: ダークウォールナット、セピア、アイボリー、アンティークゴールド、深いモスグリーン、暗めのネイビー、夕日のオレンジ。
- 光: 夕暮れの柔らかな斜光。埃が少し光る。暗く潰しすぎない。
- 雰囲気: 静かで温かい、少し不思議、怖すぎない。
- 禁止: 人物、人影、幽霊、血液、ホラー表現、現代家電、ロゴ、透かし、画像内UI文字、読ませる必要がある文字。
- 重要: 謎に必要な数字、音名、文章、時計記号、正解情報は画像へ焼き込まず、React/CSS/SVGで正確に重ねる。

## 推奨サイズ

- 背景・シーン画像: `1080 x 1920px`, 9:16, WebP
- 状態差分画像: `1080 x 1920px`, 9:16, WebP
- アイテム画像: `768 x 768px`, 背景透過WebPまたはPNG
- 謎用画像: 正方形は `768 x 768px`、横長が必要な場合は `1600 x 900px`

## 画像生成が必要な背景素材

### `title-bg.webp`

- 保存先: `src/assets/images/backgrounds/title-bg.webp`
- 用途: タイトル背景
- 推奨サイズ: `1080 x 1920px`
- 形式: WebP
- プロンプト:

```text
Create a title background for a mobile portrait escape game. The scene is an antique Western mansion music room at sunset, with ivory walls, dark walnut wood, moss green curtains, a dark walnut grand piano, bookshelf, pendulum clock, wooden desk with small music box, and one heavy exit door. Keep a generous clean negative space in the upper center for HTML title text. High-quality elegant digital game background illustration, warm antique palette, quiet and slightly mysterious but not horror. No people, no human shadows, no ghosts, no blood, no modern electronics, no logos, no watermark, no readable text, no UI.
```

### `room-main.webp`

- 保存先: `src/assets/images/scenes/room-main.webp`
- 用途: 音楽室全景、ホットスポット基準画像
- 推奨サイズ: `1080 x 1920px`
- 形式: WebP
- プロンプト:

```text
Create the base full-room image for a smartphone static point-and-click escape game. One antique Western mansion music room at sunset, ivory walls, dark walnut floor, moss green curtains, warm orange-gold sunset light from a window. Clearly include exactly six tappable objects with separation: an antique grand piano on the lower left, a tall bookshelf on the upper right wall, an antique wooden pendulum clock near the center wall, a wooden writing desk in the lower right-center, a small wooden music box on the desk, and one heavy dark brown exit door on the far right. Vertical 9:16 composition, standing eye-height camera, top and bottom safe space for UI. Elegant polished digital illustration, warm and readable, not horror. No people, no extra doors, no readable text, no logos, no watermark.
```

### `room-piano.webp`

- 保存先: `src/assets/images/scenes/room-piano.webp`
- 用途: ピアノ拡大
- 推奨サイズ: `1080 x 1920px`
- 形式: WebP
- プロンプト:

```text
Create a close-up of the same dark walnut grand piano from the antique sunset music room. Show plausible white and black keys, carved wood ornament, and music stand. Warm sunset reflections, ivory wallpaper and moss green curtain edge in the background. Vertical 9:16, piano fills the lower two-thirds, safe top and bottom margins for UI. No text, no logos, no watermark, no people, no horror, no broken keyboard structure.
```

### `room-bookshelf.webp`

- 保存先: `src/assets/images/scenes/room-bookshelf.webp`
- 用途: 本棚拡大
- 推奨サイズ: `1080 x 1920px`
- 形式: WebP
- プロンプト:

```text
Create a close-up of the same tall dark walnut bookshelf from the antique sunset music room. Old books without readable titles, carved top, warm sunset light, ivory wallpaper. Leave a small empty shelf area where a torn sheet music fragment could be found. Vertical 9:16, centered, safe UI margins. No readable text, no logos, no watermark, no people, no ghosts, no modern objects.
```

### `room-clock.webp`

- 保存先: `src/assets/images/scenes/room-clock.webp`
- 用途: 古時計拡大
- 推奨サイズ: `1080 x 1920px`
- 形式: WebP
- プロンプト:

```text
Create a close-up of the same antique dark walnut pendulum clock from the sunset music room. Brass pendulum, carved wooden case, clear blank circular clock face suitable for overlaying exact symbols with HTML or SVG. Ivory wallpaper and warm sunset light. Vertical 9:16, clock centered. Do not draw numbers, hands, random symbols, or readable text. No people, no horror, no logo, no watermark.
```

### `room-desk.webp`

- 保存先: `src/assets/images/scenes/room-desk.webp`
- 用途: 机拡大
- 推奨サイズ: `1080 x 1920px`
- 形式: WebP
- プロンプト:

```text
Create a close-up of the same dark walnut wooden writing desk from the antique sunset music room. Closed drawers with brass handles, old lamp, ink bottle, aged papers, and a small wooden music box on the desk. Leave a small space for a sheet music fragment. Warm sunset light, polished elegant game background. Vertical 9:16, safe UI margins. No readable text, no logos, no watermark, no people, no horror, no modern objects.
```

### `room-music-box.webp`

- 保存先: `src/assets/images/scenes/room-music-box.webp`
- 用途: オルゴール拡大
- 推奨サイズ: `1080 x 1920px`
- 形式: WebP
- プロンプト:

```text
Create a close-up of a small antique dark walnut wooden music box from the same sunset music room. Brass inlay, visible empty winding-key socket on the side, placed on the same wooden desk with aged paper nearby. Vertical 9:16, music box centered and tappable, safe UI margins. Closed or slightly ajar lid. No readable text, no random symbols, no logos, no watermark, no people, no horror, no modern objects.
```

### `room-door.webp`

- 保存先: `src/assets/images/scenes/room-door.webp`
- 用途: 扉拡大
- 推奨サイズ: `1080 x 1920px`
- 形式: WebP
- プロンプト:

```text
Create a close-up of the same heavy dark brown carved wooden exit door from the antique sunset music room. Antique gold handle and keyhole, ivory wallpaper, dark wood trim, warm light from inside the room. Vertical 9:16, door centered, keyhole and handle clear. Closed door only. Exactly one door. No readable text, no logos, no watermark, no people, no ghosts, no horror, no modern objects.
```

### `ending-bg.webp`

- 保存先: `src/assets/images/backgrounds/ending-bg.webp`
- 用途: エンディング背景
- 推奨サイズ: `1080 x 1920px`
- 形式: WebP
- プロンプト:

```text
Create an ending background from the same antique music room. The same heavy wooden exit door is open, warm sunset light pours into the music room, dust motes glow, piano and desk/music box are subtly visible. Peaceful, warm, uplifting sense of release. Vertical 9:16, space for ending text overlay. No people, no silhouettes, no ghosts, no blood, no horror, no logos, no watermark, no readable text.
```

## 画像生成が必要な状態差分素材

### `room-desk-open.webp`

- 保存先: `src/assets/images/states/room-desk-open.webp`
- 用途: 謎1解決後の机
- 推奨サイズ: `1080 x 1920px`
- 形式: WebP
- 差分条件: 引き出しだけ開く。引き出し内にオルゴールのゼンマイ。
- プロンプト:

```text
Create the open-desk state from the same antique desk scene. Same dark walnut writing desk, same lamp, ink bottle, papers, music box, wallpaper, and sunset lighting. Only one central drawer is open, and an antique gold music-box winding key is visible inside. Vertical 9:16, open drawer clearly visible. No readable text, no logos, no watermark, no people, no horror, no modern objects.
```

### `room-music-box-active.webp`

- 保存先: `src/assets/images/states/room-music-box-active.webp`
- 用途: ゼンマイ使用後のオルゴール
- 推奨サイズ: `1080 x 1920px`
- 形式: WebP
- 差分条件: ゼンマイ装着、蓋が開く、内部機構、柔らかな金色の光。
- プロンプト:

```text
Create the active music-box state from the same close-up music box scene. Same small dark walnut music box on desk, now with a brass winding key inserted into the side socket, lid open, delicate brass cylinder and comb mechanism visible, soft golden light from inside. Vertical 9:16. No readable text, no random symbols, no logos, no watermark, no people, no horror, no modern objects.
```

### `room-piano-open.webp`

- 保存先: `src/assets/images/states/room-piano-open.webp`
- 用途: ピアノ謎解決後
- 推奨サイズ: `1080 x 1920px`
- 形式: WebP
- 差分条件: ピアノの隠し引き出しだけ開く。中に古い鍵。
- プロンプト:

```text
Create the piano hidden-drawer-open state from the same antique piano close-up scene. Same dark walnut grand piano, plausible keys, same carved music stand, same warm sunset lighting. Only a small hidden drawer in the piano front is open, and a long antique gold door key is visible inside. Vertical 9:16. No readable text, no logos, no watermark, no people, no horror, no modern objects.
```

### `room-door-open.webp`

- 保存先: `src/assets/images/states/room-door-open.webp`
- 用途: 扉解錠後
- 推奨サイズ: `1080 x 1920px`
- 形式: WebP
- 差分条件: 同じ扉が開き、夕日の光が差す。
- プロンプト:

```text
Create the open-door state from the same closed door close-up scene. The same heavy dark brown carved wooden exit door is now open inward, antique gold handle and keyhole still visible, warm sunset light streaming through from outside. Vertical 9:16. Exactly one door. No people, no silhouettes, no ghosts, no blood, no horror, no readable text, no logos, no watermark, no modern objects.
```

## Codex内で作成する素材

以下は画像生成AIへ任せず、`scripts/prepare-assets.mjs` 内のSVGからWebPへ変換します。理由は、謎の正確性と透過・軽量化を保つためです。

- `item-sheet-piece-01.webp`, `item-sheet-piece-02.webp`, `item-sheet-piece-03.webp`
- `item-winding-key.webp`
- `item-completed-sheet.webp`
- `item-door-key.webp`
- `puzzle-sheet-piece-01.webp`, `puzzle-sheet-piece-02.webp`, `puzzle-sheet-piece-03.webp`
- `puzzle-sheet-incomplete.webp`
- `puzzle-sheet-complete.webp`
- `puzzle-clock-face.webp`
- `puzzle-music-box-clue.webp`

推奨サイズはいずれも `768 x 768px`、形式は透過WebPです。

## リサイズ・透過・形式変換

ローカルPython環境が利用できる場合は、Pillowで以下の処理を行ってください。

- 背景画像: `1080 x 1920px` にリサイズしWebP化
- アイテム画像: `768 x 768px` にリサイズし透過WebPまたは透過PNG化
- クロマキー素材: 背景色をalphaへ変換

このリポジトリでは現状、同等処理を `sharp` で行う `scripts/prepare-assets.mjs` を用意しています。Python環境が使える場合は、同じ入出力パスでPillow版へ置き換えても構いません。
