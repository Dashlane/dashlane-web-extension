import React from "react";
import styles from "./ScreenReaderSpeech.module.scss";
interface Props {
  children: React.ReactNode;
}
export const ScreenReaderSpeech = ({ children }: Props) => {
  return (
    <div aria-live="polite" className={styles.visuallyHidden}>
      {children}
    </div>
  );
};
