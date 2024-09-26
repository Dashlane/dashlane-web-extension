import { Credential, Note, Secret } from "@dashlane/communication";
export type KWAuthentifiantCurrentData = Pick<
  Credential,
  | "Title"
  | "Email"
  | "Login"
  | "SecondaryLogin"
  | "Password"
  | "Note"
  | "Url"
  | "UserSelectedUrl"
  | "LinkedServices"
>;
export type KWSecureNoteCurrentData = Pick<Note, "Title" | "Content">;
export type KWSecretCurrentData = Pick<Secret, "Title" | "Content">;
export type ChangeSetCurrentData =
  | KWAuthentifiantCurrentData
  | KWSecureNoteCurrentData
  | KWSecretCurrentData;
export interface ChangeSet {
  kwType: string;
  ChangedProperties: string[];
  CurrentData: ChangeSetCurrentData;
  Id: string;
  DeviceName: string;
  Platform: string;
  ModificationDate: number;
  Removed: boolean;
  User: string;
}
export type KWAuthentifiantSignificantProperties =
  keyof KWAuthentifiantCurrentData;
export type KWSecureNoteSignificantProperties = keyof KWSecureNoteCurrentData;
export type KWSecretSignificantProperties = keyof KWSecretCurrentData;
export type SignificantProperties =
  | KWAuthentifiantSignificantProperties
  | KWSecureNoteSignificantProperties
  | KWSecretSignificantProperties;
export interface SignificantPropertiesByType {
  KWAuthentifiant: {
    [K in KWAuthentifiantSignificantProperties]: Credential[K];
  };
  KWSecureNote: {
    [K in KWSecureNoteSignificantProperties]: Note[K];
  };
  KWSecret: {
    [K in KWSecretSignificantProperties]: Secret[K];
  };
}
