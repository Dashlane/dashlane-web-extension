import { createSelector } from "reselect";
import { equals } from "ramda";
import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { GetLoginStatus } from "@dashlane/communication";
import { StateOperator } from "Shared/Live";
import { State } from "Store";
import { Account } from "Session/Store/account";
import { sessionIdSelector } from "./session.selectors";
import { ssoMigrationInfoSelector } from "./sso.selectors";
import type * as _ from "@dashlane/authentication-contracts";
const isAuthenticatedSelector = (state: State): boolean =>
  state.userSession.account.isAuthenticated;
const isUserAuthenticatedSelector = createSelector(
  sessionIdSelector,
  isAuthenticatedSelector,
  (sessionId, isAuthenticated) => sessionId && isAuthenticated
);
const accountInfoSelector = (state: State): Account =>
  state.userSession.account;
export const loginStatusSelector = createSelector(
  isUserAuthenticatedSelector,
  accountInfoSelector,
  ssoMigrationInfoSelector,
  (isUserAuthenticated, accountInfo, needsSSOMigration) => {
    if (!isUserAuthenticated) {
      return { login: null, loggedIn: false, needsSSOMigration: false };
    }
    const { isAuthenticated, login } = accountInfo;
    return {
      loggedIn: isAuthenticated,
      login,
      needsSSOMigration: needsSSOMigration !== undefined,
    };
  }
);
export const getLoginStatus$ = (): StateOperator<GetLoginStatus> =>
  pipe(map(loginStatusSelector), distinctUntilChanged<GetLoginStatus>(equals));
