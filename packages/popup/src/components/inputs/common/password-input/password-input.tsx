import * as React from "react";
import styles from "./styles.css";
interface Props {
  id: string;
  label: string;
  value: string;
  actions?: React.ReactNode;
}
const PasswordInput: React.FunctionComponent<Props> = ({
  id,
  label,
  value,
  actions,
}) => {
  return (
    <div className={styles.container}>
      <label className={styles.passwordContainer} htmlFor={id}>
        <span className={styles.label}>{label}</span>
        <span id={id} className={styles.password}>
          {value}
        </span>
      </label>
      {actions && <div className={styles.actionList}>{actions}</div>}
    </div>
  );
};
export default React.memo(PasswordInput);
