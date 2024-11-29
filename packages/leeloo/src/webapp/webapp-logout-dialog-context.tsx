import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { GlobalDispatcher } from "../libs/carbon";
import { useLogout } from "../libs/hooks/useLogout";
import { LogOutDialog } from "../auth/log-out-dialog/log-out-dialog";
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
  const openLogoutDialog = useCallback(() => setLogoutDialogOpen(true), []);
  const closeLogoutDialog = useCallback(() => setLogoutDialogOpen(false), []);
  const contextValue = useMemo(
    () => ({
      openLogoutDialog,
      closeLogoutDialog,
      isLogoutDialogOpen,
    }),
    [isLogoutDialogOpen, openLogoutDialog, closeLogoutDialog]
  );
  const logoutUser = useCallback(() => {
    closeLogoutDialog();
    logout();
  }, [closeLogoutDialog, logout]);
  return (
    <WebappLogoutDialogContext.Provider value={contextValue}>
      {children}

      <LogOutDialog
        isOpen={isLogoutDialogOpen}
        onDismiss={closeLogoutDialog}
        onLogout={logoutUser}
      />
    </WebappLogoutDialogContext.Provider>
  );
};
const useWebappLogoutDialogContext = () =>
  useContext(WebappLogoutDialogContext);
export { WebappLogoutDialogProvider, useWebappLogoutDialogContext };
