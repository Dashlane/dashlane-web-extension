import { BreachStatus, IconDataStructure } from "../../DataModel";
import {
  BaseDataModelDetailView,
  DataQuery,
  FilterCriterium,
  FilterToken,
  SortCriterium,
  SortToken,
} from "../types";
export type BreachType = "public" | "private";
export enum BreachLeakedDataType {
  Username = "username",
  Password = "password",
  Email = "email",
  CreditCard = "creditcard",
  Phone = "phone",
  Address = "address",
  SSN = "ssn",
  IP = "ip",
  Location = "geolocation",
  PersonalInfo = "personalinfo",
  SocialNetwork = "social",
}
export interface BreachDetailItemView extends BaseDataModelDetailView {
  breachType: BreachType;
  domains: string[];
  domainIcon?: IconDataStructure;
  eventDate: string;
  id: string;
  impactedEmails: string[];
  kwType: "KWSecurityBreach";
  leakedData: BreachLeakedDataType[];
  leakedPasswords: string[];
  compromisedCredentialIds: string[];
  name: string;
  status: BreachStatus;
}
export interface BreachItemView {
  domains: string[];
  breachType: BreachType;
  domainIcon?: IconDataStructure;
  eventDate: string;
  id: string;
  impactedEmails: string[];
  status: BreachStatus;
  name: string;
}
export type BreachesFilterField = "breachType" | "status";
export type BreachesSortField = "id" | "eventDate";
export type BreachesDataQuery = DataQuery<
  BreachesSortField,
  BreachesFilterField
>;
export type BreachesFilterToken = FilterToken<BreachesFilterField>;
export type BreachesSortToken = SortToken<BreachesSortField>;
export type BreachesQuery = DataQuery<BreachesSortField, BreachesFilterField>;
export interface UpdateBreachStatusRequest {
  id: string;
  status: BreachStatus;
}
export interface UpdateBreachStatusSuccess {
  success: true;
}
export interface UpdateBreachStatusFailure {
  success: false;
}
export type UpdateBreachStatusResult =
  | UpdateBreachStatusSuccess
  | UpdateBreachStatusFailure;
export type BreachesFilterCriterium = FilterCriterium<BreachesFilterField>;
export type BreachesSortCriterium = SortCriterium<BreachesSortField>;
export interface BreachesFirstTokenParams {
  sortCriteria: BreachesSortCriterium[];
  filterCriteria?: BreachesFilterCriterium[];
  initialBatchSize?: number;
}
export enum BreachesUpdaterStatus {
  UNKNOWN = "unknown",
  SYNCING = "syncing",
  SKIPPED = "skipped",
  UNCHANGED = "unchanged",
  UPDATED = "updated",
  ERROR = "error",
}
