import { Fragment, memo } from "react";
import { Flex } from "@dashlane/design-system";
import {
  Button,
  colors,
  CrossCircleIcon,
  jsx,
  LoadingIcon,
  Paragraph,
} from "@dashlane/ui-components";
import { AuthenticationCode } from "@dashlane/communication";
import useTranslate from "../../../libs/i18n/useTranslate";
const I18N_ERROR_KEYS_MAPPER = {
  generic: "popup_common_generic_error",
  [AuthenticationCode[
    AuthenticationCode.DASHLANE_AUTHENTICATOR_PUSH_NOTIFICATION_DENIED
  ]]: "login/dashlane_authenticator_error_denied",
  [AuthenticationCode[AuthenticationCode.TOKEN_EXPIRED]]:
    "login/dashlane_authenticator_error_timeout",
};
const I18N_KEYS = {
  DASHLANE_AUTHENTICATOR_TITLE: "login/dashlane_authenticator_title",
  SEND_CODE_BY_EMAIL: "login/dashlane_authenticator_send_code_by_email_button",
  BUTTON_SEND_PUSH_NOTIFICATION:
    "login/dashlane_authenticator_send_another_push_button",
};
export interface DashlaneAuthenticatorStepProps {
  switchToOtpTokenStep: () => void;
  sendDashlaneAuthenticatorPushNotification: () => void;
  errorKey?: string;
}
const DashlaneAuthenticatorStepComponent = ({
  errorKey,
  switchToOtpTokenStep,
  sendDashlaneAuthenticatorPushNotification,
}: DashlaneAuthenticatorStepProps) => {
  const { translate } = useTranslate();
  return (
    <Flex
      flexDirection="column"
      sx={{
        padding: "24px",
        height: "100%",
        textAlign: "center",
        marginTop: "120px",
      }}
      alignItems="center"
    >
      <Paragraph
        sx={{ fontSize: "21px", fontWeight: 500 }}
        color={colors.white}
      >
        {translate(I18N_KEYS.DASHLANE_AUTHENTICATOR_TITLE)}
      </Paragraph>
      {!errorKey ? (
        <LoadingIcon
          data-testid="dashlane-authenticator-loading-icon"
          size="80px"
          sx={{ margin: "24px 0px" }}
        />
      ) : (
        <>
          <CrossCircleIcon
            size={80}
            color={colors.white}
            sx={{ margin: "24px 0px" }}
            data-testid="dashlane-authenticator-error-icon"
          />
          <Paragraph color={colors.white}>
            {translate(
              I18N_ERROR_KEYS_MAPPER[errorKey]
                ? I18N_ERROR_KEYS_MAPPER[errorKey]
                : I18N_ERROR_KEYS_MAPPER["generic"]
            )}
          </Paragraph>
        </>
      )}
      <div sx={{ width: "100%", marginTop: "auto" }}>
        {errorKey ? (
          <Button
            type="button"
            nature="primary"
            size="large"
            theme="dark"
            onClick={() => {
              sendDashlaneAuthenticatorPushNotification();
            }}
            sx={{ marginBottom: "8px", width: "100%" }}
          >
            {translate(I18N_KEYS.BUTTON_SEND_PUSH_NOTIFICATION)}
          </Button>
        ) : null}
        <Button
          onClick={() => switchToOtpTokenStep()}
          type="button"
          nature="secondary"
          theme="dark"
          size="large"
          sx={{ width: "100%" }}
        >
          {translate(I18N_KEYS.SEND_CODE_BY_EMAIL)}
        </Button>
      </div>
    </Flex>
  );
};
export const DashlaneAuthenticatorStep = memo(
  DashlaneAuthenticatorStepComponent
);
