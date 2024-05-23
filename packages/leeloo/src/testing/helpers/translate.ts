import { TranslatorInterface } from '../../libs/i18n/types';
export function makeTranslate(): TranslatorInterface {
    const translate: any = (key: string, params: Record<string, any> = {}) => {
        let stringifiedParams = Object.keys(params)
            .map((pKey) => `${pKey}:${params[pKey]}`)
            .join('');
        stringifiedParams = stringifiedParams.length ? ` ${stringifiedParams}` : '';
        return `TRANSLATED ${key}${stringifiedParams}`;
    };
    translate.localizedCountries = {};
    translate.getLocale = () => 'en';
    translate.namespace = () => translate;
    translate.markup = translate;
    translate.price = jest.fn((currency: string, price: number) => `${currency} ${price}`);
    translate.registerTranslations = jest.fn(() => {
    });
    translate.setLocale = (locale: string) => jest.fn(() => Promise.resolve());
    translate.shortDate = jest.fn(() => 'shortDate');
    return translate;
}
