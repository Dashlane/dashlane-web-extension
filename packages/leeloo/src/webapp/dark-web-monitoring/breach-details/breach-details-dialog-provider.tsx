import * as React from "react";
import { BreachDetailsDialog } from "./breach-details-dialog";
interface OpenBreachDetailsDialogParams {
  breach: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}
export interface BreachDetailsDialogInterface {
  openBreachDetailsDialog: (params: OpenBreachDetailsDialogParams) => void;
}
export const BreachDetailsDialogContext =
  React.createContext<BreachDetailsDialogInterface>({
    openBreachDetailsDialog: () => {},
  });
export const BreachDetailsDialogProvider: React.FunctionComponent = ({
  children,
}) => {
  const [activeBreach, setActiveBreach] = React.useState<string | null>(null);
  const onDismiss = React.useCallback(() => {
    setActiveBreach(null);
  }, []);
  const openBreachDetailsDialog = ({
    breach,
  }: OpenBreachDetailsDialogParams) => {
    setActiveBreach(breach);
  };
  return (
    <BreachDetailsDialogContext.Provider
      value={{
        openBreachDetailsDialog,
      }}
    >
      {children}
      {activeBreach && (
        <BreachDetailsDialog
          breachId={activeBreach}
          onDismissClick={onDismiss}
        />
      )}
    </BreachDetailsDialogContext.Provider>
  );
};
