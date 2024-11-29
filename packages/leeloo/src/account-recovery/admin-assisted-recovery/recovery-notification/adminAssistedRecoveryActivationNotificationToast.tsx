import { useEffect, useRef } from "react";
import { useToast } from "@dashlane/design-system";
import { DASHLANE_REQUEST_ADMIN_ASSISTED_RECOVERY } from "../../../app/routes/constants";
import { translate } from "../../../libs/i18n";
import { useRecoveryNotification } from "./use-recovery-notification";
export const AdminAssistedRecoveryActivationNotificationToast = () => {
  const { showToast, closeToast } = useToast();
  const { showNotification, acknowledgeNotification } =
    useRecoveryNotification();
  const toastIdRef = useRef("");
  const I18N_KEYS = {
    AAR_TOAST_DESCRIPTION: "webapp_aar_by_default_toast_markup",
    AAR_TOAST_CTA: "webapp_aar_by_default_toast_confirmation",
  };
  useEffect(() => {
    if (showNotification && !toastIdRef.current) {
      toastIdRef.current = showToast({
        description: translate.markup(
          I18N_KEYS.AAR_TOAST_DESCRIPTION,
          { supportLink: DASHLANE_REQUEST_ADMIN_ASSISTED_RECOVERY },
          { linkTarget: "_blank" }
        ),
        showCloseActionAsText: true,
        closeActionLabel: translate(I18N_KEYS.AAR_TOAST_CTA),
        onCloseClick: () => {
          acknowledgeNotification();
          closeToast(toastIdRef.current);
        },
        isManualDismiss: true,
      });
    }
    return () => {
      if (toastIdRef.current) {
        closeToast(toastIdRef.current);
      }
    };
  }, [showNotification, acknowledgeNotification, closeToast, showToast]);
  return null;
};
