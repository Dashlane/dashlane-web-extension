import { ChangeEvent, Component, FormEvent, KeyboardEvent, MouseEvent, } from 'react';
import { jsx, SelectDropdownMenu, StylesConfig } from '@dashlane/ui-components';
import { colors } from '@dashlane/design-system';
import { AuthenticationCode, LocalAccountInfo } from '@dashlane/communication';
import { DashlaneUpdateNeeded } from 'auth/login-panel/login-form/login-errors/dashlane-update-needed';
import PrimaryButton from 'libs/dashlane-style/buttons/modern/primary';
import { TranslatorInterface } from 'libs/i18n/types';
import pageStyles from '../styles.css';
import classnames from 'classnames';
const dsColors = colors.lightTheme.ds;
const ERROR_I18N_KEYS = {
    INVALID_LOGIN: 'webapp_login_form_email_fieldset_error_invalid_login',
    EMPTY_LOGIN: 'webapp_login_form_email_fieldset_error_empty_login',
    NETWORK_ERROR: 'webapp_login_form_email_fieldset_network_error_offline',
    USER_DOESNT_EXIST: 'webapp_login_form_email_fieldset_error_user_doesnt_exist',
    USER_DOESNT_EXIST_UNLIKELY_MX: 'webapp_login_form_email_fieldset_error_user_doesnt_exist_unlikely_mx',
    USER_DOESNT_EXIST_INVALID_MX: 'webapp_login_form_email_fieldset_error_user_doesnt_exist_invalid_mx',
    THROTTLED: 'webapp_login_form_email_fieldset_error_throttled',
    UNKNOWN_ERROR: 'webapp_login_form_email_fieldset_error_unknown',
    SSO_BLOCKED: 'webapp_login_form_email_fieldset_error_sso_blocked',
    TEAM_GENERIC_ERROR: 'webapp_login_form_email_fieldset_error_team_generic_error'
};
const I18N_KEYS = {
    DESCRIPTION: 'webapp_login_form_email_fieldset_email_description',
    PLACEHOLDER: 'webapp_login_form_email_fieldset_email_placeholder',
    EMAIL_CONFIRM: 'webapp_login_form_email_fieldset_email_confirm',
    OTHER_ACCOUNT: 'webapp_login_form_email_fieldset_select_option_other_account',
};
type LoginSelectOption = {
    label: string;
    value: string;
};
const OTHER_ACCOUNT_VALUE = 'other_account';
const showDashlaneUpdateInfoBox = (error: string | undefined) => error ===
    AuthenticationCode[AuthenticationCode.CLIENT_VERSION_DOES_NOT_SUPPORT_SSO_MIGRATION];
interface Props {
    error: string;
    handleOtherAccountSelect: () => void;
    handleLoginChange: (value: string) => void;
    isCarbonRequestPending: boolean;
    isLoginUsingAnotherLocalAccount: boolean;
    localAccounts: LocalAccountInfo[];
    login: string | null;
    onLoginSubmit: (e: FormEvent) => void;
    translate: TranslatorInterface;
}
export class AccountSelectionFieldset extends Component<Props> {
    private handleSelectChange = (option: {
        label: string;
        value: string;
    }) => {
        const value = option.value;
        if (value === OTHER_ACCOUNT_VALUE) {
            this.props.handleOtherAccountSelect();
            return;
        }
        this.props.handleLoginChange(value);
    };
    private loginInputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        this.props.handleLoginChange(e.target.value);
    };
    private handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.props.onLoginSubmit(e);
        }
    };
    private getLoginSelect = (localAccounts: LocalAccountInfo[]) => {
        const { login, translate } = this.props;
        const options: LoginSelectOption[] = localAccounts.map(({ login: localAccountLogin }) => ({
            label: localAccountLogin,
            value: localAccountLogin,
        }));
        options.push({
            label: translate(I18N_KEYS.OTHER_ACCOUNT),
            value: OTHER_ACCOUNT_VALUE,
        });
        const lastSuccessfulLoginAccount = localAccounts.find((localAccount) => localAccount.isLastSuccessfulLogin);
        if (!lastSuccessfulLoginAccount) {
            return null;
        }
        const lastSuccessfulLogin = lastSuccessfulLoginAccount.login;
        const defaultLoginOption = {
            label: login || lastSuccessfulLogin,
            value: login || lastSuccessfulLogin,
        };
        const customStyles: StylesConfig<LoginSelectOption> = {
            option: (styles, { data: { value } }) => {
                return value === OTHER_ACCOUNT_VALUE
                    ? {
                        ...styles,
                        color: dsColors.text.neutral.quiet,
                    }
                    : styles;
            },
        };
        return (<SelectDropdownMenu id="login-select" isClearable={false} isSearchable={false} options={options} onChange={this.handleSelectChange} value={defaultLoginOption} customStyles={customStyles}/>);
    };
    private shouldDisplayLoginDropdown = () => !this.props.isLoginUsingAnotherLocalAccount &&
        Boolean(this.props.localAccounts.length);
    private onSubmit = (e: MouseEvent<HTMLElement>) => {
        this.props.onLoginSubmit(e);
    };
    public render() {
        const { error, login, localAccounts, translate } = this.props;
        const loginSelect = this.getLoginSelect(localAccounts);
        const loginInput = (<input autoFocus={true} className={classnames({
                [pageStyles.loginInput]: true,
                [pageStyles.inputError]: ERROR_I18N_KEYS[error] || showDashlaneUpdateInfoBox(error),
            })} onChange={this.loginInputChangeHandler} onKeyDown={this.handleKeyDown} type="email" placeholder={translate(I18N_KEYS.PLACEHOLDER)} defaultValue={login || ''}/>);
        return (<fieldset>
        <label className={pageStyles.label}>
          {translate(I18N_KEYS.DESCRIPTION)}
          <div className={pageStyles.fieldContainer} data-testid={'login_container'}>
            {this.shouldDisplayLoginDropdown() ? loginSelect : loginInput}
            {ERROR_I18N_KEYS[error] ? (<div className={pageStyles.errorText} id="login-account-email-input-error">
                {translate(ERROR_I18N_KEYS[error])}
              </div>) : null}
          </div>
        </label>
        {showDashlaneUpdateInfoBox(this.props.error) ? (<DashlaneUpdateNeeded />) : null}
        <PrimaryButton size="large" fullWidth data-testid="login-button" loading={this.props.isCarbonRequestPending} label={translate(I18N_KEYS.EMAIL_CONFIRM)} onClick={this.onSubmit}/>
      </fieldset>);
    }
}
