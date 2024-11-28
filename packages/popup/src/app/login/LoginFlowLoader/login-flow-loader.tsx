import React from "react";
import styles from "./style.css";
import Lockup from "../../../lockup.svg";
export const LoginFlowLoader = () => (
  <div className={styles.loaderContainer}>
    <div className={styles.loaderLockupContainer}>
      <Lockup />
    </div>
  </div>
);
