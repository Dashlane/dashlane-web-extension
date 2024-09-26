import { IconDataStructure } from "../../DataModel";
import {
  DataQuery,
  FilterCriterium,
  FilterToken,
  SortCriterium,
  SortToken,
} from "../types";
export enum PasswordHistoryItemType {
  Credential = "credential",
  Generated = "generated",
}
export interface PasswordHistoryItemBase {
  type: PasswordHistoryItemType;
  id: string;
  primaryInfo: string;
  password: string;
  timestamp: number;
  domain: string;
}
export interface GeneratedPasswordHistoryItemView
  extends Omit<PasswordHistoryItemBase, "domain"> {
  type: PasswordHistoryItemType.Generated;
}
export interface CredentialPasswordHistoryItemView
  extends PasswordHistoryItemBase {
  type: PasswordHistoryItemType.Credential;
  secondaryInfo: string;
  credentialId: string;
  icons: IconDataStructure;
  isProtected: boolean;
  spaceId?: string;
}
export type PasswordHistoryItemView =
  | GeneratedPasswordHistoryItemView
  | CredentialPasswordHistoryItemView;
export type PasswordHistorySortField = "id" | "primaryInfo" | "timestamp";
export type PasswordHistoryFilterField = "type" | "credentialId";
export type PasswordHistorySortToken = SortToken<PasswordHistorySortField>;
export type PasswordHistoryFilterToken =
  FilterToken<PasswordHistoryFilterField>;
export type PasswordHistoryDataQuery = DataQuery<
  PasswordHistorySortField,
  PasswordHistoryFilterField
>;
export type PasswordHistoryFilterCriterium =
  FilterCriterium<PasswordHistoryFilterField>;
export type PasswordHistorySortCriterium =
  SortCriterium<PasswordHistorySortField>;
export interface PasswordHistoryFirstTokenParams {
  sortCriteria: PasswordHistorySortCriterium[];
  filterCriteria?: PasswordHistoryFilterCriterium[];
  initialBatchSize?: number;
}
