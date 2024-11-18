import { AuthenticationCode } from "../Authentication";
import { TeamSettings } from "../TeamAdmin";
export interface TeamInfo extends TeamSettings {
  name: string;
  features: Record<string, unknown>;
  teamCaptains: Record<string, true>;
  forcedDomainsEnabled?: boolean;
  personalSpaceEnabled?: boolean;
  removeForcedContentEnabled?: boolean;
  sharingDisabled?: boolean;
}
export interface TeamStatusBilling {
  planDetails: {
    currency: string;
    priceRanges: {
      startMembers: number;
      price: number;
      equivalentPrice: number;
    }[];
  };
  billingInformation?: {
    billingMethod: "processout" | "invoice";
    cardLast4?: string;
  };
  nextBillingDetails: {
    amount: number;
    currency: string;
    dateUnix: number;
  };
  lastBillingDateUnix: number;
  isExpiringSoon: boolean;
  isFreeTrial: boolean;
  isGracePeriod: boolean;
  usersToBeRenewedCount: number;
}
export type PlanTier =
  | "legacy"
  | "team"
  | "business"
  | "businessplus"
  | "entreprise"
  | "starter"
  | "standard";
export type Seats = {
  paid: number;
  extraFree: number;
  remaining: number;
};
export type GetTeamInfoResult = GetTeamInfoSuccess | GetTeamInfoError;
export type TeamCapabilities = {
  activeDirectorySync: {
    enabled: boolean;
  };
  phoneSupport: {
    enabled: boolean;
  };
  samlProvisioning: {
    enabled: boolean;
  };
  scim: {
    enabled: boolean;
  };
  sso: {
    enabled: boolean;
  };
  usageReports: {
    enabled: boolean;
  };
  groupSharing: {
    enabled: boolean;
    info?: {
      limit?: number;
      reason?: string;
    };
  };
  activityLog: {
    enabled: boolean;
  };
  riskDetection: {
    enabled: boolean;
    info?: {
      reason?: string;
    };
  };
};
export type GetTeamInfoSuccess = {
  success: true;
  data: {
    billing: TeamStatusBilling;
    teamInfo: TeamInfo;
    planTier: PlanTier;
    capabilities: TeamCapabilities;
    seats: Seats;
  };
};
export type GetTeamInfoError = {
  success: false;
  reason: AuthenticationCode;
  message: string;
};
export interface ComputePlanPricingRequest {
  seats: number;
}
export interface ComputePlanPrice {
  renewal: {
    seatsCount: number;
    price: {
      value: number;
      taxes: number;
      currency: "usd" | "eur";
    };
  };
  additionalSeats: {
    seatsCount: number;
    price: {
      value: number;
      taxes: number;
      currency: "usd" | "eur";
    };
  };
}
export interface ComputePlanPricingSuccess {
  success: true;
  data: ComputePlanPrice;
}
export enum ComputePlanPricingErrorType {
  ComputePlanPricingFailed = "COMPUTE_PLAN_PRICING_FAILED",
  NotBillingAdmin = "NOT_BILLING_ADMIN",
}
export interface ComputePlanPricingError {
  success: false;
  error: {
    code: ComputePlanPricingErrorType;
    message: string;
  };
}
export type ComputePlanPricingResponse =
  | ComputePlanPricingSuccess
  | ComputePlanPricingError;
