import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { AuthenticationFlowContracts } from '@dashlane/authentication-contracts';
import { Button, Checkbox, Infobox, jsx } from '@dashlane/design-system';
import { PageView } from '@dashlane/hermes';
import { DataStatus, useAnalyticsCommands, useModuleCommands, } from '@dashlane/framework-react';
import { Heading, Link, Paragraph } from '@dashlane/ui-components';
import { FORM_SX_STYLES } from '../constants';
import { EmailHeader } from '../components';
import useTranslate from 'libs/i18n/useTranslate';
import { useIsAutoSsoLoginDisabled } from 'libs/api/killswitch/useIsAutoSsoLoginDisabled';
import { DASHLANE_SSO_MORE_INFO } from 'src/libs/externalUrls';
const I18N_KEYS = {
    TITLE: 'login/sso_sign_in_title',
    DESCRIPTION: 'login/sso_sign_in_description',
    BUTTON_LOGIN_WITH_SSO: 'login/activate_sso_button_primary',
    AUTOMATIC_SSO: 'login/auto_trigger_sso',
    INFOBOX_TITLE: 'login/auto_trigger_sso_infobox_title',
    INFOBOX_LINK: 'login/auto_trigger_sso_infobox_link',
};
export const AccountSSO = ({ localAccounts, loginEmail, rememberMeForSSOPreference, }: Omit<AuthenticationFlowContracts.AuthenticationFlowMachineSSORedirectionToIdpView, 'step'>) => {
    const { translate } = useTranslate();
    const { trackPageView } = useAnalyticsCommands();
    useEffect(() => {
        void trackPageView({
            pageView: PageView.LoginSso,
        });
    }, []);
    const { initiateLoginWithSSO } = useModuleCommands(AuthenticationFlowContracts.authenticationFlowApi);
    const [isChecked, setIsChecked] = useState<boolean>(rememberMeForSSOPreference !== undefined
        ? rememberMeForSSOPreference
        : true);
    const isAutoSsoLoginDisabled = useIsAutoSsoLoginDisabled();
    const onShouldRememberMeForSSOCheckboxChanged = (e: ChangeEvent<HTMLInputElement>) => {
        setIsChecked(e.target.checked);
    };
    const handleSSOLogin = async () => {
        await initiateLoginWithSSO({
            login: loginEmail ?? '',
            rememberMeForSSOPreference: isChecked,
        });
    };
    return (<>
      <EmailHeader loginEmail={loginEmail ?? ''} showAccountsActionsDropdown showLogoutDropdown={false} localAccounts={localAccounts}/>

      <form sx={FORM_SX_STYLES}>
        <Heading size="x-small" color="ds.text.neutral.catchy" sx={{ marginBottom: '24px' }}>
          {translate(I18N_KEYS.TITLE)}
        </Heading>

        <div sx={{
            flexGrow: '1',
        }}>
          <Paragraph size="medium" color="ds.text.neutral.standard">
            {translate(I18N_KEYS.DESCRIPTION)}
          </Paragraph>

          {isAutoSsoLoginDisabled.status === DataStatus.Success &&
            !isAutoSsoLoginDisabled.data ? (<>
              <Checkbox sx={{
                marginTop: '24px',
                marginBottom: '24px',
                alignItems: 'start',
            }} name="rememberMeForSSO" onChange={onShouldRememberMeForSSOCheckboxChanged} checked={isChecked} label={<span sx={{ fontSize: '14px' }}>
                    {translate(I18N_KEYS.AUTOMATIC_SSO)}
                  </span>}/>
              <Infobox size="small" mood="brand" title={<div sx={{ display: 'flex', flexDirection: 'column' }}>
                    <span>{translate(I18N_KEYS.INFOBOX_TITLE)}</span>
                    <Link href={DASHLANE_SSO_MORE_INFO}>
                      {translate(I18N_KEYS.INFOBOX_LINK)}
                    </Link>
                  </div>}/>
            </>) : null}
        </div>

        <Button onClick={() => {
            void handleSSOLogin();
        }} fullsize size="large" sx={{ marginBottom: '8px' }}>
          {translate(I18N_KEYS.BUTTON_LOGIN_WITH_SSO)}
        </Button>
      </form>
    </>);
};
