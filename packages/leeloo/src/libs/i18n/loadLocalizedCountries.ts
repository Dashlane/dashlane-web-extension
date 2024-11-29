export default function loadLocalizedCountries(locale: string): Promise<{
  [k: string]: string;
}> {
  if (locale === "de") {
    return new Promise((resolve) => {
      require.ensure([], (require) => {
        resolve(require("localized-countries/data/de.json"));
      });
    });
  }
  if (locale === "en") {
    return new Promise((resolve) => {
      require.ensure([], (require) => {
        resolve(require("localized-countries/data/en.json"));
      });
    });
  }
  if (locale === "es") {
    return new Promise((resolve) => {
      require.ensure([], (require) => {
        resolve(require("localized-countries/data/es.json"));
      });
    });
  }
  if (locale === "fr") {
    return new Promise((resolve) => {
      require.ensure([], (require) => {
        resolve(require("localized-countries/data/fr.json"));
      });
    });
  }
  if (locale === "it") {
    return new Promise((resolve) => {
      require.ensure([], (require) => {
        resolve(require("localized-countries/data/it.json"));
      });
    });
  }
  if (locale === "ja") {
    return new Promise((resolve) => {
      require.ensure([], (require) => {
        resolve(require("localized-countries/data/ja.json"));
      });
    });
  }
  if (locale === "pt") {
    return new Promise((resolve) => {
      require.ensure([], (require) => {
        resolve(require("localized-countries/data/pt_BR.json"));
      });
    });
  }
  if (locale === "ko") {
    return new Promise((resolve) => {
      require.ensure([], (require) => {
        resolve(require("localized-countries/data/ko.json"));
      });
    });
  }
  if (locale === "zh") {
    return new Promise((resolve) => {
      require.ensure([], (require) => {
        resolve(require("localized-countries/data/zh.json"));
      });
    });
  }
  if (locale === "nl") {
    return new Promise((resolve) => {
      require.ensure([], (require) => {
        resolve(require("localized-countries/data/nl.json"));
      });
    });
  }
  if (locale === "sv") {
    return new Promise((resolve) => {
      require.ensure([], (require) => {
        resolve(require("localized-countries/data/sv.json"));
      });
    });
  }
  return new Promise((resolve) => {
    require.ensure([], (require) => {
      resolve(require("localized-countries/data/en.json"));
    });
  });
}
