import type { FunctionComponent } from 'react';
import type { Wine } from '../../../../models/wines';
import { formatWineKind } from '../../../../utils/format';
import styles from './index.module.scss';

interface HoldersProps {
  wines: Wine[];
  selected: string | null;
  onSelect: (holder: string | null) => void;
}

interface Holder {
  name: string;
  bottles: number;
  kinds: [string, number][];
}

// "Placering" is the member keeping the bottles, so group what is left by member
const groupByHolder = (wines: Wine[]): Holder[] => {
  const holders = new Map<string, { bottles: number; kinds: Map<string, number> }>();

  wines.forEach((wine) => {
    const remaining = wine.remaining ?? 0;
    if (remaining === 0) return;

    const name = wine.location || 'Ukendt';
    const holder = holders.get(name) ?? { bottles: 0, kinds: new Map() };
    holder.bottles += remaining;
    holder.kinds.set(wine.kind, (holder.kinds.get(wine.kind) ?? 0) + remaining);
    holders.set(name, holder);
  });

  return [...holders.entries()]
    .map(([name, { bottles, kinds }]) => ({ name, bottles, kinds: [...kinds.entries()].sort((a, b) => b[1] - a[1]) }))
    .sort((a, b) => b.bottles - a.bottles);
};

const Holders: FunctionComponent<HoldersProps> = ({ wines, selected, onSelect }) => {
  const holders = groupByHolder(wines);
  const most = holders[0]?.bottles ?? 1;

  return (
    <ul className={styles.holders}>
      {holders.map((holder) => {
        const isSelected = selected === holder.name;

        return (
          <li key={holder.name}>
            <button
              type="button"
              className={`${styles.holder} ${isSelected ? styles.selected : ''}`}
              onClick={() => onSelect(isSelected ? null : holder.name)}
              aria-pressed={isSelected}
            >
              <span className={styles.name}>Hos {holder.name}</span>
              <span className={styles.count}>
                {holder.bottles}
                <span className={styles.unit}>{holder.bottles === 1 ? 'flaske' : 'flasker'}</span>
              </span>
              {/* each member's share, measured against whoever holds the most */}
              <span className={styles.bar} aria-hidden>
                <span className={styles.fill} style={{ width: `${(holder.bottles / most) * 100}%` }} />
              </span>
              <span className={styles.kinds}>{holder.kinds.map(([kind, count]) => `${count} ${formatWineKind(kind).toLowerCase()}`).join(' · ')}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default Holders;
