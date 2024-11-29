import createReducer from "../../store/reducers/create";
import { State } from "./types";
const reducer = createReducer<State>("ie-drop-notification", {
  displayIeDropNotification: true,
});
export const closeIeNotificationAction = reducer.registerAction<void>(
  "IE_DROP_NOTIFICATION",
  () => ({
    displayIeDropNotification: false,
  })
);
export default reducer;
