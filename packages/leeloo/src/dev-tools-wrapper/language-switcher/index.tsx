import { ChangeEvent } from 'react';
import { jsx } from '@dashlane/ui-components';
import { locales } from 'libs/i18n';
import * as localeActions from 'libs/i18n/reducer';
import useTranslate from 'libs/i18n/useTranslate';
import { DispatchGlobal } from 'store/types';
interface LanguageSwitcherProps {
    dispatchGlobal: DispatchGlobal;
}
export const LanguageSwitcher = ({ dispatchGlobal }: LanguageSwitcherProps) => {
    const { translate } = useTranslate();
    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const { value: language } = event.target;
        translate.setLocale(language).then(() => {
            dispatchGlobal(localeActions.userChangedLanguage({ language: language }));
        });
    };
    const options = locales.map(function (locale: string) {
        return (<option key={locale} value={locale}>
        {translate(`language_switcher_language_${locale}`)}
      </option>);
    });
    return (<select sx={{
            display: 'block',
            position: 'fixed',
            right: '10px',
            bottom: '10px',
            width: '150px',
        }} defaultValue={translate.getLocale()} onChange={handleChange}>
      {options}
    </select>);
};
