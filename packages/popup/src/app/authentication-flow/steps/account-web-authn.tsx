import { Fragment, useEffect, useRef } from "react";
import useTranslate from "../../../libs/i18n/useTranslate";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { Button, jsx, Paragraph } from "@dashlane/design-system";
import { useAnalyticsCommands } from "@dashlane/framework-react";
import { Result } from "@dashlane/framework-types";
import {
  Mode,
  PageView,
  UserAskUseOtherAuthenticationEvent,
} from "@dashlane/hermes";
import { BiometricOutlinedIcon } from "@dashlane/ui-components";
import { EmailHeader } from "../components";
import { Header } from "../components/header";
import { PopupLoginLayout } from "../components/popup-login-layout";
import { FORM_SX_STYLES } from "../constants";
import { triggerWebAuthn } from "../helpers/trigger-webauthn";
import { logEvent } from "../../../libs/logs/logEvent";
import { usePinCodeStatusForUser } from "../hooks/use-pin-code-status-for-user";
interface Props
  extends Omit<
    AuthenticationFlowContracts.AuthenticationFlowWebAuthnView,
    "step"
  > {
  retryWebAuthnAuthentication: () => Promise<Result<undefined>>;
  switchToMasterPassword: () => Promise<Result<undefined>>;
  switchToPinCode: () => Promise<Result<undefined>>;
  webAuthnAuthenticationFail: (params: {
    webAuthnError: string;
  }) => Promise<Result<undefined>>;
}
export const I18N_KEYS = {
  TITLE: "login/unlock_your_vault_label",
  BUTTON_USE_MP: "login/webauthn_button_use_master_password",
  ERROR_TITLE: "login/webauthn_error_title",
  ERROR_DESCRIPTION: "login/webauthn_error_description",
  BUTTON_RETRY: "login/webauthn_error_button_retry",
  BUTTON_USE_PIN_CODE: "login/form_webauthn_use_pin",
};
export const AccountWebAuthn = ({
  loginEmail,
  error,
  switchToMasterPassword,
  switchToPinCode,
  retryWebAuthnAuthentication,
  webAuthnAuthenticationFail,
  localAccounts,
}: Props) => {
  const { translate } = useTranslate();
  const { trackPageView } = useAnalyticsCommands();
  useEffect(() => {
    void trackPageView({
      pageView: PageView.LoginWebauthn,
    });
  }, []);
  const authAbortController = useRef<AbortController>(new AbortController());
  const pinCodeStatus = usePinCodeStatusForUser(loginEmail);
  const isAllowedToUsePinCode = pinCodeStatus.isPinCodeEnabled;
  const webAuthnAuthentication = async () => {
    if (loginEmail) {
      const webAuthnResult = await triggerWebAuthn(
        loginEmail,
        authAbortController.current.signal
      );
      if (
        !webAuthnResult.success &&
        authAbortController.current.signal.aborted
      ) {
        authAbortController.current = new AbortController();
      } else if (!webAuthnResult.success) {
        void webAuthnAuthenticationFail({
          webAuthnError: webAuthnResult.error as string,
        });
      }
    }
  };
  const onUseMasterPasswordClick = () => {
    authAbortController.current.abort();
    void logEvent(
      new UserAskUseOtherAuthenticationEvent({
        next: Mode.MasterPassword,
        previous: Mode.Biometric,
      })
    );
    void switchToMasterPassword();
  };
  const onUsePinCodeClick = () => {
    authAbortController.current.abort();
    void logEvent(
      new UserAskUseOtherAuthenticationEvent({
        next: Mode.Pin,
        previous: Mode.Biometric,
      })
    );
    void switchToPinCode();
  };
  const onRetryWebAuthnAuthentication = () => {
    void retryWebAuthnAuthentication();
    void webAuthnAuthentication();
  };
  useEffect(() => {
    void webAuthnAuthentication();
  }, []);
  return (
    <>
      <EmailHeader
        loginEmail={loginEmail ?? ""}
        showAccountsActionsDropdown
        showLogoutDropdown={false}
        localAccounts={localAccounts}
      />

      <form sx={FORM_SX_STYLES}>
        <PopupLoginLayout>
          <Header
            text={translate(error ? I18N_KEYS.ERROR_TITLE : I18N_KEYS.TITLE)}
          />
          {error ? (
            <Paragraph color="ds.text.neutral.standard">
              {translate(I18N_KEYS.ERROR_DESCRIPTION)}
            </Paragraph>
          ) : (
            <BiometricOutlinedIcon
              sx={{ margin: "100px auto" }}
              size={80}
              color="ds.text.neutral.standard"
              aria-hidden="true"
            />
          )}
        </PopupLoginLayout>

        {!isAllowedToUsePinCode ? (
          <Button onClick={onUseMasterPasswordClick} fullsize size="large">
            {translate(I18N_KEYS.BUTTON_USE_MP)}
          </Button>
        ) : (
          <Button onClick={onUsePinCodeClick} fullsize size="large">
            {translate(I18N_KEYS.BUTTON_USE_PIN_CODE)}
          </Button>
        )}

        {error ? (
          <Button
            onClick={onRetryWebAuthnAuthentication}
            mood="neutral"
            intensity="quiet"
            fullsize
            size="large"
            sx={{ marginTop: "8px" }}
          >
            {translate(I18N_KEYS.BUTTON_RETRY)}
          </Button>
        ) : null}
      </form>
    </>
  );
};
