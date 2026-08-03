import { clearSaveData } from '../../services/saveService';
import { useGame } from '../../context/useGame';
import { Modal } from '../common/Modal';
import './SettingsModal.css';

export function SettingsModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useGame();

  const resetSave = () => {
    if (!window.confirm('セーブデータをリセットしますか？')) return;
    clearSaveData();
    dispatch({ type: 'RESET' });
    onClose();
  };

  return (
    <Modal title="設定" onClose={onClose}>
      <div className="settingsPanel">
        <label>
          <input
            type="checkbox"
            checked={state.settings.bgmEnabled}
            onChange={(event) => dispatch({ type: 'UPDATE_SETTINGS', settings: { bgmEnabled: event.target.checked } })}
          />
          BGM
        </label>
        <label>
          BGM音量
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={state.settings.bgmVolume}
            onChange={(event) => dispatch({ type: 'UPDATE_SETTINGS', settings: { bgmVolume: Number(event.target.value) } })}
          />
        </label>
        <label>
          <input
            type="checkbox"
            checked={state.settings.seEnabled}
            onChange={(event) => dispatch({ type: 'UPDATE_SETTINGS', settings: { seEnabled: event.target.checked } })}
          />
          SE
        </label>
        <label>
          SE音量
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={state.settings.seVolume}
            onChange={(event) => dispatch({ type: 'UPDATE_SETTINGS', settings: { seVolume: Number(event.target.value) } })}
          />
        </label>
        <div className="settingsActions">
          <button type="button" onClick={() => dispatch({ type: 'GO_SCENE', scene: 'title' })}>タイトルへ戻る</button>
          <button type="button" onClick={onClose}>ゲームへ戻る</button>
          <button type="button" className="dangerButton" onClick={resetSave}>セーブリセット</button>
        </div>
      </div>
    </Modal>
  );
}
