import React, { useEffect } from 'react';
import styles from './index.module.scss';
import PocketbaseImage from '../PocketbaseImage';
import type { Album } from '../../models/albums';

interface ImageLightboxProps {
  album: Album;
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({ album, index, onClose, onPrev, onNext }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, onPrev, onNext]);

  const imgName = album.images[index];

  if (!imgName) return null;

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleBackdrop} role="dialog" aria-modal="true">
      <button className={styles.close} onClick={onClose} aria-label="Close">
        ×
      </button>

      <button className={styles.prev} onClick={onPrev} aria-label="Previous">
        ‹
      </button>
      <div className={styles.content}>
        <div className={styles.imageWrap}>
          <PocketbaseImage album={album} imageName={imgName} className={styles.image} />
        </div>
        <div className={styles.caption} aria-hidden>
          {album.title} — {index + 1}/{album.images.length}
        </div>
      </div>
      <button className={styles.next} onClick={onNext} aria-label="Next">
        ›
      </button>
    </div>
  );
};

export default ImageLightbox;
