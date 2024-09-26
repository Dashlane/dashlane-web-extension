import { UserGroupDownload } from "@dashlane/sharing/types/serverResponse";
import { MasterPasswordResetDemand } from "../MasterPasswordReset";
import { PremiumStatusBillingInfo, PremiumStatusSpace } from "..";
import {
  PremiumStatusCode,
  FamilyMembership,
  PreviousPremiumPlan,
  SpaceStatus,
} from "../OpenSession";
import { ValuesType } from "@dashlane/framework-types";
export interface AdminDataNotifications {
  accountRecoveryRequests: MasterPasswordResetDemand[];
}
export interface AdminData {
  notifications?: AdminDataNotifications;
  teamId: string;
  userGroups?: UserGroupDownload[];
}
export interface TeamAdminDataUpdatedEvent {
  teams: {
    [teamId: string]: AdminData;
  };
}
export type TeamMemberStatus =
  | SpaceStatus.Accepted
  | SpaceStatus.Pending
  | SpaceStatus.Proposed
  | SpaceStatus.Removed
  | SpaceStatus.Revoked
  | SpaceStatus.Unproposed;
export const TeamMemberSSOStatuses = Object.freeze({
  Activated: "activated",
  PendingActivation: "pending_activation",
  PendingDeactivation: "pending_deactivation",
});
export type TeamMemberSSOStatus = ValuesType<typeof TeamMemberSSOStatuses>;
export interface TeamMemberInfo {
  compromisedPasswords: number;
  isBillingAdmin: boolean;
  isTeamCaptain: boolean;
  isGroupManager: boolean;
  lastUpdateDateUnix?: number | null;
  login: string;
  name: string;
  nbrPasswords: number;
  reused?: number | null;
  reusedDistinct?: number | null;
  revokedDateUnix?: number | null;
  securityIndex?: number | null;
  status: string;
  weakPasswords?: number | null;
  hasPublicKey: boolean;
  safePasswords?: number | null;
  twoFAInformation: {
    type?: "sso" | "email_token" | "totp_device_registration" | "totp_login";
    phone?: string | null;
    lastUpdateDateUnix?: number | null;
  };
  accountRecoveryKeyStatus: "enabled" | "disabled";
  ssoStatus?: TeamMemberSSOStatus | null;
  recoveryCreationDateUnix?: number | null;
}
export interface GetTeamMembersRequest {
  teamId: number;
}
export type GetTeamMembersSuccess = {
  success: true;
  members: TeamMemberInfo[];
};
export type GetTeamMembersFailure = {
  success: false;
  error: Error;
};
export type GetTeamMembersResult =
  | GetTeamMembersSuccess
  | GetTeamMembersFailure;
export interface AddTeamAdminRequest {
  teamId: number;
  memberLogin: string;
}
export interface AddTeamAdminResult {
  error?: Error;
}
export interface RemoveTeamAdminRequest {
  teamId: number;
  memberLogin: string;
}
export interface RemoveTeamAdminResult {
  error?: Error;
}
export type ActiveDirectorySyncStatus = {
  failedSyncCount: number;
  lastFailedSync: {
    durationMs: number;
    error: string;
    eventDateUnix: number;
    id: number;
    teamId: number;
  } | null;
  lastSuccessfulSync: {
    durationMs: number;
    eventDateUnix: number;
    id: number;
    proposedCount: number;
    removedCount: number;
    reproposedCount: number;
    teamId: number;
    unproposedCount: number;
    validCount: number;
  } | null;
};
export type TeamSettings = {
  activeDirectorySyncStatus?: ActiveDirectorySyncStatus;
  activeDirectorySyncType?: string | null;
  activeDirectoryToken?: string;
  duo?: boolean;
  duoApiHostname?: string;
  duoIntegrationKey?: string;
  duoSecretKey?: string;
  recoveryEnabled?: boolean;
  ssoEnabled?: boolean;
  ssoServiceProviderUrl?: string | null;
  ssoIdpMetadata?: string | null;
  ssoIdpEntrypoint?: string | null;
  cryptoForcedPayload?: string;
  uuid?: string | null;
};
export interface GetTeamSettingsRequest {
  teamId: number;
  settings: (keyof TeamSettings)[];
}
export interface GetTeamSettingsResult {
  error?: Error;
  settings: TeamSettings;
}
export interface SetTeamSettingsRequest {
  teamId: number;
  settings: TeamSettings;
}
export interface SetTeamSettingsResult {
  error?: Error;
}
export type CheckDirectorySyncKeyResponseStatus = "validated" | "rejected";
export interface CheckDirectorySyncKeyRequest {
  teamId: string;
  requestId: number;
  publicKey: string;
}
export interface CheckDirectorySyncKeyResponse {
  teamId: string;
  requestId: number;
  publicKey: string;
  response: CheckDirectorySyncKeyResponseStatus;
}
export interface RegisterFreeTrialRequest {
  creatorEmail: string;
  companyName: string;
  language: string;
}
export interface TeamInviteToken {
  token: string;
  teamId: number;
}
export interface TeamFreeTrialToken {
  token: string;
}
export interface TokenInformation {
  teamInviteTokens: TeamInviteToken[];
  teamFreeTrialTokens: TeamFreeTrialToken[];
  resetToken: string | null;
  newDeviceToken: string | null;
}
export interface TokensResponse {
  code: number;
  content: TokenInformation;
  message: string;
}
export interface PremiumStatusResponseCapability {
  capability: string;
  enabled: boolean;
  info?: Object;
}
export interface PremiumStatusRequest {
  login: string;
  uki: string;
  autoRenewal?: boolean;
  billingInformation?: boolean;
  spaces?: boolean;
}
export interface PremiumStatusResponse {
  success: boolean;
  statusCode?: PremiumStatusCode;
  billingInformation?: PremiumStatusBillingInfo;
  planName?: string;
  planType?: string;
  planFeature?: string;
  endDate?: number;
  autoRenewal?: boolean;
  spaces?: PremiumStatusSpace[];
  capabilities?: PremiumStatusResponseCapability[];
  familyMembership?: FamilyMembership[];
  previousPlan?: PreviousPremiumPlan | false;
  recoveryHash?: string;
}
export interface AcceptTeamInviteRequest {
  token: string;
}
export interface AdminProvisioningKeyData {
  adminProvisioningKey: string | null;
}
export interface MassDeploymentTeamKeyData {
  massDeploymentTeamAccessKey: string | null;
  massDeploymentTeamSecretKey: string | null;
}
export type GetSpecialUserGroupRevisionRequest = {
  teamId: number;
};
export type GetSpecialUserGroupRevisionResult = {
  specialUserGroupRevision: number;
};
export type GetSpecialUserGroupInviteValuesRequest = {
  teamId: number;
  memberLogin: string;
};
export type GetSpecialUserGroupInviteValuesResult = {
  groupKey: string;
  proposeSignature: string;
};
