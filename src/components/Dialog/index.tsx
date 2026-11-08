import { useEffect, useId, useRef, type FunctionComponent } from 'react';
import { IoClose } from 'react-icons/io5';
import styles from './index.module.scss';

interface DialogProps {
  onClose: () => void;
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
  label?: string;
  labelledBy?: string;
}

/*
    Native <dialog> opened with showModal(): the browser handles the focus trap
    and Escape to close.
*/
const Dialog: FunctionComponent<DialogProps> = ({ onClose, children, className, label, labelledBy }) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    // React removes the dialog before close() runs, so restore focus ourselves
    const opener = document.activeElement as HTMLElement | null;
    if (dialog && !dialog.open) dialog.showModal();
    return () => {
      dialog?.close();
      opener?.focus({ preventScroll: true });
    };
  }, []);

  const handleCancel = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onClose();
  };

  // A click on the ::backdrop is reported on the dialog element itself
  const handleClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <dialog ref={ref} className={`${styles.dialog} ${className ?? ''}`} onCancel={handleCancel} onClick={handleClick} aria-label={label} aria-labelledby={labelledBy}>
      {children}
    </dialog>
  );
};

interface ModalProps {
  title: string;
  onClose: () => void;
  children?: React.ReactNode | React.ReactNode[];
  width?: 'narrow' | 'wide';
}

const Modal: FunctionComponent<ModalProps> = ({ title, onClose, children, width = 'narrow' }) => {
  const titleId = useId();

  return (
    <Dialog onClose={onClose} labelledBy={titleId} className={`${styles.modal} ${width === 'wide' ? styles.wide : ''}`}>
      <div className={styles.header}>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Luk">
          <IoClose aria-hidden />
        </button>
      </div>

      <div className={styles.content}>{children}</div>
    </Dialog>
  );
};

export { Dialog, Modal };
