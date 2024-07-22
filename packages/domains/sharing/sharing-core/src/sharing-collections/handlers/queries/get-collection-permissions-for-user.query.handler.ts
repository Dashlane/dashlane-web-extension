import { combineLatestWith, map, of, switchMap } from "rxjs";
import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import { FeatureFlipsClient } from "@dashlane/framework-contracts";
import {
  GetCollectionPermissionsForUserQuery,
  SharedCollectionRole,
  SharingDisabledReason,
} from "@dashlane/sharing-contracts";
import { VaultOrganizationClient } from "@dashlane/vault-contracts";
import { getSuccess, isFailure, success } from "@dashlane/framework-types";
import { SharingCollectionAccessService } from "../common/shared-collection-access.service";
import {
  CurrentSpaceGetterService,
  CurrentSpaceSharingInfo,
  ItemGroupsGetterService,
} from "../../../sharing-carbon-helpers";
@QueryHandler(GetCollectionPermissionsForUserQuery)
export class GetCollectionPermissionsForUserQueryHandler
  implements IQueryHandler<GetCollectionPermissionsForUserQuery>
{
  constructor(
    private sharingAccess: SharingCollectionAccessService,
    private itemGroupsGetter: ItemGroupsGetterService,
    private vaultOrganization: VaultOrganizationClient,
    private currentSpace: CurrentSpaceGetterService,
    private featureFlips: FeatureFlipsClient
  ) {}
  private isCollectionsSharingEnabled(
    currentSpaceInfo: CurrentSpaceSharingInfo
  ) {
    return (
      currentSpaceInfo.isSharingEnabled &&
      currentSpaceInfo.isCollectionsSharingEnabled
    );
  }
  execute({ body }: GetCollectionPermissionsForUserQuery) {
    const { collectionId, userId } = body;
    const {
      queries: { queryCollections },
    } = this.vaultOrganization;
    const { userFeatureFlip } = this.featureFlips.queries;
    const sharingWithLimitedRightsFF$ = userFeatureFlip({
      featureFlip:
        "sharingVault_web_Share_Collections_with_limited_Rights_Items_dev",
    });
    return queryCollections({
      ids: [collectionId],
    }).pipe(
      combineLatestWith(this.currentSpace.get()),
      switchMap(([queryCollectionsResult, currentSpaceInfoResult]) => {
        if (isFailure(queryCollectionsResult)) {
          throw new Error("Error accessing private collections");
        }
        if (isFailure(currentSpaceInfoResult)) {
          throw new Error("Error accessing current space info");
        }
        const isCollectionsSharingEnabled = this.isCollectionsSharingEnabled(
          getSuccess(currentSpaceInfoResult)
        );
        const collectionsResult = getSuccess(queryCollectionsResult);
        const collection = collectionsResult.collections.find(
          ({ id }) => id === collectionId
        );
        if (collection) {
          const itemIds = collection.vaultItems.map(({ id }) => id);
          return of({
            isCollectionsSharingEnabled,
            itemIds,
            role: SharedCollectionRole.Manager,
            isPrivateCollection: true,
          });
        }
        return this.sharingAccess
          .getUserRoleInCollection$(collectionId, userId)
          .pipe(
            combineLatestWith(
              this.itemGroupsGetter.getForCollectionId(collectionId)
            ),
            map(([role, itemGroupsResult]) => {
              if (isFailure(itemGroupsResult)) {
                throw new Error(
                  "Failed to retrieve item groups for shared collection permissions query"
                );
              }
              const itemGroups = getSuccess(itemGroupsResult);
              return {
                itemIds: itemGroups.map(
                  (group) => group.items?.[0]?.itemId
                ) as string[],
                role,
                isCollectionsSharingEnabled,
                isPrivateCollection: false,
              };
            })
          );
      }),
      switchMap(
        ({
          itemIds,
          role,
          isCollectionsSharingEnabled,
          isPrivateCollection,
        }) => {
          const isManager = role === SharedCollectionRole.Manager;
          return sharingWithLimitedRightsFF$.pipe(
            switchMap((sharingWithLimitedRightsFF) => {
              let isSharingWithLimitedRightsFFEnabled: boolean;
              if (isFailure(sharingWithLimitedRightsFF)) {
                isSharingWithLimitedRightsFFEnabled = false;
              } else {
                isSharingWithLimitedRightsFFEnabled = Boolean(
                  getSuccess(sharingWithLimitedRightsFF)
                );
              }
              if (!isCollectionsSharingEnabled || !isManager) {
                return of(
                  success({
                    canShare: false,
                    canEditRoles: isManager,
                    canEdit: isManager,
                    canDelete: isManager,
                    role,
                    sharingDisabledReason: !isCollectionsSharingEnabled
                      ? SharingDisabledReason.DisabledInTAC
                      : SharingDisabledReason.EditorRole,
                  })
                );
              }
              return this.sharingAccess.canShareItems(itemIds).pipe(
                map((canSharePrivateCollection) => {
                  if (isFailure(canSharePrivateCollection)) {
                    throw new Error(
                      "Error checking if user can share a collection"
                    );
                  }
                  if (!getSuccess(canSharePrivateCollection)) {
                    return success({
                      canShare:
                        !isPrivateCollection &&
                        isSharingWithLimitedRightsFFEnabled,
                      canEditRoles: isManager,
                      canEdit: isManager,
                      canDelete: isManager,
                      role,
                      sharingDisabledReason:
                        SharingDisabledReason.LimitedRightItems,
                    });
                  }
                  return success({
                    canShare: isManager,
                    canEditRoles: isManager,
                    canEdit: isManager,
                    canDelete: isManager,
                    role,
                    sharingDisabledReason: isPrivateCollection
                      ? SharingDisabledReason.LimitedRightItems
                      : undefined,
                  });
                })
              );
            })
          );
        }
      )
    );
  }
}
