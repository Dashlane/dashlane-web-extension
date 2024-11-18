import { from, map, switchMap, take } from "rxjs";
import {
  IQueryHandler,
  QueryHandler,
  QueryHandlerResponseOf,
} from "@dashlane/framework-application";
import {
  getSuccess,
  isFailure,
  isSuccess,
  success,
} from "@dashlane/framework-types";
import {
  GetSharingGroupByIdQuery,
  SharingGroup,
} from "@dashlane/sharing-contracts";
import { SharingUserGroupsRepository } from "../../services/user-groups.repository";
import { FeatureFlipsClient } from "@dashlane/framework-contracts";
import { CarbonLegacyClient } from "@dashlane/communication";
@QueryHandler(GetSharingGroupByIdQuery)
export class GetSharingGroupByIdQueryHandler
  implements IQueryHandler<GetSharingGroupByIdQuery>
{
  constructor(
    private readonly carbonLegacyClient: CarbonLegacyClient,
    private readonly featureFlips: FeatureFlipsClient,
    private readonly userGroupsRepo: SharingUserGroupsRepository
  ) {}
  execute({
    body,
  }: GetSharingGroupByIdQuery): QueryHandlerResponseOf<GetSharingGroupByIdQuery> {
    const { id } = body;
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
          ? this.executeWithGrapheneState$(id)
          : this.executeWithCarbonState$(id);
      })
    );
  }
  private executeWithGrapheneState$(
    id: string
  ): QueryHandlerResponseOf<GetSharingGroupByIdQuery> {
    return from(this.userGroupsRepo.getUserGroupForId(id)).pipe(
      map((userGroup) => {
        const group: SharingGroup = {
          id: userGroup.groupId,
          name: userGroup.name,
          users: userGroup.acceptedUsers ?? [],
        };
        return success(group);
      })
    );
  }
  private executeWithCarbonState$(
    id: string
  ): QueryHandlerResponseOf<GetSharingGroupByIdQuery> {
    return this.carbonLegacyClient.queries.getUserGroup(id).pipe(
      map((carbonGroup) => {
        if (isFailure(carbonGroup)) {
          throw new Error("Unable to get carbon user group.");
        }
        const userGroup = getSuccess(carbonGroup);
        if (!userGroup) {
          throw new Error("Unable to get carbon user group.");
        }
        const group: SharingGroup = {
          id: userGroup.id,
          name: userGroup.name,
          users: userGroup.users.map((user) => user.id),
        };
        return success(group);
      })
    );
  }
}
