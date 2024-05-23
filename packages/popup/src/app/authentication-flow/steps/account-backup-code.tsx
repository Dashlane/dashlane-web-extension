import { Fragment, FunctionComponent } from 'react';
import { useFormik } from 'formik';
import { AuthenticationFlowContracts } from '@dashlane/authentication-contracts';
import { Button, jsx } from '@dashlane/design-system';
import { Result } from '@dashlane/framework-types';
import { Heading, Link } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import FormInput from 'src/components/inputs/login/FormInput';
import InputWithMessageWrapper, { MessageType, } from 'src/components/inputs/login/InputWithMessageWrapper';
import { ThemeEnum } from 'src/libs/helpers-types';
import { EmailHeader } from '../components';
import { FORM_SX_STYLES } from '../constants';
import { getLostbackupCodesUrl } from 'src/libs/extension-urls';
const I18N_KEYS = {
    TITLE: 'login/otp_backup_code_title',
    DESCRIPTION: 'login/otp_backup_code_description',
    CANCEL: 'popup_common_action_cancel',
    CONFIRM: '_common_action_confirm',
    CODES_LOST: 'login/otp_backup_code_lost_text',
    CODES_LOST_LINK: 'login/otp_backup_code_lost_link',
};
const I18N_ERROR_KEYS = {
    EMPTY_OTP: 'login/security_code_error_empty_otp',
    OTP_NOT_VALID: 'login/security_code_error_otp_not_valid',
    OTP_ALREADY_USED: 'login/otp_backup_code_error_already_used',
    OTP_TOO_MANY_ATTEMPTS: 'login/security_code_error_token_too_many_attempts',
    NETWORK_ERROR: 'login/security_code_error_network_error',
    UNKNOWN_ERROR: 'popup_common_generic_error',
};
interface Props extends Omit<AuthenticationFlowContracts.AuthenticationFlowTwoFactorAuthenticationOtpView, 'step'> {
    submitBackupCode: (params: {
        twoFactorAuthenticationOtpValue: string;
    }) => Promise<Result<undefined>>;
    changeTwoFactorAuthenticationOtpType: (params: {
        twoFactorAuthenticationOtpType: AuthenticationFlowContracts.AuthenticationFlowTwoFactorAuthenticationOtpType;
    }) => Promise<Result<undefined>>;
}
export const AccountBackupCode: FunctionComponent<Props> = ({ loginEmail, isLoading, error, changeTwoFactorAuthenticationOtpType, submitBackupCode, localAccounts, }: Props) => {
    const lostBackupCodesUrl = getLostbackupCodesUrl(loginEmail);
    const { translate } = useTranslate();
    const { setFieldValue, handleSubmit, values: { twoFactorAuthenticationOtpValue }, } = useFormik({
        initialValues: {
            twoFactorAuthenticationOtpValue: '',
        },
        onSubmit: ({ twoFactorAuthenticationOtpValue }) => {
            void submitBackupCode({
                twoFactorAuthenticationOtpValue,
            });
        },
    });
    const onTokenInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { target: { value }, } = e;
        void setFieldValue('twoFactorAuthenticationOtpValue', value);
    };
    return (<>
      <EmailHeader loginEmail={loginEmail ?? ''} showAccountsActionsDropdown showLogoutDropdown={false} localAccounts={localAccounts}/>
      <form sx={FORM_SX_STYLES} onSubmit={handleSubmit} noValidate>
        <Heading size="x-small" color="ds.text.neutral.catchy" sx={{ marginBottom: '24px' }}>
          {translate(I18N_KEYS.TITLE)}
        </Heading>

        <div sx={{
            marginBottom: '8px',
            flexGrow: '1',
            width: '100%',
        }}>
          <p sx={{
            color: 'ds.text.neutral.quiet',
            marginBottom: '24px',
            lineHeight: '20px',
        }}>
            {translate(I18N_KEYS.DESCRIPTION)}
          </p>
          <InputWithMessageWrapper type={MessageType.Error} message={error &&
            translate(error in I18N_ERROR_KEYS
                ? I18N_ERROR_KEYS[error as keyof typeof I18N_ERROR_KEYS]
                : I18N_ERROR_KEYS.UNKNOWN_ERROR)} theme={ThemeEnum.Dark}>
            <FormInput placeholder="" inputType="text" ariaLabelledBy="backupCode" handleChange={onTokenInputChange} value={twoFactorAuthenticationOtpValue} hasError={!!error} theme={ThemeEnum.Light}/>
          </InputWithMessageWrapper>
          <p sx={{ marginTop: '24px', color: 'ds.text.neutral.quiet' }}>
            {`${translate(I18N_KEYS.CODES_LOST)} `}
            <Link href={lostBackupCodesUrl} target="_blank" rel="noopener noreferrer" color="ds.text.neutral.quiet" hoverColor="ds.text.neutral.standard">
              {translate(I18N_KEYS.CODES_LOST_LINK)}
            </Link>
          </p>
        </div>
        <Button type="submit" isLoading={isLoading} aria-label={translate(I18N_KEYS.CONFIRM)} disabled={!twoFactorAuthenticationOtpValue} fullsize size="large" sx={{ marginBottom: '8px' }}>
          {translate(I18N_KEYS.CONFIRM)}
        </Button>
        <Button onClick={() => {
            void changeTwoFactorAuthenticationOtpType({
                twoFactorAuthenticationOtpType: 'totp',
            });
        }} mood="neutral" intensity="quiet" fullsize size="large">
          {translate(I18N_KEYS.CANCEL)}
        </Button>
      </form>
    </>);
};
