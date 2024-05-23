import React, { createContext, ReactNode, useContext } from 'react';
import usePopupPersistedState from '../UIState/usePopupPersistedState';
interface Context {
    activeTab: number;
    setActiveTab: (tabIndex: number) => void;
}
interface Provider {
    children: ReactNode;
}
const ActiveTabContext = createContext<Context>({} as Context);
const tabIndexKey = 'tabIndexKey';
const ActiveTabProvider = ({ children }: Provider) => {
    const [activeTab, setActiveTab, isLoading] = usePopupPersistedState<number>(tabIndexKey, 0);
    if (isLoading) {
        return null;
    }
    const contextValue = {
        activeTab,
        setActiveTab: (tabIndex: number) => {
            setActiveTab(tabIndex);
        },
    };
    return (<ActiveTabContext.Provider value={contextValue}>
      {children}
    </ActiveTabContext.Provider>);
};
const useActiveTabContext = () => useContext(ActiveTabContext);
export { ActiveTabProvider, useActiveTabContext };
