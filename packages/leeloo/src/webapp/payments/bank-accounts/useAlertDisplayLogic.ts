import * as React from "react";
const DISMISS_DELAY_MS = 5000;
export const useAlertDisplayLogic = () => {
  const [alertMessage, setAlertMessage] = React.useState("");
  const [visible, setVisible] = React.useState(false);
  const hide = () => {
    setVisible(false);
  };
  const show = () => {
    setVisible(true);
  };
  React.useEffect(() => {
    if (!visible) {
      return undefined;
    }
    const timer = setTimeout(hide, DISMISS_DELAY_MS);
    return () => {
      return clearTimeout(timer);
    };
  }, [visible, alertMessage]);
  return {
    isAlertVisible: visible,
    alertMessage,
    setAlertMessage,
    hide,
    show,
  };
};
