export const faviconSelector = () => {
    const lightSchemeIcons = document.querySelectorAll('link.light-scheme-favicon');
    const darkSchemeIcons = document.querySelectorAll('link.dark-scheme-favicon');
    const darkModeMatcher = window.matchMedia('(prefers-color-scheme: dark)');
    function selectFavicon() {
        if (darkModeMatcher.matches) {
            lightSchemeIcons.forEach((i) => i.remove());
            darkSchemeIcons.forEach((i) => document.head.append(i));
        }
        else {
            darkSchemeIcons.forEach((i) => i.remove());
            lightSchemeIcons.forEach((i) => document.head.append(i));
        }
    }
    if (darkModeMatcher.addEventListener) {
        darkModeMatcher.addEventListener('change', selectFavicon);
    }
    else {
        darkModeMatcher.addListener(selectFavicon);
    }
    selectFavicon();
};
