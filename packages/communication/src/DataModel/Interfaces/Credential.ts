import * as Common from "./Common";
import { IconDataStructure } from "./Icon";
import { CredentialLinkedServices } from "./LinkedServices";
export interface TrustedUrl {
  TrustedUrl: string;
  TrustedUrlExpire: string;
}
export interface CredentialCategory extends Common.BaseDataModelObject {
  CategoryName: string;
}
export type CredentialStatus =
  | "ACCOUNT_NOT_VERIFIED"
  | "ACCOUNT_VERIFIED"
  | "ACCOUNT_INVALID";
export type CredentialType = "WEB";
export interface Credential extends Common.DataModelObject {
  Title: string;
  Email: string;
  Login: string;
  SecondaryLogin: string;
  Password: string;
  Strength: number;
  Note?: string;
  Checked?: boolean;
  Status?: CredentialStatus;
  SharedObject?: boolean;
  ModificationDatetime?: number;
  Category?: string;
  Url: string;
  UserSelectedUrl?: string;
  UseFixedUrl: boolean;
  TrustedUrlGroup: TrustedUrl[];
  NumberUse?: number;
  AutoLogin?: boolean;
  AutoProtected?: boolean;
  SubdomainOnly?: boolean;
  Type?: CredentialType;
  Server?: string;
  Port?: string;
  Alias?: string;
  SID?: string;
  ConnectionOptions?: string;
  domainIcon?: IconDataStructure;
  limitedPermissions?: boolean;
  OtpSecret?: string;
  OtpUrl?: string;
  LinkedServices?: CredentialLinkedServices;
}
export function isCredential(o: Common.BaseDataModelObject): o is Credential {
  return Boolean(o) && o.kwType === "KWAuthentifiant";
}
