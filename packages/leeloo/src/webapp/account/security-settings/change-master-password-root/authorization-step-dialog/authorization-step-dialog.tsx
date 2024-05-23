import React from 'react';
import classnames from 'classnames';
import { Dialog } from '@dashlane/ui-components';
import { carbonConnector } from 'libs/carbon/connector';
import useTranslate from 'libs/i18n/useTranslate';
import { allIgnoreClickOutsideClassName } from 'webapp/variables';
import { TwoFactorAuthenticationBackupCodeDialog, TwoFactorAuthenticationCodeDialog, } from 'webapp/two-factor-authentication/components/two-factor-authentication-dialog';
import { getTwoFactorAuthenticationCodeLogError } from 'webapp/two-factor-authentication/errors/disable';
import { TwoFactorAuthenticationErrorWithMessage } from 'webapp/two-factor-authentication/types';
enum AuthenticationMode {
    SIX_DIGIT_TOKEN = 'SIX_DIGIT_TOKEN',
    BACKUP_CODE = 'BACKUP_CODE'
}
const I18N_KEYS = {
    CLOSE_DIALOG: '_common_dialog_dismiss_button',
    GENERIC_ERROR: '_common_generic_error',
};
interface Props {
    handleOnCancel: () => void;
    handleOnSubmit: () => void;
    login: string;
}
export const AuthorizationStepDialog = ({ handleOnCancel, handleOnSubmit, login, }: Props) => {
    const { translate } = useTranslate();
    const [authenticationMode, setAuthenticationMode] = React.useState<AuthenticationMode>(AuthenticationMode.SIX_DIGIT_TOKEN);
    const [authenticationError, setAuthenticationError] = React.useState<TwoFactorAuthenticationErrorWithMessage | undefined>(undefined);
    const handleVerifyAuthentication = async ({ authenticationCode, }: {
        authenticationCode: string;
    }) => {
        try {
            const result = await carbonConnector.validateToken({
                type: 'otp',
                value: authenticationCode,
            });
            if (result.success) {
                setAuthenticationError(undefined);
                handleOnSubmit();
            }
            else {
                setAuthenticationError({
                    code: result.error.code,
                    message: getTwoFactorAuthenticationCodeLogError(result.error.code)
                        ?.errorMessage || I18N_KEYS.GENERIC_ERROR,
                });
            }
        }
        catch (error) {
            setAuthenticationError({
                code: error?.code,
                message: I18N_KEYS.GENERIC_ERROR,
            });
        }
    };
    const handleToggleAuthenticationMode = (mode: AuthenticationMode) => {
        setAuthenticationMode(mode);
        setAuthenticationError(undefined);
    };
    const dialogProps = {
        handleClickOnBack: handleOnCancel,
        handleClickOnSubmit: handleVerifyAuthentication,
        error: authenticationError,
        login: login,
    };
    const dialogContent = authenticationMode === AuthenticationMode.BACKUP_CODE ? (<TwoFactorAuthenticationBackupCodeDialog {...dialogProps} toggleAuthenticationCodeMode={handleToggleAuthenticationMode.bind(null, AuthenticationMode.SIX_DIGIT_TOKEN)}/>) : (<TwoFactorAuthenticationCodeDialog {...dialogProps} toggleAuthenticationCodeMode={handleToggleAuthenticationMode.bind(null, AuthenticationMode.BACKUP_CODE)}/>);
    return (<Dialog isOpen modalContentClassName={classnames(allIgnoreClickOutsideClassName)} disableOutsideClickClose disableScrolling disableUserInputTrap disableEscapeKeyClose closeIconName={translate(I18N_KEYS.CLOSE_DIALOG)} onClose={handleOnCancel}>
      {dialogContent}
    </Dialog>);
};
