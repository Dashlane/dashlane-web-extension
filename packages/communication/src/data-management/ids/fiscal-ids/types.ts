import { DataQuery } from "../../types";
import {
  AddIdRequest,
  AddIdResult,
  BaseIdUpdateModel,
  UpdateIdRequest,
  UpdateIdResult,
} from "../types";
export type FiscalIdFilterField = "spaceId";
export type FiscalIdSortField =
  | "creationDate"
  | "idNumber"
  | "id"
  | "lastUse"
  | "teledeclarantNumber";
export type FiscalIdDataQuery = DataQuery<
  FiscalIdSortField,
  FiscalIdFilterField
>;
export type FiscalIdUpdateModel = BaseIdUpdateModel & {
  teledeclarantNumber: string;
};
export type AddFiscalIdRequest = AddIdRequest<FiscalIdUpdateModel>;
export type EditFiscalIdRequest = UpdateIdRequest<FiscalIdUpdateModel>;
export type AddFiscalIdResult = AddIdResult;
export type EditFiscalIdResult = UpdateIdResult;
