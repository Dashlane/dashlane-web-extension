import {
  CredentialFilterField,
  CredentialSortField,
  CredentialWithCategory,
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
  CredentialWithCategory,
  CredentialSortField,
  CredentialFilterField
>;
