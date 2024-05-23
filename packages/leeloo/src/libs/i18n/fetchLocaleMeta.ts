export const fetchRelativeLocaleStrings = (locale: string): Promise<{
    [k: string]: string;
}> => {
    if (locale === 'de') {
        return new Promise((resolve) => {
            require.ensure([], (require) => {
                resolve(require('date-fns/locale/de/index.js'));
            });
        });
    }
    if (locale === 'en') {
        return new Promise((resolve) => {
            require.ensure([], (require) => {
                resolve(require('date-fns/locale/en-US/index.js'));
            });
        });
    }
    if (locale === 'es') {
        return new Promise((resolve) => {
            require.ensure([], (require) => {
                resolve(require('date-fns/locale/es/index.js'));
            });
        });
    }
    if (locale === 'fr') {
        return new Promise((resolve) => {
            require.ensure([], (require) => {
                resolve(require('date-fns/locale/fr/index.js'));
            });
        });
    }
    if (locale === 'it') {
        return new Promise((resolve) => {
            require.ensure([], (require) => {
                resolve(require('date-fns/locale/it/index.js'));
            });
        });
    }
    if (locale === 'ja') {
        return new Promise((resolve) => {
            require.ensure([], (require) => {
                resolve(require('date-fns/locale/ja/index.js'));
            });
        });
    }
    if (locale === 'pt-br') {
        return new Promise((resolve) => {
            require.ensure([], (require) => {
                resolve(require('date-fns/locale/pt-BR/index.js'));
            });
        });
    }
    if (locale === 'ko') {
        return new Promise((resolve) => {
            require.ensure([], (require) => {
                resolve(require('date-fns/locale/ko/index.js'));
            });
        });
    }
    if (locale === 'zh-cn') {
        return new Promise((resolve) => {
            require.ensure([], (require) => {
                resolve(require('date-fns/locale/zh-CN/index.js'));
            });
        });
    }
    if (locale === 'nl') {
        return new Promise((resolve) => {
            require.ensure([], (require) => {
                resolve(require('date-fns/locale/nl/index.js'));
            });
        });
    }
    if (locale === 'sv') {
        return new Promise((resolve) => {
            require.ensure([], (require) => {
                resolve(require('date-fns/locale/sv/index.js'));
            });
        });
    }
    return new Promise((resolve) => {
        require.ensure([], (require) => {
            resolve(require('date-fns/locale/en-US/index.js'));
        });
    });
};
