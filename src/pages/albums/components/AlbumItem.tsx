import React from 'react';
import styles from './AlbumItem.module.scss';
import { Link } from 'react-router';
import PocketbaseImage from '../../../components/PocketbaseImage';
import type { Album } from '../../../models/albums';
import { stripClubPrefix, formatDate } from '../../../utils/format';

export interface AlbumItemProps {
  album: Album;
}

// One cover image leads, two smaller ones support it
const PREVIEW_COUNT = 3;

export const AlbumItem: React.FC<AlbumItemProps> = ({ album }) => {
  const total = album.images.length;
  const preview = album.images.slice(0, PREVIEW_COUNT);
  const hiddenCount = total - PREVIEW_COUNT;
  const date = formatDate(album.date, { day: 'numeric', month: 'long' }, '');

  return (
    <Link to={`/albums/${album.id}`} className={styles.cardLink}>
      <div className={`${styles.mosaic} ${total === 1 ? styles.single : ''}`}>
        {preview.map((image, i) => (
          <div key={image} className={`${styles.tile} ${i === 0 ? styles.cover : ''}`}>
            <PocketbaseImage album={album} imageName={image} alt="" className={styles.media} thumb={i === 0 ? '800x0' : '300x300'} />

            {i === PREVIEW_COUNT - 1 && hiddenCount > 0 && (
              <div className={styles.overlay}>
                <span>+{hiddenCount}</span>
              </div>
            )}
          </div>
        ))}

        {/* keep the mosaic shape when an album has only two images */}
        {total === 2 && <div className={styles.tile} />}
      </div>

      <div className={styles.caption}>
        <h3 className={styles.title}>{stripClubPrefix(album.title)}</h3>
        <p className={styles.meta}>
          {date && <time dateTime={album.date}>{date}</time>}
          {date && ' · '}
          {total === 1 ? '1 billede' : `${total} billeder`}
        </p>
      </div>
    </Link>
  );
};
