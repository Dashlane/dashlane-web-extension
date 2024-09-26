export type Indicator =
  | "teamTrial"
  | "webAccount"
  | "memberAccount"
  | "standaloneAccount";
export interface CreateAccountRequest {
  anonymousUserId: string;
  login: string;
  deviceName: string;
  password: string;
  format: string;
  language: string;
  subscribe: boolean;
}
export interface CreateAccountResult {
  encryptSettingsRequest: CreateAccountRequest;
  valid: boolean;
}
export type ConsentType = "emailsOffersAndTips" | "privacyPolicyAndToS";
export interface UserConsent {
  consentType: ConsentType;
  status: boolean;
}
export interface ConfirmAccountCreationRequest {
  createAccountResult: CreateAccountResult;
  options: {
    flowIndicator: Indicator;
  };
  isStandAlone: boolean;
  consents?: UserConsent[];
}
export interface ConfirmAccountCreationResult {
  uki: string;
  abtestingversion: string;
  m2dToken: string;
  origin: string;
  openSession?: boolean;
}
export enum AccountCreationCode {
  USER_EXISTS,
  USER_DOESNT_EXIST,
  USER_DOESNT_EXIST_UNLIKELY_MX,
  USER_DOESNT_EXIST_INVALID_MX,
  USER_DOESNT_EXIST_SSO_NON_PROVISIONED,
  USER_SSO_PROVISIONED,
  USER_NITRO_SSO_PROVISIONED,
  USER_NOT_PROPOSED,
}
export type CheckLoginResponse = {
  accountCreationCode: AccountCreationCode;
  isUserProposed?: boolean;
  isUserAccepted?: boolean;
  isProposedExpired?: boolean;
};
