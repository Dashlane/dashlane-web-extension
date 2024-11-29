import { useEffect } from "react";
import { DialogFooter } from "@dashlane/design-system";
import { useAnalyticsCommands } from "@dashlane/framework-react";
import { PageView } from "@dashlane/hermes";
import { HeaderAccountRecoveryKey } from "./account-recovery-heading";
import useTranslate from "../../../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  ARK_ACTIVATION_INIT_STEP_DESCRIPTION:
    "webapp_account_recovery_key_fourth_step_description",
  ARK_ACTIVATION_INIT_STEP_BUTTON: "_common_dialog_done_button",
};
export interface AccountRecoveryKeyActivationFinalStepProps {
  onClose: () => void;
}
export const AccountRecoveryKeyActivationFinalStep = ({
  onClose,
}: AccountRecoveryKeyActivationFinalStepProps) => {
  const { translate } = useTranslate();
  const { trackPageView } = useAnalyticsCommands();
  useEffect(() => {
    trackPageView({
      pageView: PageView.SettingsSecurityRecoveryKeySuccess,
    });
  }, []);
  return (
    <>
      <HeaderAccountRecoveryKey
        title={translate(I18N_KEYS.ARK_ACTIVATION_INIT_STEP_DESCRIPTION)}
        iconName="FeedbackSuccessOutlined"
        isSuccess
      />

      <DialogFooter
        actions={{
          primary: {
            children: translate(I18N_KEYS.ARK_ACTIVATION_INIT_STEP_BUTTON),
            onClick: onClose,
          },
        }}
      />
    </>
  );
};
