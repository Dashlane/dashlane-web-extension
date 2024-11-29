import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AlertProps } from "@dashlane/ui-components/lib/components/alert/Alert";
import { Alert, AlertSeverity, AlertSize } from "@dashlane/ui-components";
import useTranslate from "../i18n/useTranslate";
interface ShowAlertFunc {
  (
    content: ReactNode,
    severity?: AlertSeverity,
    showIcon?: boolean,
    actionText?: string,
    onAction?: () => void,
    alertDurationMs?: number
  ): void;
}
interface AlertContext {
  showAlert: ShowAlertFunc;
}
interface Provider {
  children: ReactNode;
  portalId: string;
  alertSize?: AlertSize;
}
export const AlertContext = createContext<AlertContext>({} as AlertContext);
export const AlertProvider = ({ children, portalId, alertSize }: Provider) => {
  const [isShown, setIsShown] = useState(0);
  const { translate } = useTranslate();
  const timerRef = useRef<number | undefined>();
  const alertPropsRef = useRef<AlertProps>({
    children: null,
    showIcon: true,
  });
  const clearTimeout = useCallback(() => {
    window.clearTimeout(timerRef?.current);
  }, []);
  useEffect(() => {
    return clearTimeout;
  }, [clearTimeout]);
  const showAlert: ShowAlertFunc = (
    content,
    severity,
    showIcon = true,
    actionText?,
    onAction?,
    alertDurationMs = 5000
  ) => {
    clearTimeout();
    alertPropsRef.current = {
      children: content,
      severity,
      showIcon,
      actionText,
      onAction,
    };
    setIsShown((val) => ++val);
    timerRef.current = window.setTimeout(() => {
      setIsShown(0);
    }, alertDurationMs);
  };
  const alertRoot = document.getElementById(portalId);
  return (
    <>
      <AlertContext.Provider value={{ showAlert }}>
        {children}
      </AlertContext.Provider>
      {isShown && alertRoot
        ? createPortal(
            <Alert
              {...alertPropsRef.current}
              size={alertSize}
              closeIconName={translate("_common_alert_dismiss_button")}
            />,
            alertRoot
          )
        : null}
    </>
  );
};
