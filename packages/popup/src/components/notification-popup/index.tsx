import * as React from "react";
import { Alert, AlertSeverity, AlertSize } from "@dashlane/ui-components";
import styles from "components/notification-popup/styles.css";
export interface NotificationPopupProps {
  severity: AlertSeverity;
  message: string;
}
export const NotificationPopup = ({
  severity,
  message,
}: NotificationPopupProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.popup} role="alert" aria-live="polite">
        <Alert severity={severity} showIcon size={AlertSize.SMALL}>
          {message}
        </Alert>
      </div>
    </div>
  );
};
