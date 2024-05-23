import * as React from 'react';
import { format as dateFormatter } from 'date-fns';
import { memoize } from 'ramda';
import { Store } from 'store/create';
import { getPreferredCountry, getPreferredLanguage } from './getPreferred';
import * as localeActions from './reducer';
import { LinkParams, TranslateFunction, TranslatorInterface } from './types';
import loadAndSetLocale, { setLocale } from './setLocale';
import loadLocalizedCountries from './loadLocalizedCountries';
import ReactMarkdown from 'react-markdown';
import LinkComponent from 'libs/dashlane-style/link';
import { fetchRelativeLocaleStrings } from 'libs/i18n/fetchLocaleMeta';
import { DATE_TIME_FORMAT, DateTimeFormat, LOCALE_FORMAT, LocaleFormat, } from 'libs/i18n/helpers';
const config = require('../../../meta/config');
const Counterpart = require('counterpart').Instance;
const enTranslationsFile = require('../../../i18n/en.json');
export const locales = config.i18n.locales;
const isMissing = (res: string): boolean => !res || res.substr(0, 20) === 'missing translation:';
const getEnglishTranslations = memoize(() => {
    const counterpart = new Counterpart();
    setLocale(counterpart, 'en', enTranslationsFile);
    return counterpart;
});
const getEnglishLocaleFor = (key: string, params?: Record<string, any>): string => {
    const counterpart = getEnglishTranslations();
    return counterpart.translate(key, params);
};
const localeMapping = {
    'en-context': 'en',
    'en-pending': 'en',
    'en-pseudo': 'en',
    zh: 'zh-cn',
    pt: 'pt-br',
};
const make = function (): TranslatorInterface {
    const counterpart = new Counterpart();
    const reportedMissingTranslations = {};
    const shouldWarn = process.env.NODE_ENV !== '*****';
    const translate = ((key: string, params?: Record<string, any>) => {
        if (shouldWarn && key.endsWith('_markup')) {
            throw new Error('Use translate.markup for markup keys');
        }
        const res = counterpart.translate(key, params);
        if (shouldWarn && !res && !reportedMissingTranslations[key]) {
            console.warn(`Empty translation for key "${key}" !`);
            reportedMissingTranslations[key] = true;
        }
        if (!isMissing(res)) {
            return res;
        }
        return params ? getEnglishLocaleFor(key, params) : getEnglishLocaleFor(key);
    }) as any as TranslatorInterface;
    translate.localizedCountries = {};
    translate.registerTranslations =
        counterpart.registerTranslations.bind(counterpart);
    translate.getLocale = counterpart.getLocale.bind(counterpart);
    translate.localeMeta = undefined;
    translate.setLocale = async (locale: string): Promise<void> => {
        if (locale === 'en') {
            setLocale(counterpart, locale, enTranslationsFile);
        }
        else {
            await loadAndSetLocale(counterpart)(locale);
        }
        translate.localizedCountries = await loadLocalizedCountries(locale);
        translate.localeMeta = await fetchRelativeLocaleStrings(locale in localeMapping ? localeMapping[locale] : locale);
    };
    translate.namespace = (prefix: string) => {
        const newF = ((key: string, params?: {}) => translate(prefix + key, params)) as TranslateFunction;
        newF.markup = (key: string, params?: {}, linkParams?) => translate.markup(prefix + key, params, linkParams);
        newF.localeMeta = translate.localeMeta;
        return newF;
    };
    translate.shortDate = (timeAsDate: Date = new Date(), format: LocaleFormat | DateTimeFormat | Intl.DateTimeFormatOptions | string = LocaleFormat.L): string => {
        if (typeof format === 'object') {
            return timeAsDate.toLocaleString(translate.localeMeta?.code, format);
        }
        if (format in LocaleFormat) {
            return timeAsDate.toLocaleString(translate.localeMeta?.code, LOCALE_FORMAT[LocaleFormat[format]]);
        }
        const inferredFormat = format in DateTimeFormat
            ? DATE_TIME_FORMAT[DateTimeFormat[format]]
            : format;
        if (typeof format === 'string') {
            return dateFormatter(timeAsDate, inferredFormat, {
                locale: translate.localeMeta,
            });
        }
        return '';
    };
    translate.priceSymbol = (currency: string) => Intl.NumberFormat(undefined, {
        notation: 'standard',
        currency: currency.toUpperCase(),
        style: 'currency',
    })
        .format(0)
        .replace(/\d|\.|,]/g, '')
        .trim();
    translate.price = (currency: string, price: number, options?: Partial<Intl.NumberFormatOptions>) => Intl.NumberFormat(undefined, {
        notation: 'standard',
        currency: currency.toUpperCase(),
        style: 'currency',
        ...(options ?? {}),
    }).format(price);
    const Markup = (key: string, params: Record<string, unknown> = {}, linkParams: LinkParams = {}, linkProps?: Record<string, unknown>) => {
        if (!key.endsWith('_markup')) {
            throw new Error('Markup keys must end with _markup');
        }
        const { linkTarget, onLinkClicked = () => { } } = linkParams;
        let rawTranslation = counterpart.translate(key, params);
        if (rawTranslation === undefined || rawTranslation === null) {
            console.error('rawTranslation is null or undefined');
        }
        rawTranslation = rawTranslation || '';
        const translationContainsLineBreaks = rawTranslation.indexOf('\n') > -1;
        return (<ReactMarkdown source={rawTranslation} allowedTypes={[
                'Text',
                'Link',
                'Emph',
                'Strong',
                'Paragraph',
                'Softbreak',
                'List',
                'Item',
            ]} containerTagName="span" softBreak="br" renderers={{
                Paragraph: translationContainsLineBreaks ? 'p' : 'span',
                Link: function Link(props: {
                    href: string;
                    children: string;
                }) {
                    return (<LinkComponent {...linkProps} aria-label={rawTranslation} href={props.href} target={linkTarget} onClick={() => {
                            onLinkClicked(props.href);
                        }}>
                {props.children}
              </LinkComponent>);
                },
            }}/>);
    };
    translate.markup = Markup;
    return translate as TranslatorInterface;
};
export const translate = make();
export function initializeTranslator(store: Store): Promise<TranslatorInterface> {
    const preferredLocale = getPreferredLanguage(store.getState().locale.language, locales, config.i18n.defaultLocale);
    store.dispatch(localeActions.loadedLanguage({ language: preferredLocale }));
    return translate.setLocale(preferredLocale).then(() => {
        const preferredCountry = getPreferredCountry(store.getState().locale.country, locales, config.i18n.defaultCountry);
        store.dispatch(localeActions.loadedCountry({ country: preferredCountry }));
        return translate;
    });
}
let testSingleton: TranslatorInterface;
export function getTranslateSingletonForTests(): TranslatorInterface {
    if (!testSingleton) {
        testSingleton = make();
        testSingleton.setLocale('en');
    }
    return testSingleton!;
}
