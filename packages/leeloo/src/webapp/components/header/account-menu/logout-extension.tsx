import { DropdownItem } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { logLogoutEvent } from "../../../account/logs";
import { useWebappLogoutDialogContext } from "../../../webapp-logout-dialog-context";
const I18N_KEYS = {
  LOGOUT: "manage_subscription_account_menu_logout",
};
export const LogoutExtension = () => {
  const { translate } = useTranslate();
  const { openLogoutDialog } = useWebappLogoutDialogContext();
  const handleLogout = () => {
    logLogoutEvent();
    openLogoutDialog();
  };
  return (
    <DropdownItem
      data-testid="logoutItem"
      onSelect={handleLogout}
      label={translate(I18N_KEYS.LOGOUT)}
      leadingIcon="LogOutOutlined"
    />
  );
};
