import { Lee } from "../../../lee";
import { AlertSeverity } from "@dashlane/ui-components";
import { NotificationName } from "@dashlane/communication";
import {
  addNotification,
  removeNotification,
} from "../../../libs/notifications/actions";
import { redirect } from "../../../libs/router";
import { Notification } from "../../../libs/notifications/types";
import { isDashlaneUrl, openDashlaneUrl } from "../../../libs/external-urls";
import { carbonConnector } from "../../../libs/carbon/connector";
interface ShowNotificationArguments {
  lee: Lee;
  notificationKey: string;
  buttonTextKey?: string;
  level: AlertSeverity;
  redirectPath?: string;
  onClickButton?: () => void;
  keyParams?: {
    [key: string]: string | number;
  };
  notificationName?: NotificationName;
}
export const showNotification = ({
  lee,
  notificationKey,
  buttonTextKey,
  level,
  redirectPath,
  onClickButton,
  keyParams,
  notificationName,
}: ShowNotificationArguments) => {
  const dispatchOptions: Notification = {
    key: notificationKey,
    level,
    textKey: notificationKey,
    buttonTextKey,
    keyParams,
    handleClose: () => {
      lee.dispatchGlobal(removeNotification(notificationKey));
      if (notificationName) {
        carbonConnector.markNotificationAsSeen(notificationName);
      }
    },
  };
  if (redirectPath) {
    dispatchOptions.handleLinkClick = (event: MouseEvent) => {
      event.preventDefault();
      if (isDashlaneUrl(redirectPath)) {
        openDashlaneUrl(redirectPath, {
          type: "",
          action: "",
        });
      } else {
        lee.dispatchGlobal(removeNotification(notificationKey));
        redirect(redirectPath);
      }
    };
  }
  if (onClickButton) {
    dispatchOptions.handleButtonClick = () => {
      onClickButton();
    };
  }
  lee.dispatchGlobal(addNotification(dispatchOptions));
};
