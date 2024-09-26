import { Collection } from "@dashlane/communication";
import { findDataModelObject } from "DataManagement/PersonalData/utils";
import { State } from "Store";
export const collectionsSelector = (state: State): Collection[] =>
  state.userSession.personalData.collections;
export const collectionSelector = (
  state: State,
  collectionId: string
): Collection => {
  const collections = collectionsSelector(state);
  return findDataModelObject(collectionId, collections);
};
