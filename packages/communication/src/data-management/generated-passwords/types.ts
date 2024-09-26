import {
  DataQuery,
  FilterCriterium,
  FilterToken,
  SortCriterium,
  SortToken,
} from "../types";
export type GeneratedPasswordsFilterField = "domain";
export type GeneratedPasswordsSortField = "id" | "domain" | "generatedDate";
export type GeneratedPasswordsDataQuery = DataQuery<
  GeneratedPasswordsSortField,
  GeneratedPasswordsFilterField
>;
export interface GeneratedPasswordItemView {
  domain: string;
  generatedDate: number;
  password: string;
  id: string;
  platform: string;
}
export type GeneratedPasswordFilterToken =
  FilterToken<GeneratedPasswordsFilterField>;
export type GeneratedPasswordSortToken = SortToken<GeneratedPasswordsSortField>;
export interface SaveGeneratedPasswordRequest {
  password: string;
  url?: string;
}
export type GeneratedPasswordFilterCriterium =
  FilterCriterium<GeneratedPasswordsFilterField>;
export type GeneratedPasswordSortCriterium =
  SortCriterium<GeneratedPasswordsSortField>;
export interface GeneratedPasswordFirstTokenParams {
  sortCriteria: GeneratedPasswordSortCriterium[];
  filterCriteria?: GeneratedPasswordFilterCriterium[];
  initialBatchSize?: number;
}
