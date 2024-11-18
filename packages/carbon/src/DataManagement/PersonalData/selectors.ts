import {
  BaseDataModelObject,
  DATAMODELOBJECT_TYPE_TO_CARBON_STORE_KEY,
  DataModelType,
} from "@dashlane/communication";
import { State } from "Store";
export const personalDataItemsOfTypeSelector = (
  state: State,
  kwTypes: DataModelType[]
) =>
  state.userSession &&
  state.userSession.personalData &&
  kwTypes.reduce(
    (result: BaseDataModelObject[], kwType: DataModelType) =>
      result.concat(
        state.userSession.personalData[
          DATAMODELOBJECT_TYPE_TO_CARBON_STORE_KEY[kwType]
        ]
      ),
    []
  );
export const personalDataSelector = (state: State) =>
  state.userSession && state.userSession.personalData;
