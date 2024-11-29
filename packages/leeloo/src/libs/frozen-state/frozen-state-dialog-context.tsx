import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { AdminAccess } from "../../user/permissions";
import { useIsFrozenState } from "./hooks/use-is-frozen-state";
import { FrozenStateDialogFlow } from "./frozen-state-dialog-flow";
export interface FrozenStateDialogInterface {
  openDialog: () => void;
  closeDialog: () => void;
  shouldShowFrozenStateDialog: boolean | null;
}
export const FrozenStateDialogContext =
  createContext<FrozenStateDialogInterface>({
    openDialog: () => {},
    closeDialog: () => {},
    shouldShowFrozenStateDialog: null,
  });
export const useFrozenState = () => useContext(FrozenStateDialogContext);
interface Props {
  adminAccess: AdminAccess;
}
export const FrozenStateDialogProvider = ({
  adminAccess,
  children,
}: PropsWithChildren<Props>) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [shouldShowFrozenStateDialog, setShouldShowFrozenStateDialog] =
    useState<boolean | null>(null);
  const shouldShowFrozenStateDialogValue = useIsFrozenState();
  if (
    shouldShowFrozenStateDialogValue !== null &&
    shouldShowFrozenStateDialogValue !== shouldShowFrozenStateDialog
  ) {
    setShouldShowFrozenStateDialog(shouldShowFrozenStateDialogValue);
  }
  const openDialog = useCallback(() => setDialogOpen(true), []);
  const closeDialog = useCallback(() => setDialogOpen(false), []);
  const contextValue = useMemo(
    () => ({
      openDialog,
      closeDialog,
      shouldShowFrozenStateDialog,
    }),
    [shouldShowFrozenStateDialog, openDialog, closeDialog]
  );
  return (
    <>
      <FrozenStateDialogContext.Provider value={contextValue}>
        {children}
      </FrozenStateDialogContext.Provider>
      <FrozenStateDialogFlow
        hasBillingAccess={adminAccess.hasBillingAccess}
        hasFullAccess={adminAccess.hasFullAccess}
        openOnDemand={dialogOpen}
        closeDialog={contextValue.closeDialog}
      />
    </>
  );
};
