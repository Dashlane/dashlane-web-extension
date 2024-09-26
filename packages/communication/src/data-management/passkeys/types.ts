import { WebAuthnPrivateKey } from "../../DataModel";
import { DataModelDetailView, DataModelItemView, DataQuery } from "../types";
export type PasskeyFilterField =
  | "id"
  | "itemName"
  | "rpId"
  | "spaceId"
  | "userDisplayName";
export type PasskeySortField = "id" | "itemName" | "lastUse" | "rpId";
export type PasskeyDataQuery = DataQuery<PasskeySortField, PasskeyFilterField>;
export type PasskeysForDomainDataQuery = {
  domain: string;
} & PasskeyDataQuery;
export interface PasskeyBaseModel {
  counter: number;
  credentialId: string;
  keyAlgorithm: number;
  privateKey: WebAuthnPrivateKey;
  rpId: string;
  rpName: string;
  userDisplayName: string;
  userHandle: string;
}
export interface CustomizableFieldsInPasskey {
  itemName?: string;
  note?: string;
  spaceId: string;
}
export interface AllFieldsPasskey
  extends PasskeyBaseModel,
    CustomizableFieldsInPasskey {}
export type PasskeyAddModel = AllFieldsPasskey;
export type PasskeyUpdateModel = AllFieldsPasskey;
export interface PasskeyDetailView
  extends DataModelDetailView,
    AllFieldsPasskey {}
export interface PasskeyItemView extends DataModelItemView, AllFieldsPasskey {}
export enum DeletePasskeyErrorCode {
  NOT_AUTHORIZED,
  NOT_FOUND,
  INTERNAL_ERROR,
}
export type AddPasskeyRequest = PasskeyAddModel;
export type UpdatePasskeyRequest = {
  id: string;
} & Partial<PasskeyUpdateModel>;
interface AddOrUpdatePasskeyResultSuccess {
  success: true;
}
export type AddPasskeyResultSuccess = AddOrUpdatePasskeyResultSuccess & {
  id: string;
};
export type UpdatePasskeyResultSuccess = AddOrUpdatePasskeyResultSuccess;
export interface AddPasskeyResultError {
  success: false;
  error?: {};
}
export interface UpdatePasskeyResultError {
  success: false;
  error?: {};
}
export type DeletePasskeyRequest = {
  id: string;
};
export type DeletePasskeyResultSuccess = {
  success: true;
};
export type DeletePasskeyResultError = {
  success: false;
  error: {
    code: DeletePasskeyErrorCode;
  };
};
export type DeletePasskeyResult =
  | DeletePasskeyResultSuccess
  | DeletePasskeyResultError;
export type AddPasskeyResult = AddPasskeyResultSuccess | AddPasskeyResultError;
export type UpdatePasskeyResult =
  | UpdatePasskeyResultSuccess
  | UpdatePasskeyResultError;
