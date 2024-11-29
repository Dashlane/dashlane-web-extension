import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { useCompromisedCredentialsAtRisk } from "../hooks/use-compromised-credentials";
import { useCredentialsContext } from "./credentials-context";
interface UpdateContext {
  isCredentialCompromised: (id: string) => boolean;
}
const CompromisedCredentialsContext = createContext<UpdateContext>(
  {} as UpdateContext
);
interface Provider {
  children: ReactNode;
}
const CompromisedCredentialsProvider = ({ children }: Provider) => {
  const { credentialIds } = useCredentialsContext();
  const compromisedCredentials = useCompromisedCredentialsAtRisk(credentialIds);
  const compromisedCredentialsSet = useMemo(
    () => new Set(compromisedCredentials),
    [compromisedCredentials]
  );
  const isCredentialCompromised = useCallback(
    (id: string) => compromisedCredentialsSet.has(id),
    [compromisedCredentialsSet]
  );
  return (
    <CompromisedCredentialsContext.Provider value={{ isCredentialCompromised }}>
      {children}
    </CompromisedCredentialsContext.Provider>
  );
};
const useCompromisedCredentialsContext = (): UpdateContext => {
  const context = useContext(CompromisedCredentialsContext);
  if (!context) {
    throw new Error(
      "useCompromisedCredentialsContext must be used within a CompromisedCredentialsProvider"
    );
  }
  return context;
};
export { CompromisedCredentialsProvider, useCompromisedCredentialsContext };
