import { createHashHistory, History } from "history";
import { setHistory } from "../../libs/router";
function createHistory(): History {
  return createHashHistory({
    basename: "/",
    hashType: "slash",
  });
}
export function initHistory() {
  const history = createHistory();
  setHistory(history);
  return history;
}
