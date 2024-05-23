import { createContext } from 'react';
import { translate } from 'libs/i18n';
export const I18nContext = createContext({ translate });
export const I18nProvider = I18nContext.Provider;
