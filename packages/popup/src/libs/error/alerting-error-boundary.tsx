import * as React from "react";
import { Infobox } from "@dashlane/design-system";
import { ErrorBoundary } from "@dashlane/framework-react";
import useTranslate from "../i18n/useTranslate";
export interface AlertingErrorBoundaryProps {
  moduleName: string;
  useCaseName: string;
}
const I18N_KEYS = {
  GENERIC_ERROR: "popup_common_generic_error",
};
export const AlertingErrorBoundary = ({
  moduleName,
  useCaseName,
  children,
}: React.PropsWithChildren<AlertingErrorBoundaryProps>) => {
  const { translate } = useTranslate();
  return (
    <ErrorBoundary
      applicationComponent="popup"
      moduleName={moduleName}
      useCaseName={useCaseName}
      errorView={() => (
        <Infobox
          title={translate(I18N_KEYS.GENERIC_ERROR)}
          mood="danger"
          size="large"
        />
      )}
    >
      {children}
    </ErrorBoundary>
  );
};
