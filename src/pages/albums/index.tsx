import React from 'react';
import { useAlbums } from '../../services/api/albums';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import LedgerSection from '../../components/LedgerSection';
import PageIntro from '../../components/PageIntro';
import type { Album } from '../../models/albums';
import { parseDate } from '../../utils/format';
import styles from './index.module.scss';
import { AlbumItem } from './components/AlbumItem';

const UNDATED = 'Uden dato';

// Newest year first, newest album first within a year; undated albums go last
const groupByYear = (albums: Album[]) => {
  const groups = new Map<string, Album[]>();

  [...albums]
    .sort((a, b) => (parseDate(b.date)?.getTime() ?? 0) - (parseDate(a.date)?.getTime() ?? 0))
    .forEach((album) => {
      const key = String(parseDate(album.date)?.getFullYear() ?? UNDATED);
      groups.set(key, [...(groups.get(key) ?? []), album]);
    });

  return [...groups.entries()];
};

const AlbumsPage: React.FC = () => {
  useDocumentTitle('Billeder');
  const { data: albums, isLoading, error } = useAlbums();

  return (
    <div>
      <PageIntro title="Billeder">
        <p>Beviserne. Fra de første vinlotterier til i dag.</p>
      </PageIntro>

      {isLoading && <p className={styles.status}>Henter albums…</p>}

      {error && <p className={styles.status}>Albummerne kunne ikke hentes. Prøv at genindlæse siden.</p>}

      {albums && albums.length === 0 && <p className={styles.status}>Der er ingen albums endnu.</p>}

      {albums &&
        groupByYear(albums).map(([year, yearAlbums]) => (
          <LedgerSection key={year} title={year} tally={yearAlbums.length === 1 ? '1 aften' : `${yearAlbums.length} aftener`}>
            <ul className={styles.albumList}>
              {yearAlbums.map((album) => (
                <li key={album.id}>
                  <AlbumItem album={album} />
                </li>
              ))}
            </ul>
          </LedgerSection>
        ))}
    </div>
  );
};

export default AlbumsPage;
