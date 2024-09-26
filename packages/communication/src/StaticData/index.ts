import {
  GeographicStateQuery,
  GeographicStateResult,
} from "./GeographicStates";
export type StaticDataQuery = GeographicStateQuery;
export type StaticDataResult = GeographicStateResult;
export interface QueryStaticDataCollectionsRequest {
  queries: StaticDataQuery[];
}
export interface QueryStaticDataCollectionsResponse {
  results: StaticDataResult[];
  error?: Error;
}
export { StaticDataQueryType } from "./Common";
export * from "./GeographicStates";
export * from "./types";
export * from "./static-data-slots";
