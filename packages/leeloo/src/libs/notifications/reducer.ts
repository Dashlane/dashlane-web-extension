import createReducer from "../../store/reducers/create";
import { State } from "./types";
export default createReducer<State>("NOTIFICATIONS", {
  list: [],
});
