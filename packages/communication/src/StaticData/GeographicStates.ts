import { Country } from "..";
import { StaticDataQueryType, StaticDataQueryBase } from "./Common";
export type GeographicStateValue = string;
export enum GeographicStateLevel {
  LEVEL_0,
  LEVEL_1,
}
export type GeographicStateMap = {
  [stateValue: string]: {
    code: string;
    name: string;
  };
};
export type GeographicStateCollection = {
  [localeFormat in Country]?: GeographicStateMap;
};
export interface GeographicStateResult extends StaticDataQueryBase {
  type: StaticDataQueryType.GEOGRAPHIC_STATES;
  collection: GeographicStateCollection;
}
export interface GeographicStateQuery extends StaticDataQueryBase {
  type: StaticDataQueryType.GEOGRAPHIC_STATES;
  level: GeographicStateLevel;
  localeFormats?: Country[];
}
