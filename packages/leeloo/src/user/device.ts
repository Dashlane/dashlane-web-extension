import { Store } from "../store/create";
import loadAndPersist from "./storage";
export function __REDACTED__(store: Store) {
  return Promise.all([
    loadAndPersist({
      store,
      storage: localStorage,
      whiteList: ["locale/languageOverride"],
    }),
  ]);
}
