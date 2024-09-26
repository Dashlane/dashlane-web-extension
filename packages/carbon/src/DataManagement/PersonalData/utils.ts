import {
  PersonalData,
  PersonalDataCollections,
} from "Session/Store/personalData/types";
import {
  contains,
  filter,
  map,
  omit,
  pick,
  propSatisfies,
  toUpper,
  unnest,
  values,
} from "ramda";
import { BaseDataModelObject } from "@dashlane/communication";
import { PERSONAL_DATA_COLLECTIONS_KEYS } from "Session/Store/personalData/dataTypes";
export const findDataModelObject = <
  T extends {
    Id: string;
  }
>(
  id: string,
  list: T[]
): T | undefined => {
  const idToFind = (id || "").toUpperCase();
  return (list || []).find((item) => {
    if (!item?.Id) {
      return false;
    }
    return idToFind === item.Id?.toUpperCase();
  });
};
export const filterDataModelObjects = (
  personalData: PersonalData,
  ids: string[],
  excludedData: (keyof PersonalDataCollections)[]
): BaseDataModelObject[] => {
  const allDataModelObjects: BaseDataModelObject[] = unnest(
    values(
      omit(excludedData, pick(PERSONAL_DATA_COLLECTIONS_KEYS, personalData))
    )
  );
  const uppercaseIds = map(toUpper, ids);
  const isMatchingAnId = propSatisfies<string, BaseDataModelObject>(
    (itemId: string) => {
      return contains((itemId || "").toUpperCase(), uppercaseIds);
    },
    "Id"
  );
  return filter(isMatchingAnId, allDataModelObjects);
};
