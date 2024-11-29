import { AlertSeverity } from "@dashlane/ui-components";
import { Lee } from "../../../lee";
import { showNotification } from "./notification";
import { NotificationName } from "@dashlane/communication";
import { openUrl } from "../../../libs/external-urls";
import { WEBAPP_LOGIN } from "../../urls";
import { browser } from "@dashlane/browser-utils";
interface ShowTacInExtensionNotificationParameters {
  lee: Lee;
  setIsVaultNavigationModalOpen: (isVaultNavigationOpen: boolean) => void;
}
const I18N_KEYS = {
  MESSAGE: "team_tac_notification_message",
  BUTTON_OPEN_VAULT: "team_tac_notification_open_vault_button",
};
export const showTacInExtensionNotification = ({
  lee,
  setIsVaultNavigationModalOpen,
}: ShowTacInExtensionNotificationParameters) => {
  const onClickButton = () => {
    if (!APP_PACKAGED_IN_EXTENSION && !browser.isSafari()) {
      setIsVaultNavigationModalOpen(true);
    } else {
      openUrl(WEBAPP_LOGIN);
    }
  };
  showNotification({
    lee,
    notificationKey: I18N_KEYS.MESSAGE,
    buttonTextKey: I18N_KEYS.BUTTON_OPEN_VAULT,
    level: AlertSeverity.SUBTLE,
    onClickButton,
    notificationName: NotificationName.TacGetTheExtensionBanner,
  });
};
