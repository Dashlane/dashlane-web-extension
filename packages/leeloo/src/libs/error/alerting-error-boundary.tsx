import * as React from 'react';
import { Alert, AlertSeverity, AlertSize } from '@dashlane/ui-components';
import { ErrorBoundary } from '@dashlane/framework-react';
import { Lee } from 'lee';
import useTranslate from 'libs/i18n/useTranslate';
export interface AlertingErrorBoundaryProps {
    lee?: Lee;
    moduleName: string;
    useCaseName: string;
}
const I18N_KEYS = {
    GENERIC_ERROR: '_common_generic_error',
};
interface ErrorBoundaryAlertProps {
    onCloseError: () => void;
}
const ErrorBoundaryAlert = ({ onCloseError }: ErrorBoundaryAlertProps) => {
    const { translate } = useTranslate();
    return (<Alert severity={AlertSeverity.ERROR} size={AlertSize.MEDIUM} onClose={onCloseError} showIcon onAction={onCloseError} actionText={translate('_common_dialog_dismiss_button')}>
      {translate(I18N_KEYS.GENERIC_ERROR)}
    </Alert>);
};
export const AlertingErrorBoundary = ({ moduleName, useCaseName, lee, children, }: React.PropsWithChildren<AlertingErrorBoundaryProps>) => {
    return (<ErrorBoundary moduleName={moduleName} useCaseName={useCaseName} onError={lee?.reportError} errorView={(onClose) => <ErrorBoundaryAlert onCloseError={onClose}/>}>
      {children}
    </ErrorBoundary>);
};
