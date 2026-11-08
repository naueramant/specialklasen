import React, { useEffect, useRef } from 'react';
import { IoChevronBack, IoChevronForward, IoClose } from 'react-icons/io5';
import styles from './index.module.scss';
import PocketbaseImage from '../PocketbaseImage';
import { Dialog } from '../Dialog';
import type { Album } from '../../models/albums';

interface ImageLightboxProps {
  album: Album;
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({ album, index, onClose, onPrev, onNext }) => {
  // Escape is handled by the dialog itself
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onPrev, onNext]);

  // horizontal swipe on touch screens
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(deltaX) < 50) return;
    if (deltaX > 0) onPrev();
    else onNext();
  };

  const imgName = album.images[index];

  if (!imgName) return null;

  const total = album.images.length;
  const position = `${index + 1} af ${total}`;

  return (
    <Dialog onClose={onClose} label={`${album.title}, billede ${position}`} className={styles.lightbox}>
      <button type="button" className={`${styles.control} ${styles.close}`} onClick={onClose} aria-label="Luk">
        <IoClose aria-hidden />
      </button>

      {total > 1 && (
        <button type="button" className={`${styles.control} ${styles.prev}`} onClick={onPrev} aria-label="Forrige billede">
          <IoChevronBack aria-hidden />
        </button>
      )}

      <div className={styles.content} onClick={(e) => e.target === e.currentTarget && onClose()} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <PocketbaseImage key={imgName} album={album} imageName={imgName} alt={`${album.title}, billede ${position}`} className={styles.image} variant="full" />
        <p className={styles.caption} aria-live="polite">
          {album.title} · {position}
        </p>
      </div>

      {total > 1 && (
        <button type="button" className={`${styles.control} ${styles.next}`} onClick={onNext} aria-label="Næste billede">
          <IoChevronForward aria-hidden />
        </button>
      )}
    </Dialog>
  );
};

export default ImageLightbox;
