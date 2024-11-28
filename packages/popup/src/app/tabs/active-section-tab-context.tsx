import React, { createContext, ReactNode, useContext } from "react";
import usePopupPersistedState from "../UIState/use-popup-persisted-state";
interface Context {
  activeTab: number;
  setActiveTab: (tabIndex: number) => void;
}
interface Provider {
  children: ReactNode;
}
const ActiveSectionTabContext = createContext<Context>({} as Context);
const tabIndexKey = "tabIndexKey";
const ActiveSectionTabProvider = ({ children }: Provider) => {
  const [activeTab, setActiveTab, isLoading] = usePopupPersistedState<number>(
    tabIndexKey,
    0
  );
  if (isLoading) {
    return null;
  }
  const contextValue = {
    activeTab,
    setActiveTab: (tabIndex: number) => {
      setActiveTab(tabIndex);
    },
  };
  return (
    <ActiveSectionTabContext.Provider value={contextValue}>
      {children}
    </ActiveSectionTabContext.Provider>
  );
};
const useActiveSectionTabContext = () => useContext(ActiveSectionTabContext);
export { ActiveSectionTabProvider, useActiveSectionTabContext };
