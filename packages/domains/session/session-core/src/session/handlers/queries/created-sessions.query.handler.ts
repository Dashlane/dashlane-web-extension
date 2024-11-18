import { CarbonLegacyClient } from "@dashlane/communication";
import {
  IQueryHandler,
  QueryHandler,
  QueryHandlerResponseOf,
} from "@dashlane/framework-application";
import { isSuccess, safeCast, success } from "@dashlane/framework-types";
import { LocalSession, LocalSessionsQuery } from "@dashlane/session-contracts";
import { combineLatest, map } from "rxjs";
import { SessionsStateStore } from "../../stores/sessions-state.store";
interface LocalUserAuthenticationState {
  deviceAccessKey: string;
  ssoActivatedUser: boolean;
}
@QueryHandler(LocalSessionsQuery)
export class LocalSessionsQueryHandler
  implements IQueryHandler<LocalSessionsQuery>
{
  constructor(
    private readonly carbon: CarbonLegacyClient,
    private readonly store: SessionsStateStore
  ) {}
  execute(): QueryHandlerResponseOf<LocalSessionsQuery> {
    return combineLatest([
      this.carbon.queries.carbonStateList({
        paths: ["authentication.localUsers"],
      }),
      this.store.state$,
    ]).pipe(
      map(([carbonQuery, storeState]) => {
        if (!isSuccess(carbonQuery)) {
          throw new Error("failed to get data from carbon");
        }
        const [users] = carbonQuery.data as [
          Record<string, LocalUserAuthenticationState>
        ];
        const result = Object.entries(storeState).reduce(
          (acc, [key, val]) => ({
            ...acc,
            [key]: safeCast<LocalSession>({
              login: key,
              deviceAccessKey: users[key].deviceAccessKey,
              state: val.status,
            }),
          }),
          safeCast<Record<string, LocalSession>>({})
        );
        return success(result);
      })
    );
  }
}
