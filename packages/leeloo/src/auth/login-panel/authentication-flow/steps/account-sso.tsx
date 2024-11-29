import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import {
  Button,
  Dialog,
  EmailField,
  Heading,
  Icon,
  Paragraph,
} from "@dashlane/design-system";
import { confidentialSSOApi } from "@dashlane/sso-scim-contracts";
import { PageView } from "@dashlane/hermes";
import {
  useAnalyticsCommands,
  useModuleCommands,
} from "@dashlane/framework-react";
import {
  augmentUrlWithProperSsoQueryParameters,
  redirectToUrl,
} from "../../../../libs/external-urls";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { DASHLANE_DOWNLOAD_EXTENSION_URL } from "../../../../webapp/urls";
import { ClientBypass, ClientBypassType } from "../types/manual-bypass";
import { Header, WebappLoginLayout } from "../components";
interface AccountSSOProps
  extends Omit<
    AuthenticationFlowContracts.AuthenticationFlowMachineSSORedirectionToIdpView,
    "step"
  > {
  sendUsageLog?: boolean;
  changeLogin?: (
    params: AuthenticationFlowContracts.ChangeAccountEmailCommandRequest
  ) => void;
  setUseClientBypass: (bypass: ClientBypass) => void;
}
const I18N_KEYS = {
  EMAIL_PLACEHOLDER: "webapp_login_form_email_fieldset_email_placeholder",
  HEADING: "webapp_login_form_heading_log_in",
  NEXT: "webapp_login_form_email_fieldset_email_confirm",
  SELECTOR_LABEL: "webapp_login_form_email_fieldset_email_description",
  USE_ANOTHER_ACCOUNT:
    "webapp_login_form_email_fieldset_select_option_other_account",
  CLOSE: "_common_dialog_dismiss_button",
  DIALOG_TITLE: "Extension required to log in",
  DIALOG_BODY:
    "Because you’re using SSO with Dashlane, you need to log in to your account with the extension.",
  DIALOG_CTA: "Add extension",
};
export const AccountSSO = ({
  serviceProviderRedirectUrl,
  isNitroProvider,
  loginEmail,
  sendUsageLog,
  changeLogin,
  setUseClientBypass,
}: AccountSSOProps) => {
  const [
    showNitroSSOExtensionNeededError,
    setShowNitroSSOExtensionNeededError,
  ] = useState(false);
  const { translate } = useTranslate();
  const { trackPageView } = useAnalyticsCommands();
  useEffect(() => {
    if (sendUsageLog) {
      void trackPageView({
        pageView: PageView.LoginSso,
      });
    }
  }, []);
  const { loginUserWithEnclaveSSO } = useModuleCommands(confidentialSSOApi);
  const nitroLoginCommand = useCallback(async () => {
    await loginUserWithEnclaveSSO({
      userEmailAddress: loginEmail ?? "",
    });
  }, [loginUserWithEnclaveSSO, loginEmail]);
  useEffect(() => {
    if (serviceProviderRedirectUrl) {
      if (isNitroProvider && !APP_PACKAGED_IN_EXTENSION) {
        setShowNitroSSOExtensionNeededError(true);
        return;
      }
      const newSsoServiceProviderUrl = augmentUrlWithProperSsoQueryParameters(
        serviceProviderRedirectUrl
      );
      if (isNitroProvider) {
        nitroLoginCommand();
      } else {
        changeLogin?.({ login: "" });
        setUseClientBypass({
          type: ClientBypassType.WAITING_IDP_REDIRECTION,
          login: loginEmail,
        });
        redirectToUrl(newSsoServiceProviderUrl);
      }
    }
  }, [
    isNitroProvider,
    serviceProviderRedirectUrl,
    nitroLoginCommand,
    setUseClientBypass,
    loginEmail,
    changeLogin,
  ]);
  return (
    <>
      <Dialog
        title=""
        isOpen={showNitroSSOExtensionNeededError}
        actions={{
          primary: {
            children: I18N_KEYS.DIALOG_CTA,
            onClick: (e: SyntheticEvent<HTMLButtonElement>) => {
              e.preventDefault();
              redirectToUrl(DASHLANE_DOWNLOAD_EXTENSION_URL);
            },
          },
        }}
        onClose={() => setShowNitroSSOExtensionNeededError(false)}
        closeActionLabel={translate(I18N_KEYS.CLOSE)}
      >
        <div sx={{ marginBottom: "25px" }}>
          <Icon
            sx={{ size: "60px" }}
            name="FeedbackFailOutlined"
            color="ds.container.expressive.danger.catchy.idle"
            aria-hidden="true"
          />
        </div>
        <Heading title={I18N_KEYS.DIALOG_TITLE} as={"h1"} />
        <Paragraph sx={{ marginBottom: "24px" }}>
          {I18N_KEYS.DIALOG_BODY}
        </Paragraph>
      </Dialog>

      <WebappLoginLayout>
        <Header text={translate(I18N_KEYS.HEADING)} />
        <div sx={{ gap: "25px", display: "flex", flexDirection: "column" }}>
          <EmailField
            name="email"
            id="extng-account-email-input"
            value={loginEmail}
            type="email"
            label={translate(I18N_KEYS.SELECTOR_LABEL)}
          />
          <Button
            type="submit"
            id="extng-account-email-next-button"
            aria-label={translate(I18N_KEYS.NEXT)}
            data-testid="login-button"
            fullsize
            size="large"
            disabled={true}
            isLoading={true}
          >
            {translate(I18N_KEYS.NEXT)}
          </Button>
        </div>
      </WebappLoginLayout>
    </>
  );
};
