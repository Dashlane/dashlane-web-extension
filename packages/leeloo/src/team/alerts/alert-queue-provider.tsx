import { Alert } from "./types";
import * as React from "react";
import useTranslate from "../../libs/i18n/useTranslate";
interface AlertQueueContextInterface {
  queue: Alert[];
  addAlertToQueue: (alert: Alert) => void;
  popAlertFromQueue: () => void;
  reportTACError: (error: Error, message?: string) => void;
}
interface AlertQueueProviderProps {
  globalReportError: (error: Error, message?: string) => void;
  children: React.ReactNode;
}
export const AlertQueueContext =
  React.createContext<AlertQueueContextInterface | null>(null);
export const LEE_NETWORK_ERROR = "NETWORK ERROR";
export const AlertQueueProvider = ({
  globalReportError,
  children,
}: AlertQueueProviderProps) => {
  const [alertQueue, setAlertQueue] = React.useState<Alert[]>([]);
  const { translate } = useTranslate();
  const addAlertToQueue = (alert: Alert) => {
    if (
      !alertQueue.find(
        (existingAlert) =>
          existingAlert.title === alert.title &&
          existingAlert.message === alert.message
      )
    ) {
      setAlertQueue((currentQueue) => [...currentQueue, alert]);
    }
  };
  const popAlertFromQueue = () => {
    setAlertQueue((currentQueue) => currentQueue.slice(1));
  };
  const reportTACError = (error: Error, message?: string) => {
    if (error.message.toUpperCase() === LEE_NETWORK_ERROR) {
      addAlertToQueue({
        title: translate("_common_alert_network_error_title"),
        message: translate("_common_alert_network_error_message"),
      });
    }
    globalReportError(error, message);
  };
  return (
    <AlertQueueContext.Provider
      value={{
        queue: alertQueue,
        addAlertToQueue,
        popAlertFromQueue,
        reportTACError,
      }}
    >
      {children}
    </AlertQueueContext.Provider>
  );
};
