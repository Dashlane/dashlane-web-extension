import appReducer from "../../app/reducer";
import createStore from "../../store/create";
export function initStore() {
  return createStore(appReducer);
}
