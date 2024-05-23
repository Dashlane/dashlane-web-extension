export const getUrlSearch = (url = window.location.href) => {
    const normalizedUrl = url.replace('#/', '/');
    return new URL(normalizedUrl).search;
};
export const parseUrlSearchParams = (search: string) => {
    return new URLSearchParams(search);
};
export const getUrlSearchParams = (url = window.location.href) => {
    const search = getUrlSearch(url);
    return parseUrlSearchParams(search);
};
