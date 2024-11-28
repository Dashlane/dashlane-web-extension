import { ChangeEvent, Fragment, useEffect, useState } from "react";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import {
  Button,
  Checkbox,
  Infobox,
  jsx,
  Paragraph,
} from "@dashlane/design-system";
import {
  DataStatus,
  useAnalyticsCommands,
  useModuleCommands,
} from "@dashlane/framework-react";
import { PageView } from "@dashlane/hermes";
import { EmailHeader } from "../components";
import { Header } from "../components/header";
import { PopupLoginLayout } from "../components/popup-login-layout";
import { FORM_SX_STYLES } from "../constants";
import { useIsAutoSsoLoginDisabled } from "../../../libs/api/killswitch/useIsAutoSsoLoginDisabled";
import { DASHLANE_SSO_MORE_INFO } from "../../../libs/externalUrls";
import useTranslate from "../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  TITLE: "login/sso_sign_in_title",
  DESCRIPTION: "login/sso_sign_in_description",
  BUTTON_LOGIN_WITH_SSO: "login/activate_sso_button_primary",
  AUTOMATIC_SSO: "login/auto_trigger_sso",
  INFOBOX_TITLE: "login/auto_trigger_sso_infobox_title",
  INFOBOX_LINK: "login/auto_trigger_sso_infobox_link",
};
export const AccountSSO = ({
  localAccounts,
  loginEmail,
  rememberMeForSSOPreference,
}: Omit<
  AuthenticationFlowContracts.AuthenticationFlowMachineSSORedirectionToIdpView,
  "step"
>) => {
  const { translate } = useTranslate();
  const { trackPageView } = useAnalyticsCommands();
  useEffect(() => {
    void trackPageView({
      pageView: PageView.LoginSso,
    });
  }, []);
  const { initiateLoginWithSSO } = useModuleCommands(
    AuthenticationFlowContracts.authenticationFlowApi
  );
  const [isChecked, setIsChecked] = useState<boolean>(
    rememberMeForSSOPreference !== undefined ? rememberMeForSSOPreference : true
  );
  const isAutoSsoLoginDisabled = useIsAutoSsoLoginDisabled();
  const onShouldRememberMeForSSOCheckboxChanged = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setIsChecked(e.target.checked);
  };
  const handleSSOLogin = async () => {
    await initiateLoginWithSSO({
      login: loginEmail ?? "",
      rememberMeForSSOPreference: isChecked,
    });
  };
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
          <Header text={translate(I18N_KEYS.TITLE)} />
          <Paragraph color="ds.text.neutral.standard">
            {translate(I18N_KEYS.DESCRIPTION)}
          </Paragraph>

          {isAutoSsoLoginDisabled.status === DataStatus.Success &&
          !isAutoSsoLoginDisabled.data ? (
            <>
              <Checkbox
                sx={{
                  marginTop: "24px",
                  marginBottom: "24px",
                  alignItems: "start",
                }}
                name="rememberMeForSSO"
                onChange={onShouldRememberMeForSSOCheckboxChanged}
                checked={isChecked}
                label={
                  <span sx={{ fontSize: "14px" }}>
                    {translate(I18N_KEYS.AUTOMATIC_SSO)}
                  </span>
                }
              />
              <Infobox
                mood="brand"
                title={translate(I18N_KEYS.INFOBOX_TITLE)}
                description={
                  <Paragraph as="a" href={DASHLANE_SSO_MORE_INFO}>
                    {translate(I18N_KEYS.INFOBOX_LINK)}
                  </Paragraph>
                }
              />
            </>
          ) : null}
        </PopupLoginLayout>

        <Button
          onClick={() => {
            void handleSSOLogin();
          }}
          fullsize
          size="large"
          sx={{ margin: "16px 0 8px 0" }}
        >
          {translate(I18N_KEYS.BUTTON_LOGIN_WITH_SSO)}
        </Button>
      </form>
    </>
  );
};
