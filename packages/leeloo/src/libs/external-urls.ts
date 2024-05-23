import * as qs from 'query-string';
import { MouseEvent } from 'react';
import { tabsCreate } from '@dashlane/webextensions-apis';
export function openUrl(url: string) {
    tabsCreate({ url }).catch(() => {
        const newWindow = window.open() || window;
        newWindow.opener = null;
        newWindow.location.replace(url);
    });
}
export function redirectToUrl(url: string) {
    window.location.replace(url);
}
export interface TrackingParams {
    type: string;
    subtype?: string;
    action: string;
    subaction?: string;
}
export function openDashlaneUrl(url: string, tracking: TrackingParams, options: {
    newTab: boolean;
} = { newTab: true }) {
    const parsedQueryString = qs.parse(qs.extract(url));
    const queryStringIndex = url.indexOf('?');
    const urlWithoutQueryString = queryStringIndex > -1 ? url.slice(0, queryStringIndex) : url;
    const newQueryString = Object.assign({}, parsedQueryString, {
        utm_source: 'webapp',
        utm_medium: tracking.type,
        utm_campaign: tracking.subtype,
        utm_term: tracking.action,
        utm_content: tracking.subaction,
    });
    const fullUrl = urlWithoutQueryString + '?' + qs.stringify(newQueryString);
    if (options.newTab) {
        openUrl(fullUrl);
    }
    else {
        window.location.assign(fullUrl);
    }
}
export const onLinkClickOpenDashlaneUrl = (tracking: TrackingParams) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const url = e.currentTarget.href;
    openDashlaneUrl(url, tracking);
};
export const augmentUrlWithProperSsoQueryParameters = (redirectUrl: string): string => {
    const currentLocation = window.location;
    const currentHost = currentLocation.host;
    const currentPath = currentLocation.pathname;
    const redirectLocation = new URL(redirectUrl);
    const redirectUrlQueries = qs.parse(redirectLocation.search);
    redirectUrlQueries['frag'] = 'true';
    if (currentHost.startsWith('qa')) {
        redirectUrlQueries['redirect'] = 'web_qa';
    }
    else if (currentHost.startsWith('preview')) {
        redirectUrlQueries['redirect'] = 'web_preview';
    }
    else if (currentHost.startsWith('beta')) {
        redirectUrlQueries['redirect'] = 'web_beta';
    }
    else if (currentHost.startsWith('console')) {
        redirectUrlQueries['redirect'] = 'web_console';
    }
    else if (currentHost.startsWith('localhost')) {
        redirectUrlQueries['redirect'] = 'localhost';
    }
    else {
        const currentPathArray = currentPath.split('/');
        if (currentPathArray.find((path) => path === 'branch')) {
            redirectUrlQueries['redirect'] = 'web_branch';
            redirectUrlQueries['redirectBranch'] = currentPathArray[2];
        }
    }
    redirectLocation.search = qs.stringify(redirectUrlQueries);
    return (redirectLocation.protocol +
        '//' +
        redirectLocation.host +
        redirectLocation.pathname +
        redirectLocation.search);
};
export const isDashlaneUrl = (redirectUrl: string): boolean => redirectUrl.startsWith('*****') ||
    redirectUrl.startsWith('*****');
