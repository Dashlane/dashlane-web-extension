import {
  Notifications,
  PersonalSettings,
  SSOSettingsData,
  SyncState,
} from "@dashlane/communication";
import { Account } from "Session/Store/account";
import { AccountCreation } from "Session/Store/account-creation";
import { AuthTicketInfo } from "Session/Store/authTicket/types";
import { ChangeMPData } from "Session/Store/changeMasterPassword/types";
import { ContactInfo } from "Session/Store/account-contact-info/types";
import { DirectorySync } from "Session/Store/directorySync";
import { IconsCache } from "Session/Store/Icons";
import { LocalSettings } from "Session/Store/localSettings/types";
import { PersonalData } from "Session/Store/personalData/types";
import { BreachRefreshMetaData } from "Session/Store/breachRefreshMetadata/types";
import { SdkAuthentication } from "Session/Store/sdk/types";
import { Session } from "Session/Store/session";
import { SharingData } from "Session/Store/sharingData/types";
import { SharingSyncState } from "Session/Store/sharingSync";
import { SpaceData } from "Session/Store/spaceData";
import { TeamAdminData } from "Session/Store/teamAdminData";
import { UserABTests } from "Session/Store/abTests/types";
import { PaymentsState } from "Session/Store/payments/types";
import { CredentialOTPs } from "Session/Store/credentialOTP";
import { UserActivityState } from "Session/Store/userActivity/types";
import { VaultReportState } from "Session/Store/vaultReport/types";
import { RecoverySessionData } from "Session/Store/recovery/types";
import { LoginDeviceLimitState } from "Login/DeviceLimit/Store/loginDeviceLimitFlow/types";
import { TwoFactorAuthenticationEnableFlowStoreState } from "Authentication/TwoFactorAuthentication/Flow/Enable/Store/types";
import { TwoFactorAuthenticationDisableFlowStoreState } from "Authentication/TwoFactorAuthentication/Flow/Disable/Store/types";
import { VpnState } from "VPN/vpnstate";
import { ImportPersonalDataStoreData } from "DataManagement/Import/state/types";
import { SecureFileStorageState } from "Session/Store/secureFileStorage";
import { CredentialsDedupViewState } from "./credentialsDedupView/types";
export interface UserSessionState {
  abTests: UserABTests;
  account: Account;
  accountContactInfo: ContactInfo;
  accountCreation: AccountCreation;
  authTicketInfo: AuthTicketInfo;
  credentialOTPs: CredentialOTPs;
  directorySync: DirectorySync;
  iconsCache: IconsCache;
  localSettings: LocalSettings;
  loginDeviceLimitFlow: LoginDeviceLimitState;
  twoFactorAuthenticationEnableFlow: TwoFactorAuthenticationEnableFlowStoreState;
  twoFactorAuthenticationDisableFlow: TwoFactorAuthenticationDisableFlowStoreState;
  notificationsStatus: Notifications;
  paymentsState: PaymentsState;
  personalData: PersonalData;
  personalSettings: PersonalSettings;
  recoveryData: RecoverySessionData;
  sdkAuthentication: SdkAuthentication;
  session: Session;
  sharingData: SharingData;
  sharingSync: SharingSyncState;
  spaceData: SpaceData;
  ssoSettings: SSOSettingsData;
  changeMPData: ChangeMPData;
  sync: SyncState;
  teamAdminData: TeamAdminData;
  userActivity: UserActivityState;
  vaultReport: VaultReportState;
  vpnData: VpnState;
  importPersonalData: ImportPersonalDataStoreData;
  secureFileStorageState: SecureFileStorageState;
  credentialsDedupViewState: CredentialsDedupViewState;
  breachRefreshMetaData: BreachRefreshMetaData;
}
