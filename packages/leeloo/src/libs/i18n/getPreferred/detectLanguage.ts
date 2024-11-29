export function getNavigatorLocaleHints(window: Window) {
  const navigator: Navigator = window.navigator;
  return {
    languages: navigator.languages,
    language: navigator.language,
    userLanguage: navigator.userLanguage,
    systemLanguage: navigator.systemLanguage,
  };
}
export function detectBestMatchingSupportedCountry(window: Window) {
  const navigatorHints = getNavigatorLocaleHints(window);
  const browserLanguage =
    navigatorHints.userLanguage || navigatorHints.language;
  let preferredCountryBrowser = "";
  if (browserLanguage.length >= 5) {
    preferredCountryBrowser = browserLanguage.substr(3, 2);
  }
  return preferredCountryBrowser;
}
