import type { FunctionComponent } from 'react';
import { IoDocumentTextOutline, IoDownloadOutline } from 'react-icons/io5';
import PageIntro from '../../components/PageIntro';
import { DOWNLOADS } from '../../data/downloads';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import styles from './index.module.scss';

const DownloadsPage: FunctionComponent = () => {
  useDocumentTitle('Downloads');

  return (
    <>
      <PageIntro title="Downloads">
        <p>Ark og andet godt til klassens aftener.</p>
      </PageIntro>

      <ul className={styles.downloads}>
        {DOWNLOADS.map((download) => (
          <li key={download.file}>
            <a href={download.file} download={download.fileName} className={styles.download}>
              <span className={styles.preview}>
                {download.preview ? <img src={download.preview} alt="" loading="lazy" decoding="async" /> : <IoDocumentTextOutline aria-hidden className={styles.placeholder} />}
              </span>
              <span className={styles.body}>
                <span className={styles.title}>{download.title}</span>
                <span className={styles.description}>{download.description}</span>
                <span className={styles.action}>
                  <IoDownloadOutline aria-hidden /> Hent <span className={styles.format}>({download.format})</span>
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};

export default DownloadsPage;
