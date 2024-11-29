import * as React from "react";
import { Alert, AlertSeverity, AlertSize } from "@dashlane/ui-components";
import { ErrorBoundary } from "@dashlane/framework-react";
import useTranslate from "../i18n/useTranslate";
export interface AlertingErrorBoundaryProps {
  moduleName: string;
  useCaseName: string;
}
const I18N_KEYS = {
  GENERIC_ERROR: "_common_generic_error",
};
interface ErrorBoundaryAlertProps {
  onCloseError: () => void;
}
const ErrorBoundaryAlert = ({ onCloseError }: ErrorBoundaryAlertProps) => {
  const { translate } = useTranslate();
  return (
    <Alert
      severity={AlertSeverity.ERROR}
      size={AlertSize.MEDIUM}
      onClose={onCloseError}
      showIcon
      onAction={onCloseError}
      actionText={translate("_common_dialog_dismiss_button")}
    >
      {translate(I18N_KEYS.GENERIC_ERROR)}
    </Alert>
  );
};
export const AlertingErrorBoundary = ({
  moduleName,
  useCaseName,
  children,
}: React.PropsWithChildren<AlertingErrorBoundaryProps>) => {
  return (
    <ErrorBoundary
      applicationComponent="leeloo"
      moduleName={moduleName}
      useCaseName={useCaseName}
      errorView={(onClose) => <ErrorBoundaryAlert onCloseError={onClose} />}
    >
      {children}
    </ErrorBoundary>
  );
};
