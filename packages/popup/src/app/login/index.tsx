import * as React from 'react';
import { Kernel } from 'kernel';
import { device } from '@dashlane/browser-utils';
import { AuthenticationCode, LoginStep, LoginStepInfo, OtpType, } from '@dashlane/communication';
import { PageView, UserUseAnotherAccountEvent } from '@dashlane/hermes';
import { AuthenticationFlowContracts } from '@dashlane/authentication-contracts';
import { useModuleCommands } from '@dashlane/framework-react';
import { confidentialSSOApi } from '@dashlane/sso-scim-contracts';
import Header from 'app/login/Header';
import PasswordStep from 'app/login/PasswordStep';
import { WebAuthnStep } from 'app/login/WebAuthnStep/WebAuthnStep';
import { WebAuthnErrorStep } from 'app/login/WebAuthnErrorStep/WebAuthnErrorStep';
import styles from 'app/login/styles.css';
import OTPWrapper from 'app/login/OTPWrapper';
import EmailStep from 'app/login/EmailStep';
import WelcomeStep from 'app/login/WelcomeStep';
import ActivateSSOStep from 'app/login/ActivateSSOStep';
import SSOStep from 'app/login/SSOStep';
import TokenWrapper from 'app/login/TokenWrapper';
import { DashlaneAuthenticatorStep } from 'app/login/DashlaneAuthenticatorStep/index';
import { DeviceLimitFlow } from 'app/login/DeviceLimitFlow';
import { EmailError, isInEmailError, resendToken, sendLogin, sendOTP2, sendOtpForNewDevice, sendPassword, sendToken, updateLoginStepInfoLogin, } from 'app/login/helpers';
import { REMEMBER_ME_FOR_SSO_PREFERENCE } from 'src/libs/local-storage-constants';
import { openExternalUrl } from 'libs/externalUrls';
import { LocalAccount } from 'src/eventManager/types';
import { browserSupportsWebAuthnAuthentication } from './WebAuthnStep/helpers/browserWebAuthnAuthentication';
import { logEvent, logPageView } from 'src/libs/logs/logEvent';
import { carbonConnector } from 'src/carbonConnector';
import { Route } from '@dashlane/framework-infra/src/spi/business/webapp/open.types';
import BackupCodeWrapper from './BackupCodeWrapper';
import { PasswordLessStep } from './PasswordLessStep';
const loginStepToPageView = {
    [LoginStep.Email]: PageView.LoginEmail,
    [LoginStep.Password]: PageView.LoginMasterPassword,
    [LoginStep.SSO]: PageView.LoginSso,
    [LoginStep.OTPToken]: PageView.LoginTokenEmail,
    [LoginStep.OTP1]: PageView.LoginTokenAuthenticator,
    [LoginStep.OTP2]: PageView.LoginTokenAuthenticator,
    [LoginStep.WebAuthn]: PageView.LoginWebauthn,
};
interface TwoFactorAuthStepParams {
    [key: string]: {
        component: React.FunctionComponent<any>;
        handleSubmit: (params: {
            login: string;
            otp: string;
        }) => void;
        alternateMethod: OTPLoginStep | BackupCodeLoginStep;
    };
}
type OTPLoginStep = LoginStep.OTP1 | LoginStep.OTP2;
type BackupCodeLoginStep = LoginStep.BackupCodeOTP1 | LoginStep.BackupCodeOTP2;
const TWO_FACTOR_AUTH_STEP_MAPPER: TwoFactorAuthStepParams = {
    [LoginStep.OTP1]: {
        component: OTPWrapper,
        handleSubmit: sendOtpForNewDevice,
        alternateMethod: LoginStep.BackupCodeOTP1,
    },
    [LoginStep.OTP2]: {
        component: OTPWrapper,
        handleSubmit: sendOTP2,
        alternateMethod: LoginStep.BackupCodeOTP2,
    },
    [LoginStep.BackupCodeOTP1]: {
        component: BackupCodeWrapper,
        handleSubmit: sendOtpForNewDevice,
        alternateMethod: LoginStep.OTP1,
    },
    [LoginStep.BackupCodeOTP2]: {
        component: BackupCodeWrapper,
        handleSubmit: sendOTP2,
        alternateMethod: LoginStep.OTP2,
    },
};
export interface LoginProps {
    lastUsedAccount?: LocalAccount;
    localAccountsLogin: string[];
    kernel: Kernel;
    currentLoginStep: LoginStepInfo | null;
    ssoMigrationServiceProviderUrl: string;
    openSignupOrLogin: (route: Route) => void;
    setIsInitialSyncAnimationPending: (pending: boolean) => void;
}
const Login: React.FC<LoginProps> = ({ currentLoginStep, kernel, lastUsedAccount, localAccountsLogin, openSignupOrLogin, ssoMigrationServiceProviderUrl, setIsInitialSyncAnimationPending, }) => {
    const initialLogin = currentLoginStep?.login ?? lastUsedAccount?.login ?? '';
    const ongoingLoginStep = currentLoginStep ? currentLoginStep.step : null;
    const loginsRef = React.useRef([initialLogin]);
    const [login, setLogin] = React.useState(initialLogin);
    const [step, setStep] = React.useState<LoginStep | null>(ongoingLoginStep);
    const [error, setError] = React.useState('');
    const resetErrorState = (): void => setError('');
    const [isWaitingCarbonResponse, setIsWaitingCarbonResponse] = React.useState(false);
    const [displayRememberMeWithAutoLogin, setDisplayRememberMeWithAutoLogin] = React.useState(true);
    const [animationRunning, setAnimationRunning] = React.useState(false);
    const [isDashlaneAuthenticatorAvailable, setIsDashlaneAuthenticatorAvailable,] = React.useState(false);
    const [twoFactorAuthenticationMode, setTwoFactorAuthenticationMode] = React.useState<OtpType>(OtpType.NO_OTP);
    const { loginUserWithEnclaveSSO } = useModuleCommands(confidentialSSOApi);
    const { initiateLoginWithSSO, logout } = useModuleCommands(AuthenticationFlowContracts.authenticationFlowApi);
    const displayApp = () => {
        window.dispatchEvent(new Event('display-app'));
    };
    const backupAndSendLogin = (newLogin: string) => {
        loginsRef.current.push(newLogin);
        sendLogin({ login: newLogin });
    };
    const setWaitingForResponseState = (): void => {
        resetErrorState();
        setIsWaitingCarbonResponse(true);
    };
    const sendDashlaneAuthenticatorPushNotification = (): void => {
        setWaitingForResponseState();
        void carbonConnector.updateLoginStepInfo({ login: login });
        void carbonConnector.openSessionWithDashlaneAuthenticator({
            login: login,
            deviceName: device.getDefaultDeviceName(),
            persistData: true,
            password: null,
        });
    };
    const handleOpenSessionFailed = (errorCode: string) => {
        const removedLogins = loginsRef.current.splice(-1);
        displayApp();
        setError(errorCode);
        setIsWaitingCarbonResponse(false);
        const isSSOMigrationSupported = errorCode ===
            AuthenticationCode[AuthenticationCode.CLIENT_VERSION_DOES_NOT_SUPPORT_SSO_MIGRATION];
        if (!step && isSSOMigrationSupported) {
            setStep(LoginStep.Password);
        }
        if (isInEmailError(errorCode)) {
            if (errorCode === EmailError.USER_DOESNT_EXIST_SSO) {
                openSignupOrLogin(`/signup?email=${removedLogins[0]}`);
            }
            setLogin('');
            const lastWorkingLogin = loginsRef.current[loginsRef.current.length - 1];
            updateLoginStepInfoLogin(lastWorkingLogin || '');
        }
    };
    React.useEffect(() => {
        const unsubscribes = [
            carbonConnector.openSessionAskMasterPassword.on(async () => {
                await carbonConnector.updateLoginStepInfo({ step: LoginStep.Password });
                displayApp();
                setStep(LoginStep.Password);
                setIsWaitingCarbonResponse(false);
            }),
            carbonConnector.openSessionTokenSent.on(() => {
                void carbonConnector.updateLoginStepInfo({ step: LoginStep.OTPToken });
                displayApp();
                setStep(LoginStep.OTPToken);
                setIsWaitingCarbonResponse(false);
            }),
            carbonConnector.openSessionDashlaneAuthenticator.on(() => {
                void carbonConnector.updateLoginStepInfo({
                    step: LoginStep.DashlaneAuthenticator,
                });
                displayApp();
                setStep(LoginStep.DashlaneAuthenticator);
                setIsWaitingCarbonResponse(true);
                setIsDashlaneAuthenticatorAvailable(true);
            }),
            carbonConnector.openSessionFailed.on((data) => {
                handleOpenSessionFailed(data.errorCode);
            }),
            carbonConnector.openSessionOTPForNewDeviceRequired.on(() => {
                void carbonConnector.updateLoginStepInfo({ step: LoginStep.OTP1 });
                displayApp();
                setTwoFactorAuthenticationMode(OtpType.OTP_NEW_DEVICE);
                setStep(LoginStep.OTP1);
                setIsWaitingCarbonResponse(false);
            }),
            carbonConnector.openSessionOTPSent.on(() => {
                void carbonConnector.updateLoginStepInfo({ step: LoginStep.OTP2 });
                displayApp();
                setTwoFactorAuthenticationMode(OtpType.OTP_LOGIN);
                setStep(LoginStep.OTP2);
                setIsWaitingCarbonResponse(false);
            }),
            carbonConnector.liveServiceProviderUrl.on(() => {
                displayApp();
                setStep(LoginStep.SSO);
                setIsWaitingCarbonResponse(false);
            }),
            carbonConnector.openSessionMasterPasswordLess.on(() => {
                void carbonConnector.updateLoginStepInfo({
                    step: LoginStep.PasswordLess,
                });
                displayApp();
                setStep(LoginStep.PasswordLess);
                setIsWaitingCarbonResponse(false);
            }),
        ];
        return () => {
            unsubscribes.forEach((unsubscribe) => {
                unsubscribe();
            });
        };
    }, []);
    React.useEffect(() => {
        if (step === LoginStep.WebAuthnError) {
            return;
        }
        if (login === lastUsedAccount?.login) {
            if (browserSupportsWebAuthnAuthentication() &&
                lastUsedAccount.rememberMeType === 'webauthn') {
                if (step === LoginStep.Password) {
                    setDisplayRememberMeWithAutoLogin(false);
                }
                else if (lastUsedAccount.shouldAskMasterPassword) {
                    setStep(LoginStep.Password);
                }
                else {
                    setStep(LoginStep.WebAuthn);
                    displayApp();
                    return;
                }
            }
        }
        if (login && !step && !isWaitingCarbonResponse) {
            backupAndSendLogin(login);
            setIsWaitingCarbonResponse(true);
            return;
        }
        if (!login && !step) {
            setStep(LoginStep.Welcome);
            displayApp();
            return;
        }
        if (!login && step === LoginStep.Password) {
            setStep(LoginStep.Welcome);
            displayApp();
            return;
        }
        if (login && step) {
            displayApp();
            return;
        }
    }, [login, step, ongoingLoginStep, lastUsedAccount, isWaitingCarbonResponse]);
    React.useEffect(() => {
        if (login && ongoingLoginStep === LoginStep.ActivateSSO) {
            setIsWaitingCarbonResponse(false);
            setStep(LoginStep.ActivateSSO);
            displayApp();
            return;
        }
    }, [login, ongoingLoginStep]);
    React.useEffect(() => {
        if (login && ongoingLoginStep === LoginStep.DeviceLimitReached) {
            setIsWaitingCarbonResponse(false);
            setStep(LoginStep.DeviceLimitReached);
            displayApp();
            return;
        }
    });
    React.useEffect(() => {
        if (step && loginStepToPageView[step]) {
            logPageView(loginStepToPageView[step as keyof typeof loginStepToPageView]);
        }
    }, [step]);
    React.useEffect(() => {
        if (login && step === LoginStep.DashlaneAuthenticator) {
            sendDashlaneAuthenticatorPushNotification();
        }
    }, [login, step]);
    const updateLogin = (newLogin: string): void => {
        resetErrorState();
        setLogin(newLogin);
        setTwoFactorAuthenticationMode(OtpType.NO_OTP);
        if (newLogin === lastUsedAccount?.login) {
            if (browserSupportsWebAuthnAuthentication() &&
                lastUsedAccount.rememberMeType === 'webauthn') {
                setStep(LoginStep.WebAuthn);
                return;
            }
        }
        if (step === LoginStep.WebAuthnError) {
            setStep(LoginStep.Password);
        }
        setDisplayRememberMeWithAutoLogin(true);
        backupAndSendLogin(newLogin);
    };
    const switchToEmailStep = (): void => {
        setLogin('');
        setStep(LoginStep.Email);
        resetErrorState();
    };
    const switchToPasswordStep = (): void => {
        setStep(LoginStep.Password);
        resetErrorState();
    };
    const switchToAlternateMethodStep = (target: OTPLoginStep | BackupCodeLoginStep): void => {
        setStep(target);
        resetErrorState();
    };
    const switchToWebAuthnStep = (): void => {
        setStep(LoginStep.WebAuthn);
        resetErrorState();
    };
    const switchToWebAuthnErrorStep = (): void => {
        setStep(LoginStep.WebAuthnError);
        resetErrorState();
    };
    const switchToEmailStepFromDropdown = (): void => {
        switchToEmailStep();
        void logEvent(new UserUseAnotherAccountEvent({}));
    };
    const switchToEmailStepFromWelcomeStep = (): void => {
        switchToEmailStep();
    };
    const switchToOtpTokenStepFromDashlaneAuthenticatorStep = async (): Promise<void> => {
        setIsWaitingCarbonResponse(false);
        await carbonConnector.cancelDashlaneAuthenticatorRegistration();
        setStep(LoginStep.OTPToken);
        void carbonConnector.openSessionResendToken({ login: login || '' });
        resetErrorState();
    };
    const switchToDashlaneAuthenticatorStep = (): void => {
        setStep(LoginStep.DashlaneAuthenticator);
    };
    const onNewAccountClickFromDropdown = (): void => {
        openSignupOrLogin('/signup');
    };
    const onNewAccountClickFromWelcomeStep = (): void => {
        openSignupOrLogin('/signup');
    };
    const onSSOClickFromWelcomeStep = async (rememberMeForSSOPreference: boolean) => {
        localStorage.setItem(REMEMBER_ME_FOR_SSO_PREFERENCE, rememberMeForSSOPreference ? 'true' : 'false');
        await initiateLoginWithSSO({
            login: login ?? '',
            rememberMeForSSOPreference,
        });
    };
    const onActivateSSOClick = async () => {
        const providerInfo = await carbonConnector.getSSOProviderInfo();
        if (providerInfo.isNitroProvider) {
            void loginUserWithEnclaveSSO({ userEmailAddress: login });
        }
        else {
            void openExternalUrl(ssoMigrationServiceProviderUrl);
        }
    };
    const onSubmitEmail = (email: string): void => {
        setLogin(email);
        backupAndSendLogin(email);
    };
    const onStartOver = (): void => {
        void logout();
        setIsWaitingCarbonResponse(false);
        switchToEmailStep();
    };
    const passwordStepDescription = login === lastUsedAccount?.login &&
        lastUsedAccount.rememberMeType === 'webauthn' &&
        lastUsedAccount.shouldAskMasterPassword
        ? 'login/webauthn_password_session_expired_description'
        : undefined;
    const isInitialLocalLogin = localAccountsLogin.length === 0 || !localAccountsLogin.includes(login);
    const getPasswordLessStepComponent = () => (<PasswordLessStep switchToEmailStep={switchToEmailStep}/>);
    const getPasswordStepComponent = () => (<PasswordStep login={login} isLoading={isWaitingCarbonResponse} sendPassword={sendPassword} displayRememberMe={twoFactorAuthenticationMode !== OtpType.OTP_LOGIN &&
            displayRememberMeWithAutoLogin &&
            !isInitialLocalLogin} setWaitingForResponseState={setWaitingForResponseState} error={error} resetErrorState={resetErrorState} descriptionKey={passwordStepDescription}/>);
    const getWebAuthnStepComponent = () => (<WebAuthnStep login={login} onUseMasterPassword={switchToPasswordStep} getExtensionId={kernel.browser.getExtensionId} showError={switchToWebAuthnErrorStep}/>);
    const getWebAuthnErrorStepComponent = () => (<WebAuthnErrorStep onUseMasterPassword={switchToPasswordStep} onRetryWebAuthn={switchToWebAuthnStep}/>);
    const getTwoFactorAuthStepComponent = () => {
        if (step) {
            const { handleSubmit, alternateMethod, component } = TWO_FACTOR_AUTH_STEP_MAPPER[step];
            return React.createElement(component, {
                login,
                isLoading: isWaitingCarbonResponse,
                setWaitingForResponseState,
                error,
                handleSubmit,
                onSwitchAuthMethodClick: () => switchToAlternateMethodStep(alternateMethod),
                resetErrorState,
            });
        }
        return null;
    };
    const getTokenStepComponent = () => (<TokenWrapper login={login} isLoading={isWaitingCarbonResponse} setWaitingForResponseState={setWaitingForResponseState} error={error} sendToken={sendToken} resendToken={resendToken} resetErrorState={resetErrorState} isDashlaneAuthenticatorAvailable={isDashlaneAuthenticatorAvailable} switchToDashlaneAuthenticatorStep={switchToDashlaneAuthenticatorStep}/>);
    const getDashlaneAuthenticatorStepComponent = () => (<DashlaneAuthenticatorStep errorKey={error} switchToOtpTokenStep={() => {
            void switchToOtpTokenStepFromDashlaneAuthenticatorStep();
        }} sendDashlaneAuthenticatorPushNotification={sendDashlaneAuthenticatorPushNotification}/>);
    const getEmailStep = () => (<EmailStep onCreateAnAccountClick={() => openSignupOrLogin('/signup')} onSubmitEmail={onSubmitEmail} setWaitingForResponseState={setWaitingForResponseState} isLoading={isWaitingCarbonResponse} error={error} resetErrorState={resetErrorState}/>);
    const getWelcomeStep = () => (<WelcomeStep onCreateAccountClick={onNewAccountClickFromWelcomeStep} onLoginClick={switchToEmailStepFromWelcomeStep}/>);
    const getSSOStep = () => (<SSOStep onSSOSignInClicked={onSSOClickFromWelcomeStep}/>);
    const getActivateSSOStep = () => (<ActivateSSOStep onActivateSSOClicked={() => {
            void onActivateSSOClick();
        }}/>);
    const getDeviceLimitFlow = () => (<DeviceLimitFlow setIsInitialSyncAnimationPending={setIsInitialSyncAnimationPending} onStartOver={onStartOver}/>);
    const getStepComponent = () => {
        switch (step) {
            case LoginStep.Password:
                return getPasswordStepComponent();
            case LoginStep.WebAuthn:
                return getWebAuthnStepComponent();
            case LoginStep.WebAuthnError:
                return getWebAuthnErrorStepComponent();
            case LoginStep.OTP2:
            case LoginStep.OTP1:
            case LoginStep.BackupCodeOTP1:
            case LoginStep.BackupCodeOTP2:
                return getTwoFactorAuthStepComponent();
            case LoginStep.Email:
                return getEmailStep();
            case LoginStep.Welcome:
                return getWelcomeStep();
            case LoginStep.OTPToken:
                return getTokenStepComponent();
            case LoginStep.SSO:
                return getSSOStep();
            case LoginStep.ActivateSSO:
                return getActivateSSOStep();
            case LoginStep.DeviceLimitReached:
                return getDeviceLimitFlow();
            case LoginStep.DashlaneAuthenticator:
                return getDashlaneAuthenticatorStepComponent();
            case LoginStep.PasswordLess:
                return getPasswordLessStepComponent();
            default:
                return null;
        }
    };
    const showHeader = step !== LoginStep.DeviceLimitReached &&
        step !== LoginStep.DashlaneAuthenticator;
    return (<div className={styles.loginPanel}>
      {showHeader ? (<Header login={login} localAccountsLogin={localAccountsLogin} onOtherAccountClick={switchToEmailStepFromDropdown} onNewAccountClick={onNewAccountClickFromDropdown} onSelectLogin={updateLogin} setAnimationRunning={setAnimationRunning} hideDropdown={step === LoginStep.Email ||
                step === LoginStep.Welcome ||
                step === LoginStep.ActivateSSO ||
                step === LoginStep.PasswordLess ||
                animationRunning} showLogoutDropdown={step === LoginStep.ActivateSSO}/>) : null}

      {!animationRunning ? getStepComponent() : null}
    </div>);
};
export default React.memo(Login);
