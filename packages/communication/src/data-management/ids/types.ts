import {
  Country,
  DriverLicense,
  EmbeddedAttachment,
  FiscalId,
  IdCard,
  Passport,
  SocialSecurityId,
} from "../../DataModel";
import { DriverLicenseUpdateModel } from "./driver-licenses";
import { FiscalIdUpdateModel } from "./fiscal-ids";
import { IdCardUpdateModel } from "./id-cards";
import { PassportUpdateModel } from "./passports";
import { SocialSecurityIdUpdateModel } from "./social-security-ids/types";
export type IdDataModel =
  | DriverLicense
  | FiscalId
  | IdCard
  | Passport
  | SocialSecurityId;
export type BaseIdUpdateModel = {
  country: Country;
  idNumber: string;
  spaceId: string;
  attachments?: EmbeddedAttachment[];
};
export type BaseIdDataModel = Pick<
  IdDataModel,
  | "CreationDatetime"
  | "Id"
  | "LastBackupTime"
  | "LocaleFormat"
  | "SpaceId"
  | "UserModificationDatetime"
>;
export type EditableBaseIdDataModel = Pick<
  BaseIdDataModel,
  "SpaceId" | "LocaleFormat"
>;
export enum IdErrorCode {
  INTERNAL_ERROR = "INTERNAL_ERROR",
  NOT_AUTHENTICATED = "NOT_AUTHENTICATED",
  NOT_FOUND = "NOT_FOUND",
}
export enum AddIdResultErrorCode {
  MISSING_ID_NUMBER = "MISSING_ID_NUMBER",
}
export enum UpdateIdResultErrorCode {
  MISSING_ID_NUMBER = "MISSING_ID_NUMBER",
}
export type AddIdRequest<UpdateModel> = UpdateModel;
export type UpdateIdRequest<UpdateModel> = {
  id: string;
} & Partial<UpdateModel>;
type IdResultSuccess = {
  success: true;
};
type IdResultError = {
  success: false;
};
export type AddIdResultSuccess = IdResultSuccess & {
  id: string;
};
export type AddIdResultError = IdResultError & {
  error: {
    code: AddIdResultErrorCode | IdErrorCode;
  };
};
export type UpdateIdResultError = IdResultError & {
  error: {
    code: UpdateIdResultErrorCode | IdErrorCode;
  };
};
export type AddIdResult = AddIdResultSuccess | AddIdResultError;
export type UpdateIdResult = IdResultSuccess | UpdateIdResultError;
export type IdUpdateModel =
  | DriverLicenseUpdateModel
  | FiscalIdUpdateModel
  | IdCardUpdateModel
  | PassportUpdateModel
  | SocialSecurityIdUpdateModel;
