import {
  GeographicStateQuery,
  GeographicStateResult,
  StaticDataQueryType,
} from "@dashlane/communication";
import { getStatesForLocaleFormats } from "StaticData/GeographicStates/services";
export function processQuery(
  query: GeographicStateQuery
): GeographicStateResult {
  return {
    type: StaticDataQueryType.GEOGRAPHIC_STATES,
    collection: getStatesForLocaleFormats(query.level, query.localeFormats),
  };
}
