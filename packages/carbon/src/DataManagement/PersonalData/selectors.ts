import { BaseDataModelObject, DataModelType } from "@dashlane/communication";
import { State } from "Store";
import dataTypes from "Session/Store/personalData/dataTypes";
export const personalDataItemsOfTypeSelector = (
  state: State,
  kwTypes: DataModelType[]
) =>
  state.userSession &&
  state.userSession.personalData &&
  kwTypes.reduce(
    (result: BaseDataModelObject[], kwType: DataModelType) =>
      result.concat(state.userSession.personalData[dataTypes[kwType]]),
    []
  );
export const personalDataSelector = (state: State) =>
  state.userSession && state.userSession.personalData;
