import { debounce } from "lodash";
import Oolong from "oolong";
import { Store } from "redux";
import { GlobalState } from "../../store/types";
import { restoreDataAction } from "./reducer";
import errorAction from "../../libs/logs/errorActions";
import preventDoubleCalls from "./prevent-double-calls";
import { Sync } from "./types";
interface Options {
  store: Store<{}>;
  storage: Storage;
  whiteList: string[];
  saveDelay?: number;
}
const KEY = "@Storage.App";
export function loadData(storage: Storage): Promise<GlobalState> {
  return new Promise((resolve) => {
    const currentStateString = storage.getItem(KEY);
    resolve(currentStateString && JSON.parse(currentStateString));
  });
}
function clearData(storage: Storage) {
  storage.removeItem(KEY);
  return Promise.resolve();
}
function saveData(state: {}, storage: Storage) {
  storage.setItem(KEY, JSON.stringify(state));
}
export function filter(state: {}, whiteList: string[]) {
  const whiteListForOolong = whiteList.map((pattern) => pattern.split("/"));
  return Oolong.pickDeep(state, ...whiteListForOolong);
}
export default function loadAndPersist({
  saveDelay,
  store,
  storage,
  whiteList,
}: Options): Promise<Sync> {
  saveDelay = saveDelay || 1000;
  preventDoubleCalls(storage);
  let stopped = false;
  return loadData(storage)
    .then((data) => {
      if (data && Object.keys(data).length) {
        store.dispatch(restoreDataAction(data));
      }
    })
    .then(() => {
      store.subscribe(
        debounce(() => {
          if (stopped) {
            return;
          }
          saveData(filter(store.getState(), whiteList), storage);
        }, saveDelay)
      );
    })
    .catch((error) => {
      store.dispatch(errorAction("Load data from storage failed", error));
    })
    .then(() => ({
      clear: () => clearData(storage),
      stop: () => {
        stopped = true;
      },
    }));
}
