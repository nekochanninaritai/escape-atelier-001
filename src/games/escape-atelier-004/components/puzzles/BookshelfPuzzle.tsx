import { BOOK_CLUE, isCorrectBook, isCorrectPage, resolveBookId } from '../../data/puzzles';
import type { BookshelfPuzzleState } from '../../types';

type BookshelfPuzzleProps = {
  state: BookshelfPuzzleState;
  onChange: (state: BookshelfPuzzleState) => void;
  onComplete: () => void;
};

const bookNumbers = [3, 5, 7, 9, 12];
const pageNumbers = [12, 19, 23, 31, 42];

export function BookshelfPuzzle({ state, onChange, onComplete }: BookshelfPuzzleProps) {
  const isCorrect = isCorrectBook(state.selectedBookId) && isCorrectPage(state.openedPage);

  return (
    <div className="studyInlinePuzzle bookshelfPuzzle">
      <p className="studyPuzzleNote">重なった手掛かりに従い、本とページを選ぶ。</p>
      <div className="bookChoiceGrid" aria-label="本を選ぶ">
        {bookNumbers.map((bookNumber) => {
          const bookId = resolveBookId(bookNumber);
          return (
            <button type="button" key={bookId} className={state.selectedBookId === bookId ? 'selected' : ''} onClick={() => onChange({ ...state, selectedBookId: bookId })}>
              {bookNumber}
            </button>
          );
        })}
      </div>
      <div className="pageChoiceGrid" aria-label="ページを選ぶ">
        {pageNumbers.map((page) => (
          <button type="button" key={page} className={state.openedPage === page ? 'selected' : ''} onClick={() => onChange({ ...state, openedPage: page })}>
            {page}
          </button>
        ))}
      </div>
      {isCorrect ? <p className="studyPuzzleResult">{BOOK_CLUE.phrase}</p> : null}
      <button type="button" onClick={onComplete} disabled={!isCorrect}>
        ページを読む
      </button>
    </div>
  );
}

