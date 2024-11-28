import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { jsx } from "@dashlane/design-system";
interface Context {
  isFooterAlertHubOpen: boolean;
  isEmbeddedAlertShown: boolean;
  setIsFooterAlertHubOpen: (value: boolean) => void;
  setIsEmbeddedAlertShown: () => void;
}
interface Provider {
  children: ReactNode;
}
const FooterAlertHubContext = createContext<Context>({} as Context);
const FooterAlertHubProvider = ({ children }: Provider) => {
  const [isFooterAlertHubOpen, setFooterAlertHubOpen] = useState(false);
  const [isEmbeddedAlertShown, setEmbeddedAlertIsShown] = useState(false);
  const contextValue = useMemo(
    () => ({
      isFooterAlertHubOpen,
      isEmbeddedAlertShown,
      setIsFooterAlertHubOpen: setFooterAlertHubOpen,
      setIsEmbeddedAlertShown: () => setEmbeddedAlertIsShown(true),
    }),
    [isFooterAlertHubOpen, isEmbeddedAlertShown]
  );
  return (
    <FooterAlertHubContext.Provider value={contextValue}>
      {children}
    </FooterAlertHubContext.Provider>
  );
};
const useFooterAlertHubContext = () => useContext(FooterAlertHubContext);
export { FooterAlertHubProvider, useFooterAlertHubContext };
