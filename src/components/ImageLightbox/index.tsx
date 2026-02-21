import React, { useEffect } from 'react';
import styles from './index.module.scss';
import PocketbaseImage from '../PocketbaseImage';
import type { Album } from '../../models/albums';
import PocketbaseVideo from '../PocketbaseVideo';

export type LightboxMediaItem =
  | {
      type: 'image';
      name: string;
    }
  | {
      type: 'video';
      name: string;
    };

interface ImageLightboxProps {
  album: Album;
  items: LightboxMediaItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({ album, items, index, onClose, onPrev, onNext }) => {
  useEffect(() => {
    const onKeyCapture = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', onKeyCapture, { capture: true });
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKeyCapture, { capture: true } as AddEventListenerOptions);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose, onPrev, onNext]);

  const item = items[index];
  if (!item) return null;

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
          {item.type === 'image' ? (
            <PocketbaseImage key={`image:${item.name}`} album={album} imageName={item.name} className={styles.media} />
          ) : (
            <PocketbaseVideo key={`video:${item.name}`} album={album} fileName={item.name} className={styles.media} />
          )}
        </div>
        <div className={styles.caption} aria-hidden>
          {album.title} — {index + 1}/{items.length}
        </div>
      </div>
      <button className={styles.next} onClick={onNext} aria-label="Next">
        ›
      </button>
    </div>
  );
};

export default ImageLightbox;
