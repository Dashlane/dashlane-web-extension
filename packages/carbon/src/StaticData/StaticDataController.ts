import {
  QueryStaticDataCollectionsRequest,
  QueryStaticDataCollectionsResponse,
  StaticDataQuery,
  StaticDataQueryType,
} from "@dashlane/communication";
import { processQuery as processGeographicStatesQuery } from "StaticData/GeographicStates";
export interface StaticDataController {
  query: (
    request: QueryStaticDataCollectionsRequest
  ) => QueryStaticDataCollectionsResponse;
}
export const makeStaticDataController = (): StaticDataController => {
  return {
    query,
  };
};
class UnknownQueryTypeError extends Error {
  public constructor(query: never) {
    super(`Unexpected StaticDataQuery type (${query})`);
  }
}
function processQueries(queries: StaticDataQuery[]) {
  return queries.map((query) => {
    switch (query.type) {
      case StaticDataQueryType.GEOGRAPHIC_STATES:
        return processGeographicStatesQuery(query);
      default:
        throw new UnknownQueryTypeError(query.type);
    }
  });
}
function query(
  request: QueryStaticDataCollectionsRequest
): QueryStaticDataCollectionsResponse {
  try {
    return {
      results: processQueries(request.queries),
      error: null,
    };
  } catch (error) {
    return {
      results: [],
      error,
    };
  }
}
