import { DialogFooter, Paragraph } from "@dashlane/design-system";
import { Result } from "@dashlane/framework-types";
import { HeaderAccountRecoveryKey } from "./account-recovery-heading";
import useTranslate from "../../../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  ARK_GENERATE_NEW_KEY_CANCEL_TITLE:
    "webapp_account_recovery_key_cancel_generate_new_key_title",
  ARK_GENERATE_NEW_KEY_CANCEL_DESCRIPTION:
    "webapp_account_recovery_key_cancel_new_key_description",
  ARK_GENERATE_NEW_KEY_CANCEL_GO_BACK_BUTTON: "_common_action_go_back",
  ARK_GENERATE_NEW_KEY_CANCEL_BUTTON:
    "webapp_account_recovery_key_cancel_new_key_button",
};
interface Props {
  goToPrevStep: () => Promise<Result<undefined>>;
  onClose: () => void;
}
export const AccountRecoveryKeyActivationCancelNewKeyStep = ({
  goToPrevStep,
  onClose,
}: Props) => {
  const { translate } = useTranslate();
  return (
    <>
      <HeaderAccountRecoveryKey
        title={translate(I18N_KEYS.ARK_GENERATE_NEW_KEY_CANCEL_TITLE)}
        iconName="RecoveryKeyOutlined"
      />

      <Paragraph>
        {translate(I18N_KEYS.ARK_GENERATE_NEW_KEY_CANCEL_DESCRIPTION)}
      </Paragraph>

      <DialogFooter
        actions={{
          primary: {
            children: translate(I18N_KEYS.ARK_GENERATE_NEW_KEY_CANCEL_BUTTON),
            onClick: onClose,
          },
          secondary: {
            children: translate(
              I18N_KEYS.ARK_GENERATE_NEW_KEY_CANCEL_GO_BACK_BUTTON
            ),
            onClick: () => {
              goToPrevStep();
            },
          },
        }}
      />
    </>
  );
};
