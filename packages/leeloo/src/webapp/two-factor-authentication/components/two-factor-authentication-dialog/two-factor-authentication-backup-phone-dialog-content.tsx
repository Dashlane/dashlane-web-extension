import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { DialogBody, DialogFooter } from '@dashlane/ui-components';
import { TwoFactorAuthenticationError } from '@dashlane/hermes';
import { AuthenticationCode, CountryCode, RequestTOTPActivationError, } from '@dashlane/communication';
import useTranslate from 'libs/i18n/useTranslate';
import { BackupPhoneNumberForm } from './backup-phone-number-form';
import { logTwoFactorAuthenticationEnableBackupPhoneNumberPageView, logTwoFactorAuthenticationEnableErrorEvent, } from 'webapp/two-factor-authentication/logs/enable-flow-logs';
interface Props {
    handleClickOnSubmit: (params: {
        countryCode: string;
        phoneNumber: string;
    }) => Promise<void>;
    handleClickOnBack: () => void;
    error?: {
        code: string;
    };
    countryCode: string;
    savedValues?: {
        savedCountryCode?: CountryCode;
        savedPhoneNumber?: string;
    };
}
const I18N_KEYS = {
    PRIMARY_BUTTON: '_common_action_continue',
    SECONDARY_BUTTON: '_common_action_back',
};
const BACKUP_PHONE_ERROR_MAPPER = {
    GENERIC_ERROR: {
        message: 'webapp_account_security_settings_two_factor_authentication_turn_on_generic_error',
        log: TwoFactorAuthenticationError.UnknownError,
    },
    [RequestTOTPActivationError.PHONE_VALIDATION_FAILED]: {
        message: 'webapp_account_security_settings_two_factor_authentication_turn_on_backup_phone_invalid_format',
        log: TwoFactorAuthenticationError.WrongPhoneFormatError,
    },
    [AuthenticationCode.NETWORK_ERROR]: {
        message: '_common_alert_network_error_message',
        log: TwoFactorAuthenticationError.UnknownError,
    },
};
export const TwoFactorAuthenticationBackupPhoneDialog = ({ handleClickOnSubmit, handleClickOnBack, error, countryCode: initialCountryCode, savedValues, }: Props) => {
    const { translate } = useTranslate();
    const [localErrorMessage, setLocalErrorMessage] = useState<string>();
    useEffect(() => {
        logTwoFactorAuthenticationEnableBackupPhoneNumberPageView();
    }, []);
    const formik = useFormik({
        initialValues: {
            countryCode: savedValues?.savedCountryCode
                ? savedValues.savedCountryCode
                : initialCountryCode,
            phoneNumber: savedValues?.savedPhoneNumber
                ? savedValues.savedPhoneNumber
                : '',
        },
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            const { countryCode, phoneNumber } = values;
            await handleClickOnSubmit({
                countryCode: countryCode,
                phoneNumber: phoneNumber,
            });
            setSubmitting(false);
        },
    });
    const { values: { countryCode, phoneNumber }, setFieldValue, isSubmitting, } = formik;
    useEffect(() => {
        if (error && !isSubmitting) {
            const { code: errorCode } = error;
            const mappedError = BACKUP_PHONE_ERROR_MAPPER[errorCode] ??
                BACKUP_PHONE_ERROR_MAPPER.GENERIC_ERROR;
            setLocalErrorMessage(mappedError.message);
            logTwoFactorAuthenticationEnableErrorEvent(mappedError.log);
        }
    }, [error, isSubmitting]);
    const disableSubmit = phoneNumber.length === 0;
    return (<form onSubmit={formik.handleSubmit}>
      <DialogBody>
        <BackupPhoneNumberForm countryCode={countryCode} phoneNumber={phoneNumber} errorMessage={localErrorMessage ? translate(localErrorMessage) : undefined} setFieldValue={setFieldValue} setErrorMessage={setLocalErrorMessage}/>
      </DialogBody>
      <DialogFooter primaryButtonTitle={translate(I18N_KEYS.PRIMARY_BUTTON)} primaryButtonProps={{
            disabled: disableSubmit,
            type: 'button',
        }} primaryButtonOnClick={() => formik.handleSubmit()} secondaryButtonTitle={translate(I18N_KEYS.SECONDARY_BUTTON)} secondaryButtonOnClick={handleClickOnBack} secondaryButtonProps={{
            id: 'two-factor-authentication-backup-phone-dialog-back-button',
        }}/>
    </form>);
};
