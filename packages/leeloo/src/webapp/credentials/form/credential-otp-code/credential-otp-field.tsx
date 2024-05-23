import { jsx } from '@dashlane/design-system';
import { useFeatureFlip } from '@dashlane/framework-react';
import { CredentialSetupOtpField, CredentialSetupOtpFieldProps, } from './credential-setup-otp-field';
import { OtpCodeComponent, OtpCodeComponentProps } from './otp-code.component';
export type CredentialOtpFieldProps = OtpCodeComponentProps & CredentialSetupOtpFieldProps & {
    isEditable: boolean;
};
export const CredentialOtpField = ({ secretOrUrl, url, title, isEditable, onCopy, onSubmit, setHasOpenedDialogs, }: CredentialOtpFieldProps) => {
    const otpSetupEnabled = useFeatureFlip('sharingVault_web_otp_setup_dev');
    if (secretOrUrl) {
        return (<OtpCodeComponent secretOrUrl={secretOrUrl} isEditable={isEditable && !!otpSetupEnabled} onCopy={onCopy}/>);
    }
    if (isEditable && otpSetupEnabled) {
        return (<CredentialSetupOtpField url={url} title={title} onSubmit={onSubmit} setHasOpenedDialogs={setHasOpenedDialogs}/>);
    }
    return null;
};
