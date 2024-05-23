import React, { createContext, ReactNode, useContext } from 'react';
import { useCompromisedCredentialsAtRisk } from '../hooks/use-compromised-credentials';
import { useCredentialsContext } from './credentials-context';
interface UpdateContext {
    isCredentialCompromised: (id: string) => boolean;
}
const CompromisedCredentialsContext = createContext<UpdateContext>({} as UpdateContext);
interface Provider {
    children: ReactNode;
}
const CompromisedCredentialsProvider = ({ children }: Provider) => {
    const { credentials } = useCredentialsContext();
    const compromisedCredentials = useCompromisedCredentialsAtRisk(credentials.map((credential) => credential.id));
    const isCredentialCompromised = (id: string) => compromisedCredentials.some((item) => item === id);
    return (<CompromisedCredentialsContext.Provider value={{ isCredentialCompromised }}>
      {children}
    </CompromisedCredentialsContext.Provider>);
};
const useCompromisedCredentialsContext = () => useContext(CompromisedCredentialsContext);
export { CompromisedCredentialsProvider, useCompromisedCredentialsContext };
