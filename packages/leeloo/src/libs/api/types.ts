import { SpaceTier, TeamMemberInfo } from "@dashlane/communication";
export interface Auth {
  login: string | null;
  uki: string | null;
  teamId?: number | null;
}
export type PlanType =
  | "free_trial"
  | "offer"
  | "stripe"
  | "mac"
  | "playstore"
  | "amazon"
  | "ios"
  | "ios_renewable"
  | "paypal"
  | "paypal_renewable"
  | "invoice";
export interface PriceRange {
  startMembers: number;
  price: number;
  equivalentPrice: number;
}
export interface PlanDetails {
  currency: "usd" | "eur";
  duration: string;
  name: string;
  planType: PlanType;
  priceRanges: PriceRange[];
  tier?: SpaceTier;
}
export type NextBillingDetails = {
  amount: number;
  currency: "usd" | "eur";
  dateUnix: number;
};
export interface Team {
  assignedPlanDetails: PlanDetails;
  planDetails: PlanDetails;
  currentBillingInfoLite?: {
    type: string;
    card_last4: string;
  };
  info: {
    name?: string;
    teamDomains?: string[];
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
    secureWifiEnabled?: boolean;
    ssoEnabled?: boolean;
    vaultExportEnabled?: boolean;
  };
  membersNumber: number;
  extraFreeSlots: number;
  isFreeTrial: boolean;
  isExpiringSoon: boolean;
  isGracePeriod: boolean;
  creationDateUnix: number;
  lastBillingDateUnix: number;
  nextBillingDetails: NextBillingDetails;
  planId: string;
  planType: PlanType;
  planTier: SpaceTier;
  remainingSlots: number;
  usersToBeRenewedCount: number;
  statusCode: number;
  securityIndex: number;
}
export interface GetABTestingVersionDetailsResult {
  common: string;
  details: Record<string, any>;
  version: string;
}
export interface TeamPlansProposeMembersResultContent {
  proposedMembers: {};
  refusedMembers: {};
  team?: Team;
}
export interface TeamPlansProposeMembersResult {
  code: number;
  content: TeamPlansProposeMembersResultContent;
  message: string;
}
export interface TeamPlansProposeMembersRequest {
  login: string | null;
  uki: string | null;
  teamId: number | null;
  proposedMemberLogins: string;
  force: boolean | null;
}
export interface TeamPlansMembersResult {
  content: {
    billingAdmins: {};
    members: TeamMemberInfo[];
    page: number;
    pages: number;
  };
}
export interface TeamPlansLastUpdateResult {
  code: number;
  content: {
    timestamp: number;
  };
  message: string;
}
export interface TeamPlansRevokeMembersRequest extends Auth {
  removedMemberLogins: string;
  members: "true" | "false";
}
export interface TeamPlansRevokeMembersResult {
  content: {
    removedMembers: Record<string, boolean>;
    unproposedMembers: Record<string, boolean>;
    refusedMembers: Record<string, string>;
  };
}
export interface TeamPlansIsCacheUpdate {
  isUpToDate: boolean;
  remoteLastUpdateTimestamp: number;
}
export interface TeamPlansCache {
  isCacheUpToDate: {
    promise?: Promise<TeamPlansIsCacheUpdate>;
  };
  members: {
    data?: TeamPlansMembersResult;
    lastUpdateTimestamp: number;
    promise?: Promise<TeamPlansMembersResult>;
  };
}
