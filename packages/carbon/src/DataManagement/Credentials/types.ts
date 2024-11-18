import {
  Credential,
  CredentialFilterField,
  CredentialSortField,
  Mappers,
  SaveCredentialContentCapture,
  SaveCredentialContentUI,
  SaveCredentialFromCapture,
  SaveCredentialFromImport,
  SaveCredentialFromUI,
} from "@dashlane/communication";
export type SaveCredential =
  | SaveCredentialFromCapture
  | SaveCredentialFromImport
  | SaveCredentialFromUI;
export type SaveCredentialContent =
  | SaveCredentialContentUI
  | SaveCredentialContentCapture;
export type SaveCredentialContentKeys =
  | keyof SaveCredentialContentUI
  | keyof SaveCredentialContentCapture;
export type CredentialMappers = Mappers<
  Credential,
  CredentialSortField,
  CredentialFilterField
>;
