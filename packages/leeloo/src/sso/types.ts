import { Lee } from "../lee";
import { SsoMigrationServerMethod } from "@dashlane/communication";
export interface SsoUrlInfo {
  login: string;
  ssoToken: string;
  key: string;
  exists: string;
  currentAuths: SsoMigrationServerMethod;
  expectedAuths: SsoMigrationServerMethod;
  inStore: boolean;
}
export interface Props {
  lee: Lee;
  location: {
    search: string;
    pathname: string;
    hash: string;
  };
}
export interface Consent {
  consentType: "privacyPolicyAndToS" | "emailsOffersAndTips";
  status: boolean;
}
export enum SsoSteps {
  ASK_FOR_MP = "ASK_FOR_MP",
  ACCOUNT_CREATION = "ACCOUNT_CREATION",
  D_SPINNER = "D_SPINNER",
  CHANGE_MP_PROGRESS = "CHANGE_MP_PROGRESS",
}
