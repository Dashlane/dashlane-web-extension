import { Button, Flex, Icon, Paragraph } from "@dashlane/design-system";
import { useModuleCommands } from "@dashlane/framework-react";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import useTranslate from "../../../../../../libs/i18n/useTranslate";
import { openUrl } from "../../../../../../libs/external-urls";
import { DASHLANE_CONTACT_SUPPORT_WITH_CHATBOT } from "../../../../../../webapp/urls";
import { Header, WebappLoginLayout } from "../../../components";
const I18N_ERROR_KEYS: Record<
  AuthenticationFlowContracts.DeviceToDeviceAuthenticationErrors,
  string
> = {
  GENERIC_ERROR: "_common_generic_error",
  TIMEOUT: "webapp_login_form_device_to_device_authentication_timeout_error",
  REQUEST_REJECTED:
    "webapp_login_form_device_to_device_authentication_rejected_error",
  ACCOUNT_ERROR:
    "webapp_login_form_device_to_device_authentication_account_error",
  RATE_LIMIT: "webapp_login_form_device_to_device_authentication_rate_limit",
};
export const I18N_KEYS = {
  LOGIN_HEADER: "webapp_login_form_heading_log_in",
  GO_TO_LOGIN:
    "webapp_login_form_device_to_device_authentication_go_to_login_cta",
  CONTACT_SUPPORT:
    "webapp_login_form_device_to_device_authentication_contact_support_cta",
  ...I18N_ERROR_KEYS,
};
type DeviceTransferErrorProps = Pick<
  AuthenticationFlowContracts.AuthenticationFlowDeviceToDeviceAuthenticationView,
  "error"
>;
const shouldDisplayContactSupport = ({ error }: DeviceTransferErrorProps) => {
  return (
    error &&
    AuthenticationFlowContracts.isDeviceToDeviceAuthenticationError(error) &&
    [
      AuthenticationFlowContracts.DeviceToDeviceAuthenticationErrors
        .ACCOUNT_ERROR,
      AuthenticationFlowContracts.DeviceToDeviceAuthenticationErrors.RATE_LIMIT,
    ].includes(error)
  );
};
export const DeviceTransferError = ({ error }: DeviceTransferErrorProps) => {
  const { translate } = useTranslate();
  const { changeLogin } = useModuleCommands(
    AuthenticationFlowContracts.authenticationFlowApi
  );
  return (
    <WebappLoginLayout>
      <Header text={translate(I18N_KEYS.LOGIN_HEADER)} />
      <Flex flexDirection="column" alignItems="center">
        <Icon
          name="FeedbackFailOutlined"
          color="ds.text.danger.quiet"
          sx={{ width: "77px", height: "77px" }}
        />
        <Paragraph
          sx={{
            textAlign: "center",
            margin: "32px 0",
            color: "ds.text.danger.standard",
          }}
        >
          {translate(I18N_KEYS[error ?? "GENERIC_ERROR"])}
        </Paragraph>
        <Button fullsize onClick={() => changeLogin({})}>
          {translate(I18N_KEYS.GO_TO_LOGIN)}
        </Button>
        {shouldDisplayContactSupport({ error }) ? (
          <Button
            fullsize
            mood="neutral"
            intensity="quiet"
            sx={{ marginTop: "8px" }}
            onClick={() => openUrl(DASHLANE_CONTACT_SUPPORT_WITH_CHATBOT)}
          >
            {translate(I18N_KEYS.CONTACT_SUPPORT)}
          </Button>
        ) : null}
      </Flex>
    </WebappLoginLayout>
  );
};
