import { FINAL_TIME, isCorrectFinalTime, normalizeFinalHour, normalizeFinalMinute } from '../../data/puzzles';
import type { FinalTimeState } from '../../types';

type PortraitTimePuzzleProps = {
  state: FinalTimeState;
  onChange: (state: FinalTimeState) => void;
  onComplete: () => void;
};

export function PortraitTimePuzzle({ state, onChange, onComplete }: PortraitTimePuzzleProps) {
  const hour = state.hour ?? 0;
  const minute = state.minute ?? 0;
  const isCorrect = isCorrectFinalTime(state.hour, state.minute);

  return (
    <div className="studyInlinePuzzle portraitTimePuzzle">
      <p className="studyPuzzleNote">肖像画の裏にある小さな時刻合わせ。時刻を合わせると、額縁の奥で何かが動く。</p>
      <div className="clockFace" aria-hidden="true">
        <div className="clockHand hour" style={{ transform: `rotate(${hour * 30 + minute * 0.5}deg)` }} />
        <div className="clockHand minute" style={{ transform: `rotate(${minute * 6}deg)` }} />
      </div>
      <label>
        時
        <input type="number" min="0" max="23" value={hour} onChange={(event) => onChange({ ...state, hour: normalizeFinalHour(Number(event.target.value)) })} />
      </label>
      <label>
        分
        <input type="number" min="0" max="59" value={minute} onChange={(event) => onChange({ ...state, minute: normalizeFinalMinute(Number(event.target.value)) })} />
      </label>
      {isCorrect ? <p className="studyPuzzleResult">{String(FINAL_TIME.hour).padStart(2, '0')}:{String(FINAL_TIME.minute).padStart(2, '0')}</p> : null}
      <button type="button" onClick={onComplete} disabled={!isCorrect}>
        時刻を合わせる
      </button>
    </div>
  );
}
