import { PremiumStatusSpace } from "../OpenSession";
export interface UserGroupSummary {
  groupId: string;
  name: string;
  publicKey: string;
}
export interface SpaceInfo {
  name?: string;
  teamDomains?: string[];
  emergencyDisabled?: boolean;
  sharingDisabled?: boolean;
  twoFAEnforced?: string;
  mpPersistenceDisabled?: boolean;
  forcedDomainsEnabled?: boolean;
  personalSpaceEnabled?: boolean;
  removeForcedContentEnabled?: boolean;
  lockOnExit?: boolean;
  collectSensitiveDataAuditLogsEnabled?: boolean;
  autologinDomainDisabledArray?: string[];
  forceAutomaticLogout: number;
  cryptoForcedPayload: string;
  idpUrl?: string;
  idpCertificate?: string;
  idpSecurityGroups?: string[];
  recoveryEnabled?: boolean;
  richIconsEnabled?: boolean;
  secureWifiEnabled?: boolean;
  ssoEnabled?: boolean;
}
export interface Space {
  teamId: string;
  details: PremiumStatusSpace;
  info?: SpaceInfo;
}
export interface SpaceMemberRights {
  readonly isTeamAdmin: boolean;
  readonly isBillingAdmin: boolean;
  readonly isGroupManager: boolean;
}
export interface SpaceDataUpdatedEvent {
  spaces: Space[];
  rights: SpaceMemberRights;
}
