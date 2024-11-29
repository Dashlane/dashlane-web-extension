import { DropdownItem } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useRouterGlobalSettingsContext } from "../../../../libs/router";
import { useOpenTeamConsole } from "../../../../libs/hooks/use-open-team-console";
const I18N_KEYS = {
  ADMIN_CONSOLE: "manage_subscription_account_menu_admin_console",
};
interface OpenConsoleProps {
  login: string;
  setShowConsoleDialog: (isOpen: boolean) => void;
}
export const OpenConsole = ({
  login,
  setShowConsoleDialog,
}: OpenConsoleProps) => {
  const { openTeamConsole } = useOpenTeamConsole();
  const { translate } = useTranslate();
  const { store } = useRouterGlobalSettingsContext();
  const isInExtensionOrDesktop =
    APP_PACKAGED_IN_EXTENSION || APP_PACKAGED_IN_DESKTOP;
  const isBusinessAdmin =
    store.getState().user?.session?.permissions.tacAccessPermissions.size > 0;
  const goToOpenAdminConsoleDialog = (e: Event) => {
    if (isInExtensionOrDesktop) {
      e.preventDefault();
      openTeamConsole({
        email: login,
      });
    } else {
      setShowConsoleDialog(true);
    }
  };
  return isBusinessAdmin ? (
    <DropdownItem
      onSelect={(e) => goToOpenAdminConsoleDialog(e)}
      label={translate(I18N_KEYS.ADMIN_CONSOLE)}
      leadingIcon="DashboardOutlined"
    />
  ) : null;
};
