import { useState } from "react";
import {
  DropdownContent,
  DropdownMenu,
  DropdownTriggerButton,
} from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
import { NavigateTacVaultDialog } from "../../navigate-tac-vault-dialog/navigate-tac-vault-dialog";
import { AccountButtonWithTooltip } from "./account-button-with-tooltip";
import { useUserLogin } from "../../account/hooks/use-user-login";
import { UserProfile } from "./account-menu/user-profile";
import { LockExtension } from "./account-menu/lock-extension";
import { DashlaneLabs } from "./account-menu/dashlane-labs";
import { Subscription } from "./account-menu/subscription";
import { LogoutExtension } from "./account-menu/logout-extension";
import { Settings } from "./account-menu/settings";
import { OpenConsole } from "./account-menu/open-console";
const I18N_KEYS = {
  ACCOUNT_LABEL: "webapp_account_root_header",
};
const accountButtonSx = {
  margin: "0 12px 0 0",
  ":hover:enabled:not(:active), :focus:enabled:not(:active)": {
    background: "transparent",
    border: `2px solid ds.oddity.focus`,
  },
};
const Divider = () => (
  <hr
    key="horizontal-divider"
    sx={{
      border: "none",
      borderTop: "1px solid ds.border.neutral.quiet.idle",
      margin: "8px 0",
      opacity: 0.8,
    }}
  />
);
interface HeaderAccountMenuProps {
  invertColors?: boolean;
  isOpen?: boolean;
}
export const HeaderAccountMenu = ({
  invertColors = false,
  isOpen,
}: HeaderAccountMenuProps) => {
  const { translate } = useTranslate();
  const userLogin = useUserLogin() ?? "";
  const [showConsoleDialog, setShowConsoleDialog] = useState(false);
  const [
    displayRecoveryActivationNotification,
    setDisplayRecoveryActivationNotification,
  ] = useState(false);
  return displayRecoveryActivationNotification ? (
    <AccountButtonWithTooltip
      accountButtonSx={accountButtonSx}
      color={
        invertColors ? "ds.text.inverse.quiet" : "ds.text.neutral.standard"
      }
      hideRecoveryNotification={() =>
        setDisplayRecoveryActivationNotification(false)
      }
    />
  ) : (
    <>
      <DropdownMenu align="end" isOpen={isOpen}>
        <DropdownTriggerButton
          showCaret={true}
          mood={invertColors ? "brand" : "neutral"}
          intensity={invertColors ? "catchy" : "supershy"}
          sx={{ zIndex: 99 }}
        >
          {translate(I18N_KEYS.ACCOUNT_LABEL)}
        </DropdownTriggerButton>
        <DropdownContent>
          <UserProfile login={userLogin} />
          <Subscription setShowConsoleDialog={setShowConsoleDialog} />
          <OpenConsole
            login={userLogin}
            setShowConsoleDialog={setShowConsoleDialog}
          />
          <DashlaneLabs />
          <Settings />
          <Divider />
          <LockExtension />
          <LogoutExtension />
        </DropdownContent>
      </DropdownMenu>
      {showConsoleDialog ? (
        <NavigateTacVaultDialog
          isShown={showConsoleDialog}
          setIsShown={setShowConsoleDialog}
          isFromVault={true}
        />
      ) : null}
    </>
  );
};
