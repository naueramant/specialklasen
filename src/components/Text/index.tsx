import type { FunctionComponent } from "react";
import styles from "./index.module.scss";

interface ImpactTextProps {
  children: React.ReactNode;
}

const ImpactText: FunctionComponent<ImpactTextProps> = ({ children }) => {
  return <span className={styles.impactText}>{children}</span>;
};

const BodyText: FunctionComponent<ImpactTextProps> = ({ children }) => {
  return <p className={styles.bodyText}>{children}</p>;
};

export { BodyText, ImpactText };
