import {
  BrowserCronSource,
  computeHash,
  decryptAes256,
  decryptRsaOaep,
  DedicatedWorkerGlobalScopeFileDownloadEmitterChannel,
  deriveKeyArgon2d,
  deriveKeyPbkdf2,
  encryptAes256,
  encryptRsaOaep,
  FileUploadListenerDedicatedWorker,
  generateKeyAes256,
  generateKeyPairRsaOaep,
  getRandomValues,
  HttpFetchBackend,
  signHmacSha,
  signRsassaPkcs1,
  unsafeComputeMd5Hash,
  verifyHmacSha,
  verifyRsassaPkcs1,
} from "@dashlane/framework-infra";
import { JsonWebAppResourceFetcher } from "@dashlane/framework-infra/assets";
import { makeStorageInfrastructure } from "@dashlane/framework-infra/storage";
import {
  AcknowledgedChannel,
  createSingleChannelListener,
  FileDownloadModule,
  FileUploadModule,
  HttpModule,
  LowLevelChannel,
  MemoryStoreInfrastructureFactory,
  provideClass,
  provideValue,
  startApplicationNode,
  TaskTrackingModule,
} from "@dashlane/framework-application";
import {
  ChangeMasterPasswordModule,
  LocalDataKeyEncryptionCodec,
  SessionModule,
  SessionServerApiCredentialsRepository,
  VaultAccessModule,
} from "@dashlane/session-core";
import { appDefinition } from "@dashlane/application-extension-definition";
import {
  ConfidentialSSOModule,
  EnclaveCloudflareHeaders,
  isEnclaveEnvironment,
  ScimModule,
} from "@dashlane/sso-scim-core";
import { TeamEnclaveModule } from "@dashlane/enclave-core";
import { WebExtensionEnclaveLoginContext } from "@dashlane/sso-scim-infra";
import { CarbonReadyHandler } from "./start-application-modules.types";
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
import { DeviceManagementModule } from "@dashlane/device-core";
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
  AnalyticsModule,
  CryptographyInfrastructure,
  CryptographyModule,
  FeatureFlipsModule,
  IconsModule,
  KillSwitchModule,
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
  AntiphishingModule,
  BreachesModule,
  EmailMonitoringModule,
  OtpModule,
  PasswordHealthModule,
  VaultReportModule,
} from "@dashlane/password-security-core";
import { PermissionsModule } from "@dashlane/access-rights-core";
import { SyncModule } from "@dashlane/sync-core";
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
  ActivityLogsModule,
  LoggedOutMonitoringModule,
  SiemModule,
} from "@dashlane/risk-monitoring-core";
import { NudgesModule } from "@dashlane/risk-mitigation-core";
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
import {
  AccountCreationModule,
  AccountManagementModule,
  AccountReferralModule,
  DeleteOrResetAccountModule,
  SubscriptionCodeModule,
} from "@dashlane/account-core";
import { NotificationsModule } from "@dashlane/monetization-notifications-core";
import { MasterPasswordSecurityModule } from "@dashlane/master-password-core";
import { VpnNotificationsModule } from "@dashlane/vpn-core";
import { UserConsentsModule } from "@dashlane/privacy-core";
import {
  GetStartedModule,
  ProfileAdminModule,
} from "@dashlane/onboarding-core";
import { B2CPlansModule } from "@dashlane/plans-core";
import { getCloudflareKeys } from "../common/cloudflare-keys";
import { appAccessKey, appSecretKey } from "../common/app-keys";
import { WebAppSessionConfig } from "./web-app-session-config";
const BROWSER_CRON_SOURCE = new BrowserCronSource();
const nitroCloudflareHeaders: EnclaveCloudflareHeaders = {
  accessKey: USE_CLOUDFLARE_HEADERS ? CLOUDFLARE_NITRO_ACCESS_KEY : "",
  secretKey: USE_CLOUDFLARE_HEADERS ? CLOUDFLARE_NITRO_SECRET_KEY : "",
};
const nitroEnvironment = isEnclaveEnvironment(NITRO_ENCLAVE_ENVIRONMENT)
  ? NITRO_ENCLAVE_ENVIRONMENT
  : "prod";
const cloudflareKeys = getCloudflareKeys();
export async function startApplicationModules(
  channelToPage: LowLevelChannel
): Promise<CarbonReadyHandler> {
  const carbon = await import("@dashlane/carbon");
  const storageInfrastructure = await makeStorageInfrastructure();
  const carbonInfrastructure = new carbon.CarbonLegacyInfrastructure();
  const app = await startApplicationNode({
    appDefinition,
    channels: {},
    channelsListener: createSingleChannelListener(
      new AcknowledgedChannel(channelToPage)
    ),
    currentNode: "background",
    implementations: {
      cloudPasskey: CloudPasskeyModule,
      taskTracking: TaskTrackingModule,
      featureFlips: FeatureFlipsModule,
      "carbon-legacy": {
        module: carbon.CarbonLegacyModule,
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
      b2cPlansApi: B2CPlansModule,
      deviceTransfer: DeviceTransferModule,
      activityLogs: ActivityLogsModule,
      accountManagement: AccountManagementModule,
      deviceManagement: DeviceManagementModule,
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
      siem: SiemModule,
      scim: ScimModule,
      nudges: NudgesModule,
      session: {
        module: SessionModule,
        configurations: {
          session: provideClass(WebAppSessionConfig),
        },
      },
      sync: SyncModule,
      importOrchestrator: ImportOrchestratorModule,
      vaultReport: VaultReportModule,
      vaultItemsCrud: VaultItemsCrudModule,
      vaultSearch: VaultSearchModule,
      vaultOrganization: VaultOrganizationModule,
      vaultNotifications: VaultNotificationsModule,
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
      analytics: AnalyticsModule,
      teamMembers: TeamMembersModule,
      teamPlanDetails: TeamPlanDetailsModule,
      teamPlanUpdate: TeamPlanUpdateModule,
      teamVat: TeamVatModule,
      inviteLink: InviteLinkModule,
      teamAdminNotifications: TeamAdminNotificationsModule,
      notifications: NotificationsModule,
      changeMasterPassword: ChangeMasterPasswordModule,
      teamPasswordHealth: TeamPasswordHealthModule,
      userConsents: UserConsentsModule,
      vaultAccess: VaultAccessModule,
      vpnNotifications: VpnNotificationsModule,
      accountCreation: AccountCreationModule,
      deleteOrResetAccount: DeleteOrResetAccountModule,
      subscriptionCode: SubscriptionCodeModule,
      accountReferral: AccountReferralModule,
      userVerification: UserVerificationModule,
      getStarted: GetStartedModule,
      profileAdmin: ProfileAdminModule,
      deviceRegistration: DeviceRegistrationModule,
      webServices: WebServicesModule.configure(
        {
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
        },
        provideClass(SessionServerApiCredentialsRepository)
      ),
      platformInfo: PlatformInfoModule,
      authentication: AuthenticationModule,
      icons: IconsModule,
      "file-download": {
        module: FileDownloadModule,
        configurations: {
          fileDownloadEmitterChannel: provideValue(
            new DedicatedWorkerGlobalScopeFileDownloadEmitterChannel()
          ),
        },
      },
      "file-upload": {
        module: FileUploadModule,
        configurations: {
          fileUploadListener: provideClass(FileUploadListenerDedicatedWorker),
        },
      },
      killSwitch: KillSwitchModule,
    },
    otherModules: [
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
      EnclaveModule.configure(
        provideValue(
          new EnclaveApiSettings(
            { appAccessKey, appSecretKey },
            nitroCloudflareHeaders,
            SSO_ENCLAVE_API_ADDRESS,
            DASHLANE_API_ADDRESS,
            nitroEnvironment
          )
        )
      ),
    ],
    storeInfrastructureFactory: new MemoryStoreInfrastructureFactory(),
    jsonFetcher: new JsonWebAppResourceFetcher(PUBLIC_PATH),
    cronSource: BROWSER_CRON_SOURCE,
    keyValueStorageInfrastructure: storageInfrastructure,
    defaultDeviceStorageEncryptionCodec: provideClass(
      ObfuscationKeyEncryptionCodec
    ),
    defaultUserStorageEncryptionCodec: provideClass(
      LocalDataKeyEncryptionCodec
    ),
    exceptionLogging: {
      sink: provideClass(SoftwareLogsExceptionSink),
    },
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
  };
}
