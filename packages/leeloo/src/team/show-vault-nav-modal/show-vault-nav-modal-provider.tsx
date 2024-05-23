import React from 'react';
import { OpenVaultNavigationDialog } from 'team/open-vault-dialog/open-vault-dialog';
interface ShowVaultNavModalContextInterface {
    isVaultNavigationModalOpen: boolean;
    setIsVaultNavigationModalOpen: (isVaultNavigationShow: boolean) => void;
    setOnBeforeNavigateCallback: (callback: () => void) => void;
}
export const ShowVaultNavModalContext = React.createContext<ShowVaultNavModalContextInterface>({
    isVaultNavigationModalOpen: false,
    setIsVaultNavigationModalOpen: () => { },
    setOnBeforeNavigateCallback: () => { },
});
interface ShowVaultNavModalProviderProps extends React.PropsWithChildren<Record<never, never>> {
}
export const ShowVaultNavModalProvider = ({ children, }: ShowVaultNavModalProviderProps) => {
    const [isVaultNavigationModalOpen, setIsVaultNavigationModalOpen] = React.useState<boolean>(false);
    const [onBeforeNavigateCallback, setOnBeforeNavigateCallback] = React.useState<(() => void) | undefined>(undefined);
    return (<ShowVaultNavModalContext.Provider value={{
            isVaultNavigationModalOpen,
            setIsVaultNavigationModalOpen,
            setOnBeforeNavigateCallback,
        }}>
      {children}
      {isVaultNavigationModalOpen ? (<OpenVaultNavigationDialog showVaultNavigationModal={isVaultNavigationModalOpen} setShowVaultNavigationModal={setIsVaultNavigationModalOpen} onBeforeNavigate={onBeforeNavigateCallback}/>) : null}
    </ShowVaultNavModalContext.Provider>);
};
