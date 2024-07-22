import { combineLatest, distinctUntilChanged, map } from "rxjs";
import {
  IQueryHandler,
  QueryHandler,
  QueryHandlerResponseOf,
} from "@dashlane/framework-application";
import { HasInvitesQuery } from "@dashlane/sharing-contracts";
import {
  isSuccess,
  mapSuccessObservable,
  success,
} from "@dashlane/framework-types";
import { CarbonLegacyClient } from "@dashlane/communication";
import { isSharingSyncState } from "../../carbon-helpers/sharing-sync-state";
import { PendingCollectionsStore } from "../../store/pending-collections.store";
@QueryHandler(HasInvitesQuery)
export class HasInvitesQueryHandler implements IQueryHandler<HasInvitesQuery> {
  constructor(
    private carbonLegacyClient: CarbonLegacyClient,
    private store: PendingCollectionsStore
  ) {}
  execute(): QueryHandlerResponseOf<HasInvitesQuery> {
    const {
      queries: { carbonState },
    } = this.carbonLegacyClient;
    const sharingSyncState$ = carbonState({
      path: "userSession.sharingSync",
    });
    const carbonSharingSyncState$ = sharingSyncState$.pipe(
      mapSuccessObservable((state) => {
        if (!isSharingSyncState(state)) {
          throw new Error("Bad SharingSync format");
        }
        return state;
      })
    );
    const invitesState$ = this.store.state$;
    return combineLatest([carbonSharingSyncState$, invitesState$]).pipe(
      map(([carbonSharingSyncStateResult, pendingInvites]) => {
        const carbonSharingSyncState = isSuccess(carbonSharingSyncStateResult)
          ? carbonSharingSyncStateResult.data
          : { pendingItemGroups: [], pendingUserGroups: [] };
        const hasPendingItemGroups =
          carbonSharingSyncState.pendingItemGroups.length > 0;
        const hasPendingUserGroups =
          carbonSharingSyncState.pendingUserGroups.length > 0;
        const hasPendingCollections =
          pendingInvites.pendingCollections.length > 0;
        const hasInvites =
          hasPendingItemGroups || hasPendingUserGroups || hasPendingCollections;
        return hasInvites;
      }),
      distinctUntilChanged(),
      map(success)
    );
  }
}
