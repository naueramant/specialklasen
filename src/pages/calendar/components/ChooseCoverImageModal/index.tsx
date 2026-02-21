import { useEffect, useMemo, useState, type FunctionComponent } from 'react';
import type { RecordModel } from 'pocketbase';
import type { Event } from '../../../../models/event';
import { pb } from '../../../../services/api/client';
import { syncSuperuserAuthToPocketBase } from '../../../../services/admin/superuserAuth';
import styles from './index.module.scss';

const isVideoFile = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  return ext === 'mp4' || ext === 'webm' || ext === 'ogg' || ext === 'mov' || ext === 'm4v';
};

interface ChooseCoverImageModalProps {
  event: Event;
  isOpen: boolean;
  isSaving?: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onSelect: (fileName: string) => void;
}

const ChooseCoverImageModal: FunctionComponent<ChooseCoverImageModalProps> = ({ event, isOpen, isSaving = false, errorMessage = null, onClose, onSelect }) => {
  if (!isOpen) return null;

  const [albumRecord, setAlbumRecord] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const album = useMemo(() => {
    return event.albumExpanded ?? albumRecord;
  }, [event.albumExpanded, albumRecord]);

  useEffect(() => {
    let cancelled = false;

    const escapeFilterValue = (value: string) => value.replaceAll('\\', '\\\\').replaceAll('"', '\\"');

    const fetchAlbum = async () => {
      if (!event.album) return;
      if (event.albumExpanded) return;

      setLoading(true);
      setLoadError(null);

      try {
        syncSuperuserAuthToPocketBase(pb);
        const result = await pb.collection('albums').getOne(event.album);
        if (!cancelled) setAlbumRecord(result);
      } catch (e: any) {
        try {
          syncSuperuserAuthToPocketBase(pb);
          const id = escapeFilterValue(event.album);
          const list = await pb.collection('albums').getList(1, 1, { filter: `id="${id}"` });
          const first = Array.isArray((list as any)?.items) ? (list as any).items[0] : null;
          if (!cancelled) setAlbumRecord(first ?? null);
          if (!first && !cancelled) setLoadError('Kunne ikke finde albummet.');
        } catch (e2: any) {
          const message = typeof e?.message === 'string' ? e.message : typeof e2?.message === 'string' ? e2.message : 'Kunne ikke hente albummet.';
          if (!cancelled) setLoadError(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAlbum();
    return () => {
      cancelled = true;
    };
  }, [event.album, event.albumExpanded]);

  const images: string[] = (Array.isArray((album as any)?.images) ? (album as any).images : []).filter(
    (name: unknown): name is string => typeof name === 'string' && name.length > 0 && !isVideoFile(name)
  );

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div className={styles.popup}>
        <div className={styles.header}>
          <h2 className={styles.title}>Vælg coverbillede</h2>
          <button type="button" className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          {!event.album ? (
            <p className={styles.hint}>Dette event har ikke et album linket.</p>
          ) : loading ? (
            <p className={styles.hint}>Henter billeder…</p>
          ) : loadError ? (
            <p className={styles.hint}>{loadError}</p>
          ) : !album ? (
            <p className={styles.hint}>Kunne ikke finde albummet.</p>
          ) : images.length === 0 ? (
            <p className={styles.hint}>Albummet har ingen billeder at vælge imellem.</p>
          ) : (
            <div className={styles.grid}>
              {images.map((fileName) => {
                let url: string | null = null;
                try {
                  url = pb.files.getURL(album as unknown as RecordModel, fileName);
                } catch {
                  url = null;
                }

                const selected = event.coverFromAlbum === fileName;

                return (
                  <button
                    key={fileName}
                    type="button"
                    className={`${styles.thumbButton} ${selected ? styles.selected : ''}`}
                    onClick={() => onSelect(fileName)}
                    disabled={!url || isSaving}
                    title={fileName}
                  >
                    {url ? <img src={url} alt={fileName} className={styles.thumbImage} /> : <span className={styles.thumbMissing}>?</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChooseCoverImageModal;
