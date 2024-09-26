import { IdCard, Identity } from "../../../DataModel";
import { DataQuery } from "../../types";
import {
  AddIdRequest,
  AddIdResult,
  BaseIdUpdateModel,
  UpdateIdRequest,
  UpdateIdResult,
} from "../types";
export type IdCardFilterField = "spaceId";
export type IdCardSortField =
  | "creationDate"
  | "idNumber"
  | "name"
  | "id"
  | "lastUse";
export type IdCardDataQuery = DataQuery<IdCardSortField, IdCardFilterField>;
export type IdCardWithIdentity = IdCard & {
  identity: Identity;
};
export type IdCardUpdateModel = BaseIdUpdateModel & {
  expirationDate: number | null;
  issueDate: number | null;
  name: string;
};
export type AddIdCardRequest = AddIdRequest<IdCardUpdateModel>;
export type EditIdCardRequest = UpdateIdRequest<IdCardUpdateModel>;
export type AddIdCardResult = AddIdResult;
export type EditIdCardResult = UpdateIdResult;
