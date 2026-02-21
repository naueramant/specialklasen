import { useEffect, useMemo, useState, type FunctionComponent } from 'react';
import { BodyText, ImpactText } from '../../components/Text';
import { useWines } from '../../services/api/wines';
import WineTable from './components/WineTable';
import styles from './index.module.scss';

const CellarPage: FunctionComponent = () => {
  const { data: wines } = useWines();

  const SHARED = 'Fælles';
  const MEMBERS = ['Peter', 'Jonas', 'Mads', 'Jacob', 'Jeppe'];

  const availableOwners = useMemo(() => {
    const inData = (wines ?? []).map((w) => w.owner).filter((v): v is string => typeof v === 'string' && v.trim().length > 0);
    return Array.from(new Set([SHARED, ...MEMBERS, ...inData]));
  }, [wines]);

  const [selectedOwners, setSelectedOwners] = useState<string[]>([]);
  const [didInitSelection, setDidInitSelection] = useState(false);
  const [ownerPickerOpen, setOwnerPickerOpen] = useState(false);

  useEffect(() => {
    if (didInitSelection) return;
    if (availableOwners.length === 0) return;
    setSelectedOwners(availableOwners);
    setDidInitSelection(true);
  }, [availableOwners, didInitSelection]);

  useEffect(() => {
    if (!ownerPickerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOwnerPickerOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [ownerPickerOpen]);

  const toggleOwner = (owner: string) => {
    setSelectedOwners((prev) => {
      const next = prev.includes(owner) ? prev.filter((o) => o !== owner) : [...prev, owner];
      const order = new Map(availableOwners.map((o, i) => [o, i] as const));
      next.sort((a, b) => (order.get(a) ?? 9999) - (order.get(b) ?? 9999));
      return next;
    });
    setDidInitSelection(true);
  };

  const ownerPickerLabel = useMemo(() => {
    if (selectedOwners.length === 0) return 'Vælg ejere';
    if (selectedOwners.length === availableOwners.length) return 'Alle';
    return `${selectedOwners.length} valgt`;
  }, [availableOwners.length, selectedOwners.length]);

  const isSharedWine = (w: { owner?: string }) => !w.owner || w.owner === SHARED;

  const winesForOwner = useMemo(() => {
    const map = new Map<string, typeof wines>();
    if (!wines) return map;

    for (const owner of availableOwners) {
      if (owner === SHARED) {
        map.set(owner, wines.filter(isSharedWine));
      } else {
        map.set(
          owner,
          wines.filter((w) => w.owner === owner)
        );
      }
    }

    return map;
  }, [availableOwners, wines]);

  const unionVisibleWines = useMemo(() => {
    if (!wines) return [];
    const selected = selectedOwners.length > 0 ? selectedOwners : [];
    const seen = new Set<string>();
    const out: NonNullable<typeof wines> = [];

    for (const owner of selected) {
      const list = winesForOwner.get(owner) ?? [];
      for (const wine of list) {
        if (!wine?.id) continue;
        if (seen.has(wine.id)) continue;
        seen.add(wine.id);
        out.push(wine);
      }
    }

    return out;
  }, [selectedOwners, wines, winesForOwner]);

  const remainingWines = unionVisibleWines.reduce((total, wine) => total + wine.quantity, 0);
  const drunkWines = unionVisibleWines.reduce((total, wine) => total + (wine.remaining !== undefined ? wine.quantity - wine.remaining : 0), 0);

  if (!wines || wines.length === 0) {
    return (
      <div className={styles.emptyState}>
        <ImpactText>Ingen vine i kælderen</ImpactText>
        <p className={styles.emptyStateText}>Der er i øjeblikket ingen vine i kælderen.</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.filterRow}>
        <div className={styles.filterLabel}>
          <span>Vis tabeller for</span>
          <button type="button" className={styles.ownerPickerButton} onClick={() => setOwnerPickerOpen(true)}>
            {ownerPickerLabel}
          </button>
        </div>
      </div>

      {ownerPickerOpen && (
        <div
          className={styles.ownerPickerOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOwnerPickerOpen(false);
          }}
        >
          <div className={styles.ownerPickerPanel}>
            <div className={styles.ownerPickerHeader}>
              <span>Vælg ejere</span>
              <button type="button" className={styles.ownerPickerClose} onClick={() => setOwnerPickerOpen(false)}>
                ×
              </button>
            </div>
            <div className={styles.ownerPickerList}>
              {availableOwners.map((owner) => {
                const checked = selectedOwners.includes(owner);
                return (
                  <label key={owner} className={styles.ownerPickerItem}>
                    <input type="checkbox" checked={checked} onChange={() => toggleOwner(owner)} />
                    <span>{owner}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <BodyText>
        {selectedOwners.length === 0
          ? 'Vælg mindst én ejer i dropdown for at vise tabeller.'
          : `I de valgte tabeller er der i øjeblikket ${remainingWines} vine og ${drunkWines} vine er blevet konsumeret 🎉`}
      </BodyText>

      {selectedOwners.length > 0 && (
        <div className={styles.ownerSections}>
          {selectedOwners.map((owner) => {
            const list = winesForOwner.get(owner) ?? [];
            if (list.length === 0) return null;

            return (
              <div key={owner} className={styles.ownerSection}>
                <div className={styles.ownerHeader}>
                  <ImpactText>{owner}</ImpactText>
                </div>
                <WineTable wines={list} />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default CellarPage;
