import { getLanguage } from "@dashlane/framework-infra/spi";
import { TRANSLATION_MAP_FOR_COUNTRIES_ABBREVIATION_IN_DIFFERENT_LANGUAGES } from "./helpers";
export const fullLocalizedCountry = (countryAbbreviation: string): string => {
  if (countryAbbreviation) {
    const currentLanguage = getLanguage();
    const currentLanguageMap =
      currentLanguage in
      TRANSLATION_MAP_FOR_COUNTRIES_ABBREVIATION_IN_DIFFERENT_LANGUAGES
        ? TRANSLATION_MAP_FOR_COUNTRIES_ABBREVIATION_IN_DIFFERENT_LANGUAGES[
            currentLanguage
          ]
        : TRANSLATION_MAP_FOR_COUNTRIES_ABBREVIATION_IN_DIFFERENT_LANGUAGES[
            "en"
          ];
    return (
      currentLanguageMap[countryAbbreviation.toLocaleUpperCase()] ??
      countryAbbreviation
    );
  }
  return "";
};
