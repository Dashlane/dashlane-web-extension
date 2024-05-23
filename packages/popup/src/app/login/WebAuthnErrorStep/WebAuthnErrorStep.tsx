import * as React from 'react';
import { colors, Paragraph } from '@dashlane/ui-components';
import FormWrapper from 'app/login/FormWrapper';
import useTranslate from 'libs/i18n/useTranslate';
export interface WebAuthnErrorStepProps {
    onUseMasterPassword: () => void;
    onRetryWebAuthn: () => void;
}
const I18N_KEYS = {
    TITLE: 'login/webauthn_error_title',
    DESCRIPTION: 'login/webauthn_error_description',
    BUTTON_RETRY: 'login/webauthn_error_button_retry',
    BUTTON_USE_MP: 'login/webauthn_error_button_use_master_password',
};
export const WebAuthnErrorStep = ({ onUseMasterPassword, onRetryWebAuthn, }: WebAuthnErrorStepProps) => {
    const { translate } = useTranslate();
    const handleFormSubmit = () => {
        onUseMasterPassword();
    };
    return (<FormWrapper title={{
            text: translate(I18N_KEYS.TITLE),
            labelId: 'webauthn_error_label',
        }} handleSubmit={handleFormSubmit} formActionsProps={{
            isLoading: false,
            primaryButtonText: translate(I18N_KEYS.BUTTON_USE_MP),
            secondaryButtonText: translate(I18N_KEYS.BUTTON_RETRY),
            onSecondaryButtonClick: onRetryWebAuthn,
        }}>
      <Paragraph color={colors.dashGreen05}>
        {translate(I18N_KEYS.DESCRIPTION)}
      </Paragraph>
    </FormWrapper>);
};
