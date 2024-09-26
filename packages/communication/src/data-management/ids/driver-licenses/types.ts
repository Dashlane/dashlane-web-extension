import { DriverLicense, Identity } from "../../../DataModel";
import { DataQuery } from "../../types";
import {
  AddIdRequest,
  AddIdResult,
  BaseIdUpdateModel,
  UpdateIdRequest,
  UpdateIdResult,
} from "../types";
export type DriverLicenseFilterField = "spaceId";
export type DriverLicenseSortField =
  | "creationDate"
  | "idNumber"
  | "name"
  | "id"
  | "lastUse";
export type DriverLicenseDataQuery = DataQuery<
  DriverLicenseSortField,
  DriverLicenseFilterField
>;
export type DriverLicenseWithIdentity = DriverLicense & {
  identity: Identity;
};
export type DriverLicenseUpdateModel = BaseIdUpdateModel & {
  expirationDate: number | null;
  issueDate: number | null;
  name: string;
  state: string;
};
export type AddDriverLicenseRequest = AddIdRequest<DriverLicenseUpdateModel>;
export type EditDriverLicenseRequest =
  UpdateIdRequest<DriverLicenseUpdateModel>;
export type AddDriverLicenseResult = AddIdResult;
export type EditDriverLicenseResult = UpdateIdResult;
