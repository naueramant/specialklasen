import React from 'react';
import styles from './AlbumItem.module.scss';
import { Link } from 'react-router';
import PocketbaseImage from '../../../components/PocketbaseImage';
import Card from '../../../components/Card';
import type { Album } from '../../../models/albums';
import { ImpactText } from '../../../components/Text';
import PocketbaseVideo from '../../../components/PocketbaseVideo';

const isVideoFile = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  return ext === 'mp4' || ext === 'webm' || ext === 'ogg' || ext === 'mov' || ext === 'm4v';
};

export interface AlbumItemProps {
  album: Album;
}

export const AlbumItem: React.FC<AlbumItemProps> = ({ album }) => {
  const total = album.images.length;
  const preview = album.images.slice(0, 4);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <ImpactText>{album.title}</ImpactText>
        <div className={styles.date}>{new Date(album.date).toLocaleDateString('da-DK', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>

      <Link to={`/albums/${album.id}`} className={styles.cardLink}>
        <Card>
          <div className={styles.albumCard} aria-hidden={false}>
            {Array.from({ length: 4 }).map((_, i) => {
              const image = preview[i];

              // If no image for this slot, render an empty placeholder
              if (!image) {
                return <div key={i} className={styles.imageWrap} />;
              }

              const isLast = i === 3;
              const hiddenCount = total - 4;

              return (
                <div key={i} className={styles.imageWrap}>
                  {isVideoFile(image) ? (
                    <>
                      <PocketbaseVideo album={album} fileName={image} className={styles.videoCover} controls={false} muted />
                      <div className={styles.videoBadge} aria-hidden>
                        VIDEO
                      </div>
                    </>
                  ) : (
                    <PocketbaseImage album={album} imageName={image} className={styles.cover} />
                  )}

                  {isLast && hiddenCount > 0 && (
                    <div className={styles.overlay}>
                      <div className={styles.overlayCount}>+{hiddenCount}</div>
                      <div className={styles.overlayText}>See more</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </Link>
    </div>
  );
};
