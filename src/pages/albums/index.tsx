import React from 'react';
import { useAlbums } from '../../services/api/albums';
import styles from './index.module.scss';
import { AlbumItem } from './components/AlbumItem';

const AlbumsPage: React.FC = () => {
  const { data: albums, isLoading, error } = useAlbums();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div>
      {albums && (
        <ul>
          {albums.map((album, index) => (
            <li key={index} className={styles.albumItem}>
              <AlbumItem album={album} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AlbumsPage;
