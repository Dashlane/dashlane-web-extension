import { distinctUntilChanged, map, switchMap } from "rxjs";
import { equals as isDeepEqual } from "ramda";
import {
  FrameworkRequestContextValues,
  IQueryHandler,
  QueryHandler,
  RequestContext,
} from "@dashlane/framework-application";
import { safeCast, success } from "@dashlane/framework-types";
import {
  GetSharingStatusForItemsQuery,
  SharingStatus,
} from "@dashlane/sharing-contracts";
import { SharingUserGroupsRepository } from "../../../sharing-recipients/services/user-groups.repository";
import { SharedItemsRepository } from "../common/shared-items-repository";
@QueryHandler(GetSharingStatusForItemsQuery)
export class GetSharingStatusForItemsQueryHandler
  implements IQueryHandler<GetSharingStatusForItemsQuery>
{
  constructor(
    private userGroupRepository: SharingUserGroupsRepository,
    private context: RequestContext,
    private readonly sharedItemsRepository: SharedItemsRepository
  ) {}
  private getCurrentUserLogin(): string | undefined {
    return this.context.get<string>(FrameworkRequestContextValues.UserName);
  }
  execute({ body }: GetSharingStatusForItemsQuery) {
    const { itemIds } = body;
    return this.sharedItemsRepository.sharedAccessesById$(itemIds).pipe(
      switchMap((sharedAccesses) => {
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
              const result: Record<string, SharingStatus> = Object.entries(
                sharedAccesses
              ).reduce((acc, [itemId, sharedAccess]) => {
                const isSharedViaUserGroup = sharedAccess.userGroups.some(
                  ({ id, status }) =>
                    myUserGroupIds.includes(id) && status === "accepted"
                );
                acc[itemId] = {
                  isShared: true,
                  isSharedViaUserGroup,
                };
                return acc;
              }, safeCast<Record<string, SharingStatus>>({}));
              return result;
            })
          );
      }),
      distinctUntilChanged((a, b) => isDeepEqual(a, b)),
      map(success)
    );
  }
}
