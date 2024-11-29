import React, { createContext, ReactNode, useContext } from "react";
import { DataStatus } from "@dashlane/framework-react";
import { useCredentialsContext } from "./credentials-context";
const HasCredentialsContext = createContext<boolean | undefined>(undefined);
interface Provider {
  children: ReactNode;
}
const HasCredentialsProvider = ({ children }: Provider) => {
  const { credentials, credentialStatus } = useCredentialsContext();
  let hasCredentials;
  if (credentials.length > 0) {
    hasCredentials = true;
  } else if (credentialStatus !== DataStatus.Loading) {
    hasCredentials = false;
  }
  return (
    <HasCredentialsContext.Provider value={hasCredentials}>
      {children}
    </HasCredentialsContext.Provider>
  );
};
const useHasCredentialsContext = () => useContext(HasCredentialsContext);
export { HasCredentialsProvider, useHasCredentialsContext };
