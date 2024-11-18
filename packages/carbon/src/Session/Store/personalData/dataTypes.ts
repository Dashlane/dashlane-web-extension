import { DATAMODELOBJECT_TYPE_TO_CARBON_STORE_KEY } from "@dashlane/communication";
import { PersonalDataCollections } from "Session/Store/personalData/types";
export const PERSONAL_DATA_COLLECTIONS_KEYS = Object.keys(
  DATAMODELOBJECT_TYPE_TO_CARBON_STORE_KEY
).map(
  (key) => DATAMODELOBJECT_TYPE_TO_CARBON_STORE_KEY[key]
) as (keyof PersonalDataCollections)[];
