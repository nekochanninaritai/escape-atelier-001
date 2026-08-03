import { useEffect, type ReactNode } from 'react';
import './Modal.css';

type ModalProps = {
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export function Modal({ title, children, onClose }: ModalProps) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modalBackdrop" role="presentation">
      <section className="modalPanel" role="dialog" aria-modal="true" aria-label={title} tabIndex={-1}>
        <div className="modalHeader">
          <h2>{title}</h2>
          <button type="button" className="iconButton" onClick={onClose} aria-label="閉じる">
            x
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
