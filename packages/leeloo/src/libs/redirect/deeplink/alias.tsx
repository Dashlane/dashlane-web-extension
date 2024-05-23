import * as React from 'react';
import { Redirect, useLocation } from 'libs/router';
const getClientAliases = (): Aliases => ({
    '/account-recovery/admin-assisted-recovery/change-master-password': [
        '/master-password-reset',
    ],
    '/credentials': ['/passwords'],
    '/credentials/account-settings': ['/account-settings'],
    '/credentials/account-settings?view=devices': ['/devices'],
    '/credentials/account-settings?view=security-settings': [
        '/security-settings',
    ],
    '/darkweb-monitoring': ['/dark-web-monitoring', '/security-dashboard'],
    '/ids': ['/id-documents'],
    '/ids/driver-licenses': ['/driver-licenses'],
    '/ids/fiscal-ids': ['/fiscals'],
    '/ids/id-cards': ['/id-cards'],
    '/ids/passports': ['/passports'],
    '/ids/social-security-ids': ['/social-security-numbers'],
    '/notifications': ['/sharing'],
    '/onboarding': ['/getting-started'],
    '/payments/bank-account': ['/bank-accounts'],
    '/payments/card': ['/credit-cards'],
    '/personal-info/addresses': ['/addresses'],
    '/personal-info/companies': ['/companies'],
    '/personal-info/emails': ['/emails'],
    '/personal-info/identities': ['/identities'],
    '/personal-info/phones': ['/phones'],
    '/personal-info': ['/websites'],
    '/secure-notes': ['/notes'],
    '/login?askmp': ['/askmp'],
});
interface Aliases {
    [key: string]: string[];
}
interface AliasProps {
    basePath: string;
    aliases: Aliases;
}
const buildPath = (aliases: Aliases, basePath = '') => Object.values(aliases)
    .flat()
    .map((path) => `${basePath}${path}`);
const getAliasRedirect = (aliases: Aliases, pathname: string) => {
    const match = Object.entries(aliases).reduce((memo, entry) => {
        if (memo) {
            return memo;
        }
        const [route, entryAliases] = entry;
        const alias = entryAliases.find((entryAlias) => pathname.startsWith(entryAlias));
        return alias ? { route, alias } : null;
    }, null);
    return match ? pathname.replace(match.alias, match.route) : null;
};
export const Alias = (props: AliasProps) => {
    const location = useLocation();
    const redirectPathname = getAliasRedirect(props.aliases, location.pathname.replace(props.basePath ?? '', ''));
    const redirectUrl = redirectPathname
        ? `${props.basePath}${redirectPathname}${location.search}`
        : null;
    return redirectUrl ? <Redirect to={redirectUrl}/> : null;
};
export const buildClientProps = (basePath = '') => {
    return {
        basePath,
        path: buildPath(getClientAliases(), basePath),
        aliases: getClientAliases(),
    };
};
