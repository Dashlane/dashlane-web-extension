import { Identity, Passport } from "../../../DataModel";
import { DataQuery } from "../../types";
import {
  AddIdRequest,
  AddIdResult,
  BaseIdUpdateModel,
  UpdateIdRequest,
  UpdateIdResult,
} from "../types";
export type PassportFilterField = "spaceId";
export type PassportSortField =
  | "creationDate"
  | "idNumber"
  | "name"
  | "id"
  | "lastUse";
export type PassportDataQuery = DataQuery<
  PassportSortField,
  PassportFilterField
>;
export type PassportWithIdentity = Passport & {
  identity: Identity;
};
export type PassportUpdateModel = BaseIdUpdateModel & {
  expirationDate: number | null;
  issueDate: number | null;
  deliveryPlace: string;
  name: string;
};
export type AddPassportRequest = AddIdRequest<PassportUpdateModel>;
export type EditPassportRequest = UpdateIdRequest<PassportUpdateModel>;
export type AddPassportResult = AddIdResult;
export type EditPassportResult = UpdateIdResult;
