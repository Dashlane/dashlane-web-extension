import { Fragment } from "react";
import { Button, jsx, Paragraph } from "@dashlane/design-system";
import { Result } from "@dashlane/framework-types";
import { Header } from "../../components/header";
import { PopupLoginLayout } from "../../components/popup-login-layout";
import { openWebAppAndClosePopup } from "../../../helpers";
import useTranslate from "../../../../libs/i18n/useTranslate";
export const I18N_KEYS = {
  MAX_ATTMEPTS_REACHED_HEADING: "login/heading_max_pin_attempts_reached",
  MAX_ATTMEPTS_REACHED_PASSWORDLESS_MESSAGE:
    "login/desc_max_pin_attempts_reached_passwordless",
  USE_RECOVERY_METHOD_BUTTON: "login/form_pin_use_recovery_method",
  LOGIN_WITH_ANOTHER_DEVICE_BUTTON: "login/form_pin_login_with_another_device",
};
interface Props {
  switchToDeviceToDeviceAuthentication: () => Promise<Result<undefined>>;
}
export const MaxAttemptsReachedPasswordlessComponent = ({
  switchToDeviceToDeviceAuthentication,
}: Props) => {
  const { translate } = useTranslate();
  const handleUseRecoveryMethod = async () => {
    await switchToDeviceToDeviceAuthentication();
    void openWebAppAndClosePopup({
      route: "login?ask-account-recovery",
    });
  };
  return (
    <>
      <PopupLoginLayout>
        <Header text={translate(I18N_KEYS.MAX_ATTMEPTS_REACHED_HEADING)} />
        <Paragraph>
          {translate(I18N_KEYS.MAX_ATTMEPTS_REACHED_PASSWORDLESS_MESSAGE)}
        </Paragraph>
      </PopupLoginLayout>
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
    </>
  );
};
