import { Fragment } from "react";
import { Button, jsx, Paragraph } from "@dashlane/design-system";
import { Result } from "@dashlane/framework-types";
import { Header } from "../../components/header";
import { PopupLoginLayout } from "../../components/popup-login-layout";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { openWebAppAndClosePopup } from "../../../helpers";
export const I18N_KEYS = {
  MAX_ATTMEPTS_REACHED_HEADING: "login/heading_max_pin_attempts_reached",
  MAX_ATTMEPTS_REACHED_MP_MESSAGE: "login/desc_max_pin_attempts_reached",
  LOGIN_WITH_MP_BUTTON: "login/form_pin_login_with_mp",
  PASSWORD_FORGOT_BUTTON: "login/password_forgot",
};
interface Props {
  switchToMasterPassword: () => Promise<Result<undefined>>;
}
export const MaxAttemptsReachedMasterPasswordComponent = ({
  switchToMasterPassword,
}: Props) => {
  const { translate } = useTranslate();
  const handleForgotMasterPassword = async () => {
    await switchToMasterPassword();
    void openWebAppAndClosePopup({
      route: "login?ask-account-recovery",
    });
  };
  return (
    <>
      <PopupLoginLayout>
        <Header text={translate(I18N_KEYS.MAX_ATTMEPTS_REACHED_HEADING)} />
        <Paragraph>
          {translate(I18N_KEYS.MAX_ATTMEPTS_REACHED_MP_MESSAGE)}
        </Paragraph>
      </PopupLoginLayout>
      <Button
        onClick={() => {
          void switchToMasterPassword();
        }}
        fullsize
        size="large"
        sx={{ marginBottom: "8px" }}
      >
        {translate(I18N_KEYS.LOGIN_WITH_MP_BUTTON)}
      </Button>
      <Button
        onClick={() => {
          void handleForgotMasterPassword();
        }}
        mood="neutral"
        intensity="quiet"
        fullsize
        size="large"
      >
        {translate(I18N_KEYS.PASSWORD_FORGOT_BUTTON)}
      </Button>
    </>
  );
};
