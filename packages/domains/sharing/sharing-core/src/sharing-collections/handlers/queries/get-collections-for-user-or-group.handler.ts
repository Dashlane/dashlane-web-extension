import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import {
  GetCollectionsForUserOrGroupQuery,
  SharedCollection,
} from "@dashlane/sharing-contracts";
import { SharedCollectionsRepository } from "../common/shared-collections.repository";
import { FeatureFlipsClient } from "@dashlane/framework-contracts";
import { combineLatestWith, map, switchMap } from "rxjs";
import {
  getSuccess,
  isFailure,
  isSuccess,
  success,
} from "@dashlane/framework-types";
import { SharingUserGroupsRepository } from "../../../sharing-recipients/services/user-groups.repository";
import { SharedCollectionsStore } from "../../store/shared-collections.store";
import { mapToLegacyCollection } from "../../data-access/shared-collections-repository.adapter";
@QueryHandler(GetCollectionsForUserOrGroupQuery)
export class GetCollectionsForUserOrGroupQueryHandler
  implements IQueryHandler<GetCollectionsForUserOrGroupQuery>
{
  constructor(
    private readonly collectionsRepository: SharedCollectionsRepository,
    private readonly userGroupsRepository: SharingUserGroupsRepository,
    private readonly featureFlips: FeatureFlipsClient,
    private readonly store: SharedCollectionsStore
  ) {}
  execute({ body }: GetCollectionsForUserOrGroupQuery) {
    const { targetId } = body;
    const { userFeatureFlip } = this.featureFlips.queries;
    return userFeatureFlip({
      featureFlip: "sharingVault_web_sharingSyncGrapheneMigration_dev",
    }).pipe(
      switchMap((newSharingSyncEnabledResult) => {
        if (isFailure(newSharingSyncEnabledResult)) {
          throw new Error(
            "Cannot retrieve FF for invite collection member command"
          );
        }
        const isNewSharingSyncEnabled = isSuccess(newSharingSyncEnabledResult)
          ? !!getSuccess(newSharingSyncEnabledResult)
          : false;
        return isNewSharingSyncEnabled
          ? this.executeWithGrapheneState$(targetId)
          : this.executeWithCarbonState$(targetId);
      })
    );
  }
  private executeWithGrapheneState$(targetId: string) {
    return this.userGroupsRepository
      .acceptedUserGroupIdsForLogin$(targetId)
      .pipe(
        combineLatestWith(this.store.state$),
        map(([userGroupIds, collectionState]) => {
          const collectionsWithTargetId: SharedCollection[] = [];
          const { collections, sharedCollectionsAccess } = collectionState;
          for (const collectionId in sharedCollectionsAccess) {
            const collectionAccess = sharedCollectionsAccess[collectionId];
            if (!collectionAccess) {
              continue;
            }
            const isUserInCollection = sharedCollectionsAccess[
              collectionId
            ].users.some((user) => user.name === targetId);
            if (isUserInCollection) {
              collectionsWithTargetId.push(
                mapToLegacyCollection(collections[collectionId])
              );
              continue;
            }
            const isGroupInCollection = sharedCollectionsAccess[
              collectionId
            ].userGroups.some((group) => group.id === targetId);
            if (isGroupInCollection) {
              collectionsWithTargetId.push(
                mapToLegacyCollection(collections[collectionId])
              );
              continue;
            }
            const isUserInGroupInCollection = sharedCollectionsAccess[
              collectionId
            ].userGroups.some((collectionGroup) =>
              userGroupIds.includes(collectionGroup.id)
            );
            if (isUserInGroupInCollection) {
              collectionsWithTargetId.push(
                mapToLegacyCollection(collections[collectionId])
              );
              continue;
            }
          }
          return success({ collections: collectionsWithTargetId });
        })
      );
  }
  private executeWithCarbonState$(targetId: string) {
    return this.userGroupsRepository
      .acceptedUserGroupIdsForLogin$(targetId)
      .pipe(
        combineLatestWith(this.collectionsRepository.getCollections()),
        map(([userGroupIds, sharedCollections]) => {
          const collections: SharedCollection[] = sharedCollections.filter(
            (collection: SharedCollection) => {
              const isUserInCollection = collection.users?.some(
                (user) => user.login === targetId
              );
              if (isUserInCollection) {
                return true;
              }
              const groupsInCollection = collection.userGroups;
              const isGroupInCollection = groupsInCollection?.some(
                (group) => group.uuid === targetId
              );
              if (isGroupInCollection) {
                return true;
              }
              const isUserInGroupInCollection = groupsInCollection?.some(
                (collectionGroup) => userGroupIds.includes(collectionGroup.uuid)
              );
              return isUserInGroupInCollection;
            }
          );
          return success({ collections });
        })
      );
  }
}
