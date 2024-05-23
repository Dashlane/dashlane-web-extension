import { UAParser } from 'ua-parser-js';
function getParsedUserAgent() {
    const uaParser = new UAParser(navigator.userAgent);
    return uaParser.getResult();
}
export function isEdge(url = '') {
    return (url.startsWith('*****') &&
        getParsedUserAgent().browser.name === 'Edge');
}
export function sanitizeURL(url?: string): string {
    const invalidProtocolRegex = /^(%20|\s)*(javascript|data|vbscript)/im;
    const ctrlCharactersRegex = /[^\x20-\x7EÀ-ž]/gim;
    const urlSchemeRegex = /^([^:]+):/gm;
    if (!url) {
        return 'about:blank';
    }
    const sanitizedURL = url.replace(ctrlCharactersRegex, '').trim();
    const urlSchemeParseResults = sanitizedURL.match(urlSchemeRegex);
    if (!urlSchemeParseResults) {
        return sanitizedURL;
    }
    const urlScheme = urlSchemeParseResults[0];
    if (invalidProtocolRegex.test(urlScheme)) {
        return 'about:blank';
    }
    return sanitizedURL;
}
