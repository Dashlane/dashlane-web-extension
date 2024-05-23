import { Fragment } from 'react';
import useTranslate from 'libs/i18n/useTranslate';
import { colors, jsx, Link, Paragraph, TextInput, } from '@dashlane/ui-components';
import { I18N_KEYS, I18N_OTP_ERROR_KEYS } from './I18N_KEYS';
import { NavLink, useRouterGlobalSettingsContext } from 'libs/router';
interface Props {
    securityCode: string;
    toggleBackupCodeInput: () => void;
    onOTPInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    hasError: boolean;
    error: string;
    login: string;
}
export const LoginBackupCodeInput = ({ securityCode, toggleBackupCodeInput, onOTPInputChange, hasError, error, login, }: Props) => {
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    return (<>
      <Paragraph sx={{ marginBottom: '18px', lineHeight: 1.25 }} color={colors.grey00}>
        {translate(I18N_KEYS.SECURITY_CODE_BACKUP_CODE_DESCRIPTION)}
      </Paragraph>
      <TextInput autoFocus={true} type="text" fullWidth label={translate(I18N_KEYS.SECURITY_CODE_BACKUP_CODE_LABEL)} value={securityCode} feedbackType={hasError ? 'error' : undefined} feedbackText={hasError
            ? translate(I18N_OTP_ERROR_KEYS[error] ?? I18N_OTP_ERROR_KEYS.UNKNOWN_ERROR)
            : ''} onChange={onOTPInputChange}/>

      <Paragraph sx={{ marginTop: '16px' }} color={colors.grey00}>
        {translate(I18N_KEYS.SECURITY_CODE_CANT_ACCESS_BACKUP_CODES)}
        <br />
        <Link color={colors.midGreen00} onClick={toggleBackupCodeInput} target="_self">
          {translate(I18N_KEYS.SECURITY_CODE_LINK)}
        </Link>
      </Paragraph>
      <Paragraph sx={{ margin: '8px 0' }} color={colors.grey00}>
        {translate(I18N_KEYS.SECURITY_CODE_LOST_BACKUP_CODES)}
        <br />
        <NavLink color="ds.text.brand.standard" to={routes.recover2faCodes(login)} target="_blank" rel="noopener noreferrer">
          {translate(I18N_KEYS.SECURITY_CODE_LOST_PHONE_LINK)}
        </NavLink>
      </Paragraph>
    </>);
};
