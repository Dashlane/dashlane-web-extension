import { Button, Paragraph } from "@dashlane/design-system";
import { Result } from "@dashlane/framework-types";
import { EmailHeader } from "../../components";
import { Header } from "../../components/header";
import { ASK_ACCOUNT_RECOVERY_URL_REDIRECTION } from "../../constants";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { useHistory } from "../../../../../libs/router";
const I18N_KEYS = {
  MAX_ATTMEPTS_REACHED_HEADING:
    "webapp_login_form_pin_max_attempts_reached_title",
  MAX_ATTMEPTS_REACHED_PASSWORDLESS_MESSAGE:
    "webapp_login_form_pin_max_attempts_reached_passwordless_desc",
  LOGIN_WITH_ANOTHER_DEVICE_BUTTON:
    "webapp_login_form_pin_use_another_device_button",
  USE_RECOVERY_METHOD_BUTTON:
    "webapp_login_form_pin_use_recovery_method_button",
};
interface Props {
  loginEmail: string;
  switchToDeviceToDeviceAuthentication: () => Promise<Result<undefined>>;
}
export const MaxAttemptsReachedPasswordlessComponent = ({
  loginEmail,
  switchToDeviceToDeviceAuthentication,
}: Props) => {
  const { translate } = useTranslate();
  const history = useHistory();
  const handleUseRecoveryMethod = async () => {
    await switchToDeviceToDeviceAuthentication();
    history.push(`/login?${ASK_ACCOUNT_RECOVERY_URL_REDIRECTION}`);
  };
  return (
    <>
      <div
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <Header text={translate(I18N_KEYS.MAX_ATTMEPTS_REACHED_HEADING)} />
        <Paragraph>
          {translate(I18N_KEYS.MAX_ATTMEPTS_REACHED_PASSWORDLESS_MESSAGE)}
        </Paragraph>
        <EmailHeader selectedEmail={loginEmail} />
      </div>
      <div>
        <Button
          onClick={() => {
            void switchToDeviceToDeviceAuthentication();
          }}
          fullsize
          size="large"
          sx={{ marginBottom: "8px" }}
        >
          {translate(I18N_KEYS.LOGIN_WITH_ANOTHER_DEVICE_BUTTON)}
        </Button>
        <Button
          onClick={() => {
            void handleUseRecoveryMethod();
          }}
          mood="neutral"
          intensity="quiet"
          fullsize
          size="large"
        >
          {translate(I18N_KEYS.USE_RECOVERY_METHOD_BUTTON)}
        </Button>
      </div>
    </>
  );
};
