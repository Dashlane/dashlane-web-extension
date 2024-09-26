import { DataModelItemView, DataQuery, SortToken } from "../types";
export type SecretSortField =
  | "id"
  | "title"
  | "updatedAt"
  | "createdAt"
  | "lastUse";
export type SecretFilterField = "id" | "spaceId" | "hasAttachments";
export type SecretDataQuery = DataQuery<SecretSortField, SecretFilterField>;
export type SecretSortToken = SortToken<SecretSortField>;
export enum DeleteSecretErrorCode {
  NOT_FOUND = "NOT_FOUND",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  LEAVE_SHARING_FAILED = "LEAVE_SHARING_FAILED",
  LEAVE_SHARING_FORBIDDEN_LAST_ADMIN = "LEAVE_SHARING_FORBIDDEN_LAST_ADMIN",
  LEAVE_SHARING_FORBIDDEN_GROUP_ITEM = "LEAVE_SHARING_FORBIDDEN_GROUP_ITEM",
}
export interface SecretItemView extends DataModelItemView {
  abbrContent: string;
  createdAt: number;
  title: string;
  updatedAt: number;
}
