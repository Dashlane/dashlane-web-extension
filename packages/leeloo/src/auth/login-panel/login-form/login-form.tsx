import { FormEvent, MouseEvent, useCallback, useEffect, useRef, useState, } from 'react';
import { jsx } from '@dashlane/ui-components';
import { AdminPermissionLevel, LoginStep as CarbonLoginStep, ChangeMPFlowPath, LocalAccountInfo, LoginResultEnum, LoginStatusChanged, } from '@dashlane/communication';
import { BrowseComponent, PageView, UserUseAnotherAccountEvent, } from '@dashlane/hermes';
import { useModuleCommands } from '@dashlane/framework-react';
import { AuthenticationFlowContracts } from '@dashlane/authentication-contracts';
import { confidentialSSOApi } from '@dashlane/sso-scim-contracts';
import { carbonConnector } from 'libs/carbon/connector';
import { Lee } from 'lee';
import { ActivateSSODialog } from 'sso/migration-dialogs/activate-sso/activate-sso-dialog';
import { provideLocalInStoreSsoUrl } from 'sso/utils';
import { LoginStep } from 'auth/login-panel/login-form/types';
import { AccountSelectionFieldset } from 'auth/login-panel/login-form/account-selection';
import { AdditionalFactorInputFieldset } from 'auth/login-panel/login-form/additional-factor-input/additional-factor-input';
import { LogOutDialog } from 'auth/log-out-dialog/log-out-dialog';
import { WebAuthnStep } from 'auth/login-panel/login-form/webauthn-step/webauthn-step';
import { LoginFormHeader } from 'auth/login-panel/login-form/login-form-header/login-form-header';
import { BeginAccountRecoveryDialog } from 'account-recovery/admin-assisted-recovery/admin-assisted-recovery-dialogs/begin-recovery/begin-recovery';
import { PendingAccountRecoveryDialog } from 'account-recovery/admin-assisted-recovery/admin-assisted-recovery-dialogs/pending-recovery/pending-recovery';
import { redirect } from 'libs/router';
import { ACCOUNT_CREATION_URL_SEGMENT, ADMIN_ASSISTED_RECOVERY_URL_SEGMENT, } from 'app/routes/constants';
import { ApprovalRecoveryDialog } from 'account-recovery/admin-assisted-recovery/admin-assisted-recovery-dialogs/approval-recovery/approval-recovery';
import { RejectedRecoveryDialog } from 'account-recovery/admin-assisted-recovery/admin-assisted-recovery-dialogs/rejected-recovery/rejected-recovery';
import { GenericRecoveryErrorDialog } from 'account-recovery/admin-assisted-recovery/admin-assisted-recovery-dialogs/generic-recovery-error/generic-recovery-error';
import { augmentUrlWithProperSsoQueryParameters, redirectToUrl, } from 'libs/external-urls';
import { getDefaultDeviceName } from 'helpers';
import styles from './styles.css';
import { browserSupportsWebAuthnAuthentication } from 'webapp/webauthn';
import { DialogContextProvider } from 'webapp/dialog';
import { logEvent, logPageView } from 'libs/logs/logEvent';
import { DashlaneAuthenticatorStep } from './dashlane-authenticator/dashlane-authenticator-step';
import { PasswordLessStep } from './password-less-step/password-less-step';
import useTranslate from 'libs/i18n/useTranslate';
import { useLoginStepInfo } from 'libs/carbon/hooks/useLoginStepInfo';
import { useLogout } from 'libs/hooks/useLogout';
import { NitroSSOLoginExtensionNeededDialog } from './login-errors/nitro-sso-web-extension-needed';
import { DASHLANE_DOWNLOAD_EXTENSION_URL } from 'webapp/urls';
import { REMEMBER_ME_FOR_SSO_PREFERENCE } from 'libs/localstorage-constants';
interface LoginFormProps {
    accounts: LocalAccountInfo[];
    lee: Lee;
    requiredPermissions?: AdminPermissionLevel;
    shouldAskMasterPassword: boolean;
    preFilledEmail?: string;
    preFilledOtpToken?: string;
    isTACFlow?: boolean;
}
const stepToPageView = {
    [LoginStep.ActivateSSO]: PageView.LoginSso,
    [LoginStep.Email]: PageView.LoginEmail,
    [LoginStep.Password]: PageView.LoginMasterPassword,
    [LoginStep.Otp]: PageView.LoginTokenAuthenticator,
    [LoginStep.OtpToken]: PageView.LoginTokenEmail,
    [LoginStep.OtpForNewDevice]: PageView.LoginTokenAuthenticator,
    [LoginStep.WebAuthn]: PageView.LoginWebauthn,
};
const mapLastLoginStepToView = (carbonLoginStep: CarbonLoginStep | undefined): LoginStep | undefined => {
    switch (carbonLoginStep) {
        case CarbonLoginStep.BackupCodeOTP1:
        case CarbonLoginStep.OTP1:
            return LoginStep.OtpForNewDevice;
        case CarbonLoginStep.BackupCodeOTP2:
        case CarbonLoginStep.OTP2:
            return LoginStep.Otp;
        case CarbonLoginStep.OTPToken:
            return LoginStep.OtpToken;
        case CarbonLoginStep.Password:
            return LoginStep.Password;
        case CarbonLoginStep.Email:
            return LoginStep.Email;
        default:
            return;
    }
};
const I18N_KEYS = {
    BROWSER_DEVICE_DEFAULT: 'webapp_login_form_regsiter_fallback_browser_name',
};
export const LoginForm = ({ accounts, lee, shouldAskMasterPassword, requiredPermissions, preFilledEmail, preFilledOtpToken, isTACFlow = false, }: LoginFormProps) => {
    const loginStepInfo = useLoginStepInfo();
    const { logout: closeSession } = useModuleCommands(AuthenticationFlowContracts.authenticationFlowApi);
    const logout = useLogout(lee.dispatchGlobal);
    const [deviceName, setDeviceName] = useState('');
    const [error, setError] = useState('');
    const [isAccountRecoveryAvailable, setIsAccountRecoveryAvailable] = useState(false);
    const [isAccountRecoveryPending, setIsAccountRecoveryPending] = useState(false);
    const [showAccountRecoveryApproved, setShowAccountRecoveryApproved] = useState(false);
    const [showAccountRecoveryRejected, setShowAccountRecoveryRejected] = useState(false);
    const [showAccountRecoveryPending, setShowAccountRecoveryPending] = useState(false);
    const [isCarbonRequestPending, setIsCarbonRequestPending] = useState(false);
    const [showAccountRecoveryError, setShowAccountRecoveryError] = useState(false);
    const [isLoginUsingAnotherLocalAccount, setIsLoginUsingAnotherLocalAccount] = useState(false);
    const [login, setLogin] = useState(preFilledEmail ?? '');
    const [otp, setOtp] = useState('');
    const [useOtpBackup, setUseOtpBackup] = useState(false);
    const [otpToken, setOtpToken] = useState('');
    const [password, setPassword] = useState<string | null>(null);
    const [rememberMe, setRememberMe] = useState(false);
    const [shouldPersistOnDevice, setShouldPersistOnDevice] = useState(true);
    const [currentStep, setCurrentStep] = useState(LoginStep.Email);
    const [ssoServiceProviderUrl, setSsoServiceProviderUrl] = useState('');
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [localSsoRedirect, setLocalSsoRedirect] = useState(false);
    const [showAccountRecoveryDialog, setShowAccountRecoveryDialog] = useState(false);
    const [isDashlaneAuthenticatorAvailable, setIsDashlaneAuthenticatorAvailable,] = useState(false);
    const [showNitroSSOExtensionNeededError, setShowNitroSSOExtensionNeededError,] = useState(false);
    const { translate } = useTranslate();
    const unsubscribeFns = useRef<Array<() => void>>([]);
    const lastLoginStep = useRef(loginStepInfo?.step);
    const [isNitroSSO, setIsNitroSSO] = useState(false);
    const { loginUserWithEnclaveSSO } = useModuleCommands(confidentialSSOApi);
    const nitroLoginCommand = useCallback(async () => {
        const loginResult = await loginUserWithEnclaveSSO({
            userEmailAddress: login,
        });
        if (loginResult.tag === 'failure') {
            setIsCarbonRequestPending(false);
            setError('UNKNOWN_ERROR');
        }
    }, [loginUserWithEnclaveSSO, login]);
    const logActiveStepPageView = useCallback((step: LoginStep) => {
        if (stepToPageView[step]) {
            logPageView(stepToPageView[step], isTACFlow ? BrowseComponent.Tac : BrowseComponent.MainApp);
        }
    }, [isTACFlow]);
    const updateStep = useCallback((newStep: LoginStep) => {
        const stepChanged = newStep !== currentStep;
        setError('');
        if (stepChanged) {
            setCurrentStep(newStep);
            logActiveStepPageView(newStep);
        }
    }, [currentStep, logActiveStepPageView]);
    useEffect(() => {
        setError('');
    }, [login, password, rememberMe, otpToken, otp]);
    const checkForSSOMigrationAndUpdateStep = useCallback(async () => {
        const { migration, serviceProviderUrl } = await carbonConnector.getSSOMigrationInfo();
        const { isNitroProvider } = await carbonConnector.getSSOProviderInfo();
        if (migration === undefined || !serviceProviderUrl) {
            return;
        }
        if (migration === AuthenticationFlowContracts.SSOMigrationType.MP_TO_SSO) {
            updateStep(LoginStep.ActivateSSO);
            setSsoServiceProviderUrl(augmentUrlWithProperSsoQueryParameters(serviceProviderUrl));
            setIsNitroSSO(isNitroProvider ?? false);
            setLocalSsoRedirect(false);
        }
        else if (migration ===
            AuthenticationFlowContracts.SSOMigrationType.MP_TO_SSO_WITH_INFO) {
            updateStep(LoginStep.ActivateSSO);
            setSsoServiceProviderUrl(provideLocalInStoreSsoUrl());
            setLocalSsoRedirect(true);
        }
    }, [updateStep]);
    const getLastSuccessfulAccount = useCallback(() => accounts.find((a) => a.isLastSuccessfulLogin), [accounts]);
    const checkForWebAuthnStep = useCallback(() => {
        if (shouldAskMasterPassword) {
            updateStep(LoginStep.Password);
            return;
        }
        if (!browserSupportsWebAuthnAuthentication()) {
            return;
        }
        const lastSuccessfulLocalAccount = getLastSuccessfulAccount();
        if (!lastSuccessfulLocalAccount) {
            return;
        }
        if (lastSuccessfulLocalAccount.rememberMeType === 'webauthn') {
            if (lastSuccessfulLocalAccount.shouldAskMasterPassword) {
                updateStep(LoginStep.Password);
            }
            else {
                updateStep(LoginStep.WebAuthn);
            }
        }
    }, [getLastSuccessfulAccount, shouldAskMasterPassword, updateStep]);
    const addCarbonEventListeners = useCallback(() => {
        unsubscribeFns.current = unsubscribeFns.current.concat([
            carbonConnector.openSessionFailed.on((data) => {
                const sessionError = data.errorCode;
                if (sessionError === 'USER_DOESNT_EXIST_SSO') {
                    redirect(`${ACCOUNT_CREATION_URL_SEGMENT}?email=${login}`);
                }
                setError(sessionError);
                setIsCarbonRequestPending(false);
            }),
            carbonConnector.liveLoginStatus.on((data: LoginStatusChanged) => {
                if (data.loggedIn && data.needsSSOMigration) {
                    checkForSSOMigrationAndUpdateStep();
                }
            }),
            carbonConnector.openSessionMasterPasswordLess.on(() => {
                updateStep(LoginStep.MasterPasswordLess);
            }),
            carbonConnector.openSessionTokenSent.on(() => {
                updateStep(LoginStep.OtpToken);
            }),
            carbonConnector.openSessionDashlaneAuthenticator.on(() => {
                updateStep(LoginStep.DashlaneAuthenticator);
                setIsDashlaneAuthenticatorAvailable(true);
                carbonConnector.openSessionWithDashlaneAuthenticator({
                    login: login,
                    password: password,
                    persistData: shouldPersistOnDevice,
                    deviceName: deviceName,
                });
            }),
            carbonConnector.openSessionOTPSent.on(() => {
                updateStep(LoginStep.Otp);
            }),
            carbonConnector.openSessionOTPForNewDeviceRequired.on(() => {
                updateStep(LoginStep.OtpForNewDevice);
            }),
            carbonConnector.openSessionAskMasterPassword.on(() => {
                updateStep(LoginStep.Password);
            }),
        ]);
    }, [
        checkForSSOMigrationAndUpdateStep,
        checkForWebAuthnStep,
        currentStep,
        deviceName,
        login,
        password,
        shouldPersistOnDevice,
        updateStep,
    ]);
    useEffect(() => {
        addCarbonEventListeners();
        return () => {
            unsubscribeFns.current.forEach((unsubscribe) => unsubscribe());
        };
    }, [addCarbonEventListeners]);
    useEffect(() => {
        if (!lastLoginStep.current && loginStepInfo?.step) {
            lastLoginStep.current = loginStepInfo.step;
            const retrievedLoginStep = mapLastLoginStepToView(lastLoginStep.current);
            if (retrievedLoginStep) {
                setCurrentStep(retrievedLoginStep);
            }
        }
    }, [loginStepInfo]);
    useEffect(() => {
        checkForWebAuthnStep();
    }, []);
    useEffect(() => {
        setIsCarbonRequestPending(false);
        logActiveStepPageView(currentStep);
    }, [currentStep, logActiveStepPageView]);
    useEffect(() => {
        setDeviceName(getDefaultDeviceName(translate(I18N_KEYS.BROWSER_DEVICE_DEFAULT)));
        setError('');
        if (!preFilledEmail) {
            const lastSuccessfulLogin = getLastSuccessfulAccount()?.login;
            if (lastSuccessfulLogin) {
                setLogin(lastSuccessfulLogin);
            }
            carbonConnector.getUserLogin().then((userLogin) => {
                if (userLogin !== null &&
                    userLogin !== undefined &&
                    userLogin !== login) {
                    setLogin(userLogin);
                }
            });
        }
        const fetchRecoveryRequest = async () => {
            const recoveryRequestPendingResult = await carbonConnector.isRecoveryRequestPending();
            if (!recoveryRequestPendingResult.success) {
                return;
            }
            setIsAccountRecoveryPending(recoveryRequestPendingResult.response);
        };
        fetchRecoveryRequest();
    }, []);
    const onSubmitEmail = useCallback(async (event?: FormEvent) => {
        if (event) {
            event.preventDefault();
        }
        setError('');
        setIsCarbonRequestPending(true);
        const loginResult = await carbonConnector.openSession({
            login: login,
        });
        const { isNitroProvider, serviceProviderUrl } = await carbonConnector.getSSOProviderInfo();
        if (serviceProviderUrl) {
            if (isNitroProvider && !APP_PACKAGED_IN_EXTENSION) {
                setIsCarbonRequestPending(false);
                setShowNitroSSOExtensionNeededError(true);
                return;
            }
            if (APP_PACKAGED_IN_EXTENSION) {
                localStorage.setItem(REMEMBER_ME_FOR_SSO_PREFERENCE, 'true');
            }
            const newSsoServiceProviderUrl = augmentUrlWithProperSsoQueryParameters(serviceProviderUrl);
            setSsoServiceProviderUrl(newSsoServiceProviderUrl);
            setIsNitroSSO(isNitroProvider ?? false);
            if (loginResult === LoginResultEnum.SSOLogin) {
                if (isNitroProvider) {
                    nitroLoginCommand();
                }
                else {
                    redirectToUrl(newSsoServiceProviderUrl);
                }
                return;
            }
        }
    }, [login, nitroLoginCommand]);
    useEffect(() => {
        if (preFilledEmail) {
            onSubmitEmail();
        }
    }, [onSubmitEmail, preFilledEmail]);
    const checkAccountRecoveryStatus = async (passwordToCheck: string) => {
        return await carbonConnector.checkRecoveryRequestStatus({
            masterPassword: passwordToCheck,
        });
    };
    const onSubmitPassword = async (event?: FormEvent) => {
        if (event) {
            event.preventDefault();
        }
        setError('');
        setIsCarbonRequestPending(true);
        if (isAccountRecoveryAvailable && password !== null) {
            const result = await checkAccountRecoveryStatus(password);
            if (result.success) {
                setIsAccountRecoveryPending(false);
                setShowAccountRecoveryPending(false);
                setShowAccountRecoveryApproved(false);
                setShowAccountRecoveryRejected(false);
                setIsCarbonRequestPending(false);
                switch (result.response.status) {
                    case 'PENDING': {
                        setIsAccountRecoveryPending(true);
                        setShowAccountRecoveryPending(true);
                        return;
                    }
                    case 'APPROVED': {
                        setShowAccountRecoveryApproved(true);
                        return;
                    }
                    case 'REFUSED': {
                        setShowAccountRecoveryRejected(true);
                        return;
                    }
                    case 'OVERRIDDEN':
                        return;
                    case 'CANCELED': {
                        setShowAccountRecoveryPending(true);
                        return;
                    }
                    default:
                        break;
                }
            }
        }
        switch (currentStep) {
            case LoginStep.OtpToken:
                carbonConnector.openSessionWithToken({
                    login,
                    password,
                    token: otpToken,
                    persistData: shouldPersistOnDevice,
                    deviceName,
                });
                break;
            case LoginStep.Otp:
                carbonConnector.openSessionWithOTP({
                    login,
                    password,
                    otp,
                    withBackupCode: useOtpBackup,
                });
                break;
            case LoginStep.OtpForNewDevice:
                carbonConnector.openSessionWithOTPForNewDevice({
                    login,
                    password,
                    otp,
                    persistData: shouldPersistOnDevice,
                    deviceName,
                    withBackupCode: useOtpBackup,
                });
                break;
            case LoginStep.Password:
                carbonConnector.openSessionWithMasterPassword({
                    login,
                    password: password ?? '',
                    rememberPassword: rememberMe,
                    requiredPermissions: requiredPermissions,
                });
                break;
        }
    };
    const onShouldRegisterDeviceFieldChange = (newShouldPersistOnDevice: boolean) => {
        setShouldPersistOnDevice(newShouldPersistOnDevice);
        setError('');
    };
    const resetAllAccountRecoveryStatuses = () => {
        setShowAccountRecoveryDialog(false);
        setShowAccountRecoveryPending(false);
        setShowAccountRecoveryApproved(false);
        setShowAccountRecoveryRejected(false);
        setShowAccountRecoveryError(false);
    };
    const handleUseAnotherAccount = async () => {
        void logEvent(new UserUseAnotherAccountEvent({}));
        setDeviceName('');
        resetAllAccountRecoveryStatuses();
        setIsCarbonRequestPending(false);
        setIsLoginUsingAnotherLocalAccount(false);
        setOtp('');
        setOtpToken('');
        setPassword(null);
        setSsoServiceProviderUrl('');
        setShowLogoutDialog(false);
        setLocalSsoRedirect(false);
        setIsDashlaneAuthenticatorAvailable(false);
        setCurrentStep(LoginStep.Email);
        closeSession();
    };
    const onOtherAccountSelect = () => {
        setLogin('');
        setIsLoginUsingAnotherLocalAccount(true);
    };
    const onAccountRecoveryPendingClose = () => {
        setShowAccountRecoveryPending(false);
    };
    const onHandleCloseApprovalRecoveryDialog = () => {
        setShowAccountRecoveryApproved(false);
    };
    const onHandleCloseRejectedRecoveryDialog = () => {
        setShowAccountRecoveryRejected(false);
    };
    const onHandleAccountRecovery = async () => {
        if (!password) {
            setIsCarbonRequestPending(false);
            setShowAccountRecoveryApproved(false);
            return;
        }
        onHandleCloseApprovalRecoveryDialog();
        const response = await carbonConnector.recoverUserData({
            masterPassword: password,
        });
        setIsCarbonRequestPending(false);
        if (response.success) {
            carbonConnector.changeMasterPassword({
                newPassword: password,
                flow: ChangeMPFlowPath.ADMIN_ASSISTED_RECOVERY,
            });
            redirect(`${ADMIN_ASSISTED_RECOVERY_URL_SEGMENT}/change-master-password`);
        }
    };
    const onNativeFormSubmit = (e: FormEvent) => {
        const isPasswordStep = currentStep === LoginStep.Password;
        const isOtpStep = currentStep === LoginStep.Otp ||
            currentStep === LoginStep.OtpToken ||
            currentStep === LoginStep.OtpForNewDevice;
        const isDashlaneAuthenticatorStep = currentStep === LoginStep.DashlaneAuthenticator;
        if (isPasswordStep || isOtpStep || isDashlaneAuthenticatorStep) {
            e.preventDefault();
            onSubmitPassword();
        }
    };
    const handleActivateSSODialogClose = () => {
        setShowLogoutDialog(true);
    };
    const handleLogoutDialogClose = () => {
        setShowLogoutDialog(false);
    };
    const handleLogout = () => {
        logout();
        setShowLogoutDialog(false);
    };
    const onHandleShowAccountRecoveryDialog = () => {
        resetAllAccountRecoveryStatuses();
        setShowAccountRecoveryDialog(true);
    };
    const onHandleShowRecoveryPendingDialog = () => {
        resetAllAccountRecoveryStatuses();
        setShowAccountRecoveryPending(true);
    };
    const onHandleCloseAccountRecoveryDialog = () => {
        setShowAccountRecoveryDialog(false);
    };
    const onHandleShowGenericRecoveryError = () => {
        resetAllAccountRecoveryStatuses();
        setShowAccountRecoveryError(true);
    };
    const onHandleGenericRecoveryErrorClose = () => {
        setShowAccountRecoveryError(false);
    };
    const onHandleNitroSSOExtensionNeededButtonClicked = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        redirectToUrl(DASHLANE_DOWNLOAD_EXTENSION_URL);
    };
    const onHandleNitroSSOExtensionNeededClose = () => {
        setShowNitroSSOExtensionNeededError(false);
    };
    const switchToPasswordStep = () => updateStep(LoginStep.Password);
    const switchToOtpTokenStepFromDashlaneAuthenticator = async () => {
        await carbonConnector.cancelDashlaneAuthenticatorRegistration();
        updateStep(LoginStep.OtpToken);
        await carbonConnector.openSessionResendToken({ login: login || '' });
    };
    const sendDashlaneAuthenticatorPush = async () => {
        setIsCarbonRequestPending(true);
        setError('');
        await carbonConnector.openSessionWithDashlaneAuthenticator({
            login: login,
            password: password,
            persistData: shouldPersistOnDevice,
            deviceName: deviceName,
        });
    };
    const switchToDashlaneAuthenticatorStep = async () => {
        updateStep(LoginStep.DashlaneAuthenticator);
        await carbonConnector.openSessionWithDashlaneAuthenticator({
            login: login,
            password: password,
            persistData: shouldPersistOnDevice,
            deviceName: deviceName,
        });
    };
    const isEmailStep = currentStep === LoginStep.Email;
    const isPasswordStep = currentStep === LoginStep.Password;
    const isOtpStep = currentStep === LoginStep.Otp ||
        currentStep === LoginStep.OtpToken ||
        currentStep === LoginStep.OtpForNewDevice;
    const isActivateSSOStep = currentStep === LoginStep.ActivateSSO;
    const isWebAuthnStep = currentStep === LoginStep.WebAuthn;
    const isDashlaneAuthenticatorStep = currentStep === LoginStep.DashlaneAuthenticator;
    const isMPLessStep = currentStep === LoginStep.MasterPasswordLess;
    const lastSuccessfulAccount = getLastSuccessfulAccount();
    return (<div>
      <div id="dashlane-dialog"/>
      <DialogContextProvider>
        {!isDashlaneAuthenticatorStep && !isMPLessStep ? (<LoginFormHeader login={login} step={currentStep} lastSuccessfulAccount={lastSuccessfulAccount}/>) : null}
        <form autoComplete="off" className={styles.form} onSubmit={onNativeFormSubmit}>
          {isEmailStep ? (<AccountSelectionFieldset error={error} handleLoginChange={setLogin} handleOtherAccountSelect={onOtherAccountSelect} isCarbonRequestPending={isCarbonRequestPending} isLoginUsingAnotherLocalAccount={isLoginUsingAnotherLocalAccount} localAccounts={accounts} login={login} onLoginSubmit={onSubmitEmail} translate={translate}/>) : null}

          {isPasswordStep || isOtpStep || isActivateSSOStep ? (<AdditionalFactorInputFieldset defaultDevicePersistenceValue={shouldPersistOnDevice} dispatchGlobal={lee.dispatchGlobal} error={error} handleBackToEmailStepClick={handleUseAnotherAccount} handleDevicePersistenceChange={onShouldRegisterDeviceFieldChange} handleFormSubmit={onSubmitPassword} handlePasswordInputChange={setPassword} handleRememberMeCheckboxChange={setRememberMe} handleOtpInputChange={setOtp} handleUseOTPBackup={setUseOtpBackup} handleTokenInputChange={setOtpToken} handleShowAccountRecoveryDialog={onHandleShowAccountRecoveryDialog} handleIsAccountRecoveryAvailable={setIsAccountRecoveryAvailable} handleShowRecoveryPendingDialog={onHandleShowRecoveryPendingDialog} isCarbonRequestPending={isCarbonRequestPending} isAccountRecoveryAvailable={isAccountRecoveryAvailable} isAccountRecoveryPending={isAccountRecoveryPending} login={login} localAccounts={accounts} loginStep={currentStep} preFilledOtpToken={preFilledOtpToken} translate={translate} isDashlaneAuthenticatorAvailable={isDashlaneAuthenticatorAvailable} switchToDashlaneAuthenticatorStep={switchToDashlaneAuthenticatorStep}/>) : null}

          {isWebAuthnStep ? (<WebAuthnStep login={login} switchToPasswordStep={switchToPasswordStep} switchToEmailStep={handleUseAnotherAccount}/>) : null}
        </form>
        {isActivateSSOStep && !showLogoutDialog ? (<ActivateSSODialog activateLink={ssoServiceProviderUrl} onClose={handleActivateSSODialogClose} localSsoRedirect={localSsoRedirect} isNitroSSO={isNitroSSO} nitroLoginCommand={nitroLoginCommand}/>) : null}

        {isDashlaneAuthenticatorStep ? (<DashlaneAuthenticatorStep errorKey={error} switchToOtpTokenStep={switchToOtpTokenStepFromDashlaneAuthenticator} sendDashlaneAuthenticatorPush={sendDashlaneAuthenticatorPush}/>) : null}

        {isMPLessStep ? (<PasswordLessStep switchToEmailStep={handleUseAnotherAccount}/>) : null}

        <LogOutDialog isOpen={showLogoutDialog} onLogout={handleLogout} onDismiss={handleLogoutDialogClose} showCloseIcon={false}/>
        <BeginAccountRecoveryDialog showAccountRecoveryDialog={showAccountRecoveryDialog} handleDismiss={onHandleCloseAccountRecoveryDialog}/>
        <PendingAccountRecoveryDialog isAccountRecoveryPending={showAccountRecoveryPending} shouldSendNewRequest={!password} handleShowAccountRecoveryDialog={onHandleShowAccountRecoveryDialog} handleShowGenericRecoveryError={onHandleShowGenericRecoveryError} handleDismiss={onAccountRecoveryPendingClose}/>
        <ApprovalRecoveryDialog isAccountRecoveryApproved={showAccountRecoveryApproved} handleDismiss={onHandleCloseApprovalRecoveryDialog} handleAccountRecovery={onHandleAccountRecovery}/>
        <RejectedRecoveryDialog isAccountRecoveryRejected={showAccountRecoveryRejected} handleDismiss={onHandleCloseRejectedRecoveryDialog}/>
        <GenericRecoveryErrorDialog isAccountRecoveryError={showAccountRecoveryError} handleGenericRecoveryErrorClose={onHandleGenericRecoveryErrorClose}/>
        <NitroSSOLoginExtensionNeededDialog isOpen={showNitroSSOExtensionNeededError} handleButtonClick={onHandleNitroSSOExtensionNeededButtonClicked} handleClose={onHandleNitroSSOExtensionNeededClose}/>
      </DialogContextProvider>
    </div>);
};
