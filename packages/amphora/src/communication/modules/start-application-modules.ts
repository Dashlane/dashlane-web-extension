import { appDefinition } from "@dashlane/application-extension-definition";
import {
  CarbonLegacyInfrastructure,
  CarbonLegacyModule,
} from "@dashlane/carbon";
import { SyncModule } from "@dashlane/sync-core";
import {
  ChangeMasterPasswordModule,
  LocalDataKeyEncryptionCodec,
  SessionModule,
  VaultAccessModule,
  WebExtensionSessionConfig,
} from "@dashlane/session-core";
import {
  PasswordLimitModule,
  SecureFilesModule,
  VaultItemsCrudModule,
  VaultNotificationsModule,
  VaultOrganizationModule,
  VaultSearchModule,
} from "@dashlane/vault-core";
import {
  FileDownloadModule,
  FileUploadModule,
  HttpModule,
  MV3ExtensionResilienceModule,
  provideClass,
  provideValue,
  startApplicationNode,
  StoreInfrastructureFactory,
  TaskTrackingModule,
} from "@dashlane/framework-application";
import {
  AnalyticsModule,
  CryptographyInfrastructure,
  CryptographyModule,
  FeatureFlipsModule,
  IconsModule,
  ObfuscationKeyEncryptionCodec,
  PlatformInfoModule,
  RemoteFileUpdateDecipheringService,
  RemoteFileUpdateDownloaderService,
  RemoteFileUpdateModule,
  RemoteFileUpdateService,
  SoftwareLogsExceptionSink,
  SoftwareLogsExceptionSinkModule,
  WebServicesModule,
} from "@dashlane/framework-dashlane-application";
import { EnclaveModule } from "@dashlane/framework-dashlane-application/enclave";
import {
  AccountCreationModule,
  AccountReferralModule,
  DeleteOrResetAccountModule,
  SubscriptionCodeModule,
} from "@dashlane/account-core";
import {
  BrowserPortListener,
  computeHash,
  decryptAes256,
  decryptRsaOaep,
  deriveKeyArgon2d,
  deriveKeyPbkdf2,
  encryptAes256,
  encryptRsaOaep,
  ExtensionCronSource,
  ExtensionLocalStorageInfrastructure,
  ExtensionManagedStorageInfrastructure,
  FileDownloadExtensionEmitterChannelFactory,
  FileUploadListenerBackgroundPage,
  FileUploadListenerServiceWorker,
  generateKeyAes256,
  generateKeyPairRsaOaep,
  getRandomValues,
  HttpFetchBackend,
  isMv3Environment,
  JsonExtensionResourceFetcher,
  MV3ServiceWorkerExtender,
  signHmacSha,
  signRsassaPkcs1,
  unsafeComputeMd5Hash,
  verifyHmacSha,
  verifyRsassaPkcs1,
} from "@dashlane/framework-infra";
import { makeWebExtensionBackgroundStoreInfrastructure } from "@dashlane/framework-infra/state";
import { CarbonReadyHandler } from "./start-application-modules-types";
import {
  AntiphishingModule,
  BreachesModule,
  EmailMonitoringModule,
  OtpModule,
  PasswordHealthModule,
  VaultReportModule,
} from "@dashlane/password-security-core";
import { AccountRecoveryKeyModule } from "@dashlane/account-recovery-core";
import {
  AuthenticationFlowModule,
  AuthenticationModule,
  AuthenticationWebServicesRepository,
  DeviceRegistrationModule,
  DeviceTransferModule,
  IdentityVerificationFlowModule,
  PinCodeModule,
  UserVerificationModule,
} from "@dashlane/authentication-core";
import { WebExtensionAuthenticationFlowInfraContext } from "@dashlane/authentication-infra";
import {
  AutofillDataModule,
  AutofillNotificationsModule,
  AutofillSecurityModule,
  AutofillSettingsModule,
  AutofillTrackingModule,
  LinkedWebsitesModule,
} from "@dashlane/autofill-core";
import { OverridesModule } from "@dashlane/analysis-core";
import {
  ActivityLogsModule,
  LoggedOutMonitoringModule,
  SiemModule,
} from "@dashlane/risk-monitoring-core";
import { NudgesModule } from "@dashlane/risk-mitigation-core";
import { PermissionsModule } from "@dashlane/access-rights-core";
import {
  ConfidentialSSOModule,
  EnclaveApiSettings,
  EnclaveCloudflareHeaders,
  EnclaveProxyModule,
  EnclaveSdkModule,
  isEnclaveEnvironment,
  ScimModule,
} from "@dashlane/sso-scim-core";
import { WebExtensionEnclaveLoginContext } from "@dashlane/sso-scim-infra";
import { webservicesApiKeys } from "../server-sdk-api-keys";
import {
  SharingCollectionsModule,
  SharingInvitesModule,
  SharingItemsModule,
  SharingRecipientsModule,
  SharingSyncModule,
} from "@dashlane/sharing-core";
import {
  InviteLinkModule,
  TeamAdminNotificationsModule,
  TeamMembersModule,
  TeamPasswordHealthModule,
  TeamPlanDetailsModule,
  TeamPlanUpdateModule,
  TeamVatModule,
} from "@dashlane/team-admin-core";
import { NotificationsModule } from "@dashlane/monetization-notifications-core";
import { DeviceManagementModule } from "@dashlane/device-core";
import { MasterPasswordSecurityModule } from "@dashlane/master-password-core";
import { VpnNotificationsModule } from "@dashlane/vpn-core";
import { UserConsentsModule } from "@dashlane/privacy-core";
import {
  GetStartedModule,
  ProfileAdminModule,
} from "@dashlane/onboarding-core";
import { B2CPlansModule } from "@dashlane/plans-core";
import { getCloudflareKeys } from "../carbon/server-api-keys";
import { ExtensionUncaughtErrorSource } from "../../logs/exceptions/extension-uncaught-error-source";
const uncaughtErrorSource = new ExtensionUncaughtErrorSource(self);
const BROWSER_CRON_SOURCE = new ExtensionCronSource();
const clientListener = new BrowserPortListener("graphene-background-port");
const nitroCloudflareHeaders: EnclaveCloudflareHeaders = {
  accessKey: USE_CLOUDFLARE_HEADERS ? CLOUDFLARE_NITRO_ACCESS_KEY : "",
  secretKey: USE_CLOUDFLARE_HEADERS ? CLOUDFLARE_NITRO_SECRET_KEY : "",
};
const nitroEnvironment = isEnclaveEnvironment(NITRO_ENCLAVE_ENVIRONMENT)
  ? NITRO_ENCLAVE_ENVIRONMENT
  : "prod";
const cloudflareKeys = getCloudflareKeys();
const storeInfra: StoreInfrastructureFactory =
  makeWebExtensionBackgroundStoreInfrastructure();
export async function startApplicationModules(): Promise<CarbonReadyHandler> {
  const carbonInfrastructure = new CarbonLegacyInfrastructure();
  const isMv3 = isMv3Environment();
  const app = await startApplicationNode({
    appDefinition,
    channels: {},
    channelsListener: clientListener,
    currentNode: "background",
    exceptionLogging: {
      sink: provideClass(SoftwareLogsExceptionSink),
      uncaughtErrorSource: provideValue(uncaughtErrorSource),
    },
    implementations: {
      accountCreation: AccountCreationModule,
      deleteOrResetAccount: DeleteOrResetAccountModule,
      subscriptionCode: SubscriptionCodeModule,
      accountReferral: AccountReferralModule,
      analytics: AnalyticsModule,
      taskTracking: TaskTrackingModule,
      featureFlips: FeatureFlipsModule,
      "carbon-legacy": {
        module: CarbonLegacyModule,
        configurations: {
          infrastructure: provideValue(carbonInfrastructure),
        },
      },
      permissions: PermissionsModule,
      passwordHealth: PasswordHealthModule,
      authenticationFlow: {
        module: AuthenticationFlowModule,
        configurations: {
          authenticationFlowContextInfrastructure: provideValue(
            new WebExtensionAuthenticationFlowInfraContext()
          ),
        },
      },
      deviceTransfer: DeviceTransferModule,
      activityLogs: ActivityLogsModule,
      loggedOutMonitoring: LoggedOutMonitoringModule,
      identityVerificationFlow: IdentityVerificationFlowModule,
      autofillSettings: AutofillSettingsModule,
      autofillData: AutofillDataModule,
      autofillTracking: AutofillTrackingModule,
      autofillSecurity: AutofillSecurityModule,
      autofillNotifications: AutofillNotificationsModule,
      linkedWebsites: LinkedWebsitesModule,
      enclaveSdkApi: {
        module: EnclaveSdkModule,
        configurations: {
          enclaveApiSettings: provideValue(
            new EnclaveApiSettings(
              nitroCloudflareHeaders,
              SSO_ENCLAVE_API_ADDRESS,
              nitroEnvironment
            )
          ),
        },
      },
      confidentialSSOApi: {
        module: ConfidentialSSOModule,
        configurations: {
          enclaveLoginContextInfrastructure: provideValue(
            new WebExtensionEnclaveLoginContext()
          ),
        },
      },
      scim: ScimModule,
      nudges: NudgesModule,
      session: {
        module: SessionModule,
        configurations: {
          session: provideClass(WebExtensionSessionConfig),
        },
      },
      sync: SyncModule,
      vaultReport: VaultReportModule,
      vaultItemsCrud: VaultItemsCrudModule,
      vaultSearch: VaultSearchModule,
      vaultNotifications: VaultNotificationsModule,
      vaultOrganization: VaultOrganizationModule,
      secureFiles: SecureFilesModule,
      passwordLimit: PasswordLimitModule,
      pinCode: PinCodeModule,
      otp: OtpModule,
      masterPasswordSecurity: MasterPasswordSecurityModule,
      emailMonitoring: EmailMonitoringModule,
      breaches: BreachesModule,
      sharingCollections: SharingCollectionsModule,
      sharingItems: SharingItemsModule,
      sharingInvites: SharingInvitesModule,
      sharingRecipients: SharingRecipientsModule,
      sharingSync: SharingSyncModule,
      antiphishing: AntiphishingModule,
      overrides: OverridesModule,
      accountRecoveryKey: AccountRecoveryKeyModule,
      teamMembers: TeamMembersModule,
      teamVat: TeamVatModule,
      teamPlanDetails: TeamPlanDetailsModule,
      teamPlanUpdate: TeamPlanUpdateModule,
      inviteLink: InviteLinkModule,
      teamAdminNotifications: TeamAdminNotificationsModule,
      notifications: NotificationsModule,
      changeMasterPassword: ChangeMasterPasswordModule,
      teamPasswordHealth: TeamPasswordHealthModule,
      userConsents: UserConsentsModule,
      vaultAccess: VaultAccessModule,
      vpnNotifications: VpnNotificationsModule,
      userVerification: UserVerificationModule,
      getStarted: GetStartedModule,
      profileAdmin: ProfileAdminModule,
      deviceRegistration: DeviceRegistrationModule,
      b2cPlansApi: B2CPlansModule,
      webServices: WebServicesModule.configure(
        {
          baseUrl: DASHLANE_API_ADDRESS,
          appKeys: {
            appAccessKey: webservicesApiKeys.appAccess,
            appSecretKey: webservicesApiKeys.appSecret,
          },
          ...(cloudflareKeys
            ? {
                cloudflareKeys: {
                  cloudflareAccessKey: cloudflareKeys.cloudflareAccess,
                  cloudflareSecretKey: cloudflareKeys.cloudflareSecret,
                },
              }
            : {}),
        },
        provideClass(AuthenticationWebServicesRepository)
      ),
      platformInfo: PlatformInfoModule,
      authentication: AuthenticationModule,
      siem: SiemModule,
      deviceManagement: DeviceManagementModule,
      icons: IconsModule,
      "file-download": {
        module: FileDownloadModule,
        configurations: {
          fileDownloadEmitterChannel: provideValue(
            new FileDownloadExtensionEmitterChannelFactory().makeFileDownloadEmitterChannel()
          ),
        },
      },
      "file-upload": {
        module: FileUploadModule,
        configurations: {
          fileUploadListener: isMv3
            ? provideClass(FileUploadListenerServiceWorker.initializeListener())
            : provideClass(FileUploadListenerBackgroundPage),
        },
      },
    },
    otherModules: [
      ...(isMv3
        ? [
            MV3ExtensionResilienceModule.configure(
              provideClass(MV3ServiceWorkerExtender)
            ),
          ]
        : []),
      SoftwareLogsExceptionSinkModule.configure({}),
      HttpModule.configure(provideValue(new HttpFetchBackend())),
      RemoteFileUpdateModule.configure(
        provideClass(RemoteFileUpdateService),
        provideClass(RemoteFileUpdateDownloaderService),
        provideClass(RemoteFileUpdateDecipheringService)
      ),
      CryptographyModule.configure(
        provideValue(
          new CryptographyInfrastructure({
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
            verifyRsassaPkcs1,
          })
        )
      ),
      EnclaveProxyModule.configure(
        {
          appAccessKey: webservicesApiKeys.appAccess,
          appSecretKey: webservicesApiKeys.appSecret,
        },
        nitroCloudflareHeaders,
        nitroEnvironment
      ),
      EnclaveModule.configure(
        provideValue(
          new EnclaveApiSettings(
            nitroCloudflareHeaders,
            SSO_ENCLAVE_API_ADDRESS,
            nitroEnvironment
          )
        )
      ),
    ],
    storeInfrastructureFactory: storeInfra,
    jsonFetcher: new JsonExtensionResourceFetcher(),
    cronSource: BROWSER_CRON_SOURCE,
    keyValueStorageInfrastructure: new ExtensionLocalStorageInfrastructure(),
    managedStorageInfrastructure: new ExtensionManagedStorageInfrastructure(),
    defaultDeviceStorageEncryptionCodec: provideClass(
      ObfuscationKeyEncryptionCodec
    ),
    defaultUserStorageEncryptionCodec: provideClass(
      LocalDataKeyEncryptionCodec
    ),
  });
  return {
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
