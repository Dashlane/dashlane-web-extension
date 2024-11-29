import React from "react";
import { Lee } from "../../lee";
import { CreateMasterPasswordMarketingContainer } from "../../left-panels";
import { CreateMasterPasswordPanel } from "../../create-master-password-panel/create-master-password-panel";
import styles from "./create-master-password.css";
export interface ConfirmNewPassword {
  password: string;
}
interface Props {
  dispatchGlobal: Lee["dispatchGlobal"];
  onSubmit: (options: ConfirmNewPassword) => Promise<void>;
}
export const CreateMasterPassword = ({ dispatchGlobal, onSubmit }: Props) => {
  return (
    <div className={styles.panelsContainer}>
      <CreateMasterPasswordMarketingContainer />
      <CreateMasterPasswordPanel
        dispatchGlobal={dispatchGlobal}
        onSubmit={onSubmit}
      />
    </div>
  );
};
