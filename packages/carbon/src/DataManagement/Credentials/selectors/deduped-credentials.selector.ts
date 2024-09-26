import { createSelector } from "reselect";
import { Credential } from "@dashlane/communication";
import {
  dedupItems,
  HandshakeRules,
} from "DataManagement/DeDuplication/dedup-filter";
import {
  boolEqual,
  concatMerge,
  genericMerge,
  maxMerge,
  minMerge,
  strictEqual,
  sumMerge,
} from "DataManagement/DeDuplication/merge-rules";
import { unsafeAllCredentialsSelector } from "DataManagement/Credentials/selectors/unsafe-all-credentials.selector";
import { State } from "Store";
const hashFields: Array<keyof Pick<Credential, "Password" | "Title" | "Url">> =
  ["Password", "Title", "Url"];
type MergeModel = Omit<
  Credential,
  "Id" | "LastBackupTime" | "LocaleFormat" | "Type" | "domainIcon"
>;
const handshakeRules: HandshakeRules<MergeModel> = {
  Alias: genericMerge,
  Attachments: concatMerge,
  AutoLogin: strictEqual,
  AutoProtected: boolEqual,
  Category: genericMerge,
  Checked: strictEqual,
  ConnectionOptions: genericMerge,
  CreationDatetime: minMerge,
  Email: strictEqual,
  LastUse: maxMerge,
  LinkedServices: strictEqual,
  Login: strictEqual,
  ModificationDatetime: maxMerge,
  Note: genericMerge,
  NumberUse: sumMerge,
  OtpSecret: strictEqual,
  OtpUrl: strictEqual,
  Password: strictEqual,
  Port: genericMerge,
  SID: genericMerge,
  SecondaryLogin: strictEqual,
  Server: genericMerge,
  SharedObject: strictEqual,
  SpaceId: strictEqual,
  Status: strictEqual,
  Strength: strictEqual,
  SubdomainOnly: boolEqual,
  Title: strictEqual,
  TrustedUrlGroup: concatMerge,
  Url: strictEqual,
  UseFixedUrl: strictEqual,
  UserModificationDatetime: maxMerge,
  UserSelectedUrl: strictEqual,
  kwType: strictEqual,
  limitedPermissions: strictEqual,
};
export const dedupedCredentialsSelector = createSelector(
  unsafeAllCredentialsSelector,
  dedupItems(hashFields, handshakeRules)
);
export const hasCredentialsDedupViewSelector = (state: State): boolean => {
  return state.userSession.credentialsDedupViewState.credentialsDedupView;
};
