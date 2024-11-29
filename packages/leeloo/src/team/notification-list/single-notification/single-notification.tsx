import React, { useCallback, useEffect } from "react";
import { Alert, AlertSeverity, AlertSize } from "@dashlane/ui-components";
import styles from "./styles.css";
import useTranslate from "../../../libs/i18n/useTranslate";
interface Props {
  level: AlertSeverity;
  text: string | React.ReactNode;
  buttonTextKey?: string;
  onClose: () => void;
  onLinkClick?: (event: MouseEvent) => void;
  onClickButton?: () => void;
}
export const SingleNotification = ({
  level = AlertSeverity.SUCCESS,
  text,
  buttonTextKey,
  onClose,
  onLinkClick,
  onClickButton,
}: Props) => {
  const notificationRef = React.useRef<HTMLDivElement>(null);
  const { translate } = useTranslate();
  const handleClick = useCallback(
    (event: MouseEvent): void => {
      if (!onLinkClick) {
        return;
      }
      const element = event.target as HTMLElement;
      if (!element || element.tagName.toLowerCase() !== "a") {
        return;
      }
      onLinkClick(event);
    },
    [onLinkClick]
  );
  useEffect(() => {
    if (!notificationRef || !notificationRef.current) {
      return undefined;
    }
    const notificationRefCurr = notificationRef.current;
    notificationRefCurr.addEventListener("click", handleClick);
    return () => {
      notificationRefCurr.removeEventListener("click", handleClick);
    };
  }, [handleClick]);
  return (
    <div className={styles.notification}>
      <Alert
        severity={level}
        size={AlertSize.SMALL}
        showIcon
        closeIconName={translate("_common_alert_dismiss_button")}
        onClose={onClose}
        onAction={onClickButton ? onClickButton : undefined}
        actionText={buttonTextKey ? buttonTextKey : undefined}
      >
        <span ref={notificationRef} className={styles.text}>
          {text}
        </span>
      </Alert>
    </div>
  );
};
