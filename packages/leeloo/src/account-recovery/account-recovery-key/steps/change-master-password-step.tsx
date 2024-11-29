import { useEffect, useState } from "react";
import { ConfirmNewPasswordRequest } from "@dashlane/account-recovery-contracts";
import {
  ExpressiveIcon,
  Flex,
  Heading,
  LinkButton,
  Paragraph,
} from "@dashlane/design-system";
import { Result } from "@dashlane/framework-types";
import {
  FlowStep,
  PageView,
  UserUseAccountRecoveryKeyEvent,
} from "@dashlane/hermes";
import useTranslate from "../../../libs/i18n/useTranslate";
import { CreatePasswordForm } from "../../../webapp/create-password-form/create-password-form";
import { PasswordTipsDialog } from "../../../create-master-password-panel/password-tips-dialog/password-tips-dialog";
import { redirect, useRouterGlobalSettingsContext } from "../../../libs/router";
import { registerRedirectPath } from "../../../libs/redirect/after-login/actions";
import { logEvent } from "../../../libs/logs/logEvent";
import {
  ACCOUNT_RECOVERY_KEY_RESULT_SEGMENT,
  LOGIN_URL_SEGMENT,
} from "../../../app/routes/constants";
import { useAnalyticsCommands } from "@dashlane/framework-react";
const I18N_KEYS = {
  ACCOUNT_RECOVERY_STEP_COUNT: "login_confirm_account_recovery_key_step_count",
  TITLE: "login_account_recovery_key_create_password_step_title",
  FIRST_DESCRIPTION: "login_account_recovery_key_create_password_step_help_1",
  SECOND_DESCRIPTION: "login_account_recovery_key_create_password_step_help_2",
  HELP_LINK: "webapp_account_security_settings_changemp_panel_infotext",
  CONTINUE_BUTTON: "_common_action_continue",
  CANCEL_BUTTON: "_common_action_cancel",
  PASSWORD_FIELD_LABEL:
    "login_account_recovery_key_create_password_step_password_field_label",
  PASSWORD_FIELD_PLACEHOLDER:
    "login_account_recovery_key_create_password_step_password_field_placeholder",
  CONFIRM_PASSWORD_FIELD_LABEL:
    "login_account_recovery_key_create_password_step_confirm_password_field_label",
  CONFIRM_PASSWORD_FIELD_PLACEHOLDER:
    "login_account_recovery_key_create_password_step_confirm_password_field_placeholder",
};
interface Props {
  onSubmit: (command: ConfirmNewPasswordRequest) => Promise<Result<undefined>>;
  onCancel: () => Promise<Result<undefined>>;
}
export const ChangeMasterPasswordStep = ({ onSubmit, onCancel }: Props) => {
  const { translate } = useTranslate();
  const { trackPageView } = useAnalyticsCommands();
  const [showPasswordTips, setShowPasswordTips] = useState(false);
  const routerGlobalSettings = useRouterGlobalSettingsContext();
  useEffect(() => {
    trackPageView({
      pageView: PageView.LoginMasterPasswordAccountRecoveryCreateNewMp,
    });
  }, []);
  const handleShowPasswordTips = (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault();
    setShowPasswordTips(true);
  };
  const handleSubmit = (password: string) => {
    routerGlobalSettings.store.dispatch(
      registerRedirectPath(ACCOUNT_RECOVERY_KEY_RESULT_SEGMENT)
    );
    onSubmit({ password });
  };
  const handleCancel = () => {
    onCancel();
    logEvent(new UserUseAccountRecoveryKeyEvent({ flowStep: FlowStep.Cancel }));
    redirect(LOGIN_URL_SEGMENT);
  };
  return (
    <Flex
      sx={{ flexDirection: "column", alignItems: "start", textAlign: "left" }}
    >
      <PasswordTipsDialog
        showPasswordTipsDialog={showPasswordTips}
        handleDismiss={() => {
          setShowPasswordTips(false);
        }}
      />
      <ExpressiveIcon
        name="RecoveryKeyOutlined"
        size="xlarge"
        mood="brand"
        sx={{ marginBottom: "24px" }}
      />
      <Paragraph color="ds.text.neutral.quiet" sx={{ marginBottom: "8px" }}>
        {translate(I18N_KEYS.ACCOUNT_RECOVERY_STEP_COUNT, {
          count: 2,
          total: 2,
        })}
      </Paragraph>
      <Heading
        as="h1"
        textStyle="ds.title.section.large"
        sx={{ marginBottom: "16px" }}
      >
        {translate(I18N_KEYS.TITLE)}
      </Heading>
      <Paragraph>{translate(I18N_KEYS.FIRST_DESCRIPTION)}</Paragraph>
      <Paragraph sx={{ margin: "16px 0" }}>
        {translate(I18N_KEYS.SECOND_DESCRIPTION)}
      </Paragraph>
      <LinkButton
        href="#"
        onClick={handleShowPasswordTips}
        sx={{
          display: "block",
          marginBottom: "16px",
        }}
      >
        {translate(I18N_KEYS.HELP_LINK)}
      </LinkButton>
      <CreatePasswordForm
        onDismiss={handleCancel}
        onSubmit={handleSubmit}
        primaryButtonTitle={translate(I18N_KEYS.CONTINUE_BUTTON)}
        secondaryButtonTitle={translate(I18N_KEYS.CANCEL_BUTTON)}
        createPasswordInputLabel={translate(I18N_KEYS.PASSWORD_FIELD_LABEL)}
        createPasswordPlaceholderLabel={translate(
          I18N_KEYS.PASSWORD_FIELD_PLACEHOLDER
        )}
        confirmPasswordInputLabel={translate(
          I18N_KEYS.CONFIRM_PASSWORD_FIELD_LABEL
        )}
        confirmPasswordPlaceholderLabel={translate(
          I18N_KEYS.CONFIRM_PASSWORD_FIELD_PLACEHOLDER
        )}
      />
    </Flex>
  );
};
