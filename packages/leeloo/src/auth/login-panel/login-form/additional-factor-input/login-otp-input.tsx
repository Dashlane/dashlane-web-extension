import React, { useEffect, useRef, useState } from 'react';
import useTranslate from 'libs/i18n/useTranslate';
import { colors, Link, Paragraph, TokenInput } from '@dashlane/ui-components';
import { I18N_KEYS, I18N_OTP_ERROR_KEYS } from './I18N_KEYS';
import { SyncDevicesTimeInfoBox } from 'webapp/two-factor-authentication/components/sync-devices-time-infobox';
import { AuthenticationCode } from '@dashlane/communication';
import { NavLink, useRouterGlobalSettingsContext } from 'libs/router';
interface Props {
    securityCode: string;
    maxLength: number;
    toggleBackupCodeInput: () => void;
    onOTPInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    hasError: boolean;
    error: string;
    login: string;
}
export const LoginOTPInput = ({ securityCode, maxLength, toggleBackupCodeInput, onOTPInputChange, onKeyDown, hasError, error, login, }: Props) => {
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const [showSyncDevicesHelp, setShowSyncDevicesHelp] = useState(false);
    const prevErrorRef = useRef<string>();
    useEffect(() => {
        if (error) {
            setShowSyncDevicesHelp(prevErrorRef.current === error &&
                error === AuthenticationCode[AuthenticationCode.OTP_NOT_VALID]);
            prevErrorRef.current = error;
        }
    }, [error]);
    return (<>
      <Paragraph sx={{ marginBottom: '12px' }} color={colors.grey00}>
        {translate(I18N_KEYS.SECURITY_CODE_OTP_DESCRIPTION)}
      </Paragraph>
      <TokenInput autoFocus value={securityCode} maxLength={maxLength} inputMode="numeric" data-testid="token-input" onChange={onOTPInputChange} onKeyDown={onKeyDown} feedbackType={hasError ? 'error' : undefined} feedbackText={hasError
            ? translate(I18N_OTP_ERROR_KEYS[error] ?? I18N_OTP_ERROR_KEYS.UNKNOWN_ERROR)
            : ''}/>
      {showSyncDevicesHelp ? <SyncDevicesTimeInfoBox /> : null}
      <Paragraph sx={{ marginTop: '16px', lineHeight: 1.25 }} color={colors.grey00}>
        {translate(I18N_KEYS.SECURITY_CODE_BACKUP_CODE_ACCESS)} <br />
        <Link color={colors.midGreen00} onClick={toggleBackupCodeInput} target="_self">
          {translate(I18N_KEYS.SECURITY_CODE_BACKUP_CODE_LINK)}
        </Link>
      </Paragraph>
      <Paragraph sx={{ margin: '8px 0', lineHeight: 1.25 }} color={colors.grey00}>
        {translate(I18N_KEYS.SECURITY_CODE_LOST_PHONE)}
        <br />
        <NavLink color="ds.text.brand.standard" to={routes.recover2faCodes(login)} target="_blank" rel="noopener noreferrer">
          {translate(I18N_KEYS.SECURITY_CODE_LOST_PHONE_LINK)}
        </NavLink>
      </Paragraph>
    </>);
};
