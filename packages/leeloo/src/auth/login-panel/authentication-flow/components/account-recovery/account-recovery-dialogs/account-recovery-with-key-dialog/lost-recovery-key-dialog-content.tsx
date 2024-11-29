import {
  Button,
  DialogFooter,
  DialogTitle,
  Paragraph,
} from "@dashlane/design-system";
import {
  ACCOUNT_RESET_INFO_URL,
  HELPCENTER_FORGOT_MASTER_PASSWORD_URL,
} from "../../../../../../../app/routes/constants";
import useTranslate from "../../../../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  RECOVERY_KEY_LOST_TITLE: "webapp_login_form_lost_recovery_key_start_title",
  RECOVERY_KEY_LOST_DESCRIPTION_PRIMARY:
    "webapp_login_form_lost_recovery_key_description_primary",
  RECOVERY_KEY_LOST_DESCRIPTION_SECONDARY:
    "webapp_login_form_lost_recovery_key_description_secondary",
  BUTTON_LEARN_MORE: "webapp_login_form_lost_recovery_key_learn_more_button",
  BUTTON_RESET_ACCOUNT:
    "webapp_login_form_lost_recovery_key_reset_account_button",
};
export const LostRecoveryKeyDialogContent = () => {
  const { translate } = useTranslate();
  return (
    <>
      <DialogTitle title={translate(I18N_KEYS.RECOVERY_KEY_LOST_TITLE)} />

      <Paragraph>
        {translate(I18N_KEYS.RECOVERY_KEY_LOST_DESCRIPTION_PRIMARY)}
      </Paragraph>

      <Paragraph>
        {translate(I18N_KEYS.RECOVERY_KEY_LOST_DESCRIPTION_SECONDARY)}
      </Paragraph>

      <DialogFooter
        actions={{
          primary: (
            <Button
              as="a"
              icon="ActionOpenExternalLinkOutlined"
              layout="iconTrailing"
              href={ACCOUNT_RESET_INFO_URL}
              target="_blank"
              rel="noreferrer"
            >
              {translate(I18N_KEYS.BUTTON_RESET_ACCOUNT)}
            </Button>
          ),
          secondary: (
            <Button
              as="a"
              icon="ActionOpenExternalLinkOutlined"
              layout="iconTrailing"
              href={HELPCENTER_FORGOT_MASTER_PASSWORD_URL}
              target="_blank"
              rel="noreferrer"
            >
              {translate(I18N_KEYS.BUTTON_LEARN_MORE)}
            </Button>
          ),
        }}
      />
    </>
  );
};
