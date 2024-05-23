import { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { DialogBody, DialogFooter, jsx } from '@dashlane/ui-components';
import { AuthenticationCode } from '@dashlane/communication';
import useTranslate from 'libs/i18n/useTranslate';
import { TwoFactorAuthenticationErrorWithMessage } from 'webapp/two-factor-authentication/types';
import { AuthenticationCodeForm } from './authentication-code-form';
import { TOKEN_LENGTH } from './constants';
const I18N_KEYS = {
    AUTHENTICATOR_PRIMARY_BUTTON: 'webapp_account_security_settings_two_factor_authentication_turn_off_authenticator_button',
    AUTHENTICATOR_SECONDARY_BUTTON: 'webapp_account_security_settings_two_factor_authentication_turn_off_authenticator_cancel',
};
const FORM_INITIAL_VALUES = {
    code: '',
};
interface Props {
    handleClickOnSubmit: (params: {
        authenticationCode: string;
    }) => Promise<void>;
    toggleAuthenticationCodeMode: () => void;
    handleClickOnBack: () => void;
    error?: TwoFactorAuthenticationErrorWithMessage;
    hideAdditionalActions?: boolean;
    secondaryButtonTitle?: string;
    logEvent?: () => void;
    login: string;
}
export const TwoFactorAuthenticationCodeDialog = ({ handleClickOnSubmit, toggleAuthenticationCodeMode, handleClickOnBack, error, hideAdditionalActions = false, secondaryButtonTitle, logEvent, login, }: Props) => {
    const { translate } = useTranslate();
    const [localErrorMessage, setLocalErrorMessage] = useState<string>();
    useEffect(() => {
        logEvent?.();
    }, []);
    const formik = useFormik({
        initialValues: FORM_INITIAL_VALUES,
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            const { code } = values;
            await handleClickOnSubmit({
                authenticationCode: code,
            });
            setSubmitting(false);
        },
    });
    const { values: { code }, setFieldValue, isSubmitting, } = formik;
    const [showSyncDevicesHelp, setShowSyncDevicesHelp] = useState(false);
    const prevErrorRef = useRef<AuthenticationCode | string>();
    useEffect(() => {
        if (error && !isSubmitting) {
            setLocalErrorMessage(error.message);
            setShowSyncDevicesHelp(prevErrorRef.current === error.code &&
                error.code === AuthenticationCode.OTP_NOT_VALID);
            prevErrorRef.current = error.code;
        }
        else if (!error) {
            setLocalErrorMessage(undefined);
        }
    }, [error, isSubmitting]);
    const formatAuthenticatorCode = (value: string) => value.replace(/\D/g, '');
    const checkAuthenticatorCodeComplete = (value: string) => {
        if (value.length === TOKEN_LENGTH) {
            formik.submitForm();
        }
    };
    const handleOnFormManualSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!formik.isSubmitting) {
            formik.submitForm();
        }
    };
    const updateAuthenticatorCode = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { target: { value }, } = e;
        setFieldValue('code', formatAuthenticatorCode(value));
        setLocalErrorMessage(undefined);
        checkAuthenticatorCodeComplete(value);
    };
    const disableSubmit = code.length !== TOKEN_LENGTH;
    return (<form onSubmit={handleOnFormManualSubmit}>
      <DialogBody>
        <AuthenticationCodeForm code={code} errorMessage={localErrorMessage} showSyncDevicesHelp={showSyncDevicesHelp} handleAuthenticatorModeClick={hideAdditionalActions ? undefined : toggleAuthenticationCodeMode} updateAuthenticatorCode={updateAuthenticatorCode} hideAdditionalActions={hideAdditionalActions} login={login}/>
      </DialogBody>
      <DialogFooter primaryButtonTitle={translate(I18N_KEYS.AUTHENTICATOR_PRIMARY_BUTTON)} primaryButtonProps={{
            disabled: disableSubmit,
            type: 'button',
        }} primaryButtonOnClick={() => formik.handleSubmit()} secondaryButtonTitle={translate(secondaryButtonTitle
            ? secondaryButtonTitle
            : I18N_KEYS.AUTHENTICATOR_SECONDARY_BUTTON)} secondaryButtonOnClick={handleClickOnBack}/>
    </form>);
};
