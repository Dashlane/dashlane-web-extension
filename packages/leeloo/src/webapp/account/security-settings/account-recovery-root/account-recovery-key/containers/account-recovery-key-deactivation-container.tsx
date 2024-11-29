import classnames from "classnames";
import { useEffect, useState } from "react";
import { accountRecoveryKeyApi } from "@dashlane/account-recovery-contracts";
import { Dialog, Paragraph } from "@dashlane/design-system";
import {
  useAnalyticsCommands,
  useModuleCommands,
} from "@dashlane/framework-react";
import { isFailure } from "@dashlane/framework-types";
import { DeleteKeyReason, PageView } from "@dashlane/hermes";
import { AccountRecoveryKeyErrorDialogBody } from "../components";
import { logUserDeleteAccountRecoveryKey } from "../helpers/logs";
import { allIgnoreClickOutsideClassName } from "../../../../../variables";
import useTranslate from "../../../../../../libs/i18n/useTranslate";
import { HeaderAccountRecoveryKey } from "../components/account-recovery-heading";
const I18N_KEYS = {
  ARK_DEACTIVATION_DIALOG_TITLE:
    "webapp_account_recovery_key_deactivation_title",
  ARK_DEACTIVATION_DIALOG_DESCRIPTION:
    "webapp_account_recovery_key_deactivation_description",
  BUTTON_CLOSE_DIALOG: "_common_dialog_dismiss_button",
  BUTTON_CANCEL: "_common_action_cancel",
  BUTTON_TURN_OFF: "webapp_account_recovery_key_deactivation_turn_off",
};
interface Props {
  onClose: () => void;
}
export const AccountRecoveryKeyDeactivationContainer = ({
  onClose: handleCloseDeactivationDialog,
}: Props) => {
  const { translate } = useTranslate();
  const { trackPageView } = useAnalyticsCommands();
  const { deactivate } = useModuleCommands(accountRecoveryKeyApi);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    trackPageView({
      pageView: PageView.SettingsSecurityRecoveryKeyDisable,
    });
  }, []);
  const handleDeactivate = async () => {
    try {
      setLoading(true);
      const resp = await deactivate({ reason: "SETTINGS" });
      if (isFailure(resp)) {
        setError(resp.error.tag);
        return;
      }
      logUserDeleteAccountRecoveryKey(DeleteKeyReason.SettingDisabled);
      setLoading(false);
      handleCloseDeactivationDialog();
    } catch (err) {
      setError(err);
    }
  };
  const handleCloseErrorDialog = () => {
    setError(null);
    handleCloseDeactivationDialog();
  };
  if (error) {
    return (
      <Dialog
        isOpen={true}
        aria-label="account-recovery-key-deactivation-dialog"
        disableScrolling
        onClose={() => handleCloseErrorDialog()}
        closeActionLabel={translate(I18N_KEYS.BUTTON_CLOSE_DIALOG)}
        dialogClassName={classnames(allIgnoreClickOutsideClassName)}
      >
        <AccountRecoveryKeyErrorDialogBody
          error={error}
          onClose={handleCloseErrorDialog}
        />
      </Dialog>
    );
  }
  return (
    <Dialog
      onClose={handleCloseDeactivationDialog}
      aria-label="account-recovery-key-deactivation-dialog"
      isOpen={true}
      disableScrolling
      closeActionLabel={translate(I18N_KEYS.BUTTON_CLOSE_DIALOG)}
      dialogClassName={classnames(allIgnoreClickOutsideClassName)}
      actions={{
        primary: {
          children: translate(I18N_KEYS.BUTTON_TURN_OFF),
          isLoading: loading,
          onClick: handleDeactivate,
        },
        secondary: {
          children: translate(I18N_KEYS.BUTTON_CANCEL),
          onClick: handleCloseDeactivationDialog,
        },
      }}
    >
      <HeaderAccountRecoveryKey
        title={translate(I18N_KEYS.ARK_DEACTIVATION_DIALOG_TITLE)}
        iconName="RecoveryKeyOutlined"
      />

      <Paragraph color="ds.text.neutral.standard">
        {translate(I18N_KEYS.ARK_DEACTIVATION_DIALOG_DESCRIPTION)}
      </Paragraph>
    </Dialog>
  );
};
