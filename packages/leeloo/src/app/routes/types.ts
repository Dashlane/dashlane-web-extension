import type { LocationDescriptor } from "history";
import { VaultItemType } from "@dashlane/vault-contracts";
import { IdVaultItemType } from "../../webapp/ids/types";
import { PricingMode } from "../../libs/premium-status.lib";
import { RoutingSchemeOptions } from "./constants";
import { SettingTab } from "../../webapp/settings/types";
export interface RoutingConfig {
  getRoutes: (namedRoutes: NamedRoutes) => JSX.Element;
  scheme: RoutingSchemeOptions;
}
export interface AddWebsiteRouteState {
  website: string;
  previouslyGeneratedPassword: string;
}
export interface NamedRoutes {
  reactivatePinAndArk: string;
  changeLoginEmailAccountSettings: string;
  teamRoutesBasePath: string;
  teamMembersRoutePath: string;
  teamSettingsRoutePath: string;
  teamSettingsSso: string;
  teamSettingsSsoConfidential: string;
  teamSettingsSsoSelfHosted: string;
  teamAccountRoutePath: string;
  teamAccountChangePlanRoutePath: string;
  teamAccountCheckoutRoutePath: string;
  teamActivityRoutePath: string;
  teamDashboardRoutePath: string;
  teamGroupsRoutePath: string;
  twoFactorAuthenticationEnforce: string;
  teamDarkWebInsightsRoutePath: string;
  teamIntegrationsRoutePath: string;
  teamGroupRoutePath: (teamUuid: string) => string;
  familyDashboard: string;
  clientRoutesBasePath: string;
  userDeviceRegistration: string;
  userCreateMasterPassword: string;
  userSendRequest: string;
  userPendingRequest: string;
  userAddApplicationCredential: string;
  userAddDatabaseCredential: string;
  userAddWebsiteCredential: string;
  userAddWebsiteCredentialWithPrefilledParameters: (
    routeState: AddWebsiteRouteState
  ) => LocationDescriptor;
  userCollection: (collectionId: string) => string;
  userCollections: string;
  userCredentials: string;
  userPasskeys: string;
  userPasskey: (passkeyUuid: string) => string;
  userCredentialsAccountSettings: string;
  userCredential: (credentialUuid: string) => string;
  userVaultItem: (
    vaultItemUuid: string,
    vaultItemType: VaultItemType,
    pathname: string
  ) => string;
  userPasswordHistory: string;
  userPasswordHistoryFilteredByCredential: (credentialUuid: string) => string;
  userAddBlankNote: string;
  userSecureNotes: string;
  userSecureNote: (secureNoteUuid: string) => string;
  userAddBlankSecret: string;
  userSecrets: string;
  userSecret: (secretsUuid: string) => string;
  userAddPersonalInfoCompany: string;
  userAddPersonalInfoEmail: string;
  userAddPersonalInfoAddress: string;
  userAddPersonalInfoIdentity: string;
  userAddPersonalInfoPhone: string;
  userAddPersonalInfoWebsite: string;
  userPersonalInfo: string;
  userPersonalInfoAddress: (uuid: string) => string;
  userPersonalInfoCompany: (uuid: string) => string;
  userPersonalInfoEmail: (uuid: string) => string;
  userPersonalInfoIdentity: (uuid: string) => string;
  userPersonalInfoPhone: (uuid: string) => string;
  userPersonalInfoWebsite: (uuid: string) => string;
  userPayments: string;
  userOnboarding: string;
  userProfileAdmin: string;
  userReferral: string;
  userChromeWelcome: string;
  userPasswordSites: string;
  userAddMobile: string;
  userTryAutofill: string;
  userAddBankAccount: string;
  userAddPaymentCard: string;
  userBankAccount: (paymentUuid: string) => string;
  userPaymentCard: (paymentUuid: string) => string;
  userIdsDocuments: string;
  userAddIdDocument: (type: IdVaultItemType) => string;
  userEditIdDocument: (type: IdVaultItemType, id: string) => string;
  userSharingCenter: string;
  vpn: string;
  importData: string;
  deviceTransfer: string;
  userSharingGroupInfo: (groupId: string) => string;
  userSharingUserInfo: (userId: string) => string;
  userEmergency: string;
  userSettings: string;
  userSettingsTab: (tab: SettingTab) => string;
  userUpsell: string;
  userGoAdvanced: (subCode?: string, pricing?: PricingMode) => string;
  userGoEssentials: (subCode?: string, pricing?: PricingMode) => string;
  userGoPlans: string;
  userGoFamily: (subCode?: string, pricing?: PricingMode) => string;
  userGoPremium: (subCode?: string, pricing?: PricingMode) => string;
  userPasswordHealth: string;
  userSubscriptionManagement: string;
  darkWebMonitoring: string;
  antiPhishing: string;
  premiumPlus: string;
  dashlaneLabs: string;
  recover2faCodes: (login?: string) => string;
  loggedOutMonitoring: string;
  changeLoginEmail: string;
}
