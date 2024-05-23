import { BrowserCronSource, computeHash, decryptAes256, decryptRsaOaep, deriveKeyArgon2d, deriveKeyPbkdf2, encryptAes256, encryptRsaOaep, generateKeyAes256, generateKeyPairRsaOaep, getRandomValues, HttpFetchBackend, IndexDbKeyValueStorage, JsonWebAppResourceFetcher, PageToWorkerChannel, signHmacSha, signRsassaPkcs1, unsafeComputeMd5Hash, verifyHmacSha, } from '@dashlane/framework-infra';
import { AcknowledgedChannel, createSingleChannelListener, HttpModule, MemoryKeyValueStorageInfrastructure, MemoryStoreInfrastructureFactory, provideClass, provideValue, RequestContextModule, startApplicationNode, TaskTrackingModule, } from '@dashlane/framework-application';
import { ChangeMasterPasswordModule, LocalDataKeyEncryptionCodec, SessionModule, VaultAccessModule, } from '@dashlane/session-core';
import { appDefinition } from '@dashlane/application-extension-definition';
import { ConfidentialSSOModule, EnclaveApiSettings, EnclaveCloudflareHeaders, EnclaveSdkModule, isEnclaveEnvironment, ScimModule, } from '@dashlane/sso-scim-core';
import { WebExtensionEnclaveLoginContext } from '@dashlane/sso-scim-infra';
import { CarbonReadyHandler } from './start-application-modules.types';
import { AccountRecoveryKeyModule } from '@dashlane/account-recovery-core';
import { AuthenticationFlowModule, AuthenticationWebServicesRepository, DeviceRegistrationModule, DeviceTransferModule, IdentityVerificationFlowModule, UserVerificationModule, } from '@dashlane/authentication-core';
import { WebExtensionAuthenticationFlowInfraContext } from '@dashlane/authentication-infra';
import { AutofillDataModule, AutofillNotificationsModule, AutofillSecurityModule, AutofillSettingsModule, AutofillTrackingModule, LinkedWebsitesModule, } from '@dashlane/autofill-core';
import { OverridesModule } from '@dashlane/analysis-core';
import { appAccessKey, appSecretKey } from './app-keys';
import { AnalyticsModule, CryptographyInfrastructure, CryptographyModule, FeatureFlipsModule, ObfuscationKeyEncryptionCodec, PlatformInfoModule, RemoteFileUpdateDecipheringService, RemoteFileUpdateDownloaderService, RemoteFileUpdateModule, RemoteFileUpdateService, ServerApiConfig, SoftwareLogsExceptionSink, SoftwareLogsExceptionSinkModule, SoftwareLogsSettings, WebServicesModule, } from '@dashlane/framework-dashlane-application';
import { AntiphishingModule, BreachesModule, EmailMonitoringModule, OtpModule, PasswordHealthModule, VaultReportModule, } from '@dashlane/password-security-core';
import { PermissionsModule } from '@dashlane/access-rights-core';
import { SyncModule } from '@dashlane/sync-core';
import { PasswordLimitModule, VaultItemsCrudModule, VaultNotificationsModule, VaultOrganizationModule, VaultSearchModule, } from '@dashlane/vault-core';
import { ActivityLogsModule } from '@dashlane/risk-monitoring-core';
import { SharingCollectionsModule, SharingInvitesModule, SharingItemsModule, } from '@dashlane/sharing-core';
import { TeamAdminNotificationsModule, TeamGetStartedModule, TeamMembersModule, TeamOffersModule, TeamPasswordHealthModule, TeamPlanDetailsModule, TeamVatModule, } from '@dashlane/team-admin-core';
import { AccountReferralModule, DeleteOrResetAccountModule, } from '@dashlane/account-core';
import { NotificationsModule } from '@dashlane/monetization-notifications-core';
import { MasterPasswordSecurityModule } from '@dashlane/master-password-core';
import { UserConsentsModule } from '@dashlane/privacy-core';
import { GetStartedModule } from '@dashlane/onboarding-core';
import { getCloudflareKeys } from 'libs/cloudflare-keys';
const BROWSER_CRON_SOURCE = new BrowserCronSource();
const FOREGROUND_TO_BACKGROUND_CHANNEL_NAME = 'graphene_leeloo_background';
const nitroCloudflareHeaders: EnclaveCloudflareHeaders = {
    accessKey: USE_CLOUDFLARE_HEADERS ? CLOUDFLARE_NITRO_ACCESS_KEY : '',
    secretKey: USE_CLOUDFLARE_HEADERS ? CLOUDFLARE_NITRO_SECRET_KEY : '',
};
const nitroEnvironment = isEnclaveEnvironment(NITRO_ENCLAVE_ENVIRONMENT)
    ? NITRO_ENCLAVE_ENVIRONMENT
    : 'prod';
const cloudflareKeys = getCloudflareKeys();
export async function startApplicationModules(): Promise<CarbonReadyHandler> {
    const grapheneChannel = new PageToWorkerChannel(self, FOREGROUND_TO_BACKGROUND_CHANNEL_NAME);
    const carbon = await import('@dashlane/carbon');
    const indexDb = new IndexDbKeyValueStorage();
    const isIndexDbSupported = await indexDb.isSupported();
    const storageInfrastructure = isIndexDbSupported
        ? indexDb
        : new MemoryKeyValueStorageInfrastructure();
    const carbonInfrastructure = new carbon.CarbonLegacyInfrastructure();
    const app = await startApplicationNode({
        appDefinition,
        channels: {},
        channelsListener: createSingleChannelListener(new AcknowledgedChannel(grapheneChannel)),
        currentNode: 'background',
        implementations: {
            taskTracking: {
                module: TaskTrackingModule,
            },
            requestContext: {
                module: RequestContextModule,
            },
            featureFlips: {
                module: FeatureFlipsModule,
            },
            'carbon-legacy': {
                module: carbon.CarbonLegacyModule,
                configurations: {
                    infrastructure: provideValue(carbonInfrastructure),
                },
            },
            permissions: {
                module: PermissionsModule,
            },
            passwordHealth: {
                module: PasswordHealthModule,
            },
            authenticationFlow: {
                module: AuthenticationFlowModule,
                configurations: {
                    authenticationFlowContextInfrastructure: provideValue(new WebExtensionAuthenticationFlowInfraContext()),
                },
            },
            deviceTransfer: { module: DeviceTransferModule },
            activityLogs: {
                module: ActivityLogsModule,
            },
            identityVerificationFlow: {
                module: IdentityVerificationFlowModule,
            },
            autofillSettings: {
                module: AutofillSettingsModule,
            },
            autofillData: {
                module: AutofillDataModule,
            },
            autofillTracking: {
                module: AutofillTrackingModule,
            },
            autofillSecurity: {
                module: AutofillSecurityModule,
            },
            autofillNotifications: {
                module: AutofillNotificationsModule,
            },
            linkedWebsites: {
                module: LinkedWebsitesModule,
            },
            enclaveSdkApi: {
                module: EnclaveSdkModule,
                configurations: {
                    enclaveApiSettings: provideValue(new EnclaveApiSettings(nitroCloudflareHeaders, SSO_ENCLAVE_API_ADDRESS, nitroEnvironment)),
                },
            },
            confidentialSSOApi: {
                module: ConfidentialSSOModule,
                configurations: {
                    enclaveLoginContextInfrastructure: provideValue(new WebExtensionEnclaveLoginContext()),
                },
            },
            scim: {
                module: ScimModule,
            },
            session: {
                module: SessionModule,
            },
            sync: {
                module: SyncModule,
            },
            vaultReport: {
                module: VaultReportModule,
            },
            vaultItemsCrud: {
                module: VaultItemsCrudModule,
            },
            vaultSearch: {
                module: VaultSearchModule,
            },
            vaultOrganization: {
                module: VaultOrganizationModule,
            },
            vaultNotifications: {
                module: VaultNotificationsModule,
            },
            passwordLimit: {
                module: PasswordLimitModule,
            },
            otp: {
                module: OtpModule,
            },
            masterPasswordSecurity: {
                module: MasterPasswordSecurityModule,
            },
            emailMonitoring: {
                module: EmailMonitoringModule,
            },
            breaches: {
                module: BreachesModule,
            },
            sharingCollections: {
                module: SharingCollectionsModule,
            },
            sharingItems: {
                module: SharingItemsModule,
            },
            sharingInvites: {
                module: SharingInvitesModule,
            },
            antiphishing: {
                module: AntiphishingModule,
            },
            overrides: {
                module: OverridesModule,
            },
            accountRecoveryKey: {
                module: AccountRecoveryKeyModule,
            },
            analytics: {
                module: AnalyticsModule,
            },
            teamMembers: {
                module: TeamMembersModule,
            },
            teamPlanDetails: {
                module: TeamPlanDetailsModule,
            },
            teamVat: {
                module: TeamVatModule,
            },
            teamGetStarted: {
                module: TeamGetStartedModule,
            },
            teamAdminNotifications: {
                module: TeamAdminNotificationsModule,
            },
            teamOffers: {
                module: TeamOffersModule,
            },
            notifications: {
                module: NotificationsModule,
            },
            changeMasterPassword: {
                module: ChangeMasterPasswordModule,
            },
            teamPasswordHealth: {
                module: TeamPasswordHealthModule,
            },
            userConsents: {
                module: UserConsentsModule,
            },
            vaultAccess: {
                module: VaultAccessModule,
            },
            deleteOrResetAccount: {
                module: DeleteOrResetAccountModule,
            },
            accountReferral: {
                module: AccountReferralModule,
            },
            userVerification: {
                module: UserVerificationModule,
            },
            getStarted: {
                module: GetStartedModule,
            },
            deviceRegistration: {
                module: DeviceRegistrationModule,
            },
            webServices: {
                module: WebServicesModule,
                configurations: {
                    serverApi: provideValue(new ServerApiConfig({
                        baseUrl: DASHLANE_API_ADDRESS,
                        appKeys: {
                            appAccessKey,
                            appSecretKey,
                        },
                        ...(cloudflareKeys
                            ? {
                                cloudflareKeys: {
                                    cloudflareAccessKey: cloudflareKeys.cloudflareAccess,
                                    cloudflareSecretKey: cloudflareKeys.cloudflareSecret,
                                },
                            }
                            : {}),
                    })),
                    serverApiInfrastructure: provideClass(AuthenticationWebServicesRepository),
                },
            },
            platformInfo: {
                module: PlatformInfoModule,
            },
        },
        otherModules: [
            {
                module: SoftwareLogsExceptionSinkModule,
                configurations: {
                    settings: provideValue(new SoftwareLogsSettings()),
                },
            },
            {
                module: HttpModule,
                configurations: {
                    infrastructure: provideValue(new HttpFetchBackend()),
                },
            },
            {
                module: RemoteFileUpdateModule,
                configurations: {
                    remoteFileUpdateInfrastructure: provideClass(RemoteFileUpdateService),
                    remoteFileUpdateDownloaderInfrastructure: provideClass(RemoteFileUpdateDownloaderService),
                    decipherInfrastructure: provideClass(RemoteFileUpdateDecipheringService),
                },
            },
            {
                module: CryptographyModule,
                configurations: {
                    infrastructure: provideValue(new CryptographyInfrastructure({
                        computeHash,
                        decryptAes256,
                        decryptRsaOaep,
                        deriveKeyArgon2d,
                        deriveKeyPbkdf2,
                        encryptAes256,
                        encryptRsaOaep,
                        generateKeyAes256,
                        generateKeyPairRsaOaep,
                        getRandomValues,
                        signHmacSha,
                        signRsassaPkcs1,
                        unsafeComputeMd5Hash,
                        verifyHmacSha,
                    })),
                },
            },
        ],
        storeInfrastructureFactory: new MemoryStoreInfrastructureFactory(),
        jsonFetcher: new JsonWebAppResourceFetcher(PUBLIC_PATH),
        cronSource: BROWSER_CRON_SOURCE,
        keyValueStorageInfrastructure: storageInfrastructure,
        defaultDeviceStorageEncryptionCodec: provideClass(ObfuscationKeyEncryptionCodec),
        defaultUserStorageEncryptionCodec: provideClass(LocalDataKeyEncryptionCodec),
        exceptionLogging: {
            sink: provideClass(SoftwareLogsExceptionSink),
        },
    });
    return {
        grapheneChannel,
        app,
        signalCarbonReady: ({ storeService }, apiEvents, leelooEvents) => {
            carbonInfrastructure.ready({
                apiEvents,
                state$: storeService.getState$(),
                leelooEvents,
                leelooEventsCommands: leelooEvents,
            });
        },
    };
}
