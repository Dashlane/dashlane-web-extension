import { v4 as uuid } from "uuid";
import createReducer from "../store/reducers/create";
import State from "./types";
import { Permissions } from "./permissions";
const BIG_NUMBER = 2147483647;
const randomNumber = () => Math.floor(Math.random() * BIG_NUMBER);
function getEmptyState(): State {
  return {
    device: {
      externalDeviceId: uuid(),
    },
    session: {
      anonymousUserId: "{" + uuid().toUpperCase() + "}",
      login: null,
      password: null,
      permissions: {
        tacAccessPermissions: new Set(),
      },
      sessionId: randomNumber(),
      uki: null,
    },
  };
}
const reducer = createReducer<State>("USER", getEmptyState());
export const loginAndUkiLoaded = reducer.registerAction(
  "USER_LOGGED_IN_WITH_UKI",
  (
    state: State,
    {
      login,
      uki,
    }: {
      login: string;
      uki: string;
    }
  ) =>
    Object.assign({}, state, {
      session: Object.assign({}, state.session, {
        login,
        uki,
        sessionId: randomNumber(),
      }),
    })
);
export const permissionsLoaded = reducer.registerAction(
  "USER_PERMISSIONS_LOADED",
  (
    state: State,
    {
      permissions,
    }: {
      permissions: Permissions;
    }
  ) =>
    Object.assign({}, state, {
      session: Object.assign({}, state.session, {
        permissions: Object.assign({}, state.session.permissions, permissions),
      }),
    })
);
export const userLoggedOut = reducer.registerAction<void>(
  "USER_LOGGED_OUT",
  (state: State) => Object.assign({}, state, getEmptyState())
);
export default reducer;
