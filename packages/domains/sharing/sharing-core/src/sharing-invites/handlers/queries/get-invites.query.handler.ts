import { combineLatest, map, switchMap, take } from "rxjs";
import {
  FrameworkRequestContextValues,
  IQueryHandler,
  QueryHandler,
  QueryHandlerResponseOf,
  RequestContext,
} from "@dashlane/framework-application";
import { getSuccess, isSuccess, success } from "@dashlane/framework-types";
import { GetInvitesQuery } from "@dashlane/sharing-contracts";
import { InviteGetterService } from "../../../sharing-carbon-helpers/services/invites-getter.service";
import { PendingCollectionsStore } from "../../store/pending-collections.store";
import {
  convertLegacyPendingCollection,
  convertLegacyPendingItemGroup,
  convertLegacyPendingUserGroup,
  getPendingCollectionsQueryObjects,
} from "./helpers";
import { FeatureFlipsClient } from "@dashlane/framework-contracts";
import { PendingUserGroupInvitesStore } from "../../store/pending-user-group-invites.store";
import { PendingSharedItemInvitesStore } from "../../store/pending-shared-item-invites.store";
import { PendingCollectionInvitesStore } from "../../store/pending-collection-invites.store";
@QueryHandler(GetInvitesQuery)
export class GetInvitesQueryHandler implements IQueryHandler<GetInvitesQuery> {
  constructor(
    private inviteGetter: InviteGetterService,
    private store: PendingCollectionsStore,
    private context: RequestContext,
    private readonly featureFlips: FeatureFlipsClient,
    private readonly pendingUserGroupsStore: PendingUserGroupInvitesStore,
    private readonly pendingItemsStore: PendingSharedItemInvitesStore,
    private readonly pendingCollectionsStore: PendingCollectionInvitesStore
  ) {}
  execute(): QueryHandlerResponseOf<GetInvitesQuery> {
    const { userFeatureFlip } = this.featureFlips.queries;
    return userFeatureFlip({
      featureFlip: "sharingVault_web_sharingSyncGrapheneMigration_dev",
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
  private executeWithNewState$() {
    return combineLatest([
      this.pendingUserGroupsStore.state$,
      this.pendingCollectionsStore.state$,
      this.pendingItemsStore.state$,
    ]).pipe(
      map(([pendingUserGroups, pendingCollections, pendingSharedItems]) =>
        success({
          pendingSharedItems,
          pendingUserGroups,
          pendingCollections,
        })
      )
    );
  }
  private executeWithCarbonState$() {
    const carbonSharingSyncState$ = this.inviteGetter.get();
    const invitesState$ = this.store.state$;
    const currentUserLogin = this.getCurrentUserLogin();
    return combineLatest([carbonSharingSyncState$, invitesState$]).pipe(
      map(([carbonSharingSyncStateResult, pendingInvites]) => {
        const carbonSharingSyncState = isSuccess(carbonSharingSyncStateResult)
          ? carbonSharingSyncStateResult.data
          : { pendingItemGroups: [], pendingUserGroups: [] };
        const pendingCollections = currentUserLogin
          ? getPendingCollectionsQueryObjects(
              pendingInvites.pendingCollections,
              currentUserLogin
            )
          : [];
        return success({
          pendingSharedItems: carbonSharingSyncState.pendingItemGroups.map(
            convertLegacyPendingItemGroup
          ),
          pendingUserGroups: carbonSharingSyncState.pendingUserGroups.map(
            convertLegacyPendingUserGroup
          ),
          pendingCollections: pendingCollections.map(
            convertLegacyPendingCollection
          ),
        });
      })
    );
  }
  private getCurrentUserLogin(): string | undefined {
    return this.context.get<string>(FrameworkRequestContextValues.UserName);
  }
}
