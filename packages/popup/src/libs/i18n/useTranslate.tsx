import * as React from 'react';
import { I18nContext } from 'libs/i18n/I18nContext';
import { TranslationService } from 'libs/i18n/types';
const useTranslate = (): TranslationService => {
    return React.useContext(I18nContext);
};
export default useTranslate;
