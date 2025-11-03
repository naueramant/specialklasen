import type { FunctionComponent } from "react";
import { PiWineFill } from "react-icons/pi";
import { NavLink } from "react-router";
import styles from "./index.module.scss";

interface PageProps {
  children?: React.ReactNode | React.ReactNode[];
}

const Page: FunctionComponent<PageProps> = ({ children }) => {
  return (
    <>
      <header className={styles.header}>
        <NavLink to="/" className={styles.logo}>
          Specialklasen <PiWineFill />
        </NavLink>

        <nav>
          <NavLink to="/cellar">Cellar</NavLink>
          <NavLink to="/calendar">Calendar</NavLink>
        </nav>
      </header>

      <main className={styles.main}>{children}</main>
    </>
  );
};

export default Page;
