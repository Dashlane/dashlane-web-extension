import { Fragment, useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import { ChangeMPFlowPath, RequestStatus } from '@dashlane/communication';
import { PageView, UserForgetMasterPasswordEvent } from '@dashlane/hermes';
import { DataStatus, useAnalyticsCommands, useModuleCommands, } from '@dashlane/framework-react';
import { confidentialSSOApi } from '@dashlane/sso-scim-contracts';
import { AuthenticationFlowContracts } from '@dashlane/authentication-contracts';
import { Button, Checkbox, jsx, PasswordField } from '@dashlane/design-system';
import { Result } from '@dashlane/framework-types';
import { NotAllowedReason } from '@dashlane/session-contracts';
import { Heading, Paragraph } from '@dashlane/ui-components';
import { DASHLANE_SSO_LOGGING_IN_URL, FORGOT_PASSWORD_URL, openExternalUrl, } from 'libs/externalUrls';
import useTranslate from 'libs/i18n/useTranslate';
import { logEvent } from 'libs/logs/logEvent';
import { openWebAppAndClosePopup } from 'src/app/helpers';
import { carbonConnector } from 'src/carbonConnector';
import { useIsRecoveryKeyEnabled } from '../hooks/use-is-recovery-key-enabled';
import { AccountRecoveryDialog, AccountRecoveryDialogLocalStatus, AccountRecoveryDialogStatus, EmailHeader, } from '../components';
import { ADMIN_ASSISTED_RECOVERY_URL_SEGMENT, FORM_SX_STYLES, } from '../constants';
import { useGetSsoMigrationType } from '../hooks/use-get-sso-migration-type';
const I18N_KEYS = {
    FORGOT_PASSWORD: 'login/password_forgot',
    HIDE: 'login/password_hide_label',
    LOG_IN: 'login/password_confirm_log_in',
    MASTER_PASSWORD_PLACEHOLDER: 'login/password_placeholder',
    REMEMBER_ME: 'login/remember_me',
    REMEMBER_ME_WARNING: 'login/remember_me_warning_text',
    SHOW: 'login/password_show_label',
    TITLE: 'login/password_label',
    ACTIVATE_SSO_DESCRIPTION: 'login/activate_sso_description',
    ACTIVATE_SSO_HEADING: 'login/activate_sso_title',
    ACTIVATE_SSO_LEARN_MORE: 'login/activate_sso_button_secondary',
    LOG_IN_WITH_SSO: 'login/activate_sso_button_primary',
};
const I18N_ERROR_KEYS = {
    EMPTY_MASTER_PASSWORD: 'login/security_code_error_empty_password',
    WRONG_PASSWORD: 'login/security_code_error_wrong_password',
    UNKNOWN_ERROR: 'login/security_code_error_unkown',
    NETWORK_ERROR: 'login/security_code_error_network_error',
};
interface Props extends Omit<AuthenticationFlowContracts.AuthenticationFlowPasswordView, 'step'> {
    sendMasterPassword: (params: {
        masterPassword: string;
        rememberMe: boolean;
    }) => Promise<Result<undefined>>;
    clearInputError: () => void;
}
interface FormValues {
    masterPassword: string;
    rememberMe: boolean;
}
export const AccountMasterPassword = ({ loginEmail, localAccounts, error, isAccountRecoveryAvailable, isLoading, sendMasterPassword, clearInputError, serviceProviderRedirectUrl, isNitroProvider, }: Props) => {
    const { translate } = useTranslate();
    const ssoMigrationType = useGetSsoMigrationType();
    const [accountRecoveryStatus, setAccountRecoveryStatus] = useState<AccountRecoveryDialogStatus>(undefined);
    const { trackPageView } = useAnalyticsCommands();
    const isAccountRecoveryKeyEnabled = useIsRecoveryKeyEnabled(loginEmail);
    useEffect(() => {
        trackPageView({
            pageView: PageView.LoginMasterPassword,
        });
    }, []);
    const isRememberMeAvailable = useMemo<boolean>(() => {
        if (!localAccounts) {
            return false;
        }
        return localAccounts.some((account: AuthenticationFlowContracts.LocalAccount) => account.isLastSuccessfulLogin &&
            !account.hasLoginOtp &&
            account.login === loginEmail &&
            account.rememberMeType !== 'webauthn');
    }, [loginEmail, localAccounts]);
    const logUserForgetMasterPasswordEvent = (hasTeamAccountRecovery: boolean) => {
        void logEvent(new UserForgetMasterPasswordEvent({
            hasBiometricReset: false,
            hasTeamAccountRecovery,
        }));
    };
    const { handleChange, handleSubmit, values: { masterPassword, rememberMe }, setFieldValue, } = useFormik({
        initialValues: {
            masterPassword: '',
            rememberMe: false,
        },
        onSubmit: async ({ masterPassword, rememberMe }: FormValues) => {
            if (!isAccountRecoveryAvailable) {
                void sendMasterPassword({
                    masterPassword,
                    rememberMe,
                });
            }
            else {
                const result = await carbonConnector.checkRecoveryRequestStatus({
                    masterPassword,
                });
                if (result.success) {
                    setAccountRecoveryStatus(result.response.status);
                }
                else {
                    void sendMasterPassword({ masterPassword, rememberMe });
                }
            }
        },
    });
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { target: { value }, } = e;
        clearInputError();
        void setFieldValue('masterPassword', value);
    };
    const handleOnForgotMasterPasswordClick = async () => {
        logUserForgetMasterPasswordEvent(isAccountRecoveryAvailable);
        if (isAccountRecoveryKeyEnabled) {
            void openWebAppAndClosePopup({
                route: 'login?ask-account-recovery-key',
            });
        }
        else if (isAccountRecoveryAvailable) {
            const pendingRequestResponse = await carbonConnector.isRecoveryRequestPending();
            if (pendingRequestResponse.success && pendingRequestResponse.response) {
                setAccountRecoveryStatus(RequestStatus.PENDING);
            }
            else {
                setAccountRecoveryStatus(AccountRecoveryDialogLocalStatus.INITIAL);
            }
        }
        else {
            void openExternalUrl(FORGOT_PASSWORD_URL);
        }
    };
    const onSendNewRequest = () => {
        void openWebAppAndClosePopup({
            route: ADMIN_ASSISTED_RECOVERY_URL_SEGMENT,
        });
    };
    const onCancelRequest = async () => {
        await carbonConnector.cancelRecoveryRequest();
        setAccountRecoveryStatus(undefined);
    };
    const handleDismissAccountRecoveryDialog = () => {
        setAccountRecoveryStatus(undefined);
    };
    const onRecoverUserAccount = async () => {
        setAccountRecoveryStatus(undefined);
        if (!masterPassword) {
            return;
        }
        const response = await carbonConnector.recoverUserData({
            masterPassword: masterPassword,
        });
        if (response.success) {
            void carbonConnector.changeMasterPassword({
                newPassword: masterPassword,
                flow: ChangeMPFlowPath.ADMIN_ASSISTED_RECOVERY,
            });
            await openWebAppAndClosePopup({
                route: `${ADMIN_ASSISTED_RECOVERY_URL_SEGMENT}/change-master-password`,
            });
        }
    };
    const { loginUserWithEnclaveSSO } = useModuleCommands(confidentialSSOApi);
    const onActivateSSOClick = () => {
        if (isNitroProvider && loginEmail) {
            void loginUserWithEnclaveSSO({ userEmailAddress: loginEmail });
        }
        else if (serviceProviderRedirectUrl) {
            void openExternalUrl(serviceProviderRedirectUrl);
        }
        else {
            throw new Error('No serviceProviderUrl available');
        }
    };
    return ssoMigrationType.status === DataStatus.Success &&
        ssoMigrationType.data &&
        ssoMigrationType.data.includes(NotAllowedReason.RequiresMP2SSOMigration) ? (<>
      <EmailHeader loginEmail={loginEmail} showAccountsActionsDropdown={false} showLogoutDropdown/>
      <form sx={FORM_SX_STYLES}>
        <Heading size="x-small" color="ds.text.neutral.catchy" sx={{ marginBottom: '24px' }}>
          {translate(I18N_KEYS.ACTIVATE_SSO_HEADING)}
        </Heading>

        <div sx={{
            flexGrow: '1',
        }}>
          <Paragraph size="medium" color="ds.text.neutral.standard">
            {translate(I18N_KEYS.ACTIVATE_SSO_DESCRIPTION)}
          </Paragraph>
        </div>

        <Button onClick={() => {
            void onActivateSSOClick();
        }} aria-label={translate(I18N_KEYS.LOG_IN_WITH_SSO)} fullsize size="large" sx={{ marginBottom: '8px' }}>
          {translate(I18N_KEYS.LOG_IN_WITH_SSO)}
        </Button>
        <Button onClick={() => {
            void openExternalUrl(DASHLANE_SSO_LOGGING_IN_URL);
        }} mood="neutral" intensity="quiet" fullsize size="large">
          {translate(I18N_KEYS.ACTIVATE_SSO_LEARN_MORE)}
        </Button>
      </form>
    </>) : (<>
      <EmailHeader loginEmail={loginEmail} showAccountsActionsDropdown showLogoutDropdown={false} localAccounts={localAccounts}/>
      <form sx={FORM_SX_STYLES} onSubmit={handleSubmit} noValidate>
        <Heading size="x-small" color="ds.text.neutral.catchy" sx={{ marginBottom: '24px' }}>
          {translate(I18N_KEYS.TITLE)}
        </Heading>

        <div sx={{
            marginBottom: '8px',
            flexGrow: '1',
            width: '100%',
        }}>
          <PasswordField autoFocus label={translate(I18N_KEYS.MASTER_PASSWORD_PLACEHOLDER)} labelPersists={false} name="masterPassword" data-testid="master-password-input" value={masterPassword} onChange={handlePasswordChange} disabled={isLoading} error={!!error} feedback={error
            ? {
                id: 'login-feedback-text',
                text: translate(error in I18N_ERROR_KEYS
                    ? I18N_ERROR_KEYS[error as keyof typeof I18N_ERROR_KEYS]
                    : I18N_ERROR_KEYS.UNKNOWN_ERROR),
            }
            : undefined} toggleVisibilityLabel={{
            show: translate(I18N_KEYS.SHOW),
            hide: translate(I18N_KEYS.HIDE),
        }}/>

          {isRememberMeAvailable ? (<>
              <Checkbox name="rememberMe" onChange={handleChange} checked={rememberMe} data-testid="master-password-checkbox" label={<Paragraph color="ds.text.neutral.quiet" size="small">
                    {translate(I18N_KEYS.REMEMBER_ME)}
                  </Paragraph>} sx={{ marginTop: '12px', marginBottom: '12px' }}/>
              {rememberMe ? (<Paragraph color="ds.text.neutral.quiet" size="small">
                  {translate(I18N_KEYS.REMEMBER_ME_WARNING)}
                </Paragraph>) : null}
            </>) : null}
        </div>

        <Button type="submit" id="extng-submit-email-token-button" aria-label={translate(I18N_KEYS.LOG_IN)} isLoading={isLoading} disabled={!masterPassword} fullsize size="large" sx={{ marginBottom: '8px' }}>
          {translate(I18N_KEYS.LOG_IN)}
        </Button>
        <Button onClick={() => {
            void handleOnForgotMasterPasswordClick();
        }} mood="neutral" intensity="quiet" fullsize size="large">
          {translate(I18N_KEYS.FORGOT_PASSWORD)}
        </Button>
      </form>

      <AccountRecoveryDialog accountRecoveryStatus={accountRecoveryStatus} handleDismiss={handleDismissAccountRecoveryDialog} shouldSendNewRequest={!masterPassword} handleAccountRecovery={() => {
            void onRecoverUserAccount();
        }} onSendNewRequest={onSendNewRequest} onCancelRequest={() => {
            void onCancelRequest();
        }}/>
    </>);
};
