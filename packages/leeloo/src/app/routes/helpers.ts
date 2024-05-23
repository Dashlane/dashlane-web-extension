import { stringify } from 'query-string';
import { RoutingSchemeOptions } from './constants';
export const GetRouteWithSubscriptionCode = (baseUrl: string, subscriptionCode: string | undefined): string => {
    const subCodeParam = stringify({ subCode: subscriptionCode });
    return `${baseUrl}${subCodeParam ? `?${subCodeParam}` : ''}`;
};
export const isAllAppsRouting = (routingSchemeOptions: RoutingSchemeOptions): boolean => routingSchemeOptions === RoutingSchemeOptions.ALL_APPS;
export const getAllWebAppRoutes = (path: string) => [
    `${path}/account-settings`,
    `${path}/collections`,
    `${path}/credentials`,
    `${path}/device-transfer`,
    `${path}/passkeys`,
    `${path}/darkweb-monitoring`,
    `${path}/anti-phishing`,
    `${path}/go-premium`,
    `${path}/ids`,
    `${path}/import`,
    `${path}/notifications`,
    `${path}/onboarding`,
    `${path}/password-health`,
    `${path}/password-history`,
    `${path}/payments`,
    `${path}/personal-info`,
    `${path}/premium-plus`,
    `${path}/referral`,
    `${path}/secrets`,
    `${path}/secure-notes`,
    `${path}/sharing-center`,
    `${path}/subscription`,
    `${path}/vpn`,
    `${path}/family-dashboard`,
    `${path}/chrome-welcome`,
    `${path}/two-factor-authentication`,
    `${path}/account-recovery-key-result`,
    `${path}/auto-login-sso-success`,
    `${path}/device-transfer-success`,
    `${path}/console`,
    `${path}/dashlane-labs`,
    `${path}/privacy-settings`,
];
