import { DialogFooter, Paragraph } from "@dashlane/design-system";
import { HeaderAccountRecoveryKey } from "./account-recovery-heading";
import useTanslate from "../../../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  ARK_ACTIVATION_CANCEL_DIALOG_TITLE:
    "webapp_account_recovery_key_activation_cancel_title",
  ARK_ACTIVATION_CANCEL_DIALOG_DESCRIPTION:
    "webapp_account_recovery_key_activation_cancel_description",
  ARK_GENERATE_NEW_KEY_CANCEL_TITLE:
    "webapp_account_recovery_key_cancel_generate_new_key_title",
  ARK_GENERATE_NEW_KEY_CANCEL_DESCRIPTION:
    "webapp_account_recovery_key_cancel_new_key_description",
  ARK_ACTIVATION_CANCEL_DIALOG_GO_BACK_BUTTON:
    "webapp_account_recovery_key_activation_cancel_primary_button",
  ARK_ACTIVATION_CANCEL_DIALOG_CANCEL_BUTTON:
    "webapp_account_recovery_key_activation_cancel_secondary_button",
};
interface Props {
  goBack: () => void;
  resetActivationFlow: () => void;
  isFeatureEnabled: boolean;
}
export const AccountRecoveryKeyActivationCancel = ({
  goBack,
  resetActivationFlow,
  isFeatureEnabled,
}: Props) => {
  const { translate } = useTanslate();
  return (
    <>
      <HeaderAccountRecoveryKey
        title={
          isFeatureEnabled
            ? translate(I18N_KEYS.ARK_GENERATE_NEW_KEY_CANCEL_TITLE)
            : translate(I18N_KEYS.ARK_ACTIVATION_CANCEL_DIALOG_TITLE)
        }
      />

      <Paragraph>
        {isFeatureEnabled
          ? translate(I18N_KEYS.ARK_GENERATE_NEW_KEY_CANCEL_DESCRIPTION)
          : translate(I18N_KEYS.ARK_ACTIVATION_CANCEL_DIALOG_DESCRIPTION)}
      </Paragraph>

      <DialogFooter
        actions={{
          primary: {
            children: translate(
              I18N_KEYS.ARK_ACTIVATION_CANCEL_DIALOG_GO_BACK_BUTTON
            ),
            onClick: goBack,
          },
          secondary: {
            children: translate(
              I18N_KEYS.ARK_ACTIVATION_CANCEL_DIALOG_CANCEL_BUTTON
            ),
            onClick: resetActivationFlow,
          },
        }}
      />
    </>
  );
};
