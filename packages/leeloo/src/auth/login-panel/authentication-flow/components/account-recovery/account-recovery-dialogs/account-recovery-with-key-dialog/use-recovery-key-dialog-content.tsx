import { accountRecoveryKeyApi } from "@dashlane/account-recovery-contracts";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { DialogFooter, DialogTitle, Paragraph } from "@dashlane/design-system";
import { useModuleCommands, useModuleQuery } from "@dashlane/framework-react";
import { FlowStep, UserUseAccountRecoveryKeyEvent } from "@dashlane/hermes";
import { ACCOUNT_RECOVERY_KEY_URL_SEGMENT } from "../../../../../../../app/routes/constants";
import { logEvent } from "../../../../../../../libs/logs/logEvent";
import useTranslate from "../../../../../../../libs/i18n/useTranslate";
import { redirect } from "../../../../../../../libs/router";
export const I18N_KEYS = {
  USE_YOUR_RECOVERY_KEY_TITLE: "webapp_login_form_use_your_recovery_key_title",
  USE_YOUR_RECOVERY_KEY_DESCRIPTION:
    "webapp_login_form_use_your_recovery_key_description",
  BUTTON_LOST_YOUR_KEY:
    "webapp_login_form_use_your_recovery_key_lost_key_button",
  BUTTON_START_RECOVERY: "webapp_login_form_use_your_recovery_key_start_button",
};
interface Props {
  onLostKey: () => void;
}
export const UseRecoveryKeyDialogContent = ({ onLostKey }: Props) => {
  const { translate } = useTranslate();
  const { startRecoveryFlow } = useModuleCommands(accountRecoveryKeyApi);
  const authenticationFlowStatus = useModuleQuery(
    AuthenticationFlowContracts.authenticationFlowApi,
    "authenticationFlowStatus"
  );
  const handleStartRecoveryFlow = () => {
    if (authenticationFlowStatus.data?.step !== "MasterPasswordStep") {
      throw new Error(
        "Cant perform AR outside of Master Password step of the Login flow"
      );
    }
    void startRecoveryFlow({
      login: authenticationFlowStatus.data?.loginEmail,
    });
    logEvent(new UserUseAccountRecoveryKeyEvent({ flowStep: FlowStep.Start }));
    redirect(ACCOUNT_RECOVERY_KEY_URL_SEGMENT);
  };
  return (
    <>
      <DialogTitle title={translate(I18N_KEYS.USE_YOUR_RECOVERY_KEY_TITLE)} />

      <Paragraph color="ds.text.neutral.standard">
        {translate(I18N_KEYS.USE_YOUR_RECOVERY_KEY_DESCRIPTION)}
      </Paragraph>

      <DialogFooter
        actions={{
          primary: {
            children: translate(I18N_KEYS.BUTTON_LOST_YOUR_KEY),
            onClick: onLostKey,
          },
          secondary: {
            children: translate(I18N_KEYS.BUTTON_START_RECOVERY),
            onClick: handleStartRecoveryFlow,
          },
        }}
      />
    </>
  );
};
