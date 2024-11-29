import { browser } from "@dashlane/browser-utils";
import { AlertSeverity } from "@dashlane/ui-components";
import { Notification } from "../../libs/notifications/types";
import { Lee } from "../../lee";
import { closeIeNotificationAction } from "./reducer";
export function getIeDropNotifications(lee: Lee): Notification[] {
  const isFullAdmin = lee.permission.adminAccess.hasFullAccess;
  const state = lee.globalState.ieNotifications;
  if (
    !isFullAdmin ||
    !browser.isInternetExplorer() ||
    !state.displayIeDropNotification
  ) {
    return [];
  }
  const handleClose = () => lee.dispatchGlobal(closeIeNotificationAction());
  return [
    {
      key: "directorySyncPosponedValidation",
      level: AlertSeverity.WARNING,
      textKey: "wac_ie_drop_message_markup",
      handleClose,
    },
  ];
}
