import { getLanguage } from "@dashlane/framework-infra/spi";
import { detectBestMatchingSupportedCountry } from "./detectLanguage";
export function getPreferredLanguage(languageOverride?: string): string {
  const preferredLocale = languageOverride ?? getLanguage();
  return preferredLocale.toLowerCase();
}
export function getPreferredCountry(defaultCountry: string): string {
  const preferredCountryFromNavigator =
    detectBestMatchingSupportedCountry(window);
  const preferredCountry = preferredCountryFromNavigator || defaultCountry;
  return preferredCountry.toUpperCase();
}
