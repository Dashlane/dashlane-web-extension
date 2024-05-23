export const fetchRelativeLocaleStrings = (locale: string): Promise<{
    [k: string]: string;
}> => {
    const dateFnLocale = locale in LOCALE_META_MAPPING ? LOCALE_META_MAPPING[locale] : locale;
    return import(`date-fns/locale/${dateFnLocale}/index.js`);
};
