import { useEffect } from "react";
import { DialogFooter, Paragraph } from "@dashlane/design-system";
import { useAnalyticsCommands } from "@dashlane/framework-react";
import { Result } from "@dashlane/framework-types";
import { PageView } from "@dashlane/hermes";
import { HeaderAccountRecoveryKey } from "./account-recovery-heading";
import useTranslate from "../../../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  ARK_GENERATE_NEW_KEY_TITLE:
    "webapp_account_recovery_key_generate_new_key_title",
  ARK_GENERATE_NEW_KEY_DESCRIPTION:
    "webapp_account_recovery_key_generate_new_key_description",
  ARK_GENERATE_NEW_KEY_CANCEL_BUTTON: "_common_action_cancel",
  ARK_GENERATE_NEW_KEY_CONTINUE_BUTTON:
    "webapp_account_recovery_key_first_step_generate_key",
};
interface Props {
  requestActivation: () => Promise<Result<undefined>>;
  resetActivationFlow: () => Promise<Result<undefined>>;
}
export const AccountRecoveryKeyActivationGenerateNewKeyStep = ({
  requestActivation,
  resetActivationFlow,
}: Props) => {
  const { translate } = useTranslate();
  const { trackPageView } = useAnalyticsCommands();
  useEffect(() => {
    trackPageView({
      pageView: PageView.SettingsSecurityRecoveryKeyGenerateNew,
    });
  }, []);
  return (
    <>
      <HeaderAccountRecoveryKey
        title={translate(I18N_KEYS.ARK_GENERATE_NEW_KEY_TITLE)}
        iconName="RecoveryKeyOutlined"
      />

      <Paragraph>
        {translate(I18N_KEYS.ARK_GENERATE_NEW_KEY_DESCRIPTION)}
      </Paragraph>

      <DialogFooter
        actions={{
          primary: {
            children: translate(I18N_KEYS.ARK_GENERATE_NEW_KEY_CONTINUE_BUTTON),
            onClick: () => {
              requestActivation();
            },
          },
          secondary: {
            children: translate(I18N_KEYS.ARK_GENERATE_NEW_KEY_CANCEL_BUTTON),
            onClick: () => {
              resetActivationFlow();
            },
          },
        }}
      />
    </>
  );
};
