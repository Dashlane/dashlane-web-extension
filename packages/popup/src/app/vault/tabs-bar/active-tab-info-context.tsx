import React, { createContext, ReactNode, useContext } from 'react';
import { logPageView } from 'src/libs/logs/logEvent';
import usePopupPersistedState from 'src/app/UIState/usePopupPersistedState';
import { TabInfo, TabList } from './tabs-data';
interface IContext {
    activeTabInfo: TabInfo;
    setActiveTabInfo: (tabInfo: TabInfo) => void;
}
interface IProvider {
    children: ReactNode;
}
const ActiveTabInfoContext = createContext<IContext>({} as IContext);
const tabInfoKey = 'vault_tabInfoKey';
const ActiveTabInfoProvider = ({ children }: IProvider) => {
    const [activeTabInfo, setActiveTabInfo, isLoading] = usePopupPersistedState(tabInfoKey, TabList[0]);
    if (isLoading) {
        return null;
    }
    const contextValue = {
        activeTabInfo,
        setActiveTabInfo: (tabInfo: TabInfo) => {
            if (tabInfo.pageViewLog) {
                logPageView(tabInfo.pageViewLog);
            }
            setActiveTabInfo(tabInfo);
        },
    };
    return (<ActiveTabInfoContext.Provider value={contextValue}>
      {children}
    </ActiveTabInfoContext.Provider>);
};
const useActiveTabInfoContext = () => useContext(ActiveTabInfoContext);
export { ActiveTabInfoProvider, useActiveTabInfoContext };
