import { Action } from "Store";
import {
  SET_CHANGE_MP_DONE,
  SET_CHANGE_MP_START,
} from "Session/Store/changeMasterPassword/actions";
import { ChangeMPData } from "Session/Store/changeMasterPassword/types";
export function getEmptyChangeMPData(): ChangeMPData {
  return {
    changeMPinProgress: false,
  };
}
export default (state = getEmptyChangeMPData(), action: Action) => {
  switch (action.type) {
    case SET_CHANGE_MP_START: {
      return {
        ...state,
        changeMPinProgress: true,
      };
    }
    case SET_CHANGE_MP_DONE: {
      return {
        ...state,
        changeMPinProgress: false,
      };
    }
    default:
      return state;
  }
};
