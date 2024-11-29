import { GetABTestingVersionDetailsResult as ABTesting } from "Libs/WS/Premium";
import { Action } from "Store";
import { SAVE_ABTESTING_INFO } from "ABTests/Store/abtesting/actions";
export { ABTesting };
export default (state = getEmptyABTesting(), action: Action): ABTesting => {
  switch (action.type) {
    case SAVE_ABTESTING_INFO:
      return Object.assign({}, state, { ...action.data });
    default:
      return state;
  }
};
export function getEmptyABTesting(): ABTesting {
  return {
    details: [],
    version: "control2016_all",
    success: null,
  };
}
