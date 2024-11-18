import {
  PremiumStatusBillingInfo,
  PremiumStatusResponse,
} from "@dashlane/communication";
import { _makeRequest } from "Libs/WS/request";
import { WSRequestParams } from "Libs/WS/types";
const WSNAME = "premium";
const WSVERSION = 3;
export interface WSPremium {
  status: (params: PremiumStatusParams) => Promise<PremiumStatusResponse>;
  setAutoRenewal: (
    params: SetAutoRenewalParams
  ) => Promise<SetAutoRenewalResponse>;
  updateCardToken: (
    params: UpdateCardTokenParam
  ) => Promise<UpdateCardTokenResponse>;
  getABTestingVersionDetails: (
    params: GetABTestingVersionDetailsRequest
  ) => Promise<GetABTestingVersionDetailsResult>;
  getSubscriptionCode: (
    params: SubscriptionCodeRequest
  ) => Promise<SubscriptionCodeResult>;
}
export const makeWSPremium = (): WSPremium => {
  return {
    status: (params) => status(params),
    setAutoRenewal: (params) => setAutoRenewal(params),
    updateCardToken: (params) => updateCardToken(params),
    getABTestingVersionDetails: (params) => getABTestingVersionDetails(params),
    getSubscriptionCode: (params) => getSubscriptionCode(params),
  };
};
export interface PremiumStatusParams extends WSRequestParams {
  billingInformation?: boolean;
  autoRenewal?: boolean;
  spaces?: boolean;
  familyInformation?: boolean;
  previousPlan?: boolean;
  needsAutoRenewalFailed?: boolean;
}
export interface PremiumStatusWSParams extends PremiumStatusParams {
  teamInformation: boolean;
  capabilities?: boolean;
}
export interface Capability {
  capability: string;
  enabled: boolean;
  info?: Object;
}
function status(params: PremiumStatusParams) {
  return _makeRequest<PremiumStatusResponse, PremiumStatusWSParams>(
    WSNAME,
    WSVERSION,
    "status",
    {
      login: params.login,
      uki: params.uki,
      billingInformation: params.billingInformation,
      spaces: params.spaces,
      autoRenewal: params.autoRenewal,
      familyInformation: params.familyInformation,
      previousPlan: params.previousPlan,
      needsAutoRenewalFailed: params.needsAutoRenewalFailed,
      teamInformation: false,
      capabilities: true,
    }
  ).then((response) => {
    if (!response.success) {
      throw new Error("failed fetching premium status");
    }
    if (response.hasOwnProperty("billingInformation")) {
      response.billingInformation = reformatBillingInformations(
        response.billingInformation as any as UnformattedPremiumStatusBillingInfo
      );
    }
    return response;
  });
}
interface UnformattedPremiumStatusBillingInfo {
  card_exp_year: string;
  card_exp_month: string;
  card_last4: string;
  card_type: string;
}
function reformatBillingInformations(
  rawBillingInfo: UnformattedPremiumStatusBillingInfo
): PremiumStatusBillingInfo {
  if (!rawBillingInfo) {
    return undefined;
  }
  return {
    cardExpirationYear: Number(rawBillingInfo.card_exp_year),
    cardExpirationMonth: Number(rawBillingInfo.card_exp_month),
    cardLast4Digits: Number(rawBillingInfo.card_last4),
    cardType: rawBillingInfo.card_type,
  };
}
export interface SetAutoRenewalParams extends WSRequestParams {
  enabled: boolean;
}
export interface SetAutoRenewalResponse {
  success: boolean;
}
export interface UpdateCardTokenResponse {
  success: boolean;
  error: any;
}
function setAutoRenewal(params: SetAutoRenewalParams) {
  return _makeRequest<SetAutoRenewalResponse, SetAutoRenewalParams>(
    WSNAME,
    WSVERSION,
    "setAutoRenewal",
    {
      login: params.login,
      uki: params.uki,
      enabled: params.enabled,
    }
  );
}
export interface UpdateCardTokenParam extends WSRequestParams {
  tokenId: string;
  stripeAccount: string;
}
function updateCardToken(params: UpdateCardTokenParam) {
  return _makeRequest<UpdateCardTokenResponse, UpdateCardTokenParam>(
    WSNAME,
    WSVERSION,
    "updateCardToken",
    {
      login: params.login,
      uki: params.uki,
      tokenId: params.tokenId,
      stripeAccount: params.stripeAccount,
    }
  );
}
export interface GetABTestingVersionDetailsRequest {
  capacity: string;
  language: string;
  platform: string;
  forceVersion3?: string;
}
export interface GetABTestingVersionDetailsResult {
  details: any[];
  success: boolean;
  version: string;
}
function getABTestingVersionDetails(
  params: GetABTestingVersionDetailsRequest
): Promise<GetABTestingVersionDetailsResult> {
  return _makeRequest<
    GetABTestingVersionDetailsResult,
    GetABTestingVersionDetailsRequest
  >(WSNAME, WSVERSION, "getABTestingVersionDetails", params);
}
export type SubscriptionCodeRequest = WSRequestParams;
export interface SubscriptionCodeResult {
  code: string;
  content: {
    subscriptionCode: string;
  };
  message: string;
}
function getSubscriptionCode({ login, uki }: SubscriptionCodeRequest) {
  return _makeRequest<SubscriptionCodeResult, SubscriptionCodeRequest>(
    WSNAME,
    WSVERSION,
    "getSubscriptionCode",
    {
      login,
      uki,
    }
  );
}
