import { useEffect } from "react";
import { DialogFooter, Paragraph } from "@dashlane/design-system";
import { useAnalyticsCommands } from "@dashlane/framework-react";
import { Result } from "@dashlane/framework-types";
import {
  FlowStep,
  PageView,
  UserCreateAccountRecoveryKeyEvent,
} from "@dashlane/hermes";
import { HeaderAccountRecoveryKey } from "./account-recovery-heading";
import { useIsMPlessUser } from "../../../hooks/use-is-mpless-user";
import useTranslate from "../../../../../../libs/i18n/useTranslate";
import { logEvent } from "../../../../../../libs/logs/logEvent";
const I18N_KEYS = {
  ARK_ACTIVATION_INIT_STEP_TITLE:
    "webapp_account_recovery_key_first_step_title",
  ARK_ACTIVATION_INIT_STEP_DESCRIPTION_MPBASED:
    "webapp_account_recovery_key_first_step_description",
  ARK_ACTIVATION_INIT_STEP_DESCRIPTION_MPLESS:
    "webapp_account_recovery_key_first_step_description_passwordless",
  ARK_ACTIVATION_INIT_STEP_BUTTON:
    "webapp_account_recovery_key_first_step_generate_key",
};
interface Props {
  goToNextStep: () => Promise<Result<undefined>>;
}
export const AccountRecoveryKeyActivationInitStep = ({
  goToNextStep,
}: Props) => {
  const { translate } = useTranslate();
  const { trackPageView } = useAnalyticsCommands();
  const { isMPLessUser } = useIsMPlessUser();
  useEffect(() => {
    trackPageView({
      pageView: PageView.SettingsSecurityRecoveryKeyEnable,
    });
  }, []);
  const logUserCreateAccountRecoveryKeyEvent = () => {
    void logEvent(
      new UserCreateAccountRecoveryKeyEvent({ flowStep: FlowStep.Start })
    );
  };
  const handleStartActivation = () => {
    logUserCreateAccountRecoveryKeyEvent();
    void goToNextStep();
  };
  return (
    <>
      <HeaderAccountRecoveryKey
        title={translate(I18N_KEYS.ARK_ACTIVATION_INIT_STEP_TITLE)}
        iconName="RecoveryKeyOutlined"
      />

      <Paragraph>
        {isMPLessUser
          ? translate(I18N_KEYS.ARK_ACTIVATION_INIT_STEP_DESCRIPTION_MPLESS)
          : translate(I18N_KEYS.ARK_ACTIVATION_INIT_STEP_DESCRIPTION_MPBASED)}
      </Paragraph>

      <DialogFooter
        actions={{
          primary: {
            children: translate(I18N_KEYS.ARK_ACTIVATION_INIT_STEP_BUTTON),
            onClick: handleStartActivation,
          },
        }}
      />
    </>
  );
};
