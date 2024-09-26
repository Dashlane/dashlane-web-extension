import { ImportPersonalDataStateType } from "@dashlane/communication";
import {
  NOTIFY_NEW_PERSONAL_DATA_STATE,
  NotifyNewImportPersonalDataStateAction,
} from "./actions";
import { ImportPersonalDataStoreData } from "./types";
export const ImportDataStateReducer = (
  data: ImportPersonalDataStoreData,
  action: NotifyNewImportPersonalDataStateAction
): ImportPersonalDataStoreData => {
  switch (action.type) {
    case NOTIFY_NEW_PERSONAL_DATA_STATE:
      return {
        state: action.newState,
      };
    default: {
      return data ?? { state: { status: ImportPersonalDataStateType.Idle } };
    }
  }
};
