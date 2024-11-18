import { distinctUntilChanged, map, of, switchMap, take } from "rxjs";
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
import { GetSharingStatusForItemQuery } from "@dashlane/sharing-contracts";
import { ItemGroupsGetterService } from "../../../sharing-carbon-helpers";
import { SharingUserGroupsRepository } from "../../../sharing-recipients/services/user-groups.repository";
import { SharedItemsRepository } from "../common/shared-items-repository";
@QueryHandler(GetSharingStatusForItemQuery)
export class GetSharingStatusForItemQueryHandler
  implements IQueryHandler<GetSharingStatusForItemQuery>
{
  constructor(
    private itemGroupGetter: ItemGroupsGetterService,
    private userGroupRepository: SharingUserGroupsRepository,
    private readonly sharedItemsRepository: SharedItemsRepository,
    private context: RequestContext,
    private readonly featureFlips: FeatureFlipsClient
  ) {}
  private getCurrentUserLogin(): string | undefined {
    return this.context.get<string>(FrameworkRequestContextValues.UserName);
  }
  execute({ body }: GetSharingStatusForItemQuery) {
    const { itemId } = body;
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
          ? this.executeWithGrapheneState$(itemId)
          : this.executeWithCarbonState$(itemId);
      })
    );
  }
  private executeWithGrapheneState$(itemId: string) {
    return this.sharedItemsRepository.sharedAccessForId$(itemId).pipe(
      switchMap((sharedAccess) => {
        if (!sharedAccess) {
          return of({
            isShared: false,
            isSharedViaUserGroup: false,
          } as const);
        }
        const userLogin = this.getCurrentUserLogin();
        if (!userLogin) {
          throw new Error(
            "No user login found to check sharing status for item"
          );
        }
        return this.userGroupRepository
          .acceptedUserGroupIdsForLogin$(userLogin)
          .pipe(
            map((myUserGroupIds) => {
              const isSharedViaUserGroup = sharedAccess.userGroups.some(
                ({ id, status }) =>
                  myUserGroupIds.includes(id) && status === "accepted"
              );
              return { isShared: true, isSharedViaUserGroup } as const;
            })
          );
      }),
      distinctUntilChanged(shallowEqualObjects),
      map(success)
    );
  }
  private executeWithCarbonState$(itemId: string) {
    return this.itemGroupGetter.getForItemId(itemId).pipe(
      switchMap((itemGroupResult) => {
        if (isFailure(itemGroupResult)) {
          throw new Error(
            "Error when retrieving item group to check sharing status"
          );
        }
        const itemGroup = getSuccess(itemGroupResult);
        if (!itemGroup) {
          return of({
            isShared: false,
            isSharedViaUserGroup: false,
          } as const);
        }
        const userLogin = this.getCurrentUserLogin();
        if (!userLogin) {
          throw new Error(
            "No user login found to check sharing status for item"
          );
        }
        return this.userGroupRepository
          .acceptedUserGroupIdsForLogin$(userLogin)
          .pipe(
            map((myUserGroupIds) => {
              const isSharedViaUserGroup =
                itemGroup.groups?.some(
                  ({ groupId, status }) =>
                    myUserGroupIds.includes(groupId) && status === "accepted"
                ) ?? false;
              return { isShared: true, isSharedViaUserGroup } as const;
            })
          );
      }),
      distinctUntilChanged(shallowEqualObjects),
      map(success)
    );
  }
}
