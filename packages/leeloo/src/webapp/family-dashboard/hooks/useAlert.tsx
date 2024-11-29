import React, { useCallback, useState } from "react";
import { AlertSeverity } from "@dashlane/ui-components";
import { PopupAlert } from "../popup-alert/popup-alert";
const getRandomId = (): number => Math.floor(Math.random() * 1e6);
export interface UseAlert {
  alert: React.ReactChild | null;
  show: () => void;
  hide: () => void;
}
export const useAlert = (
  message: string,
  severity: AlertSeverity
): UseAlert => {
  const [id, setId] = useState<number | null>(null);
  const show = useCallback(() => {
    const newId = getRandomId();
    setId(newId);
  }, [setId]);
  const hide = useCallback(() => {
    setId(null);
  }, [setId]);
  const alert = id ? (
    <PopupAlert id={id} message={message} onHide={hide} severity={severity} />
  ) : null;
  return { alert, show, hide };
};
