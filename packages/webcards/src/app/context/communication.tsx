import * as React from "react";
import {
  AutofillEngineActions,
  AutofillEngineCommands,
} from "@dashlane/autofill-engine/client";
import { AutofillEngineDispatcher } from "@dashlane/autofill-engine/dispatcher";
interface State {
  autofillEngineCommands?: AutofillEngineCommands;
  autofillEngineDispatcher?: AutofillEngineDispatcher;
  setAutofillEngineActionsHandlers?: (
    handlers: Partial<AutofillEngineActions>
  ) => void;
}
const CommunicationContext = React.createContext<State>({});
export const CommunicationContextProvider = ({
  autofillEngineCommands,
  autofillEngineDispatcher,
  children,
  setAutofillEngineActionsHandlers,
}: {
  children: React.ReactNode;
} & State) => {
  const state: State = {
    autofillEngineCommands,
    autofillEngineDispatcher,
    setAutofillEngineActionsHandlers,
  };
  return (
    <CommunicationContext.Provider value={state}>
      {children}
    </CommunicationContext.Provider>
  );
};
export const useCommunication = () => React.useContext(CommunicationContext);
