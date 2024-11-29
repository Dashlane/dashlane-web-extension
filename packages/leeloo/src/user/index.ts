import { Maybe } from "tsmonad";
import { Store } from "redux";
import type { GlobalState } from "../store/types";
import { getCurrentTeamId } from "../libs/carbon/spaces";
import type { Auth } from "./types";
export type { Auth } from "./types";
type StoreOrState = GlobalState | Store<GlobalState>;
const isReduxStore = (o: any): o is Store<{}> =>
  typeof o.getState === "function";
const getState = (o: StoreOrState): GlobalState =>
  isReduxStore(o) ? o.getState() : o;
export const getLogin = (p: StoreOrState) => getState(p).user.session.login;
export const getAuth = (p: StoreOrState): Auth | null => {
  const login = getLogin(p);
  const uki = getState(p).user.session.uki;
  return uki
    ? {
        login: login || null,
        uki: uki || null,
        teamId: getCurrentTeamId(getState(p)),
      }
    : null;
};
export const getPassword = (p: StoreOrState): Maybe<string> =>
  Maybe.maybe(getState(p).user.session.password);
export const getSessionId = (p: StoreOrState): number =>
  getState(p).user.session.sessionId;
export const getUserId = (p: StoreOrState): string =>
  getState(p).user.session.anonymousUserId;
export const getExternalDeviceId = (p: StoreOrState): string =>
  getState(p).user.device.externalDeviceId;
