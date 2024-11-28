import { FunctionComponent } from "react";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { LocalAccountInfo } from "@dashlane/communication";
import { jsx } from "@dashlane/design-system";
import { useModuleCommands } from "@dashlane/framework-react";
import { UserUseAnotherAccountEvent } from "@dashlane/hermes";
import { openWebAppAndClosePopup } from "../../helpers";
import DropdownMenu, {
  MenuItem,
} from "../../../components/dropdown/dropdown-menu/dropdown";
import useTranslate from "../../../libs/i18n/useTranslate";
import { ThemeEnum } from "../../../libs/helpers-types";
import { logEvent } from "../../../libs/logs/logEvent";
import { useLogout } from "../../../libs/hooks/useLogout";
export interface EmailHeaderProps {
  loginEmail: string;
  showAccountsActionsDropdown: boolean;
  showLogoutDropdown: boolean;
  localAccounts?: LocalAccountInfo[];
}
const openWebAppSignup = () => {
  void openWebAppAndClosePopup({ route: "/signup" });
};
const I18N_KEYS = {
  LOG_OUT: "login/log_out",
  NEW_ACCOUNT: "login/action_new_account",
  OTHER_ACCOUNT: "login/action_other_account",
  LOGO: "login/logo_a11y",
};
export const EmailHeader: FunctionComponent<EmailHeaderProps> = ({
  loginEmail,
  showAccountsActionsDropdown,
  showLogoutDropdown,
  localAccounts = [],
}: EmailHeaderProps) => {
  const { translate } = useTranslate();
  const logout = useLogout();
  const { changeLogin } = useModuleCommands(
    AuthenticationFlowContracts.authenticationFlowApi
  );
  const logUserUseAnotherAccountEvent = () => {
    void logEvent(new UserUseAnotherAccountEvent({}));
  };
  const menuItems: MenuItem[] = [
    ...localAccounts.map((account) => ({
      label: account.login,
      onClick: () =>
        loginEmail !== account.login && changeLogin({ login: account.login }),
      isSecondaryOption: false,
    })),
  ];
  if (showAccountsActionsDropdown) {
    menuItems.push(
      {
        label: translate(I18N_KEYS.OTHER_ACCOUNT),
        onClick: () => {
          logUserUseAnotherAccountEvent();
          void changeLogin({});
        },
        isSecondaryOption: true,
      },
      {
        label: translate(I18N_KEYS.NEW_ACCOUNT),
        onClick: openWebAppSignup,
        isSecondaryOption: true,
      }
    );
  }
  const handleLogoutClick = () => {
    void logout();
  };
  const logoutDropdownMenuItems: MenuItem[] = [
    {
      label: translate(I18N_KEYS.LOG_OUT),
      onClick: handleLogoutClick,
      isSecondaryOption: false,
    },
  ];
  return (
    <div sx={{ padding: "0px 24px 4px", maxWidth: "300px" }} role="navigation">
      {showLogoutDropdown ? (
        <DropdownMenu
          title={loginEmail}
          items={logoutDropdownMenuItems}
          theme={ThemeEnum.Light}
        />
      ) : menuItems.length > 0 ? (
        <DropdownMenu
          title={loginEmail}
          items={menuItems}
          theme={ThemeEnum.Light}
        />
      ) : null}
    </div>
  );
};
