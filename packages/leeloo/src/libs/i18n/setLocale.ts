import transformLangStrings from "./transform-lang-strings";
const loadTranslationFile = function (locale: string): Promise<{
  [k: string]: string;
}> {
  return import(`../../../i18n/${locale}.json`);
};
export function setLocale(
  counterpart: Counterpart,
  locale: string,
  data: {
    [k: string]: string;
  }
) {
  const defaultTranslations = {
    counterpart: { pluralize: require("pluralizers/en") },
  };
  counterpart.registerTranslations(
    locale,
    Object.assign<any, CounterpartModule._Translations>(
      defaultTranslations,
      transformLangStrings(data)
    )
  );
  counterpart.registerTranslations("ja", require("./ja.js"));
  counterpart.registerTranslations("ko", require("./ko.js"));
  counterpart.registerTranslations("zh", require("./zh.js"));
  counterpart.setLocale(locale);
}
export default function loadAndSetLocale(counterpart: Counterpart) {
  return function (locale: string) {
    document.querySelector("html")?.setAttribute("lang", locale.substr(0, 2));
    return loadTranslationFile(locale).then((json) => {
      setLocale(counterpart, locale, json);
    });
  };
}
