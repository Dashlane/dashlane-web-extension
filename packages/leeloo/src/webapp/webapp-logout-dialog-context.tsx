import React, { createContext, ReactNode, useContext, useState } from 'react';
import { GlobalDispatcher } from 'libs/carbon';
import { useLogout } from 'libs/hooks/useLogout';
import { LogOutDialog } from 'auth/log-out-dialog/log-out-dialog';
export interface Context {
    openLogoutDialog: () => void;
    closeLogoutDialog: () => void;
    isLogoutDialogOpen: boolean;
}
interface Provider {
    children: ReactNode;
    dispatchGlobal: GlobalDispatcher;
}
const WebappLogoutDialogContext = createContext<Context>({} as Context);
const WebappLogoutDialogProvider = ({ children, dispatchGlobal }: Provider) => {
    const [isLogoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const logout = useLogout(dispatchGlobal);
    const contextValue = {
        openLogoutDialog: () => setLogoutDialogOpen(true),
        closeLogoutDialog: () => setLogoutDialogOpen(false),
        isLogoutDialogOpen,
    };
    const logoutUser = () => {
        contextValue.closeLogoutDialog();
        logout();
    };
    return (<WebappLogoutDialogContext.Provider value={contextValue}>
      {children}

      <LogOutDialog isOpen={isLogoutDialogOpen} onDismiss={contextValue.closeLogoutDialog} onLogout={logoutUser} showCloseIcon/>
    </WebappLogoutDialogContext.Provider>);
};
const useWebappLogoutDialogContext = () => useContext(WebappLogoutDialogContext);
export { WebappLogoutDialogProvider, useWebappLogoutDialogContext };
