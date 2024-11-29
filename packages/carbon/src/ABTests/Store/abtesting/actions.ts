import { Action } from "Store";
import { ABTesting } from "ABTests/Store/abtesting";
export const SAVE_ABTESTING_INFO = "SAVE_ABTESTING_INFO";
export const saveABTestingInfo = (abtesting: ABTesting): Action => ({
  type: SAVE_ABTESTING_INFO,
  data: Object.assign({}, abtesting),
});
