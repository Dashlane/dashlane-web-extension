import { catchError, map, pairwise, startWith, switchMap } from "rxjs";
import { ClientsOf } from "@dashlane/framework-contracts";
import { NotAllowedReason } from "@dashlane/session-contracts";
import { getSuccessOrThrow } from "@dashlane/framework-types";
import { LeelooDependencies } from "../../libs/application-dependencies";
import { State } from "../../libs/carbon/types";
import * as actions from "../../libs/carbon/reducer";
import { carbonConnector } from "../../libs/carbon/connector";
import { Store } from "../../store/create";
import * as userActions from "../../user/reducer";
export async function initLoginStatus(
  store: Store,
  clients: ClientsOf<LeelooDependencies>
) {
  console.log("[leeloo] Running initLoginStatus app entry gate");
  const initLoginQuery$ = clients.vaultAccess.queries.isAllowed().pipe(
    map(getSuccessOrThrow),
    startWith(null),
    pairwise(),
    switchMap(async ([previous, data]) => {
      if (!data) {
        throw new Error("should not happen");
      }
      if (
        !data.isAllowed &&
        data.reasons.includes(NotAllowedReason.NoActiveUser)
      ) {
        console.log(
          "[leeloo] initLoginStatus app entry gate: no active user",
          `(reasons: ${String(data.reasons)})`
        );
        let state: Partial<State> = {
          loginStatus: { loggedIn: false, login: "" },
        };
        const { abtesting, localAccounts, currentLocation } =
          store.getState().carbon;
        state = Object.assign({}, actions.emptyState, {
          abtesting,
          localAccounts,
          currentLocation,
        });
        store.dispatch(userActions.userLoggedOut());
        store.dispatch(actions.loginStatusUpdated(state));
        return;
      }
      const { uki } = await carbonConnector.getUki(null);
      const login = (await carbonConnector.getUserLogin()) ?? "";
      const needsSSOMigration =
        !data.isAllowed &&
        (data.reasons.includes(NotAllowedReason.RequiresMP2SSOMigration) ||
          data.reasons.includes(NotAllowedReason.RequiresSSO2MPMigration));
      console.log(
        "[leeloo] initLoginStatus app entry gate: active user",
        `(previous: ${JSON.stringify(previous)})`,
        `(data: ${JSON.stringify(data)})`,
        `(needsSSOMigration: ${JSON.stringify(needsSSOMigration)})`,
        `(login: ${String(login)})`,
        `(uki: ${String(!!uki)})`
      );
      if (
        !previous ||
        (!previous?.isAllowed &&
          previous?.reasons.includes(NotAllowedReason.NoActiveUser))
      ) {
        store.dispatch(
          userActions.loginAndUkiLoaded({
            uki,
            login: login,
          })
        );
      }
      if (!needsSSOMigration) {
        const state: Partial<State> = {
          loginStatus: { loggedIn: true, login, needsSSOMigration },
        };
        store.dispatch(actions.loginStatusUpdated(state));
      }
    }),
    catchError((err) => {
      console.log("[leeloo] Error during initLoginStatus app entry gate", err);
      throw err;
    })
  );
  await new Promise((resolve) => {
    initLoginQuery$.subscribe(resolve);
  });
  console.log("[leeloo] Done running initLoginStatus app entry gate");
}
