import type { FunctionComponent } from 'react';
import { formatWineKind } from '../../utils/format';
import styles from './index.module.scss';

const WineKindBadge: FunctionComponent<{ kind: string }> = ({ kind }) => {
  return <span className={`${styles.kindBadge} ${styles[kind?.toLowerCase()] ?? ''}`}>{formatWineKind(kind)}</span>;
};

export default WineKindBadge;
