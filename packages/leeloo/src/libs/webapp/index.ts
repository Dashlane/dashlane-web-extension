import { Store } from "redux";
import { GlobalState } from "../../store/types";
type StoreOrState = GlobalState | Store<GlobalState>;
const isReduxStore = (o: any): o is Store<{}> =>
  typeof o.getState === "function";
const getState = (o: StoreOrState): GlobalState =>
  isReduxStore(o) ? o.getState() : o;
export function getCurrentSpaceId(p: StoreOrState): string | null {
  return getState(p).webapp.currentSpaceId;
}
