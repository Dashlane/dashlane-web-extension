import React from "react";
import * as Counterpart from "counterpart";
import ReactMarkdown from "react-markdown";
import { format as dateFormatter, Locale } from "date-fns";
import { Translation, TranslationService } from "./types";
import transformLangStrings from "./transform-lang-strings";
import { fetchRelativeLocaleStrings } from "./fetchLocaleMeta";
import {
  DATE_TIME_FORMAT,
  DateTimeFormat,
  LOCALE_FORMAT,
  LocaleFormat,
} from "./helpers";
const { i18n } = require("../../../meta/config");
export const locales = i18n.locales;
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
    const translation: string = Counterpart.translate(key, {
      ...params,
      fallback: key,
    });
    return (
      translation ||
      Counterpart.translate(key, {
        ...params,
        locale: i18n.defaultLocale,
      })
    );
  },
  getLocale: () => Counterpart.getLocale(),
  getLocaleMeta: () => localeMeta,
  setLocale: (locale) => {
    return Counterpart.setLocale(locale);
  },
  shortDate: (timeAsDate = new Date(), format = LocaleFormat.L): string => {
    if (typeof format === "object") {
      return timeAsDate.toLocaleString(localeMeta?.code, format);
    }
    if (format in LocaleFormat) {
      return timeAsDate.toLocaleString(
        localeMeta?.code,
        LOCALE_FORMAT[LocaleFormat[format as LocaleFormat]]
      );
    }
    const inferredFormat =
      format in DateTimeFormat
        ? DATE_TIME_FORMAT[DateTimeFormat[format as DateTimeFormat]]
        : format;
    if (typeof format === "string") {
      return dateFormatter(timeAsDate, inferredFormat, {
        locale: localeMeta,
      });
    }
    return "";
  },
  namespace: (prefix) => (key: string, params?: {}) =>
    translationService.translate(`${prefix}/${key}`, params),
  translateMarkup: (key, params) => {
    const rawTranslation = Counterpart.translate(key, {
      ...params,
      fallback: "",
    });
    const translationContainsLineBreaks = rawTranslation.includes("\n");
    return (
      <ReactMarkdown
        source={rawTranslation}
        allowedTypes={[
          "Text",
          "Link",
          "Emph",
          "Strong",
          "Paragraph",
          "Softbreak",
          "List",
          "Item",
        ]}
        containerTagName="span"
        softBreak="br"
        renderers={{
          Paragraph: translationContainsLineBreaks ? "p" : "span",
        }}
      />
    );
  },
};
