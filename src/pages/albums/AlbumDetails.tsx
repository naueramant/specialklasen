import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useAlbum } from '../../services/api/albums';
import Card from '../../components/Card';
import PocketbaseImage from '../../components/PocketbaseImage';
import ImageLightbox from '../../components/ImageLightbox';
import styles from './AlbumDetails.module.scss';
import { ImpactText } from '../../components/Text';
import PocketbaseVideo from '../../components/PocketbaseVideo';
import type { LightboxMediaItem } from '../../components/ImageLightbox';

const isVideoFile = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  return ext === 'mp4' || ext === 'webm' || ext === 'ogg' || ext === 'mov' || ext === 'm4v';
};

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

  const media = album.images ?? [];
  const mediaItems: LightboxMediaItem[] = media.map((name) => ({ type: isVideoFile(name) ? ('video' as const) : ('image' as const), name }));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <ImpactText>{album.title}</ImpactText>
        <div className={styles.date}>{new Date(album.date).toLocaleDateString('da-DK', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>

      <Card>
        <div className={styles.gallery}>
          {mediaItems.map((item, i) => (
            <div key={`${item.type}:${item.name}:${i}`} className={styles.imageWrap}>
              <button
                type="button"
                className={styles.thumbButton}
                onClick={() => {
                  setSelected(i);
                  setOpen(true);
                }}
                aria-label={`Open ${item.type} ${i + 1} of ${mediaItems.length}`}
              >
                {item.type === 'image' ? (
                  <PocketbaseImage album={album} imageName={item.name} className={styles.cover} />
                ) : (
                  <>
                    <PocketbaseVideo album={album} fileName={item.name} className={styles.videoThumb} controls={false} muted />
                    <div className={styles.videoBadge} aria-hidden>
                      VIDEO
                    </div>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </Card>

      {open && selected !== null && mediaItems.length > 0 && (
        <ImageLightbox
          album={album}
          items={mediaItems}
          index={selected}
          onClose={() => setOpen(false)}
          onPrev={() => setSelected((s) => (s === null ? 0 : (s - 1 + mediaItems.length) % mediaItems.length))}
          onNext={() => setSelected((s) => (s === null ? 0 : (s + 1) % mediaItems.length))}
        />
      )}
    </div>
  );
};

export default AlbumDetailsPage;
