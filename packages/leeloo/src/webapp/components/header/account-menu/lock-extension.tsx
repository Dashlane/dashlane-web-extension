import { DropdownItem } from "@dashlane/design-system";
import { UserLockAppEvent } from "@dashlane/hermes";
import { useModuleCommands } from "@dashlane/framework-react";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { logEvent } from "../../../../libs/logs/logEvent";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useCanLockApp } from "../hooks/use-can-lock-app";
const I18N_KEYS = {
  LOCK: "webapp_account_root_item_lock",
};
export const LockExtension = () => {
  const { translate } = useTranslate();
  const canLockApp = useCanLockApp();
  const { lockSession } = useModuleCommands(
    AuthenticationFlowContracts.authenticationFlowApi
  );
  const handleLock = () => {
    logEvent(new UserLockAppEvent({}));
    void lockSession();
  };
  return APP_PACKAGED_IN_EXTENSION && canLockApp ? (
    <DropdownItem
      data-testid="lockItem"
      onSelect={handleLock}
      label={translate(I18N_KEYS.LOCK)}
      leadingIcon="LockOutlined"
    />
  ) : null;
};
