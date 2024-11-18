import { FilterToken, SortToken } from "@dashlane/communication";
export interface PositionCursor {
  type: "positional";
  sortValues: string[];
  uniqValue: string;
}
export interface InfiniteCursor {
  type: "infinite";
}
export interface ZeroCursor {
  type: "zero";
}
export type EndCursor = PositionCursor | InfiniteCursor;
export type StartCursor = PositionCursor | ZeroCursor;
export interface Token<S extends string, F extends string> {
  sortToken: SortToken<S>;
  filterToken: FilterToken<F>;
  initialBatchSize: number;
  endCursor: EndCursor;
  startCursor: StartCursor;
}
