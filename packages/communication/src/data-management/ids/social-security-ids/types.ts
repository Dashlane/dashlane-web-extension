import { Identity, SocialSecurityId } from "../../../DataModel";
import { DataQuery } from "../../types";
import {
  AddIdRequest,
  AddIdResult,
  BaseIdUpdateModel,
  UpdateIdRequest,
  UpdateIdResult,
} from "../types";
export type SocialSecurityIdFilterField = "spaceId";
export type SocialSecurityIdSortField =
  | "creationDate"
  | "idNumber"
  | "name"
  | "id"
  | "lastUse";
export type SocialSecurityIdDataQuery = DataQuery<
  SocialSecurityIdSortField,
  SocialSecurityIdFilterField
>;
export type SocialSecurityIdWithIdentity = SocialSecurityId & {
  identity: Identity;
};
export type SocialSecurityIdUpdateModel = BaseIdUpdateModel & {
  name: string;
};
export type AddSocialSecurityIdRequest =
  AddIdRequest<SocialSecurityIdUpdateModel>;
export type EditSocialSecurityIdRequest =
  UpdateIdRequest<SocialSecurityIdUpdateModel>;
export type AddSocialSecurityIdResult = AddIdResult;
export type EditSocialSecurityIdResult = UpdateIdResult;
