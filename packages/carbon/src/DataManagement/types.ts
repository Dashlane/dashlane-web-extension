import { Trigger } from "@dashlane/hermes";
import { PersonalData } from "Session/Store/personalData/types";
export type SyncDebounceFunction = (
  options: {
    immediateCall?: boolean;
  },
  syncTrigger: Trigger
) => void;
export const PERSONAL_DATA_META_DATA = [
  "changeHistories",
  "changesToUpload",
  "generatedPasswords",
  "securityBreaches",
  "securityBreachesMetadata",
  "breachesUpdaterStatus",
  "breachRefreshMetaData",
  "versionedBreaches",
  "secureFileInfo",
  "noteCategories",
  "paypalAccounts",
  "credentialCategories",
] as const;
export type PersonalDataVaultItems = Omit<
  PersonalData,
  (typeof PERSONAL_DATA_META_DATA)[number]
>;
export function isDataKeyVaultItem(
  dataKey: string
): dataKey is keyof PersonalDataVaultItems {
  return !PERSONAL_DATA_META_DATA.includes(dataKey as never);
}
