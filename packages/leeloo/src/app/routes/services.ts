import { VaultItemType } from '@dashlane/vault-contracts';
import { ADMIN_ASSISTED_RECOVERY_URL_SEGMENT, CLIENT_TAC_URL_SEGMENT, CLIENT_URL_SEGMENT, GET_ADVANCED_URL, GET_ESSENTIALS_URL, GET_PLANS_URL, GET_PREMIUM_FAMILY_URL, GET_PREMIUM_URL, RoutingSchemeOptions, TEAM_CONSOLE_URL_SEGMENT, WAC_TAC_URL_SEGMENT, } from './constants';
import { AddWebsiteRouteState, NamedRoutes } from './types';
import { IdVaultItemType } from 'webapp/ids/types';
import { getUrlGivenDefinedQuery } from 'libs/url-utils';
import { PricingMode } from 'libs/premium-status.lib';
export const join = (...args: unknown[]): string => {
    return args.join('/');
};
export const getVaultItemRouteTypeDictionary = {
    [VaultItemType.Address]: '/addresses',
    [VaultItemType.BankAccount]: '/bank-accounts',
    [VaultItemType.Company]: '/companies',
    [VaultItemType.Credential]: '/credentials',
    [VaultItemType.DriversLicense]: '/driver-licenses',
    [VaultItemType.Email]: '/emails',
    [VaultItemType.FiscalId]: '/fiscal-ids',
    [VaultItemType.IdCard]: '/id-cards',
    [VaultItemType.Identity]: '/identities',
    [VaultItemType.Passkey]: '/passkeys',
    [VaultItemType.Passport]: '/passports',
    [VaultItemType.PaymentCard]: '/cards',
    [VaultItemType.Phone]: '/phones',
    [VaultItemType.Secret]: '/secrets',
    [VaultItemType.SecureNote]: '/secure-notes',
    [VaultItemType.SocialSecurityId]: '/social-security-ids',
    [VaultItemType.Website]: '/websites',
};
export const getUrlCompatibleUuid = (uuid: string): string => {
    let firstIndex = 0;
    let lastIndex = undefined;
    if (uuid.startsWith('{')) {
        firstIndex = 1;
    }
    if (uuid.endsWith('}')) {
        lastIndex = -1;
    }
    return uuid.toUpperCase().slice(firstIndex, lastIndex);
};
export const getNamedRoutes = (routingScheme: RoutingSchemeOptions): NamedRoutes => {
    const hostedUrlSegment = routingScheme === RoutingSchemeOptions.CLIENT
        ? WAC_TAC_URL_SEGMENT
        : CLIENT_TAC_URL_SEGMENT;
    const tacUrlSegment = APP_PACKAGED_IN_EXTENSION
        ? TEAM_CONSOLE_URL_SEGMENT
        : hostedUrlSegment;
    const teamRoutesBasePath = routingScheme === RoutingSchemeOptions.TEAM_ADMIN_CONSOLE
        ? ''
        : tacUrlSegment;
    const adminAssistedRecoveryRoutesBasePath = ADMIN_ASSISTED_RECOVERY_URL_SEGMENT;
    const clientRoutesBasePath = routingScheme === RoutingSchemeOptions.CLIENT ? '' : CLIENT_URL_SEGMENT;
    return {
        teamRoutesBasePath: teamRoutesBasePath,
        teamMembersRoutePath: join(teamRoutesBasePath, 'members'),
        teamSettingsRoutePath: join(teamRoutesBasePath, 'settings'),
        teamSettingsSso: join(teamRoutesBasePath, 'settings/sso-settings'),
        teamSettingsSsoEncryption: join(teamRoutesBasePath, 'settings/sso/self-hosted-sso'),
        teamAccountRoutePath: join(teamRoutesBasePath, 'account'),
        teamAccountChangePlanRoutePath: join(teamRoutesBasePath, 'account/changeplan'),
        teamActivityRoutePath: join(teamRoutesBasePath, 'activity'),
        teamGetStartedRoutePath: join(teamRoutesBasePath, 'get-started'),
        teamDashboardRoutePath: join(teamRoutesBasePath, 'dashboard'),
        teamDarkWebInsightsRoutePath: join(teamRoutesBasePath, 'dark-web-insights'),
        teamGroupsRoutePath: join(teamRoutesBasePath, 'groups'),
        teamGroupRoutePath: (groupUuid) => join(teamRoutesBasePath, `groups/${groupUuid}`),
        familyDashboard: join(clientRoutesBasePath, 'family-dashboard'),
        clientRoutesBasePath: clientRoutesBasePath,
        userDeviceRegistration: join(adminAssistedRecoveryRoutesBasePath, 'device-registration'),
        userCreateMasterPassword: join(adminAssistedRecoveryRoutesBasePath, 'create-master-password'),
        userSendRequest: join(adminAssistedRecoveryRoutesBasePath, 'send-request'),
        userPendingRequest: join(adminAssistedRecoveryRoutesBasePath, 'pending-request'),
        userAddApplicationCredential: join(clientRoutesBasePath, 'credentials/add/application'),
        userAddDatabaseCredential: join(clientRoutesBasePath, 'credentials/add/database'),
        userAddWebsiteCredential: join(clientRoutesBasePath, 'credentials/add'),
        userAddWebsiteCredentialWithPrefilledParameters: (routeState: AddWebsiteRouteState): {
            pathname: string;
            state: AddWebsiteRouteState;
        } => {
            const pathname = join(clientRoutesBasePath, 'password-history/credentials/add');
            return {
                pathname,
                state: routeState,
            };
        },
        userCollection: (collectionId) => join(clientRoutesBasePath, `collections/${getUrlCompatibleUuid(collectionId)}`),
        userCollections: join(clientRoutesBasePath, 'collections'),
        userCredentials: join(clientRoutesBasePath, 'credentials'),
        userCredentialsAccountSettings: join(clientRoutesBasePath, 'credentials/account-settings'),
        userPasskeys: join(clientRoutesBasePath, 'passkeys'),
        userPasskey: (passkeyUuid) => join(clientRoutesBasePath, `passkeys/${getUrlCompatibleUuid(passkeyUuid)}`),
        userVaultItem: (vaultItemUuid, vaultItemType, pathname) => {
            const vaultItemRoute = getVaultItemRouteTypeDictionary[vaultItemType];
            if (!pathname.includes(vaultItemRoute)) {
                pathname += vaultItemRoute;
            }
            return `${pathname}/${getUrlCompatibleUuid(vaultItemUuid)}`;
        },
        userCredential: (credentialUuid) => join(clientRoutesBasePath, `credentials/${getUrlCompatibleUuid(credentialUuid)}`),
        userPasswordHistory: join(clientRoutesBasePath, 'password-history'),
        userPasswordHistoryFilteredByCredential: (credentialUuid) => join(clientRoutesBasePath, `password-history/filter/${getUrlCompatibleUuid(credentialUuid)}`),
        userAddBlankNote: join(clientRoutesBasePath, 'secure-notes/add'),
        userSecureNotes: join(clientRoutesBasePath, 'secure-notes'),
        userAddBlankSecret: join(clientRoutesBasePath, 'secrets/add'),
        userSecrets: join(clientRoutesBasePath, 'secrets'),
        userOnboarding: join(clientRoutesBasePath, 'onboarding'),
        userReferral: join(clientRoutesBasePath, 'referral'),
        userChromeWelcome: join(clientRoutesBasePath, 'chrome-welcome'),
        userPasswordSites: join(clientRoutesBasePath, 'onboarding/add-password'),
        userAddMobile: join(clientRoutesBasePath, 'onboarding/add-mobile'),
        userTryAutofill: join(clientRoutesBasePath, 'onboarding/try-autofill'),
        userSecureNote: (secureNoteUuid) => join(clientRoutesBasePath, `secure-notes/${getUrlCompatibleUuid(secureNoteUuid)}`),
        userSecret: (secretUuid) => join(clientRoutesBasePath, `secrets/${getUrlCompatibleUuid(secretUuid)}`),
        userAddPersonalInfoCompany: join(clientRoutesBasePath, 'personal-info/companies/add'),
        userAddPersonalInfoEmail: join(clientRoutesBasePath, 'personal-info/emails/add'),
        userAddPersonalInfoAddress: join(clientRoutesBasePath, 'personal-info/addresses/add'),
        userAddPersonalInfoIdentity: join(clientRoutesBasePath, 'personal-info/identities/add'),
        userAddPersonalInfoPhone: join(clientRoutesBasePath, 'personal-info/phones/add'),
        userAddPersonalInfoWebsite: join(clientRoutesBasePath, 'personal-info/websites/add'),
        userPersonalInfo: join(clientRoutesBasePath, 'personal-info'),
        userPersonalInfoAddress: (uuid) => join(clientRoutesBasePath, `personal-info/addresses/${getUrlCompatibleUuid(uuid)}`),
        userPersonalInfoCompany: (uuid) => join(clientRoutesBasePath, `personal-info/companies/${getUrlCompatibleUuid(uuid)}`),
        userPersonalInfoEmail: (uuid) => join(clientRoutesBasePath, `personal-info/emails/${getUrlCompatibleUuid(uuid)}`),
        userPersonalInfoIdentity: (uuid) => join(clientRoutesBasePath, `personal-info/identities/${getUrlCompatibleUuid(uuid)}`),
        userPersonalInfoPhone: (uuid) => join(clientRoutesBasePath, `personal-info/phones/${getUrlCompatibleUuid(uuid)}`),
        userPersonalInfoWebsite: (uuid) => join(clientRoutesBasePath, `personal-info/websites/${getUrlCompatibleUuid(uuid)}`),
        userPayments: join(clientRoutesBasePath, 'payments'),
        userAddPaymentCard: join(clientRoutesBasePath, 'payments/card/add'),
        userPaymentCard: (paymentUuid) => join(clientRoutesBasePath, `payments/card/${getUrlCompatibleUuid(paymentUuid)}`),
        userAddBankAccount: join(clientRoutesBasePath, 'payments/bank-account/add'),
        userBankAccount: (paymentUuid) => join(clientRoutesBasePath, `payments/bank-account/${getUrlCompatibleUuid(paymentUuid)}`),
        userIdsDocuments: join(clientRoutesBasePath, 'ids'),
        userAddIdDocument: (type: IdVaultItemType) => join(clientRoutesBasePath, `ids${getVaultItemRouteTypeDictionary[type]}/add`),
        userEditIdDocument: (type: IdVaultItemType, id: string) => join(clientRoutesBasePath, `ids${getVaultItemRouteTypeDictionary[type]}/${getUrlCompatibleUuid(id)}`),
        userEmergency: join(clientRoutesBasePath, 'emergency'),
        userSettings: join(clientRoutesBasePath, 'settings'),
        userUpsell: join(clientRoutesBasePath, 'go-premium'),
        userSharingCenter: join(clientRoutesBasePath, 'sharing-center'),
        userGoPlans: GET_PLANS_URL,
        userGoAdvanced: (subCode?: string, pricing?: PricingMode) => getUrlGivenDefinedQuery(GET_ADVANCED_URL, { subCode, pricing }),
        userGoEssentials: (subCode?: string, pricing?: PricingMode) => getUrlGivenDefinedQuery(GET_ESSENTIALS_URL, { subCode, pricing }),
        userGoFamily: (subCode?: string, pricing?: PricingMode) => getUrlGivenDefinedQuery(GET_PREMIUM_FAMILY_URL, { subCode, pricing }),
        userGoPremium: (subCode?: string, pricing?: PricingMode) => getUrlGivenDefinedQuery(GET_PREMIUM_URL, { subCode, pricing }),
        userSharingGroupInfo: (groupId: string) => join(clientRoutesBasePath, `sharing-center/group/${getUrlCompatibleUuid(groupId)}`),
        userSharingUserInfo: (userId: string) => join(clientRoutesBasePath, `sharing-center/user/${userId.toLowerCase()}`),
        userPasswordHealth: join(clientRoutesBasePath, 'password-health'),
        userSubscriptionManagement: join(clientRoutesBasePath, 'subscription'),
        deviceTransfer: join(clientRoutesBasePath, 'device-transfer'),
        darkWebMonitoring: join(clientRoutesBasePath, 'darkweb-monitoring'),
        antiPhishing: join(clientRoutesBasePath, 'anti-phishing'),
        premiumPlus: join(clientRoutesBasePath, 'premium-plus'),
        vpn: join(clientRoutesBasePath, 'vpn'),
        importData: join(clientRoutesBasePath, 'import/source'),
        twoFactorAuthenticationEnforce: join(clientRoutesBasePath, 'two-factor-authentication/enforce'),
        dashlaneLabs: join(clientRoutesBasePath, 'dashlane-labs'),
        privacySettings: join(clientRoutesBasePath, 'privacy-settings'),
        recover2faCodes: (login?: string) => login ? `recover-2fa-codes?account=${login}` : 'recover-2fa-codes',
    };
};
