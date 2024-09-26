import { Country, EmbeddedAttachment } from "../DataModel";
export type SortDirection = "ascend" | "descend";
export interface SortCriterium<A extends string> {
  field: A;
  direction: SortDirection;
}
export interface SortToken<S extends string> {
  sortCriteria: SortCriterium<S>[];
  uniqField: S;
}
export type FilterCriterium<A extends string> =
  | {
      field: A;
      type: "equals";
      value: string | boolean | number;
    }
  | {
      field: A;
      type: "differs";
      value: string | boolean | number;
    }
  | {
      type: "matches";
      value: string;
    }
  | {
      field: A;
      type: "in";
      value: (string | boolean | number)[];
    }
  | {
      field: A;
      type: "contains";
      value: string | boolean | number;
    };
export interface FilterToken<A extends string> {
  filterCriteria: FilterCriterium<A>[];
}
export interface DataQuery<S extends string, F extends string> {
  sortToken: SortToken<S>;
  filterToken: FilterToken<F>;
  limit?: number;
}
type MapperResult = string | number | boolean;
export type Mapper<Data> = (d: Data) => MapperResult | MapperResult[];
export type Mappers<
  Data,
  SortField extends string,
  FilterField extends string
> = {
  [key in SortField | FilterField]: Mapper<Data>;
};
export type Match<T> = (query: string, item: T) => boolean;
export interface BaseDataModelItemView {
  id: string;
}
export interface DataModelItemView extends BaseDataModelItemView {
  hasAttachments: boolean;
  kwType: string;
  lastUse?: number;
  localeFormat: Country;
  spaceId: string;
}
export interface BaseDataModelDetailView {
  id: string;
}
export interface DataModelDetailView extends BaseDataModelDetailView {
  attachments: EmbeddedAttachment[];
  kwType: string;
  lastUse?: number;
  localeFormat: Country;
  spaceId: string;
}
