import { ReactNode } from "react";
import type { Locale } from "date-fns";
import { DateTimeFormat, LocaleFormat } from "./helpers";
export interface PluralizedTranslation {
  one?: string;
  zero?: string;
  other: string;
}
export type Translation = string | PluralizedTranslation;
export interface LinkParams {
  linkTarget?: "_blank" | "_top";
  onLinkClicked?: (link: string) => void;
}
export interface TranslationOptions {
  key: string;
  params?: Record<string, unknown>;
  markup?: boolean;
  linkParams?: LinkParams;
}
export interface TranslateFunction {
  (key: string, params?: Record<string, unknown>): string;
  markup: (
    key: string,
    params?: Record<string, unknown>,
    linkParams?: LinkParams,
    linkProps?: Record<string, unknown>
  ) => ReactNode;
  localeMeta?: Locale;
}
export interface TranslatorInterface extends TranslateFunction {
  getLocale: () => string;
  namespace: (prefix: string) => TranslateFunction;
  priceSymbol: (currencty: string) => string;
  price: (
    currency: string,
    price: number,
    options?: Partial<Intl.NumberFormatOptions>
  ) => string;
  registerTranslations: (
    locale: string,
    keys: {
      [k: string]: string;
    }
  ) => void;
  setLocale: (locale: string) => Promise<void>;
  shortDate: (
    date?: Date,
    format?: LocaleFormat | DateTimeFormat | Intl.DateTimeFormatOptions | string
  ) => string;
  localizedCountries: {
    [k: string]: string;
  };
}
export interface State {
  language: string;
  languageOverride?: string;
  country: string;
}
export default State;
