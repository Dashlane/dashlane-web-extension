import mergeOptions from "merge-options";
import createReducer from "../../store/reducers/create";
import { GlobalState } from "../../store/types";
const reducer = createReducer<GlobalState>("PERSISTENCE", {} as GlobalState);
export const restoreDataAction = reducer.registerAction(
  "RESTORE_DATA",
  (state: GlobalState, content: {}) => {
    return mergeOptions({}, state, content);
  }
);
const { apply } = reducer;
export default apply;
