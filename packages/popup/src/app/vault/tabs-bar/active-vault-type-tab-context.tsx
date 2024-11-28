import React, { createContext, ReactNode, useContext } from "react";
import usePopupPersistedState from "../../UIState/use-popup-persisted-state";
interface IContext {
  activeTabName: TabName;
  setActiveTabName: (tabName: TabName) => void;
}
interface IProvider {
  children: ReactNode;
}
export enum TabName {
  Ids = "ids",
  Notes = "notes",
  Passwords = "passwords",
  Payments = "payments",
  PersonalInfo = "personalInfo",
}
const ActiveVaultTypeTabContext = createContext<IContext>({} as IContext);
const tabInfoKey = "vault_tabInfoKey";
const ActiveVaultTypeTabProvider = ({ children }: IProvider) => {
  const [activeTabName, setActiveTabName, isLoading] =
    usePopupPersistedState<TabName>(tabInfoKey, TabName.Passwords);
  if (isLoading) {
    return null;
  }
  const contextValue = {
    activeTabName: activeTabName,
    setActiveTabName: (tabName: TabName) => {
      setActiveTabName(tabName);
    },
  };
  return (
    <ActiveVaultTypeTabContext.Provider value={contextValue}>
      {children}
    </ActiveVaultTypeTabContext.Provider>
  );
};
const useActiveVaultTypeTabContext = () =>
  useContext(ActiveVaultTypeTabContext);
export { ActiveVaultTypeTabProvider, useActiveVaultTypeTabContext };
