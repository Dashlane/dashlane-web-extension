import {
  WebAuthnCloudCipheringKey,
  WebAuthnKeyAlgorithm,
  WebAuthnPrivateKey,
} from "../../DataModel";
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
  rpId: string;
  rpName: string;
  userDisplayName: string;
  userHandle: string;
}
export interface CloudPasskeyModel
  extends PasskeyBaseModel,
    CustomizableFieldsInPasskey {
  keyAlgorithm: WebAuthnKeyAlgorithm.CloudPasskey;
  cloudCipheringKey: WebAuthnCloudCipheringKey;
}
export interface LegacyPasskeyModel
  extends PasskeyBaseModel,
    CustomizableFieldsInPasskey {
  keyAlgorithm: WebAuthnKeyAlgorithm.ES256;
  privateKey: WebAuthnPrivateKey;
}
export interface CustomizableFieldsInPasskey {
  itemName?: string;
  note?: string;
  spaceId: string;
}
export type AllFieldsPasskey = CloudPasskeyModel | LegacyPasskeyModel;
export type PasskeyAddModel = AllFieldsPasskey;
export type PasskeyUpdateModel = AllFieldsPasskey;
export type PasskeyDetailView = DataModelDetailView & AllFieldsPasskey;
export type PasskeyItemView = DataModelItemView & AllFieldsPasskey;
export enum DeletePasskeyErrorCode {
  NOT_AUTHORIZED,
  NOT_FOUND,
  INTERNAL_ERROR,
}
export type AddPasskeyRequest = {
  id?: string;
} & PasskeyAddModel;
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
