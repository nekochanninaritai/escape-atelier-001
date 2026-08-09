import { TYPEWRITER_ENCODED_TEXT, isTypewriterAnswerCorrect } from '../../data/puzzles';
import type { TypewriterPuzzleState } from '../../types';

type TypewriterPuzzleProps = {
  state: TypewriterPuzzleState;
  onChange: (state: TypewriterPuzzleState) => void;
  onComplete: () => void;
};

export function TypewriterPuzzle({ state, onChange, onComplete }: TypewriterPuzzleProps) {
  const normalizedInput = state.input.toUpperCase();
  const isCorrect = isTypewriterAnswerCorrect(normalizedInput);

  return (
    <div className="studyInlinePuzzle typewriterPuzzle">
      <p className="studyPuzzleNote">暗号表の端にある「{TYPEWRITER_ENCODED_TEXT}」を読み解き、タイプライターへ打ち込む。</p>
      <input
        type="text"
        value={normalizedInput}
        maxLength={12}
        onChange={(event) => onChange({ input: event.target.value.toUpperCase() })}
        aria-label="タイプライターへ入力する言葉"
      />
      <button type="button" onClick={onComplete} disabled={!isCorrect}>
        打ち終える
      </button>
    </div>
  );
}

