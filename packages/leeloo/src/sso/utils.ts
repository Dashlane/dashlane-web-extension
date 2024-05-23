import { parse, stringify } from 'query-string';
import { AdminPermissionLevel, SsoMigrationServerMethod, } from '@dashlane/communication';
import { Props, SsoUrlInfo } from 'sso/types';
export const extractSsoInfoFromUrl = (props: Props): SsoUrlInfo => {
    const { location: { search }, } = props;
    const ssoUrlInfo = {
        login: '',
        ssoToken: '',
        key: '',
        exists: '',
        currentAuths: SsoMigrationServerMethod.SSO,
        expectedAuths: SsoMigrationServerMethod.SSO,
        inStore: false,
    };
    try {
        if (search?.includes('ssoToken')) {
            return { ...ssoUrlInfo, ...parse(search) };
        }
    }
    catch (error) {
        return ssoUrlInfo;
    }
    return ssoUrlInfo;
};
export const provideLocalInStoreSsoUrl = () => {
    const urlParams = stringify({
        ssoToken: 'inStore',
        key: 'inStore',
        currentAuths: SsoMigrationServerMethod.MP,
        expectedAuths: SsoMigrationServerMethod.SSO,
        exists: true,
        inStore: true,
    });
    return `/sso?${urlParams}`;
};
export const requiredPermissions = (): AdminPermissionLevel | null => {
    const currentHost = window.location.host;
    return currentHost.startsWith('console') ? 'BILLING' : null;
};
