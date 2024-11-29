import React from "react";
import styles from "./password-tip.css";
export interface Props {
  title: string;
  description: React.ReactNode;
  example?: string;
}
export const PasswordTip = ({ title, description, example }: Props) => (
  <section>
    <h3 className={styles.tipTitle}>{title}</h3>
    <div className={styles.tipDescription}>{description}</div>
    {example ? <p className={styles.tipExample}>{example}</p> : null}
  </section>
);
