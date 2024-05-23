import React, { useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { AuthenticationFlowContracts } from '@dashlane/authentication-contracts';
import { Button, Checkbox, jsx, Paragraph, PasswordField, } from '@dashlane/design-system';
import { PageView, UserForgetMasterPasswordEvent } from '@dashlane/hermes';
import { DataStatus, useAnalyticsCommands, useModuleCommands, } from '@dashlane/framework-react';
import { Result } from '@dashlane/framework-types';
import { confidentialSSOApi } from '@dashlane/sso-scim-contracts';
import { HELPCENTER_FORGOT_MASTER_PASSWORD_URL } from 'app/routes/constants';
import { carbonConnector } from 'libs/carbon/connector';
import useTranslate from 'libs/i18n/useTranslate';
import { ActivateSSODialog } from 'sso/migration-dialogs/activate-sso/activate-sso-dialog';
import { augmentUrlWithProperSsoQueryParameters } from 'libs/external-urls';
import { logEvent } from 'libs/logs/logEvent';
import { LogOutDialog } from 'auth/log-out-dialog/log-out-dialog';
import { useIsRecoveryKeyEnabled } from '../hooks/use-is-recovery-key-enabled';
import { EmailHeader, Header, WebappLoginLayout } from '../components';
import { AccountRecoveryContainer } from '../components/account-recovery/account-recovery-container';
import { AdminAssistedARStatus } from '../types/admin-assisted-account-recovery';
import { AuthLocationState } from 'auth/auth-panel-navigation/auth-panel-navigation';
import { ASK_ACCOUNT_RECOVERY_KEY_URL_REDIRECTION } from '../constants';
import { useGetSsoMigrationType } from '../hooks/use-get-sso-migration-type';
import { NotAllowedReason } from '@dashlane/session-contracts';
import { useHasSsoToken } from '../hooks/use-has-sso-token';
import { provideLocalInStoreSsoUrl } from 'sso/utils';
const I18N_KEYS = {
    FORGOT_YOUR_PASSWORD: 'webapp_login_form_password_fieldset_password_forgot',
    HEADING: 'webapp_login_form_heading_log_in',
    HIDE: '_common_password_hide_label',
    LOG_IN: 'webapp_auth_panel_login',
    MASTER_PASSWORD_LABEL: 'webapp_login_form_password_fieldset_password_label',
    MASTER_PASSWORD_PLACEHOLDER: 'webapp_login_form_password_fieldset_password_placeholder',
    SHOW: '_common_password_show_label',
    USE_ANOTHER_ACCOUNT: 'webapp_login_form_email_fieldset_select_option_other_account',
    REMEMBER_ME: 'webapp_login_form_password_fieldset_remember_me',
    REMEMBER_ME_WARNING: 'webapp_login_form_password_fieldset_remember_me_warning_text',
};
const I18N_ERROR_KEYS = {
    EMPTY_MASTER_PASSWORD: 'webapp_login_form_password_fieldset_security_code_error_empty_password',
    WRONG_PASSWORD: 'webapp_login_form_password_fieldset_security_code_error_wrong_password',
    THROTTLED: 'webapp_login_form_password_fieldset_error_throttled',
    USER_UNAUTHORIZED: 'webapp_login_form_email_fieldset_error_user_unauthorized',
    UNKNOWN_ERROR: 'webapp_login_form_password_fieldset_security_code_error_unkown',
    NETWORK_ERROR: 'webapp_login_form_password_fieldset_network_error_offline',
};
interface Props extends Omit<AuthenticationFlowContracts.AuthenticationFlowPasswordView, 'step'> {
    sendMasterPassword: (params: {
        masterPassword: string;
        rememberMe: boolean;
    }) => Promise<Result<undefined>>;
    clearInputError: () => void;
    logoutHandler: () => void;
    location: AuthLocationState;
}
interface FormValues {
    masterPassword: string;
    rememberMe: boolean;
}
export const AccountMasterPassword = ({ loginEmail, localAccounts, error, isAccountRecoveryAvailable: isAdminAssistedRecoveryEnabled, isLoading, sendMasterPassword, clearInputError, logoutHandler, serviceProviderRedirectUrl, isNitroProvider, location, }: Props) => {
    const { translate } = useTranslate();
    const ssoMigrationType = useGetSsoMigrationType();
    const hasSsoToken = useHasSsoToken();
    const isAccountRecoveryKeyEnabled = useIsRecoveryKeyEnabled();
    const { loginUserWithEnclaveSSO } = useModuleCommands(confidentialSSOApi);
    const nitroLoginCommand = useCallback(async () => {
        await loginUserWithEnclaveSSO({
            userEmailAddress: loginEmail,
        });
    }, [loginUserWithEnclaveSSO, loginEmail]);
    const [adminAssistedRecoveryStatus, setAdminAssistedRecoveryStatus] = useState<AdminAssistedARStatus>({ processStatus: 'UNSET' });
    const [showRecoveryFlow, setShowRecoveryFlow] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [localSsoRedirect, setLocalSsoRedirect] = useState(false);
    const [shouldDisplayAccountRecoveryKeyDialog, setShouldDisplayAccountRecoveryKeyDialog,] = useState<boolean>(false);
    const [ssoServiceProviderUrl, setSsoServiceProviderUrl] = useState('');
    const { trackPageView } = useAnalyticsCommands();
    useEffect(() => {
        void trackPageView({
            pageView: PageView.LoginMasterPassword,
        });
    }, []);
    const isRememberMeAvailable = React.useMemo<boolean>(() => {
        if (!localAccounts) {
            return false;
        }
        return localAccounts.some((account) => !account.hasLoginOtp &&
            account.login === loginEmail &&
            account.rememberMeType !== 'webauthn');
    }, [loginEmail, localAccounts]);
    const logUserForgetMasterPasswordEvent = (hasTeamAccountRecovery: boolean) => {
        void logEvent(new UserForgetMasterPasswordEvent({
            hasBiometricReset: false,
            hasTeamAccountRecovery,
        }));
    };
    useEffect(() => {
        if (ssoMigrationType.status !== DataStatus.Success ||
            ssoMigrationType.data === undefined ||
            !serviceProviderRedirectUrl) {
            return;
        }
        if (ssoMigrationType.data.includes(NotAllowedReason.RequiresMP2SSOMigration)) {
            if (!hasSsoToken) {
                setSsoServiceProviderUrl(augmentUrlWithProperSsoQueryParameters(serviceProviderRedirectUrl));
                setLocalSsoRedirect(false);
            }
            else {
                setSsoServiceProviderUrl(provideLocalInStoreSsoUrl());
                setLocalSsoRedirect(true);
            }
        }
    }, [ssoMigrationType, hasSsoToken, serviceProviderRedirectUrl]);
    useEffect(() => {
        const accountRecoveryKey = !APP_PACKAGED_IN_EXTENSION
            ? false
            : location.search.includes(ASK_ACCOUNT_RECOVERY_KEY_URL_REDIRECTION);
        setShouldDisplayAccountRecoveryKeyDialog(accountRecoveryKey);
    }, [location, location.hash]);
    const { handleChange, handleSubmit, values: { masterPassword, rememberMe }, setFieldValue, } = useFormik({
        initialValues: {
            masterPassword: '',
            rememberMe: false,
        },
        onSubmit: async ({ masterPassword, rememberMe }: FormValues) => {
            if (!isAdminAssistedRecoveryEnabled) {
                sendMasterPassword({
                    masterPassword,
                    rememberMe,
                });
            }
            else {
                const result = await carbonConnector.checkRecoveryRequestStatus({
                    masterPassword,
                });
                if (result.success) {
                    setAdminAssistedRecoveryStatus({
                        processStatus: 'PENDING',
                        requestStatus: result.response.status,
                    });
                    setShowRecoveryFlow(true);
                }
                else {
                    sendMasterPassword({ masterPassword, rememberMe });
                }
            }
        },
    });
    const handleForgotMasterPassword = () => {
        logUserForgetMasterPasswordEvent(isAdminAssistedRecoveryEnabled);
        if (!isAccountRecoveryKeyEnabled && !isAdminAssistedRecoveryEnabled) {
            window.open(HELPCENTER_FORGOT_MASTER_PASSWORD_URL, '_blank');
        }
        else {
            setShowRecoveryFlow(true);
        }
    };
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { target: { value }, } = e;
        clearInputError();
        setFieldValue('masterPassword', value);
    };
    const handleActivateSSODialogClose = () => {
        setShowLogoutDialog(true);
    };
    const handleLogoutDialogClose = () => {
        setShowLogoutDialog(false);
    };
    const handleAccountRecoveryDialogClose = () => {
        setShowRecoveryFlow(false);
        setShouldDisplayAccountRecoveryKeyDialog(false);
        setAdminAssistedRecoveryStatus({
            processStatus: 'UNSET',
        });
    };
    const handleLogout = () => {
        logoutHandler();
        setShowLogoutDialog(false);
    };
    return (<WebappLoginLayout>
      <Header text={translate(I18N_KEYS.HEADING)}/>
      <EmailHeader selectedEmail={loginEmail}/>
      <form onSubmit={handleSubmit}>
        <PasswordField name="masterPassword" id="master-password-input-id" value={masterPassword} onChange={handlePasswordChange} placeholder={translate(I18N_KEYS.MASTER_PASSWORD_PLACEHOLDER)} disabled={isLoading} label={translate(I18N_KEYS.MASTER_PASSWORD_LABEL)} feedback={error
            ? {
                id: 'login-feedback-text',
                text: translate(I18N_ERROR_KEYS[error] ?? I18N_ERROR_KEYS.UNKNOWN_ERROR),
            }
            : undefined} error={!!error} toggleVisibilityLabel={{
            show: translate(I18N_KEYS.SHOW),
            hide: translate(I18N_KEYS.HIDE),
        }} autoFocus/>

        {isRememberMeAvailable ? (<Checkbox name="rememberMe" checked={rememberMe} onChange={handleChange} label={<Paragraph color="ds.text.neutral.quiet" textStyle="ds.title.block.small">
                {translate(I18N_KEYS.REMEMBER_ME)}
              </Paragraph>} sx={{ marginTop: '12px', marginBottom: '12px' }}/>) : null}

        {rememberMe ? (<Paragraph color="ds.text.neutral.quiet" textStyle="ds.title.block.small">
            {translate(I18N_KEYS.REMEMBER_ME_WARNING)}
          </Paragraph>) : null}

        <Button type="submit" data-testid="login-button" isLoading={isLoading} fullsize size="large" sx={{ marginTop: '40px', padding: '14px 16px' }}>
          {translate(I18N_KEYS.LOG_IN)}
        </Button>
        <Button intensity="quiet" mood="neutral" fullsize size="large" onClick={handleForgotMasterPassword} sx={{
            marginTop: '8px',
            padding: '14px 16px',
        }}>
          {translate(I18N_KEYS.FORGOT_YOUR_PASSWORD)}
        </Button>
      </form>
      {ssoMigrationType.status === DataStatus.Success &&
            ssoMigrationType.data &&
            ssoMigrationType.data.includes(NotAllowedReason.RequiresMP2SSOMigration) &&
            !showLogoutDialog ? (<ActivateSSODialog activateLink={ssoServiceProviderUrl} onClose={handleActivateSSODialogClose} localSsoRedirect={localSsoRedirect} isNitroSSO={isNitroProvider} nitroLoginCommand={nitroLoginCommand}/>) : null}
      <LogOutDialog isOpen={showLogoutDialog} onLogout={handleLogout} onDismiss={handleLogoutDialogClose} showCloseIcon={false}/>
      
      {showRecoveryFlow || shouldDisplayAccountRecoveryKeyDialog ? (<AccountRecoveryContainer onClose={handleAccountRecoveryDialogClose} masterPassword={masterPassword} isAccountRecoveryKeyAvailable={isAccountRecoveryKeyEnabled} isAdminAssistedRecoveryAvailable={isAdminAssistedRecoveryEnabled} existingAdminAssistedRecoveryStatus={adminAssistedRecoveryStatus}/>) : null}
    </WebappLoginLayout>);
};
