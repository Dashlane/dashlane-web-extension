import {
  Button,
  Flex,
  IndeterminateLoader,
  Paragraph,
} from "@dashlane/design-system";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { useModuleCommands } from "@dashlane/framework-react";
import useTranslate from "../../../../../../libs/i18n/useTranslate";
import { Header, WebappLoginLayout } from "../../../components";
type Props = {
  step: "LOADING_ACCOUNT" | "LOADING_PASSPHRASE";
};
export const I18N_KEYS: Record<Props["step"], string> & Record<string, string> =
  {
    LOGIN_HEADER: "webapp_login_form_heading_log_in",
    LOADING_ACCOUNT: "webapp_device_to_device_authentication_loading_account",
    LOADING_PASSPHRASE:
      "webapp_device_to_device_authentication_loading_challenge",
    CANCEL_BUTTON: "_common_action_cancel",
  };
export const DeviceTransferLoading = ({ step }: Props) => {
  const { translate } = useTranslate();
  const { changeLogin } = useModuleCommands(
    AuthenticationFlowContracts.authenticationFlowApi
  );
  return (
    <WebappLoginLayout>
      <Header text={translate(I18N_KEYS.LOGIN_HEADER)} />
      <Flex flexDirection="column" alignItems="center">
        <IndeterminateLoader mood="brand" size={77} />
        <Paragraph
          sx={{
            textAlign: "center",
            margin: "32px 0",
          }}
        >
          {translate(I18N_KEYS[step])}
        </Paragraph>
        {step === "LOADING_ACCOUNT" ? (
          <Button
            fullsize
            mood="neutral"
            intensity="quiet"
            sx={{ marginTop: "8px" }}
            onClick={() => changeLogin({})}
          >
            {translate(I18N_KEYS.CANCEL_BUTTON)}
          </Button>
        ) : null}
      </Flex>
    </WebappLoginLayout>
  );
};
