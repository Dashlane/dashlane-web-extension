import { createContext, PropsWithChildren, useContext, useEffect, useState, } from 'react';
import { jsx } from '@dashlane/design-system';
import { AdminAccess } from 'user/permissions';
import { useIsTeamDiscontinuedAfterTrial } from 'libs/hooks/use-is-team-discontinued-after-trial';
import { TrialDiscontinuedDialogFlow } from './trial-dialogs/trial-discontinued-dialog-flow';
export interface TrialDiscontinuedDialogInterface {
    openDialog: () => void;
    closeDialog: () => void;
    shouldShowTrialDiscontinuedDialog: boolean | null;
}
export const TrialDiscontinuedDialogContext = createContext<TrialDiscontinuedDialogInterface>({
    openDialog: () => { },
    closeDialog: () => { },
    shouldShowTrialDiscontinuedDialog: null,
});
export const useTrialDiscontinuedDialogContext = () => useContext(TrialDiscontinuedDialogContext);
interface Props {
    adminAccess: AdminAccess;
}
export const TrialDiscontinuedDialogProvider = ({ adminAccess, children, }: PropsWithChildren<Props>) => {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [shouldShowTrialDiscontinuedDialog, setShouldShowTrialDiscontinuedDialog,] = useState<boolean | null>(null);
    const shouldShowTrialDiscontinuedDialogValue = useIsTeamDiscontinuedAfterTrial();
    useEffect(() => {
        if (shouldShowTrialDiscontinuedDialogValue !== null) {
            setShouldShowTrialDiscontinuedDialog(shouldShowTrialDiscontinuedDialogValue);
        }
    }, [
        shouldShowTrialDiscontinuedDialog,
        shouldShowTrialDiscontinuedDialogValue,
    ]);
    const contextValue = {
        openDialog: () => setDialogOpen(true),
        closeDialog: () => setDialogOpen(false),
        shouldShowTrialDiscontinuedDialog,
    };
    return (<TrialDiscontinuedDialogContext.Provider value={contextValue}>
      {children}
      <TrialDiscontinuedDialogFlow adminAccess={adminAccess} openOnDemand={dialogOpen}/>
    </TrialDiscontinuedDialogContext.Provider>);
};
