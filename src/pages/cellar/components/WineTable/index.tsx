import type { FunctionComponent } from 'react';
import { useMemo, useState } from 'react';
import { IoArrowDown, IoArrowUp, IoClose } from 'react-icons/io5';
import WineKindBadge from '../../../../components/WineKindBadge';
import type { Wine } from '../../../../models/wines';
import { formatDate, formatVintage, formatWineKind, getOwner } from '../../../../utils/format';
import WineDetailsModal from '../WineDetailsModal/index';
import styles from './index.module.scss';

interface WineTableProps {
  wines?: Wine[];
  // owners the list is filtered to, shown with a way to clear the filter
  owners?: string[];
  onClearOwners?: () => void;
}

type SortField = keyof Wine;
type SortDirection = 'asc' | 'desc';

const COLUMNS: { field: SortField; label: string }[] = [
  { field: 'name', label: 'Navn' },
  { field: 'year', label: 'År' },
  { field: 'country', label: 'Land' },
  { field: 'region', label: 'Region' },
  { field: 'grape', label: 'Drue' },
  { field: 'kind', label: 'Type' },
  { field: 'owner', label: 'Ejer' },
  { field: 'location', label: 'Placering' },
  { field: 'bought', label: 'Købt' },
  { field: 'quantity', label: 'Antal' },
  { field: 'remaining', label: 'Tilbage' },
];

const formatBought = (wine: Wine) => formatDate(wine.bought, { year: 'numeric', month: 'short', day: 'numeric' });

const RemainingBadge: FunctionComponent<{ wine: Wine }> = ({ wine }) =>
  wine.remaining !== undefined ? <span className={`${styles.quantityBadge} ${wine.remaining === 0 ? styles.empty : ''}`}>{wine.remaining}</span> : <span>—</span>;

const WineTable: FunctionComponent<WineTableProps> = ({ wines, owners = [], onClearOwners }) => {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWine, setSelectedWine] = useState<Wine | null>(null);

  const filteredAndSortedWines = useMemo(() => {
    // First filter wines based on search term
    const filtered = wines?.filter((wine) => {
      if (!searchTerm) return true;

      const searchLower = searchTerm.toLowerCase();
      return [
        wine.name,
        wine.country,
        wine.region,
        wine.grape,
        wine.kind,
        formatWineKind(wine.kind),
        wine.location,
        getOwner(wine),
        formatBought(wine),
        formatVintage(wine.year),
      ].some((value) => value?.toLowerCase().includes(searchLower));
    });

    // Then sort the filtered results; empty values always go last
    return filtered?.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const aEmpty = aValue === undefined || aValue === '';
      const bEmpty = bValue === undefined || bValue === '';

      if (aEmpty && bEmpty) return 0;
      if (aEmpty) return 1;
      if (bEmpty) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue, 'da') : bValue.localeCompare(aValue, 'da');
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [wines, sortField, sortDirection, searchTerm]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getAriaSort = (field: SortField) => {
    if (sortField !== field) return undefined;
    return sortDirection === 'asc' ? 'ascending' : 'descending';
  };

  const SortIcon = sortDirection === 'asc' ? IoArrowUp : IoArrowDown;
  const resultCount = filteredAndSortedWines?.length ?? 0;

  return (
    <>
      <div className={styles.searchContainer}>
        <label htmlFor="wine-search" className="visually-hidden">
          Søg i kælderen
        </label>
        <input id="wine-search" type="search" placeholder="Søg vine..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={styles.searchInput} />
        {searchTerm && (
          <button type="button" className={styles.clearSearch} onClick={() => setSearchTerm('')} aria-label="Ryd søgning">
            <IoClose aria-hidden />
          </button>
        )}
      </div>

      {owners.length > 0 && (
        <p className={styles.holderFilter}>
          Viser kun vine ejet af {new Intl.ListFormat('da', { type: 'conjunction' }).format(owners)}.{' '}
          <button type="button" className={styles.linkButton} onClick={onClearOwners}>
            Vis hele kælderen
          </button>
        </p>
      )}

      <p className={searchTerm ? styles.resultCount : 'visually-hidden'} aria-live="polite">
        {searchTerm ? `${resultCount} ${resultCount === 1 ? 'vin' : 'vine'} matcher "${searchTerm}"` : ''}
      </p>

      {/* Mobile Sort Controls */}
      <div className={styles.mobileSortContainer}>
        <label htmlFor="wine-sort" className="visually-hidden">
          Sorter efter
        </label>
        <select id="wine-sort" value={sortField} onChange={(e) => setSortField(e.target.value as SortField)} className={styles.mobileSortSelect}>
          {COLUMNS.map(({ field, label }) => (
            <option key={field} value={field}>
              Sorter efter {label.toLowerCase()}
            </option>
          ))}
        </select>
        <button
          type="button"
          className={styles.sortDirectionButton}
          onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
          aria-label={sortDirection === 'asc' ? 'Stigende, skift til faldende' : 'Faldende, skift til stigende'}
        >
          <SortIcon aria-hidden />
        </button>
      </div>

      {/* Desktop Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              {COLUMNS.map(({ field, label }) => (
                <th key={field} aria-sort={getAriaSort(field)}>
                  <button type="button" className={styles.sortButton} onClick={() => handleSort(field)}>
                    {label}
                    <span className={styles.sortIcon} aria-hidden>
                      {sortField === field && <SortIcon />}
                    </span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedWines?.map((wine) => (
              <tr key={wine.id} className={`${styles.clickableRow} ${wine.remaining === 0 ? styles.drunk : ''}`} onClick={() => setSelectedWine(wine)}>
                <td className={styles.wineName}>
                  <button type="button" className={styles.wineNameButton} onClick={() => setSelectedWine(wine)}>
                    {wine.name}
                  </button>
                </td>
                <td>{formatVintage(wine.year)}</td>
                <td>{wine.country}</td>
                <td>{wine.region}</td>
                <td>{wine.grape}</td>
                <td>
                  <WineKindBadge kind={wine.kind} />
                </td>
                <td>{getOwner(wine)}</td>
                <td>{wine.location || '—'}</td>
                <td className={styles.nowrap}>{formatBought(wine)}</td>
                <td className={styles.number}>{wine.quantity}</td>
                <td className={styles.number}>
                  <RemainingBadge wine={wine} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {resultCount === 0 && searchTerm && (
          <div className={styles.emptyState}>
            <p>Ingen vine matcher "{searchTerm}". Fuck det er fattigt 💸</p>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <ul className={styles.mobileCards}>
        {filteredAndSortedWines?.map((wine) => (
          <li key={wine.id} className={`${styles.wineCard} ${styles.clickableCard} ${wine.remaining === 0 ? styles.drunk : ''}`}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardWineName}>
                <button type="button" className={styles.cardWineButton} onClick={() => setSelectedWine(wine)}>
                  {wine.name}
                </button>
              </h3>
              <span className={styles.cardYear}>{formatVintage(wine.year)}</span>
            </div>

            <dl className={styles.cardBody}>
              <div className={styles.cardRow}>
                <dt className={styles.cardLabel}>Type</dt>
                <dd>
                  <WineKindBadge kind={wine.kind} />
                </dd>
              </div>

              <div className={styles.cardRow}>
                <dt className={styles.cardLabel}>Oprindelse</dt>
                <dd>{[wine.country, wine.region].filter(Boolean).join(', ')}</dd>
              </div>

              <div className={styles.cardRow}>
                <dt className={styles.cardLabel}>Drue</dt>
                <dd>{wine.grape}</dd>
              </div>

              <div className={styles.cardRow}>
                <dt className={styles.cardLabel}>Ejer</dt>
                <dd>{getOwner(wine)}</dd>
              </div>

              <div className={styles.cardRow}>
                <dt className={styles.cardLabel}>Placering</dt>
                <dd>{wine.location || '—'}</dd>
              </div>

              <div className={styles.cardRow}>
                <dt className={styles.cardLabel}>Købt</dt>
                <dd>{formatBought(wine)}</dd>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.quantityInfo}>
                  <dt className={styles.cardLabel}>Antal</dt>
                  <dd>{wine.quantity}</dd>
                </div>
                <div className={styles.quantityInfo}>
                  <dt className={styles.cardLabel}>Tilbage</dt>
                  <dd>
                    <RemainingBadge wine={wine} />
                  </dd>
                </div>
              </div>
            </dl>
          </li>
        ))}

        {resultCount === 0 && searchTerm && (
          <li className={styles.emptyState}>
            <p>Ingen vine matcher "{searchTerm}". Fuck det er fattigt 💸</p>
          </li>
        )}
      </ul>

      {selectedWine && <WineDetailsModal wine={selectedWine} onClose={() => setSelectedWine(null)} />}
    </>
  );
};

export default WineTable;
