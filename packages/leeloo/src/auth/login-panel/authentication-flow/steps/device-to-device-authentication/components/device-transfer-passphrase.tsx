import { useEffect } from "react";
import { Flex, Paragraph } from "@dashlane/design-system";
import { analyticsApi } from "@dashlane/framework-contracts";
import { useModuleCommands } from "@dashlane/framework-react";
import { PageView } from "@dashlane/hermes";
import useTranslate from "../../../../../../libs/i18n/useTranslate";
import { useRouterGlobalSettingsContext } from "../../../../../../libs/router";
import { registerRedirectPath } from "../../../../../../libs/redirect/after-login/actions";
import { EmailHeader, Header, WebappLoginLayout } from "../../../components";
import { DEVICE_TRANSFER_SUCCESS_SEGMENT } from "../../../../../../app/routes/constants";
export const I18N_KEYS = {
  HEADING: "webapp_device_to_device_authentication_passphrase_challenge_title",
  PASSPHRASE_CHALLENGE_INFO:
    "webapp_device_to_device_authentication_passphrase_challenge_info",
};
interface DeviceTransferPassphraseProps {
  loginEmail?: string;
  passphrase?: string[];
}
export const DeviceTransferPassphrase = ({
  loginEmail,
  passphrase,
}: DeviceTransferPassphraseProps) => {
  const { translate } = useTranslate();
  const routerGlobalSettings = useRouterGlobalSettingsContext();
  const { trackPageView } = useModuleCommands(analyticsApi);
  useEffect(() => {
    routerGlobalSettings.store.dispatch(
      registerRedirectPath(DEVICE_TRANSFER_SUCCESS_SEGMENT)
    );
    trackPageView({
      pageView: PageView.LoginDeviceTransferSecurityChallenge,
    });
  }, []);
  return (
    <WebappLoginLayout>
      <Header text={translate(I18N_KEYS.HEADING)} />
      <EmailHeader selectedEmail={loginEmail} />
      <Paragraph>{translate(I18N_KEYS.PASSPHRASE_CHALLENGE_INFO)}</Paragraph>
      <Flex
        sx={{
          flexDirection: "column",
          gap: "20px",
          bg: "ds.container.agnostic.neutral.quiet",
          borderRadius: "8px",
          padding: "24px 16px",
          marginTop: "-16px",
        }}
      >
        {passphrase?.map((word) => (
          <Paragraph
            key={word}
            textStyle="ds.body.standard.monospace"
            style={{ paddingLeft: "12px" }}
            data-testid="passphrase-word"
          >
            {word}
          </Paragraph>
        ))}
      </Flex>
    </WebappLoginLayout>
  );
};
