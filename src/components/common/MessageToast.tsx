import { useGame } from '../../context/useGame';
import './MessageToast.css';

export function MessageToast() {
  const { message } = useGame();
  if (!message) return null;
  return (
    <div className="messageToast" role="status" aria-live="polite">
      {message}
    </div>
  );
}
