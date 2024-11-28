import * as React from "react";
import styles from "../styles.css";
interface Props {
  parentShape: "square" | "rectangle";
}
export const NewNotification: React.FC<Props> = ({ parentShape: shape }) => {
  const subClass = shape === "square" ? "icon-badge" : "dropdown-badge";
  const classString = `${styles["badge"]} ${styles[subClass]}`;
  return <span data-testid={subClass} className={classString} />;
};
