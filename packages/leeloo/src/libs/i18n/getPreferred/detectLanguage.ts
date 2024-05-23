export function getNavigatorLocaleHints(window: Window) {
    const navigator: Navigator = window.navigator;
    return {
        languages: navigator.languages,
        language: navigator.language,
        userLanguage: navigator.userLanguage,
        systemLanguage: navigator.systemLanguage,
    };
}
export function detectBestMatchingSupportedLanguage(window: Window, availableLocales: string[]) {
    const navigatorHints = getNavigatorLocaleHints(window);
    let preferredLocaleUser = '';
    if (navigatorHints.languages) {
        preferredLocaleUser =
            navigatorHints.languages.find((language: string) => !!availableLocales.find((locale: string) => language.substr(0, 2) === locale)) || '';
        preferredLocaleUser = preferredLocaleUser
            ? preferredLocaleUser.substr(0, 2)
            : preferredLocaleUser;
    }
    const browserLanguage = navigatorHints.userLanguage || navigatorHints.language;
    const preferredLocaleBrowser = availableLocales.find((locale: string) => browserLanguage.substr(0, 2) === locale);
    return preferredLocaleUser || preferredLocaleBrowser;
}
export function detectBestMatchingSupportedCountry(window: Window) {
    const navigatorHints = getNavigatorLocaleHints(window);
    const browserLanguage = navigatorHints.userLanguage || navigatorHints.language;
    let preferredCountryBrowser = '';
    if (browserLanguage.length >= 5) {
        preferredCountryBrowser = browserLanguage.substr(3, 2);
    }
    return preferredCountryBrowser;
}
