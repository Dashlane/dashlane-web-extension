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
  SessionServerApiCredentialsRepository,
  VaultAccessModule,
  WebExtensionSessionConfig,
} from "@dashlane/session-core";
import {
  ImportOrchestratorModule,
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
  KillSwitchModule,
  LoggingNodeWsAdaptersModule,
  NodeWsLogProcessor,
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
import {
  EnclaveApiSettings,
  EnclaveModule,
} from "@dashlane/framework-dashlane-application/enclave";
import {
  AccountCreationModule,
  AccountManagementModule,
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
  FileDownloadExtensionEmitterChannelFactory,
  FileUploadListenerBackgroundPage,
  FileUploadListenerServiceWorker,
  generateKeyAes256,
  generateKeyPairRsaOaep,
  getRandomValues,
  HttpFetchBackend,
  isMv3Environment,
  MV3ServiceWorkerExtender,
  signHmacSha,
  signRsassaPkcs1,
  unsafeComputeMd5Hash,
  verifyHmacSha,
  verifyRsassaPkcs1,
} from "@dashlane/framework-infra";
import { JsonExtensionResourceFetcher } from "@dashlane/framework-infra/assets";
import {
  ExtensionLocalStorageInfrastructure,
  ExtensionManagedStorageInfrastructure,
} from "@dashlane/framework-infra/storage";
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
  CloudPasskeyModule,
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
  EnclaveCloudflareHeaders,
  isEnclaveEnvironment,
  ScimModule,
} from "@dashlane/sso-scim-core";
import { TeamEnclaveModule } from "@dashlane/enclave-core";
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
import { logger } from "../../logs/app-logger";
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
  logger.debug(`Starting application modules`);
  const carbonInfrastructure = new CarbonLegacyInfrastructure();
  const isMv3 = isMv3Environment();
  const app = await startApplicationNode({
    externalLoggers: [logger],
    appDefinition,
    channels: {},
    channelsListener: clientListener,
    currentNode: "background",
    diagnosticsLogProcessor: provideClass(NodeWsLogProcessor),
    exceptionLogging: {
      sink: provideClass(SoftwareLogsExceptionSink),
      uncaughtErrorSource: provideValue(uncaughtErrorSource),
    },
    implementations: {
      cloudPasskey: CloudPasskeyModule,
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
      accountManagement: AccountManagementModule,
      loggedOutMonitoring: LoggedOutMonitoringModule,
      identityVerificationFlow: IdentityVerificationFlowModule,
      autofillSettings: AutofillSettingsModule,
      autofillData: AutofillDataModule,
      autofillTracking: AutofillTrackingModule,
      autofillSecurity: AutofillSecurityModule,
      autofillNotifications: AutofillNotificationsModule,
      linkedWebsites: LinkedWebsitesModule,
      teamEnclave: TeamEnclaveModule,
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
      importOrchestrator: ImportOrchestratorModule,
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
        provideClass(SessionServerApiCredentialsRepository)
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
      killSwitch: KillSwitchModule,
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
      LoggingNodeWsAdaptersModule,
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
      EnclaveModule.configure(
        provideValue(
          new EnclaveApiSettings(
            {
              appAccessKey: webservicesApiKeys.appAccess,
              appSecretKey: webservicesApiKeys.appSecret,
            },
            nitroCloudflareHeaders,
            SSO_ENCLAVE_API_ADDRESS,
            DASHLANE_API_ADDRESS,
            nitroEnvironment
          )
        )
      ),
    ],
    storeInfrastructureFactory: storeInfra,
    jsonFetcher: new JsonExtensionResourceFetcher(),
    cronSource: BROWSER_CRON_SOURCE,
    keyValueStorageInfrastructure: new ExtensionLocalStorageInfrastructure(),
    managedStorageInfrastructure: new ExtensionManagedStorageInfrastructure(
      logger
    ),
    defaultDeviceStorageEncryptionCodec: provideClass(
      ObfuscationKeyEncryptionCodec
    ),
    defaultUserStorageEncryptionCodec: provideClass(
      LocalDataKeyEncryptionCodec
    ),
  });
  return {
    app,
    signalCarbonReady: (coreServices, apiEvents, leelooEvents) => {
      carbonInfrastructure.ready({
        apiEvents,
        leelooEvents,
        leelooEventsCommands: leelooEvents,
        coreServices,
      });
    },
    signalCarbonInitFailed: (error) => {
      carbonInfrastructure.initFailed(error);
    },
  };
}
