import React, { useState } from 'react';
import { Link, useParams } from 'react-router';
import { IoArrowBack } from 'react-icons/io5';
import { useAlbum } from '../../services/api/albums';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import Card from '../../components/Card';
import PocketbaseImage from '../../components/PocketbaseImage';
import ImageLightbox from '../../components/ImageLightbox';
import styles from './AlbumDetails.module.scss';
import { ImpactText } from '../../components/Text';
import { stripClubPrefix, formatDate } from '../../utils/format';

const AlbumDetailsPage: React.FC = () => {
  const { id } = useParams();
  const { data: album, isLoading, error } = useAlbum(id);
  useDocumentTitle(album ? stripClubPrefix(album.title) : 'Billeder');

  const [selected, setSelected] = useState<number | null>(null);

  const renderStatus = () => {
    if (isLoading) return <p className={styles.status}>Henter album…</p>;

    if (error) {
      const msg = String((error as Error).message || '');
      if (msg.toLowerCase().includes('superuser')) {
        return <p className={styles.status}>Dette album er låst. Log ind som administrator for at se alle billeder.</p>;
      }

      return <p className={styles.status}>Albummet kunne ikke hentes. Prøv at genindlæse siden.</p>;
    }

    if (!album) return <p className={styles.status}>Albummet findes ikke.</p>;

    return null;
  };

  const date = album ? formatDate(album.date, undefined, '') : '';

  return (
    <div className={styles.container}>
      <Link to="/albums" className={styles.backLink}>
        <IoArrowBack aria-hidden /> Alle albums
      </Link>

      {renderStatus()}

      {album && (
        <>
          <div className={styles.header}>
            <ImpactText as="h1" className={styles.title}>
              {stripClubPrefix(album.title)}
            </ImpactText>
            <p className={styles.date}>
              {date && <time dateTime={album.date}>{date}</time>}
              {date && ' · '}
              {album.images.length === 1 ? '1 billede' : `${album.images.length} billeder`}
            </p>
          </div>

          <Card>
            <div className={styles.gallery}>
              {album.images.map((img, i) => (
                <div key={img} className={styles.imageWrap}>
                  <button type="button" className={styles.thumbButton} onClick={() => setSelected(i)} aria-label={`Åbn billede ${i + 1} af ${album.images.length}`}>
                    <PocketbaseImage album={album} imageName={img} alt="" className={styles.cover} thumb="800x0" />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {selected !== null && (
            <ImageLightbox
              album={album}
              index={selected}
              onClose={() => setSelected(null)}
              onPrev={() => setSelected((s) => (s === null ? 0 : (s - 1 + album.images.length) % album.images.length))}
              onNext={() => setSelected((s) => (s === null ? 0 : (s + 1) % album.images.length))}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AlbumDetailsPage;
