import { detectBestMatchingSupportedCountry, detectBestMatchingSupportedLanguage, } from './detectLanguage';
export { getNavigatorLocaleHints } from './detectLanguage';
export function getPreferredLanguage(languageInStore: string, locales: string[], defaultLocale: string): string {
    const preferredLocaleFromNavigator = detectBestMatchingSupportedLanguage(window, locales);
    const lastPreferredLanguage = languageInStore;
    const preferredLocale = lastPreferredLanguage ||
        FORCE_DEFAULT_LOCALE ||
        preferredLocaleFromNavigator ||
        defaultLocale;
    return preferredLocale.toLowerCase();
}
export function getPreferredCountry(countryInStore: string, locales: string[], defaultCountry: string): string {
    const preferredCountryFromNavigator = detectBestMatchingSupportedCountry(window);
    const lastPreferredCountry = countryInStore;
    const preferredCountry = preferredCountryFromNavigator || lastPreferredCountry || defaultCountry;
    return preferredCountry.toUpperCase();
}
