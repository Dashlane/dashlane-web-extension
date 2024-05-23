import React from 'react';
import { useDialogInContext } from '../hooks/use-dialog-in-context';
import { Dialog } from '../components/dialog';
export interface DialogContextValue {
    isDialogVisible: boolean;
    dialogContent: React.ReactNode;
    openDialog: (component: React.ReactNode) => void;
    closeDialog: () => void;
}
const DialogContext = React.createContext<DialogContextValue>({
    isDialogVisible: false,
    dialogContent: null,
    openDialog: () => { },
    closeDialog: () => { },
});
const DialogContextProvider = ({ children, dialogId, }: {
    children: React.ReactNode;
    dialogId?: string;
}) => {
    const { isDialogVisible, dialogContent, openDialog, closeDialog } = useDialogInContext();
    return (<DialogContext.Provider value={{ isDialogVisible, dialogContent, openDialog, closeDialog }}>
      <Dialog dialogId={dialogId}/>
      {children}
    </DialogContext.Provider>);
};
export { DialogContext, DialogContextProvider };
