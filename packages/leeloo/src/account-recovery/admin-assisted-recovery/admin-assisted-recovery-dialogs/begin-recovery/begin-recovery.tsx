import { Dialog, ExpressiveIcon, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useHistory } from "../../../../libs/router";
import { useRouterGlobalSettingsContext } from "../../../../libs/router/RouterGlobalSettingsProvider";
export const I18N_ACCOUNT_RECOVERY_KEYS = {
  TITLE: "webapp_login_form_account_recovery_title",
  SUBTITLE: "webapp_login_form_account_recovery_subtitle",
  CONFIRM: "webapp_login_form_account_recovery_confirm",
  DISMISS: "webapp_login_form_account_recovery_dismiss",
  CLOSE: "_common_dialog_dismiss_button",
};
interface BeginAccountRecoveryProps {
  showAccountRecoveryDialog: boolean;
  handleDismiss: () => void;
}
export const BeginAccountRecoveryDialog = ({
  showAccountRecoveryDialog,
  handleDismiss,
}: BeginAccountRecoveryProps) => {
  const { translate } = useTranslate();
  const history = useHistory();
  const { routes } = useRouterGlobalSettingsContext();
  const handleOnStartAccountRecovery = () => {
    handleDismiss();
    history.push(routes.userDeviceRegistration);
  };
  const onHandleCloseAccountRecoveryDialog = () => {
    handleDismiss();
  };
  return (
    <Dialog
      isOpen={showAccountRecoveryDialog}
      onClose={onHandleCloseAccountRecoveryDialog}
      closeActionLabel={translate(I18N_ACCOUNT_RECOVERY_KEYS.CLOSE)}
      decorationSlot={
        <ExpressiveIcon name="RecoveryKeyOutlined" size="xlarge" mood="brand" />
      }
      title={translate(I18N_ACCOUNT_RECOVERY_KEYS.TITLE)}
      actions={{
        primary: {
          children: translate(I18N_ACCOUNT_RECOVERY_KEYS.CONFIRM),
          onClick: handleOnStartAccountRecovery,
        },
        secondary: {
          children: translate(I18N_ACCOUNT_RECOVERY_KEYS.DISMISS),
          onClick: onHandleCloseAccountRecoveryDialog,
        },
      }}
    >
      <Paragraph>{translate(I18N_ACCOUNT_RECOVERY_KEYS.SUBTITLE)}</Paragraph>
    </Dialog>
  );
};
