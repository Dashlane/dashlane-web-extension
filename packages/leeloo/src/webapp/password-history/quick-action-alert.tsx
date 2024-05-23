import React from 'react';
import { Alert, AlertSeverity, AlertWrapper } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    DISMISS: '_common_alert_dismiss_button',
};
interface Props {
    success: boolean;
    successMessage: string;
    errorMessage: string;
    onClose: () => void;
}
export const QuickActionAlert = ({ success, successMessage, errorMessage, onClose, }: Props) => {
    const { translate } = useTranslate();
    return (<AlertWrapper>
      <Alert severity={success ? AlertSeverity.SUCCESS : AlertSeverity.ERROR} closeIconName={translate(I18N_KEYS.DISMISS)} onClose={onClose}>
        {success ? translate(successMessage) : translate(errorMessage)}
      </Alert>
    </AlertWrapper>);
};
