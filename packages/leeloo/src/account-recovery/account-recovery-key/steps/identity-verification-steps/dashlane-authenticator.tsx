import { AuthenticationCode } from "@dashlane/communication";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { Button, Flex, Heading } from "@dashlane/design-system";
import { Result } from "@dashlane/framework-types";
import { FlowStep, UserUseAccountRecoveryKeyEvent } from "@dashlane/hermes";
import { Link, LoadingIcon, Paragraph } from "@dashlane/ui-components";
import { redirect } from "../../../../libs/router";
import useTranslate from "../../../../libs/i18n/useTranslate";
import failureLottie from "../../../../libs/assets/lottie-failure.json";
import Animation from "../../../../libs/dashlane-style/animation";
import { logEvent } from "../../../../libs/logs/logEvent";
import { LOGIN_URL_SEGMENT } from "../../../../app/routes/constants";
const I18N_KEYS = {
  DASHLANE_AUTHENTICATOR_TITLE:
    "webapp_dashlane_authenticator_authentication_title",
  CANT_ACCESS_APP:
    "webapp_dashlane_authenticator_authentication_cant_access_your_app",
  SEND_CODE_BY_EMAIL:
    "webapp_dashlane_authenticator_authentication_send_code_by_email_link",
  BUTTON_SEND_PUSH_NOTIFICATION:
    "webapp_dashlane_authenticator_authentication_send_another_push_button",
  VERIFY_YOUR_IDENTITY_STEP_VERIFY_BUTTON:
    "login_verify_your_identity_step_button",
  VERIFY_YOUR_IDENTITY_STEP_CANCEL_BUTTON: "_common_action_cancel",
};
const I18N_ERROR_KEYS_MAPPER = {
  generic: "_common_generic_error",
  [AuthenticationCode[
    AuthenticationCode.DASHLANE_AUTHENTICATOR_PUSH_NOTIFICATION_DENIED
  ]]: "webapp_dashlane_authenticator_authentication_error_denied",
  [AuthenticationCode[AuthenticationCode.TOKEN_EXPIRED]]:
    "webapp_dashlane_authenticator_authentication_error_timeout",
};
interface Props
  extends Pick<
    AuthenticationFlowContracts.AuthenticationFlowDashlaneAuthenticatorView,
    "error"
  > {
  resendPushNotification: () => Promise<Result<undefined>>;
  switchToEmailToken: () => Promise<Result<undefined>>;
  cancelAccountRecoveryKey: () => Promise<Result<undefined>>;
}
export const DashlaneAuthenticator = ({
  cancelAccountRecoveryKey,
  error,
  resendPushNotification,
  switchToEmailToken,
}: Props) => {
  const { translate } = useTranslate();
  const paragraphStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    lineHeight: "20px",
  };
  const handleResendPushNotification = () => {
    resendPushNotification();
  };
  const handleSwitchToEmailToken = () => {
    switchToEmailToken();
  };
  const handleCancel = () => {
    void cancelAccountRecoveryKey();
    logEvent(new UserUseAccountRecoveryKeyEvent({ flowStep: FlowStep.Cancel }));
    redirect(LOGIN_URL_SEGMENT);
  };
  return (
    <>
      <Heading
        as="h2"
        color="ds.text.neutral.catchy"
        textStyle="ds.title.section.medium"
      >
        {translate(I18N_KEYS.DASHLANE_AUTHENTICATOR_TITLE)}
      </Heading>

      {!error ? (
        <LoadingIcon
          data-testid="dashlane-authenticator-loading-icon"
          size="88px"
          color="ds.container.expressive.brand.catchy.active"
          sx={{
            margin: "32px 0px",
          }}
        />
      ) : (
        <Flex flexDirection="column" sx={{ margin: "32px 0px" }}>
          <div>
            <Animation
              height={88}
              width={88}
              animationParams={{
                renderer: "svg",
                animationData: failureLottie,
                loop: false,
                autoplay: true,
              }}
            />
          </div>

          <Paragraph
            size="small"
            color="ds.text.danger.quiet"
            sx={{
              ...paragraphStyle,
              marginTop: "16px ",
            }}
          >
            {translate(
              error
                ? I18N_ERROR_KEYS_MAPPER[error] ??
                    I18N_ERROR_KEYS_MAPPER["generic"]
                : I18N_ERROR_KEYS_MAPPER["generic"]
            )}
          </Paragraph>
        </Flex>
      )}

      <Flex>
        <Paragraph
          color="ds.text.neutral.quiet"
          sx={{ ...paragraphStyle, paddingRight: "4px" }}
        >
          {translate(I18N_KEYS.CANT_ACCESS_APP)}
        </Paragraph>
        <Link
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleSwitchToEmailToken}
          color="ds.text.brand.standard"
        >
          {translate(I18N_KEYS.SEND_CODE_BY_EMAIL)}
        </Link>
      </Flex>

      <div
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          marginTop: "40px",
        }}
      >
        <Button
          id="cancel-button"
          data-testid="cancel-button"
          mood="neutral"
          intensity="quiet"
          sx={{ marginRight: "16px" }}
          onClick={handleCancel}
        >
          {translate(I18N_KEYS.VERIFY_YOUR_IDENTITY_STEP_CANCEL_BUTTON)}
        </Button>
        {!error ? null : (
          <Button onClick={handleResendPushNotification}>
            {translate(I18N_KEYS.BUTTON_SEND_PUSH_NOTIFICATION)}
          </Button>
        )}
      </div>
    </>
  );
};
