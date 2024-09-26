import {
  Credential,
  CredentialCategory,
  CredentialLinkedServices,
  IconDataStructure,
} from "../../DataModel";
import { SharingStatusDetail } from "../../Sharing/2/Interfaces/types";
import { Space } from "../../SpaceData";
import { LinkedWebsites } from "../linked-websites/types";
import {
  BaseDataModelItemView,
  DataModelDetailView,
  DataModelItemView,
  DataQuery,
  FilterCriterium,
  FilterToken,
  SortCriterium,
  SortToken,
} from "../types";
export type CredentialFilterField =
  | "id"
  | "email"
  | "title"
  | "spaceId"
  | "category"
  | "isLimited"
  | "hasAttachments";
export type CredentialSortField =
  | "id"
  | "title"
  | "login"
  | "category"
  | "lastUse"
  | "numberUse";
export type CredentialDataQuery = DataQuery<
  CredentialSortField,
  CredentialFilterField
>;
export type CredentialsByDomainDataQuery = {
  domain: string;
} & CredentialDataQuery;
export interface CredentialItemView extends DataModelItemView {
  autoProtected: boolean;
  category?: CredentialCategoryDetailView;
  domainIcon?: IconDataStructure;
  email: string;
  login: string;
  password: string;
  title: string;
  url: string;
}
export interface CredentialDetailView extends DataModelDetailView {
  autoLogin: boolean;
  autoProtected: boolean;
  category?: CredentialCategoryDetailView;
  domainIcon?: IconDataStructure;
  email: string;
  forceCategorizedSpace?: Space;
  linkedWebsites: LinkedWebsites;
  login: string;
  note: string;
  hasOtp: boolean;
  otpSecret: string;
  otpUrl: string;
  password: string;
  secondaryLogin?: string;
  sharingStatus: SharingStatusDetail;
  strength: number;
  subdomainOnly: boolean;
  title: string;
  url: string;
}
export interface CredentialCategoryDetailView extends BaseDataModelItemView {
  categoryName: string;
}
export enum CredentialLimitStatus {
  Unlimited = "unlimited",
  UnderLimit = "underLimit",
  NearLimit = "nearLimit",
  AtOrAboveLimit = "atOrAboveLimit",
}
export type CredentialFilterCriterium = FilterCriterium<CredentialFilterField>;
export type CredentialSortCriterium = SortCriterium<CredentialSortField>;
export interface CredentialsFirstTokenParams {
  sortCriteria: CredentialSortCriterium[];
  filterCriteria?: CredentialFilterCriterium[];
  initialBatchSize?: number;
}
export interface UpdateCredentialSuccess {
  success: true;
}
export interface UpdateCredentialFailure {
  success: false;
}
export type UpdateCredentialResult =
  | UpdateCredentialSuccess
  | UpdateCredentialFailure;
export type CreateCredentialResult = {
  credentialId: string;
};
export interface BaseCredentialModel {
  password?: string;
  url?: string;
  email?: string;
  login?: string;
  secondaryLogin?: string;
  onlyForThisSubdomain?: boolean;
  protectWithMasterPassword?: boolean;
  spaceId?: string;
  autoLogin?: boolean;
  category?: string;
}
export interface BaseCredentialUpdateModel {
  id: string;
  update: BaseCredentialModel & {
    isUrlSelectedByUser?: boolean;
    isExcludedFromHealth?: boolean;
    linkedServices?: CredentialLinkedServices;
  };
}
export type BaseCredentialUpdateRequest<UpdateModel> = UpdateModel &
  BaseCredentialUpdateModel;
export type BaseCredentialCreateRequest<CreateModel> = CreateModel &
  BaseCredentialModel;
export type UpdateCredentialRequest = BaseCredentialUpdateRequest<{}>;
export type CreateCredentialRequest = BaseCredentialCreateRequest<{}>;
export interface DeleteCredentialsSuccess {
  success: true;
}
export interface DeleteCredentialsFailure {
  success: false;
  notRemoved?: number;
}
export type CredentialWithCategory = Credential &
  Pick<CredentialCategory, "CategoryName">;
export type CredentialFilterToken = FilterToken<CredentialFilterField>;
export type CredentialSortToken = SortToken<CredentialSortField>;
