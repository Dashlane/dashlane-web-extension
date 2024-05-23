import { ChangeEvent, ChangeEventHandler, Component, createRef, FormEvent, Fragment, KeyboardEvent, MouseEvent, SyntheticEvent, } from 'react';
import classnames from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { AuthenticationCode, LocalAccountInfo } from '@dashlane/communication';
import { UserForgetMasterPasswordEvent } from '@dashlane/hermes';
import { Button, colors, FlexContainer, jsx, Link, Paragraph, Tooltip, } from '@dashlane/ui-components';
import { Checkbox, Icon } from '@dashlane/design-system';
import { DashlaneUpdateNeeded } from 'auth/login-panel/login-form/login-errors/dashlane-update-needed';
import { LoginStep } from 'auth/login-panel/login-form/types';
import { EmailHeading } from 'auth/login-panel/login-form/email-heading/email-heading';
import { carbonConnector } from 'libs/carbon/connector';
import { onLinkClickOpenDashlaneUrl } from 'libs/external-urls';
import PrimaryButton from 'libs/dashlane-style/buttons/modern/primary';
import ProgressBar from 'libs/dashlane-style/progress-bar';
import { logEvent } from 'libs/logs/logEvent';
import { TranslatorInterface } from 'libs/i18n/types';
import { DispatchGlobal } from 'store/types';
import styles from './styles.css';
import formStyles from '../styles.css';
import tokenResentConfirmationStyles from './transition-token-resent-msg.css';
import { I18N_KEYS, I18N_REMEMBER_ME_KEYS } from './I18N_KEYS';
import { MasterPasswordInput } from '../master-password-input/master-password-input';
import { LoginTokenInput } from './login-token-input';
import { LoginOTPInput } from './login-otp-input';
import { LoginBackupCodeInput } from './login-backup-code-input';
import { logResendTokenEvent } from '../../logs';
export interface Props {
    defaultDevicePersistenceValue: boolean;
    dispatchGlobal: DispatchGlobal;
    error: string;
    handleBackToEmailStepClick: () => void;
    handleDevicePersistenceChange: (value: boolean) => void;
    handleFormSubmit: (e?: FormEvent) => void;
    handlePasswordInputChange: (value: string) => void;
    handleOtpInputChange: (value: string) => void;
    handleRememberMeCheckboxChange: (value: boolean) => void;
    handleTokenInputChange: (value: string) => void;
    handleIsAccountRecoveryAvailable: (value: boolean) => void;
    handleUseOTPBackup: (value: boolean) => void;
    isCarbonRequestPending: boolean;
    isAccountRecoveryAvailable: boolean;
    isAccountRecoveryPending: boolean;
    login: string | null;
    localAccounts: LocalAccountInfo[];
    loginStep: LoginStep;
    preFilledOtpToken?: string;
    translate: TranslatorInterface;
    handleShowAccountRecoveryDialog: () => void;
    handleShowRecoveryPendingDialog: () => void;
    switchToDashlaneAuthenticatorStep: () => void;
    isDashlaneAuthenticatorAvailable: boolean;
}
interface State {
    securityCode: string;
    showConfirmTokenResent: boolean;
    rememberMeIsChecked: boolean;
    showRememberMeCheckbox: boolean;
    openSessionProgress: number;
    showBackupCodeInput: boolean;
}
const CONFIRM_TOKEN_RESENT_RESET_TIMEOUT = 2000;
const MAX_LENGTH_TOKEN = 6;
const MAX_LENGTH_OTP = 6;
export class AdditionalFactorInputFieldset extends Component<Props, State> {
    public state: Readonly<State> = {
        securityCode: '',
        showConfirmTokenResent: false,
        rememberMeIsChecked: false,
        showRememberMeCheckbox: false,
        openSessionProgress: 0,
        showBackupCodeInput: false,
    };
    private otp = createRef<HTMLInputElement>();
    private otpToken = createRef<HTMLInputElement>();
    private password = createRef<HTMLInputElement>();
    private logUserForgetMasterPasswordEvent = (hasTeamAccountRecovery: boolean) => {
        logEvent(new UserForgetMasterPasswordEvent({
            hasBiometricReset: false,
            hasTeamAccountRecovery,
        }));
    };
    private unsubToSessionProgress = () => {
    };
    private checkIsAccountRecoveryActivated = async () => {
        const response = await carbonConnector.checkDoesLocalRecoveryKeyExist();
        if (response.success && response.doesExist) {
            this.props.handleIsAccountRecoveryAvailable(true);
            return;
        }
        this.props.handleIsAccountRecoveryAvailable(false);
    };
    private preFillOtpToken = () => {
        if (this.props.loginStep === LoginStep.OtpToken &&
            this.props.preFilledOtpToken) {
            this.handleTokenValueChange(this.props.preFilledOtpToken);
        }
    };
    public componentDidMount() {
        this.checkIsAccountRecoveryActivated();
        this.preFillOtpToken();
        const showRememberMeCheckbox = this.showRememberMeCheckbox();
        this.setState({ showRememberMeCheckbox });
        this.unsubToSessionProgress = carbonConnector.openSessionProgressChanged.on(({ statusProgress }) => {
            this.setState({ openSessionProgress: statusProgress });
        });
    }
    public componentWillUnmount() {
        this.unsubToSessionProgress();
    }
    public componentDidUpdate() {
        const { isCarbonRequestPending } = this.props;
        if (!isCarbonRequestPending) {
            this.focusField();
        }
    }
    private focusField() {
        const { loginStep } = this.props;
        switch (loginStep) {
            case LoginStep.Otp:
            case LoginStep.OtpForNewDevice:
                if (this.otp.current) {
                    this.otp.current.focus();
                }
                break;
            case LoginStep.OtpToken:
                if (this.otpToken.current) {
                    this.otpToken.current.focus();
                }
                break;
            default:
                if (this.password.current) {
                    this.password.current.focus();
                }
        }
    }
    private handleOtpInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        if (this.state.showBackupCodeInput) {
            this.setState({ securityCode: value });
            this.props.handleOtpInputChange(value);
        }
        else {
            const filteredValue = value.replace(/\D/g, '');
            this.props.handleOtpInputChange(filteredValue);
            this.setState({ securityCode: filteredValue }, () => {
                if (filteredValue.length === MAX_LENGTH_OTP) {
                    this.handleFormSubmit();
                }
            });
        }
    };
    private handleTokenValueChange = (value: string) => {
        const filteredValue = value.replace(/\D/g, '');
        this.props.handleTokenInputChange(filteredValue);
        this.setState({ securityCode: filteredValue }, () => {
            if (filteredValue.length === MAX_LENGTH_TOKEN) {
                this.handleFormSubmit();
            }
        });
    };
    private handleTokenInputChange = ({ target: { value }, }: ChangeEvent<HTMLInputElement>) => {
        this.handleTokenValueChange(value);
    };
    private handleTokenResent = () => {
        logResendTokenEvent();
        carbonConnector.openSessionResendToken({ login: this.props.login || '' });
        this.setState({ showConfirmTokenResent: true });
        setTimeout(() => {
            this.setState({ showConfirmTokenResent: false });
        }, CONFIRM_TOKEN_RESENT_RESET_TIMEOUT);
    };
    private handleBackToEmailStepClick = () => {
        this.props.handleBackToEmailStepClick();
    };
    private handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.handleFormSubmit(e);
            return;
        }
    };
    private onRememberMeCheckboxChange = (value: boolean): void => {
        this.setState({ rememberMeIsChecked: value });
        this.props.handleRememberMeCheckboxChange(value);
    };
    private handleFormSubmit = (e?: SyntheticEvent<HTMLElement>) => {
        this.props.handleFormSubmit(e);
    };
    private onAccountRecoveryButtonClick = () => {
        this.logUserForgetMasterPasswordEvent(this.props.isAccountRecoveryAvailable);
        if (this.props.isAccountRecoveryPending) {
            this.props.handleShowRecoveryPendingDialog();
        }
        this.props.handleShowAccountRecoveryDialog();
    };
    private onForgetPasswordLinkClick = (e: MouseEvent<HTMLAnchorElement>) => {
        this.logUserForgetMasterPasswordEvent(this.props.isAccountRecoveryAvailable);
        onLinkClickOpenDashlaneUrl({ type: 'login', action: 'forgotPassword' })(e);
    };
    private handleDevicePersistenceChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        this.props.handleDevicePersistenceChange(event.target.checked);
    };
    private getAdditionalInput = () => {
        const { error, loginStep, translate } = this.props;
        const hasError = Boolean(error);
        const { showBackupCodeInput } = this.state;
        const toggleBackupCodeInput = () => {
            const securityCode = '';
            this.setState({
                securityCode,
                showBackupCodeInput: !showBackupCodeInput,
            });
            this.props.handleUseOTPBackup(!showBackupCodeInput);
            this.props.handleTokenInputChange(securityCode);
        };
        const renderTrustThisDeviceCheckbox = () => {
            const { defaultDevicePersistenceValue } = this.props;
            return (!APP_PACKAGED_IN_EXTENSION && (<div className={styles.trustThisDeviceContainer}>
            <Checkbox label={translate(I18N_KEYS.TRUST_DEVICE)} defaultChecked={defaultDevicePersistenceValue} onChange={this.handleDevicePersistenceChange}/>
            <Tooltip content={<p>{translate(I18N_KEYS.TRUST_DEVICE_TOOLTIP)}</p>}>
              <div sx={{ marginTop: '0.5em', marginLeft: '4px' }}>
                <Icon name="FeedbackHelpOutlined" size="small" color="ds.text.neutral.standard"/>
              </div>
            </Tooltip>
          </div>));
        };
        if (loginStep === LoginStep.OtpToken) {
            return (<div className={classnames(formStyles.fieldContainer, formStyles.otpContainer)}>
          <LoginTokenInput securityCode={this.state.securityCode} maxLength={MAX_LENGTH_TOKEN} onTokenInputChange={this.handleTokenInputChange} onKeyDown={this.handleKeyDown} hasError={hasError} error={error}/>

          {renderTrustThisDeviceCheckbox()}
        </div>);
        }
        if (loginStep === LoginStep.Otp ||
            loginStep === LoginStep.OtpForNewDevice) {
            return (<div className={classnames(formStyles.fieldContainer, formStyles.otpContainer)}>
          {showBackupCodeInput ? (<LoginBackupCodeInput onOTPInputChange={this.handleOtpInputChange} securityCode={this.state.securityCode} hasError={hasError} toggleBackupCodeInput={toggleBackupCodeInput} error={error} login={this.props.login ?? ''}/>) : (<LoginOTPInput securityCode={this.state.securityCode} maxLength={MAX_LENGTH_OTP} onOTPInputChange={this.handleOtpInputChange} onKeyDown={this.handleKeyDown} hasError={hasError} toggleBackupCodeInput={toggleBackupCodeInput} error={error} login={this.props.login ?? ''}/>)}

          {loginStep === LoginStep.OtpForNewDevice &&
                    renderTrustThisDeviceCheckbox()}
        </div>);
        }
        return null;
    };
    private showRememberMeCheckbox = () => {
        const localAccounts = this.props.localAccounts;
        if (!localAccounts) {
            return false;
        }
        return localAccounts.some((account) => !account.hasLoginOtp &&
            account.login === this.props.login &&
            account.rememberMeType !== 'webauthn');
    };
    private showDashlaneUpdateInfoBox = (error: string | undefined) => error ===
        AuthenticationCode[AuthenticationCode.CLIENT_VERSION_DOES_NOT_SUPPORT_SSO_MIGRATION];
    public render() {
        const { error, isCarbonRequestPending, loginStep, login, translate, isDashlaneAuthenticatorAvailable, switchToDashlaneAuthenticatorStep, } = this.props;
        const { rememberMeIsChecked, showConfirmTokenResent, showRememberMeCheckbox, } = this.state;
        const loginSteps = [
            LoginStep.OtpToken,
            LoginStep.Otp,
            LoginStep.OtpForNewDevice,
        ];
        const needsTwoFactor = loginSteps.includes(loginStep);
        const hasError = Boolean(error);
        const showResendToken = loginStep === LoginStep.OtpToken;
        return (<fieldset>
        <EmailHeading login={login} onBackToEmailStepClick={this.handleBackToEmailStepClick}/>

        {!needsTwoFactor ? (<div className={formStyles.fieldContainer}>
            <MasterPasswordInput error={error} hasError={hasError} onKeyDown={this.handleKeyDown} onPasswordInputChange={this.props.handlePasswordInputChange}/>
            {REMEMBER_ME_ENABLED &&
                    showRememberMeCheckbox &&
                    !this.showDashlaneUpdateInfoBox(error) && (<div sx={{ marginTop: '16px' }}>
                  <Checkbox label={translate(I18N_REMEMBER_ME_KEYS.LABEL)} defaultChecked={rememberMeIsChecked} onChange={(e) => {
                        this.onRememberMeCheckboxChange(e.target.checked);
                    }}/>
                  {rememberMeIsChecked && (<div className={styles.warningOnlyEnable}>
                      {translate(I18N_REMEMBER_ME_KEYS.WARNING_TEXT)}
                    </div>)}
                </div>)}
          </div>) : (<div>{this.getAdditionalInput()}</div>)}
        {this.showDashlaneUpdateInfoBox(error) ? (<DashlaneUpdateNeeded />) : null}
        {!hasError && this.state.openSessionProgress > 0 ? (<ProgressBar progress={this.state.openSessionProgress}/>) : (<PrimaryButton size="large" fullWidth loading={isCarbonRequestPending} label={translate(I18N_KEYS.CONFIRM_LOG_IN)} onClick={this.handleFormSubmit} data-testid="login-button"/>)}

        {!needsTwoFactor && this.props.isAccountRecoveryAvailable ? (<button type="button" onClick={this.onAccountRecoveryButtonClick} className={formStyles.disclaimerButton}>
            {translate(I18N_KEYS.FORGOT)}
          </button>) : null}

        {!needsTwoFactor && !this.props.isAccountRecoveryAvailable ? (<a href="*****" onClick={this.onForgetPasswordLinkClick} className={formStyles.disclaimerLink} target="_blank" rel="noopener noreferrer">
            {translate(I18N_KEYS.FORGOT)}
          </a>) : null}

        {showResendToken ? (<>
            <FlexContainer alignItems="center" sx={{ marginTop: '36px', marginBottom: '24px' }}>
              <Paragraph sx={{ marginRight: '5px' }}>
                {translate(I18N_KEYS.DIDNT_RECEIVE_CODE)}
              </Paragraph>
              <Button type="button" nature="ghost" onClick={this.handleTokenResent} sx={{ textDecoration: 'underline' }}>
                {translate(I18N_KEYS.RESEND_TOKEN)}
              </Button>
              <TransitionGroup>
                {showConfirmTokenResent ? (<CSSTransition classNames={{ ...tokenResentConfirmationStyles }} timeout={{
                        enter: 400,
                        exit: 0,
                    }} exit={false}>
                    <div className={formStyles.emailTokenConfirmation}>
                      {translate(I18N_KEYS.SECURITY_CODE_RESENT)}
                    </div>
                  </CSSTransition>) : null}
              </TransitionGroup>
            </FlexContainer>
            {isDashlaneAuthenticatorAvailable ? (<FlexContainer alignItems="center" sx={{ margin: '24px 0px' }}>
                <Paragraph sx={{ marginRight: '5px' }}>
                  {translate(I18N_KEYS.CANT_ACCESS_EMAIL)}
                </Paragraph>
                <Link onClick={switchToDashlaneAuthenticatorStep} color={colors.midGreen00}>
                  {translate(I18N_KEYS.USE_DASHLANE_AUTHENTICATOR_APP)}
                </Link>
              </FlexContainer>) : null}
          </>) : null}
      </fieldset>);
    }
}
