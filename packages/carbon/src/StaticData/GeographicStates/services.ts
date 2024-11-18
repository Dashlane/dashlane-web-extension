import {
  Country,
  GeographicStateCollection,
  GeographicStateLevel,
  GeographicStateMap,
  GeographicStateValue,
} from "@dashlane/communication";
import {
  GeographicStateLevelMap,
  GeographicStatesLevel0,
  GeographicStatesLevel1,
} from "StaticData/GeographicStates/data";
function getAllStatesForCountry(countryCode: Country): GeographicStateMap {
  return {
    ...(GeographicStatesLevel0[countryCode] || {}),
    ...(GeographicStatesLevel1[countryCode] || {}),
  };
}
export function isStateValid(
  countryCode: Country,
  stateValue: GeographicStateValue
): boolean {
  return stateValue in getAllStatesForCountry(countryCode);
}
export function getStatesForLocaleFormats(
  level: GeographicStateLevel,
  localeFormats?: Country[]
): GeographicStateCollection {
  const statesData =
    level === GeographicStateLevel.LEVEL_0
      ? GeographicStatesLevel0
      : GeographicStatesLevel1;
  if (!localeFormats) {
    return statesData;
  }
  return localeFormats
    .filter((localeFormat) => !!statesData[localeFormat])
    .reduce((collection, localeFormat) => {
      return Object.assign({}, collection, {
        [localeFormat]: statesData[localeFormat],
      });
    }, {});
}
const findStateNameInGeographicStateMap = (
  stateReference: string,
  stateMap: GeographicStateLevelMap
) => {
  let name = "";
  if (!stateReference) {
    return name;
  }
  const countries = Object.keys(stateMap);
  for (let idx = 0; idx < countries.length && !name; idx++) {
    name = stateMap[countries[idx]]?.[stateReference]?.name ?? "";
  }
  return name || stateReference;
};
export const findStateName = (stateReference: string): string =>
  findStateNameInGeographicStateMap(stateReference, GeographicStatesLevel0);
export const findStateLevel2Name = (stateReference: string): string =>
  findStateNameInGeographicStateMap(stateReference, GeographicStatesLevel1);
export const findStateCode = (countryCode: string, stateReference: string) => {
  return GeographicStatesLevel0[countryCode]?.[stateReference]?.code ?? "";
};
