import { GeographicStateCollection } from "@dashlane/communication";
import createReducer from "../../store/reducers/create";
import { State } from "./types";
function getEmptyState(): State {
  return {
    currentSpaceId: null,
  };
}
const reducer = createReducer<State>("WEBAPP", getEmptyState());
export const userSwitchedSpace = reducer.registerAction(
  "USER_SWITCHED_SPACE",
  (state: State, currentSpaceId: State["currentSpaceId"]) => ({
    ...state,
    currentSpaceId,
  })
);
export const staticDataRetrieved = reducer.registerAction(
  "STATIC_DATA_RETRIEVED",
  (
    state: State,
    {
      geographicStates,
    }: {
      geographicStates?: GeographicStateCollection;
    }
  ) => ({ ...state, geographicStates })
);
export default reducer;
