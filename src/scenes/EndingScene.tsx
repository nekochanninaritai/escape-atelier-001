import { useState } from 'react';
import { endingPages } from '../data/messages';
import { imageAssets } from '../data/imageAssets';
import { useGame } from '../context/useGame';
import { GameImage } from '../components/common/GameImage';
import './StoryScene.css';

export function EndingScene({ onSeriesSelect }: { onSeriesSelect?: () => void }) {
  const [page, setPage] = useState(0);
  const { dispatch } = useGame();
  const finished = page >= endingPages.length;

  return (
    <main className="storyScene endingScene">
      <GameImage
        src={imageAssets.ending.background}
        alt="夕暮れの光が差し込む開いた音楽室の扉"
        fallbackLabel="エンディング背景"
        className="storyBackground"
        decorative
      />
      <div className="endingLight" />
      <section className="storyText">
        {!finished ? (
          <>
            <p>{endingPages[page]}</p>
            <button type="button" onClick={() => setPage((current) => current + 1)}>
              次へ
            </button>
          </>
        ) : (
          <>
            <h1>ESCAPE</h1>
            <p>プレイしていただきありがとうございました</p>
            <div className="storyActions">
              <button type="button" onClick={() => dispatch({ type: 'GO_SCENE', scene: 'title' })}>
                タイトルへ戻る
              </button>
              <button type="button" onClick={() => dispatch({ type: 'START_NEW' })}>
                もう一度遊ぶ
              </button>
              {onSeriesSelect && (
                <button type="button" onClick={onSeriesSelect}>
                  作品選択へ戻る
                </button>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
