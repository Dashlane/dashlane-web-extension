import {
  combineLatest,
  distinctUntilChanged,
  map,
  switchMap,
  take,
} from "rxjs";
import {
  IQueryHandler,
  QueryHandler,
  QueryHandlerResponseOf,
} from "@dashlane/framework-application";
import { FeatureFlipsClient } from "@dashlane/framework-contracts";
import {
  HasInvitesQuery,
  SharingSyncFeatureFlips,
} from "@dashlane/sharing-contracts";
import {
  getSuccess,
  isSuccess,
  mapSuccessObservable,
  success,
} from "@dashlane/framework-types";
import { CarbonLegacyClient } from "@dashlane/communication";
import { isSharingSyncState } from "../../carbon-helpers/sharing-sync-state";
import { PendingCollectionsStore } from "../../store/pending-collections.store";
import { PendingSharedItemInvitesStore } from "../../store/pending-shared-item-invites.store";
import { PendingUserGroupInvitesStore } from "../../store/pending-user-group-invites.store";
import { PendingCollectionInvitesStore } from "../../store/pending-collection-invites.store";
@QueryHandler(HasInvitesQuery)
export class HasInvitesQueryHandler implements IQueryHandler<HasInvitesQuery> {
  constructor(
    private readonly carbonLegacyClient: CarbonLegacyClient,
    private readonly pendingCollectionsStore: PendingCollectionsStore,
    private readonly pendingCollectionInvitesStore: PendingCollectionInvitesStore,
    private readonly pendingItemsStore: PendingSharedItemInvitesStore,
    private readonly pendingUserGroupsStore: PendingUserGroupInvitesStore,
    private readonly featureFlips: FeatureFlipsClient
  ) {}
  execute(): QueryHandlerResponseOf<HasInvitesQuery> {
    const { userFeatureFlip } = this.featureFlips.queries;
    return userFeatureFlip({
      featureFlip: SharingSyncFeatureFlips.SharingSyncGrapheneMigrationDev,
    }).pipe(
      take(1),
      switchMap((isNewSharingSyncEnabledResult) => {
        const isNewSharingSyncEnabled = isSuccess(isNewSharingSyncEnabledResult)
          ? !!getSuccess(isNewSharingSyncEnabledResult)
          : false;
        return isNewSharingSyncEnabled
          ? this.executeWithNewState$()
          : this.executeWithCarbonState$();
      })
    );
  }
  executeWithNewState$(): QueryHandlerResponseOf<HasInvitesQuery> {
    const pendingItemsState$ = this.pendingItemsStore.state$;
    const pendingUserGroupsState$ = this.pendingUserGroupsStore.state$;
    const pendingCollectionsState$ = this.pendingCollectionInvitesStore.state$;
    return combineLatest([
      pendingCollectionsState$,
      pendingItemsState$,
      pendingUserGroupsState$,
    ]).pipe(
      map(([pendingCollections, pendingItems, pendingUserGroups]) => {
        const hasPendingCollections = pendingCollections.length > 0;
        const hasGraphenePendingItem = pendingItems.length > 0;
        const hasGraphenePendingUserGroups = pendingUserGroups.length > 0;
        const hasInvites =
          hasPendingCollections ||
          hasGraphenePendingItem ||
          hasGraphenePendingUserGroups;
        return hasInvites;
      }),
      distinctUntilChanged(),
      map(success)
    );
  }
  executeWithCarbonState$(): QueryHandlerResponseOf<HasInvitesQuery> {
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
    const pendingCollectionsState$ = this.pendingCollectionsStore.state$;
    return combineLatest([
      carbonSharingSyncState$,
      pendingCollectionsState$,
    ]).pipe(
      map(([carbonSharingSyncStateResult, pendingCollections]) => {
        const carbonSharingSyncState = isSuccess(carbonSharingSyncStateResult)
          ? carbonSharingSyncStateResult.data
          : { pendingItemGroups: [], pendingUserGroups: [] };
        const hasCarbonPendingItemGroups =
          carbonSharingSyncState.pendingItemGroups.length > 0;
        const hasCarbonPendingUserGroups =
          carbonSharingSyncState.pendingUserGroups.length > 0;
        const hasPendingCollections =
          pendingCollections.pendingCollections.length > 0;
        const hasInvites =
          hasCarbonPendingItemGroups ||
          hasCarbonPendingUserGroups ||
          hasPendingCollections;
        return hasInvites;
      }),
      distinctUntilChanged(),
      map(success)
    );
  }
}
