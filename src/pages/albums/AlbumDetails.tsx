import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useAlbum } from '../../services/api/albums';
import Card from '../../components/Card';
import PocketbaseImage from '../../components/PocketbaseImage';
import ImageLightbox from '../../components/ImageLightbox';
import styles from './AlbumDetails.module.scss';
import { ImpactText } from '../../components/Text';

const AlbumDetailsPage: React.FC = () => {
  const { id } = useParams();
  const { data: album, isLoading, error } = useAlbum(id);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    const msg = String((error as Error).message || '');
    if (msg.toLowerCase().includes('superuser')) {
      return <div>This album is restricted. Please sign in with an administrator account to view all images.</div>;
    }

    return <div>Error: {msg}</div>;
  }
  if (!album) return <div>Album not found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <ImpactText>{album.title}</ImpactText>
        <div className={styles.date}>{new Date(album.date).toLocaleDateString()}</div>
      </div>

      <Card>
        <div className={styles.gallery}>
          {album.images.map((img, i) => (
            <div key={i} className={styles.imageWrap}>
              <button
                className={styles.thumbButton}
                onClick={() => {
                  setSelected(i);
                  setOpen(true);
                }}
                aria-label={`Open image ${i + 1} of ${album.images.length}`}
              >
                <PocketbaseImage album={album} imageName={img} className={styles.cover} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {open && selected !== null && (
        <ImageLightbox
          album={album}
          index={selected}
          onClose={() => setOpen(false)}
          onPrev={() => setSelected((s) => (s === null ? 0 : (s - 1 + album.images.length) % album.images.length))}
          onNext={() => setSelected((s) => (s === null ? 0 : (s + 1) % album.images.length))}
        />
      )}
    </div>
  );
};

export default AlbumDetailsPage;
