import type { FunctionComponent } from "react";
import styles from "./index.module.scss";

interface CardProps {
  children?: React.ReactNode | React.ReactNode[];
  variant?: "solid" | "outlined";
}

const Card: FunctionComponent<CardProps> = ({
  children,
  variant = "solid",
}) => {
  return (
    <div
      className={`${styles.card} ${
        variant === "outlined" ? styles.outlined : ""
      }`}
    >
      {children}
    </div>
  );
};

export default Card;
