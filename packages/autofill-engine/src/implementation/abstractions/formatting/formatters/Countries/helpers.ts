import {
  CountriesForAutofill,
  CountryForAutofill,
} from "@dashlane/autofill-contracts";
import { COUNTRIES_ABBREVIATION_IN_GERMAN as de } from "./CountriesAbbreviations/de";
import { COUNTRIES_ABBREVIATION_IN_ENGLISH as en } from "./CountriesAbbreviations/en";
import { COUNTRIES_ABBREVIATION_IN_SPANISH as es } from "./CountriesAbbreviations/es";
import { COUNTRIES_ABBREVIATION_IN_FRENCH as fr } from "./CountriesAbbreviations/fr";
import { COUNTRIES_ABBREVIATION_IN_ITALIAN as it } from "./CountriesAbbreviations/it";
import { COUNTRIES_ABBREVIATION_IN_JAPANESE as ja } from "./CountriesAbbreviations/ja";
import { COUNTRIES_ABBREVIATION_IN_KOREAN as ko } from "./CountriesAbbreviations/ko";
import { COUNTRIES_ABBREVIATION_IN_PORTUGUESE as pt } from "./CountriesAbbreviations/pt";
import { COUNTRIES_ABBREVIATION_IN_CHINESE as zh } from "./CountriesAbbreviations/zh";
export const TRANSLATION_MAP_FOR_COUNTRIES_ABBREVIATION_IN_DIFFERENT_LANGUAGES: Record<
  string,
  Record<string, string>
> = {
  de,
  en,
  es,
  fr,
  it,
  ja,
  ko,
  pt,
  zh,
};
export const getDisplayUECountryName = (country: CountryForAutofill) => {
  switch (country) {
    case CountriesForAutofill.GB:
      return "UK";
    case CountriesForAutofill.IE:
      return "IRL";
    case CountriesForAutofill.LU:
      return "L";
    case CountriesForAutofill.BE:
      return "B";
    case CountriesForAutofill.DE:
      return "D";
    case CountriesForAutofill.ES:
      return "E";
    case CountriesForAutofill.IT:
      return "I";
    case CountriesForAutofill.AT:
      return "A";
    default:
      return country;
  }
};
export const EU_COUNTRIES = [
  "FR",
  "GB",
  "IE",
  "LU",
  "BE",
  "DE",
  "ES",
  "IT",
  "NL",
  "AT",
  "DK",
];
export const getCountryLocaleFromCountryName = (
  country: string | undefined
): CountryForAutofill => {
  if (!country) {
    return CountriesForAutofill.NO_TYPE;
  }
  if (
    country.length === 2 &&
    country.toLocaleUpperCase() in CountriesForAutofill
  ) {
    return country.toLocaleUpperCase() as CountryForAutofill;
  }
  const locales: Set<string> = new Set();
  const lowerCaseCountry = country.toLowerCase();
  for (const language in TRANSLATION_MAP_FOR_COUNTRIES_ABBREVIATION_IN_DIFFERENT_LANGUAGES) {
    const currentLanguageMap =
      TRANSLATION_MAP_FOR_COUNTRIES_ABBREVIATION_IN_DIFFERENT_LANGUAGES[
        language
      ];
    for (const languageLocale in currentLanguageMap) {
      if (
        currentLanguageMap[languageLocale].toLowerCase() === lowerCaseCountry
      ) {
        locales.add(languageLocale);
      }
    }
  }
  if (locales.size === 1) {
    return [...locales][0] as CountryForAutofill;
  }
  return CountriesForAutofill.NO_TYPE;
};
