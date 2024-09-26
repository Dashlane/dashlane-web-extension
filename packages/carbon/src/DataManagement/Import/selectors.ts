import {
  ImportPersonalDataState,
  ImportPersonalDataStateType,
} from "@dashlane/communication";
import { changeMPinProgressSelector } from "ChangeMasterPassword/selector";
import { State } from "Store";
export const importPersonalDataStateSelector = (
  state: State
): ImportPersonalDataState =>
  state.userSession.importPersonalData.state ?? {
    status: ImportPersonalDataStateType.Idle,
  };
export const isImportPersonalDataAvailableSelector = (state: State) =>
  !changeMPinProgressSelector(state) &&
  importPersonalDataStateSelector(state).status !==
    ImportPersonalDataStateType.Processing;
