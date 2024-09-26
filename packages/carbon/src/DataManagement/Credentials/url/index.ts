import { format as formatURL, parse as parseURL } from 'url';
import { compose, defaultTo, head, isNil, map, prop, trim } from 'ramda';
import { Credential, TrustedUrl } from '@dashlane/communication';
import { ParsedURL } from '@dashlane/url-parser';
import { isAmazonWebsite } from '../url/helpers';
import { getUnixTimestamp } from 'Utils/getUnixTimestamp';
const getUserSelectedUrl = (cred: Credential): string | null => cred.UseFixedUrl && cred.UserSelectedUrl ? cred.UserSelectedUrl : null;
const addFallbackHttpsScheme = (url: string): string => {
    return new ParsedURL(url).getUrlWithFallbackHttpsProtocol();
};
const getUrlWithoutPath = (url: string): string | null => {
    const { protocol, hostname, port } = parseURL(url);
    if (protocol && /*****/.test(protocol)) {
        return formatURL({
            protocol,
            hostname,
            port,
        });
    }
    return null;
};
const getSchemeUrlWithoutPath = compose<string, string, string, string | null>(getUrlWithoutPath, addFallbackHttpsScheme, trim);
const isNonNilTrustedUrl = (url: string | null): url is string => !isNil(url);
const filterNonNilTrustedUrls = (urls: (string | null)[]): string[] => urls.filter(isNonNilTrustedUrl);
export const getBaseTrustedUrls = compose<any, TrustedUrl[], string[], string[], (string | null | undefined)[], string[]>(filterNonNilTrustedUrls, map(getSchemeUrlWithoutPath), map(defaultTo('')), map<TrustedUrl, string>(prop('TrustedUrl')), defaultTo([]));
export const getFirstTrustedUrl = (credential: Credential): string => {
    const defaultToEmptyString = defaultTo('');
    return defaultToEmptyString(head(getBaseTrustedUrls(credential.TrustedUrlGroup)));
};
export const getBestUrl = (credential: Credential): string => {
    const userSelectedUrl = getUserSelectedUrl(credential);
    if (userSelectedUrl && userSelectedUrl.length) {
        return userSelectedUrl;
    }
    if (credential.Url && credential.Url.length) {
        return credential.Url;
    }
    return getFirstTrustedUrl(credential);
};
interface ClearUrlForPersonalDataOptions {
    keepQueryString?: boolean;
}
export function cleanUrlForPersonalData(url: string, options?: ClearUrlForPersonalDataOptions): string {
    if (!url) {
        return '';
    }
    if (isAmazonWebsite(url)) {
        return url;
    }
    const cleanUrlOptions = {
        keepQueryString: false,
        ...options,
    };
    let cleanUrl = url;
    if (!cleanUrlOptions.keepQueryString) {
        cleanUrl = stripUrlQueryString(cleanUrl);
    }
    return addFallbackHttpsScheme(cleanUrl);
}
function stripUrlQueryString(url: string): string {
    const queryStringIndex = url.indexOf('?');
    return queryStringIndex > -1 ? url.slice(0, queryStringIndex) : url;
}
export function getUpdatedTrustedUrlList(currentTrustedUrlList: TrustedUrl[], newUrl: string): TrustedUrl[] {
    const TRUSTED_URL_LIST_MAX_SIZE = 20;
    const urlToSave = cleanUrlForPersonalData(newUrl);
    const newDomain = new ParsedURL(urlToSave).getRootDomain();
    const currentList = (currentTrustedUrlList || []).filter((trustedUrlGroup) => new ParsedURL(trustedUrlGroup.TrustedUrl).getRootDomain() ===
        newDomain);
    const isUrlAlreadySaved = currentList.some((trustedUrlGroup) => trustedUrlGroup.TrustedUrl === urlToSave);
    if (isUrlAlreadySaved) {
        return currentList;
    }
    const nbrItemsToRemove = currentList.length >= TRUSTED_URL_LIST_MAX_SIZE
        ? currentList.length - TRUSTED_URL_LIST_MAX_SIZE + 1
        : 0;
    const trimmedTrustedUrlList = currentList.slice(nbrItemsToRemove);
    return trimmedTrustedUrlList.concat({
        TrustedUrl: urlToSave,
        TrustedUrlExpire: getUnixTimestamp().toString(),
    });
}
