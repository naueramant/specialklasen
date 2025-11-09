import type { FunctionComponent } from "react";
import { PiWineFill } from "react-icons/pi";
import { NavLink } from "react-router";
import { isLoggedInAsAdmin } from "../../services/admin/user";
import styles from "./index.module.scss";

interface PageProps {
  children?: React.ReactNode | React.ReactNode[];
}

const Page: FunctionComponent<PageProps> = ({ children }) => {
  const isAdmin = isLoggedInAsAdmin();

  return (
    <>
      <header className={styles.header}>
        <NavLink to="/" className={styles.logo}>
          Specialklasen <PiWineFill />
        </NavLink>

        <nav>
          <NavLink to="/cellar">Kælderen</NavLink>
          <NavLink to="/calendar">Kalender</NavLink>
          <NavLink to="/articles-of-association">Vedtægter</NavLink>

          {isAdmin && <a href="/_">Admin</a>}
        </nav>
      </header>

      <main className={styles.main}>{children}</main>
    </>
  );
};

export default Page;
