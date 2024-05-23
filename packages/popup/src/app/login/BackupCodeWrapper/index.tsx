import * as React from 'react';
import BackupCodeStep, { BackupCodeStepProps, } from 'app/login/AuthorizationStep/backup-code';
import useTranslate from 'libs/i18n/useTranslate';
import { getLostbackupCodesUrl } from 'src/libs/extension-urls';
const ERROR_I18N_KEYS = {
    EMPTY_OTP: 'login/security_code_error_empty_otp',
    OTP_NOT_VALID: 'login/security_code_error_otp_not_valid',
    OTP_ALREADY_USED: 'login/otp_backup_code_error_already_used',
    OTP_TOO_MANY_ATTEMPTS: 'login/security_code_error_token_too_many_attempts',
    NETWORK_ERROR: 'login/security_code_error_network_error',
    UNKNOWN_ERROR: 'popup_common_generic_error',
};
const I18N_KEYS = {
    CANCEL: 'popup_common_action_cancel',
    CONFIRM: '_common_action_confirm',
    CODES_LOST: 'login/otp_backup_code_lost_text',
    CODES_LOST_LINK: 'login/otp_backup_code_lost_link',
    DESCRIPTION: 'login/otp_backup_code_description',
    TITLE: 'login/otp_backup_code_title',
};
interface Props {
    login: string;
    isLoading: boolean;
    setWaitingForResponseState: () => void;
    handleSubmit: (params: {
        login: string;
        otp: string;
        withBackupCode: boolean;
    }) => void;
    onSwitchAuthMethodClick: () => void;
    resetErrorState: () => void;
    error?: string;
}
const BackupCodeWrapper: React.FunctionComponent<Props> = (props: Props) => {
    const lostBackupCodesUrl = getLostbackupCodesUrl(props.login);
    const { translate } = useTranslate();
    const [codeValue, setCodeValue] = React.useState('');
    const handleBackupCodeSubmit = (backupCode: string) => {
        props.handleSubmit({
            login: props.login,
            otp: backupCode,
            withBackupCode: true,
        });
        props.setWaitingForResponseState();
    };
    const backupCodeStepProps: BackupCodeStepProps = {
        error: props.error &&
            translate(props.error in ERROR_I18N_KEYS
                ? ERROR_I18N_KEYS[props.error as keyof typeof ERROR_I18N_KEYS]
                : ERROR_I18N_KEYS.UNKNOWN_ERROR),
        titleCopy: translate(I18N_KEYS.TITLE),
        descriptionCopy: translate(I18N_KEYS.DESCRIPTION),
        lostCodeCopy: translate(I18N_KEYS.CODES_LOST),
        lostCodeLinkCopy: translate(I18N_KEYS.CODES_LOST_LINK),
        lostCodeLink: lostBackupCodesUrl,
        handleCodeSubmit: handleBackupCodeSubmit,
        resetErrorState: props.resetErrorState,
        formActionsProps: {
            isLoading: props.isLoading,
            primaryButtonText: translate(I18N_KEYS.CONFIRM),
            secondaryButtonText: translate(I18N_KEYS.CANCEL),
            onSecondaryButtonClick: props.onSwitchAuthMethodClick,
        },
        codeValue,
        setCodeValue,
    };
    return <BackupCodeStep {...backupCodeStepProps}/>;
};
export default BackupCodeWrapper;
