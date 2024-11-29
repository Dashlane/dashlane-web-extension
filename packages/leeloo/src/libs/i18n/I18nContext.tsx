import { createContext } from "react";
import { translate } from ".";
export const I18nContext = createContext({ translate });
export const I18nProvider = I18nContext.Provider;
