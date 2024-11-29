import { createContext, ReactNode, useContext, useState } from "react";
interface Context {
  activeAction: ActionType | null;
  toggleActiveAction: (actionType: ActionType) => void;
}
interface Provider {
  children: ReactNode;
}
enum ActionType {
  AddTo = "addTo",
  RemoveFrom = "removeFrom",
}
const ActiveActionContext = createContext<Context>({} as Context);
const ActiveActionProvider = ({ children }: Provider) => {
  const [activeAction, setActiveAction] = useState<ActionType | null>(null);
  const toggleActiveAction = (actionType: ActionType) =>
    setActiveAction((prevState) =>
      prevState === actionType ? null : actionType
    );
  return (
    <ActiveActionContext.Provider value={{ activeAction, toggleActiveAction }}>
      {children}
    </ActiveActionContext.Provider>
  );
};
const useActiveActionContext = () => useContext(ActiveActionContext);
export { ActiveActionProvider, useActiveActionContext, ActionType };
