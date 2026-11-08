import type { FunctionComponent } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { NavLink } from 'react-router';
import { isLoggedInAsAdmin } from '../../services/admin/user';
import WineGlass from '../WineGlass';
import styles from './index.module.scss';

interface PageProps {
  children?: React.ReactNode | React.ReactNode[];
}

const Page: FunctionComponent<PageProps> = ({ children }) => {
  const isAdmin = isLoggedInAsAdmin();

  return (
    <>
      <header className={styles.header}>
        <NavLink to="/" className={styles.logo}>
          Specialklasen <WineGlass />
        </NavLink>

        <nav aria-label="Hovedmenu">
          <NavLink to="/cellar">Kælderen</NavLink>
          <NavLink to="/calendar">Kalender</NavLink>
          <NavLink to="/albums">Billeder</NavLink>
          <NavLink to="/articles-of-association">Vedtægter</NavLink>
          <NavLink to="/board">Bestyrelsen</NavLink>
          <NavLink to="/downloads">Downloads</NavLink>

          {isAdmin && (
            <a href="/_" target="_blank" rel="noreferrer">
              Admin
              <FaExternalLinkAlt size={14} aria-hidden />
              <span className="visually-hidden">(åbner i en ny fane)</span>
            </a>
          )}
        </nav>
      </header>

      <main className={styles.main}>{children}</main>
    </>
  );
};

export default Page;
