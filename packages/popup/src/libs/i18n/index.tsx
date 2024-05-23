import * as React from 'react';
import * as Counterpart from 'counterpart';
import ReactMarkdown from 'react-markdown';
import { format as dateFormatter, Locale } from 'date-fns';
import { Translation, TranslationService } from 'libs/i18n/types';
import transformLangStrings from 'libs/i18n/transform-lang-strings';
import { fetchRelativeLocaleStrings } from 'libs/i18n/fetchLocaleMeta';
import { i18n } from 'meta/config';
import { DATE_TIME_FORMAT, DateTimeFormat, LOCALE_FORMAT, LocaleFormat } from './helpers';
export const locales = i18n.locales;
const counterpartTranslate = Counterpart;
let localeMeta: Locale | undefined = undefined;
export async function loadLocale(locale: string): Promise<void> {
    const localeFile: {
        [k: string]: Translation;
    } = await import(`../../../i18n/${locale}.json`);
    Counterpart.registerTranslations(locale, transformLangStrings(localeFile));
    localeMeta = await fetchRelativeLocaleStrings(locale);
}
export const translationService: TranslationService = {
    translate: (key, params) => {
        const translation: string = counterpartTranslate(key, {
            ...params,
            fallback: key,
        });
        return (translation ||
            counterpartTranslate(key, {
                ...params,
                locale: i18n.defaultLocale,
            }));
    },
    getLocale: () => counterpartTranslate.getLocale(),
    getLocaleMeta: () => localeMeta,
    setLocale: (locale) => {
        return counterpartTranslate.setLocale(locale);
    },
    shortDate: (timeAsDate = new Date(), format = LocaleFormat.L): string => {
        if (typeof format === 'object') {
            return timeAsDate.toLocaleString(localeMeta?.code, format);
        }
        if (format in LocaleFormat) {
            return timeAsDate.toLocaleString(localeMeta?.code, LOCALE_FORMAT[LocaleFormat[format]]);
        }
        const inferredFormat = format in DateTimeFormat
            ? DATE_TIME_FORMAT[DateTimeFormat[format]]
            : format;
        if (typeof format === 'string') {
            return dateFormatter(timeAsDate, inferredFormat, {
                locale: localeMeta,
            });
        }
        return '';
    },
    namespace: (prefix) => (key: string, params?: {}) => translationService.translate(`${prefix}/${key}`, params),
    translateMarkup: (key, params) => {
        const rawTranslation = counterpartTranslate(key, {
            ...params,
            fallback: '',
        });
        const translationContainsLineBreaks = rawTranslation.includes('\n');
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
            }}/>);
    },
};
