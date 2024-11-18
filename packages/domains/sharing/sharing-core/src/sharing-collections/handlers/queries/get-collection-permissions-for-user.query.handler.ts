import {
  combineLatestWith,
  distinctUntilChanged,
  map,
  of,
  switchMap,
} from "rxjs";
import { shallowEqualObjects } from "shallow-equal";
import {
  FrameworkRequestContextValues,
  IQueryHandler,
  QueryHandler,
  RequestContext,
} from "@dashlane/framework-application";
import { FeatureFlipsClient } from "@dashlane/framework-contracts";
import {
  getSuccess,
  isFailure,
  isSuccess,
  success,
} from "@dashlane/framework-types";
import {
  GetCollectionPermissionsForUserQuery,
  ShareableCollection,
  SharedCollectionRole,
  SharingDisabledReason,
} from "@dashlane/sharing-contracts";
import { VaultOrganizationClient } from "@dashlane/vault-contracts";
import { SharingCollectionAccessService } from "../common/shared-collection-access.service";
import {
  CurrentSpaceGetterService,
  CurrentSpaceSharingInfo,
} from "../../../sharing-carbon-helpers";
@QueryHandler(GetCollectionPermissionsForUserQuery)
export class GetCollectionPermissionsForUserQueryHandler
  implements IQueryHandler<GetCollectionPermissionsForUserQuery>
{
  constructor(
    private readonly sharingAccess: SharingCollectionAccessService,
    private readonly vaultOrganization: VaultOrganizationClient,
    private readonly currentSpace: CurrentSpaceGetterService,
    private readonly context: RequestContext,
    private readonly featureFlips: FeatureFlipsClient
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
    return queryCollections({
      ids: [collectionId],
    }).pipe(
      combineLatestWith(
        this.currentSpace.get(),
        this.featureFlips.queries.userFeatureFlip({
          featureFlip: "sharingVault_web_sharingSyncGrapheneMigration_dev",
        })
      ),
      switchMap(
        ([
          queryCollectionsResult,
          currentSpaceInfoResult,
          newSharingSyncEnabledResult,
        ]) => {
          if (isFailure(queryCollectionsResult)) {
            throw new Error("Error accessing private collections");
          }
          if (isFailure(currentSpaceInfoResult)) {
            throw new Error("Error accessing current space info");
          }
          if (isFailure(newSharingSyncEnabledResult)) {
            throw new Error(
              "Cannot retrieve FF for invite collection member command"
            );
          }
          const isCollectionsSharingEnabled = this.isCollectionsSharingEnabled(
            getSuccess(currentSpaceInfoResult)
          );
          const isNewSharingSyncEnabled = isSuccess(newSharingSyncEnabledResult)
            ? !!getSuccess(newSharingSyncEnabledResult)
            : false;
          const collectionsResult = getSuccess(queryCollectionsResult);
          const collection = collectionsResult.collections.find(
            ({ id }) => id === collectionId
          );
          if (collection) {
            return this.getPermissionsForPrivateCollection(
              collection,
              isCollectionsSharingEnabled
            );
          }
          const currentUserLogin = this.context.get<string>(
            FrameworkRequestContextValues.UserName
          );
          if (!isNewSharingSyncEnabled) {
            return this.sharingAccess
              .getUserRoleInCollectionCarbon$(
                collectionId,
                userId,
                currentUserLogin
              )
              .pipe(
                map((role) => {
                  const isManager = role === SharedCollectionRole.Manager;
                  return {
                    canShare: isCollectionsSharingEnabled && isManager,
                    canEditRoles: isManager,
                    canEdit: isManager,
                    canDelete: isManager,
                    role,
                    sharingDisabledReason: !isCollectionsSharingEnabled
                      ? SharingDisabledReason.DisabledInTAC
                      : SharingDisabledReason.EditorRole,
                  } as const;
                }),
                distinctUntilChanged(shallowEqualObjects),
                map(success)
              );
          }
          return this.sharingAccess
            .getUserRoleInCollectionGraphene$(
              collectionId,
              userId,
              currentUserLogin
            )
            .pipe(
              map((role) => {
                const isManager = role === SharedCollectionRole.Manager;
                return {
                  canShare: isCollectionsSharingEnabled && isManager,
                  canEditRoles: isManager,
                  canEdit: isManager,
                  canDelete: isManager,
                  role,
                  sharingDisabledReason: !isCollectionsSharingEnabled
                    ? SharingDisabledReason.DisabledInTAC
                    : SharingDisabledReason.EditorRole,
                } as const;
              }),
              distinctUntilChanged(shallowEqualObjects),
              map(success)
            );
        }
      )
    );
  }
  private getPermissionsForPrivateCollection(
    collection: ShareableCollection,
    isCollectionsSharingEnabled: boolean
  ) {
    if (!isCollectionsSharingEnabled) {
      return of(
        success({
          canShare: false,
          canEditRoles: true,
          canEdit: true,
          canDelete: true,
          role: SharedCollectionRole.Manager,
          sharingDisabledReason: SharingDisabledReason.DisabledInTAC,
        })
      );
    }
    const itemIds = collection.vaultItems.map(({ id }) => id);
    return this.sharingAccess.canShareItems(itemIds).pipe(
      map((canSharePrivateCollection) => {
        if (isFailure(canSharePrivateCollection)) {
          throw new Error("Error checking if user can share a collection");
        }
        const canShare = getSuccess(canSharePrivateCollection);
        return {
          canShare,
          canEditRoles: true,
          canEdit: true,
          canDelete: true,
          role: SharedCollectionRole.Manager,
          sharingDisabledReason: canShare
            ? undefined
            : SharingDisabledReason.LimitedRightItems,
        };
      }),
      distinctUntilChanged(shallowEqualObjects),
      map(success)
    );
  }
}
