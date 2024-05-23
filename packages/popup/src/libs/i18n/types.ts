import { ReactNode } from 'react';
import { Locale as LocaleMeta } from 'date-fns';
import { DateTimeFormat, LocaleFormat } from './helpers';
export interface PluralizedTranslation {
    one?: string;
    zero?: string;
    other: string;
}
export type Translation = string | PluralizedTranslation;
export interface TranslateFunction {
    (key: string, params?: Record<string, any>): string;
}
export type GetLocale = () => string;
export type SetLocale = (locale: string) => string;
export interface TranslationService {
    translate: TranslateFunction;
    translateMarkup: (key: string, params?: Record<string, unknown>) => ReactNode;
    getLocale: GetLocale;
    getLocaleMeta: () => LocaleMeta | undefined;
    namespace: (prefix: string) => TranslateFunction;
    setLocale: SetLocale;
    shortDate: (timeAsDate: Date, format: LocaleFormat | DateTimeFormat | Intl.DateTimeFormatOptions | string) => string;
}
export interface InjectedTranslateProps {
    translate: TranslateFunction;
}
