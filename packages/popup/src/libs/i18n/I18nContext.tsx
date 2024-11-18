import * as React from "react";
import { translationService } from ".";
export const I18nContext = React.createContext(translationService);
export const I18nContextProvider: React.FunctionComponent<unknown> = ({
  children,
}) => {
  return (
    <I18nContext.Provider value={translationService}>
      {children}
    </I18nContext.Provider>
  );
};
