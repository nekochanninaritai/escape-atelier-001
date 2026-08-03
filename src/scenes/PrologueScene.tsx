import { useState } from 'react';
import { prologuePages } from '../data/messages';
import { useGame } from '../context/useGame';
import './StoryScene.css';

export function PrologueScene() {
  const [page, setPage] = useState(0);
  const { dispatch } = useGame();
  const next = () => {
    if (page >= prologuePages.length - 1) dispatch({ type: 'GO_SCENE', scene: 'room' });
    else setPage((current) => current + 1);
  };

  return (
    <main className="storyScene storyPrologue" onClick={next}>
      <section className="storyText">
        <p>{prologuePages[page]}</p>
        <div className="storyActions">
          <button type="button" onClick={(event) => { event.stopPropagation(); dispatch({ type: 'GO_SCENE', scene: 'room' }); }}>スキップ</button>
          <button type="button" onClick={(event) => { event.stopPropagation(); next(); }}>次へ</button>
        </div>
      </section>
    </main>
  );
}
