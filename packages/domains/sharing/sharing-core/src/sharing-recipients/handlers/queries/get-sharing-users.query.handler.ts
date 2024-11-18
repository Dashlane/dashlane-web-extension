import { filter, map, Observable, switchMap, take } from "rxjs";
import {
  CarbonLegacyClient,
  SharingUserDataQuery,
} from "@dashlane/communication";
import {
  FrameworkRequestContextValues,
  IQueryHandler,
  QueryHandler,
  QueryHandlerResponseOf,
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
  GetSharingUsersQuery,
  SharedAccess,
  SharedAccessEntry,
  SharingItemsClient,
} from "@dashlane/sharing-contracts";
import { SortDirection } from "@dashlane/vault-contracts";
import { RecipientSharedItemService } from "../../services/recipient-shared-item.service";
@QueryHandler(GetSharingUsersQuery)
export class GetSharingUsersQueryHandler
  implements IQueryHandler<GetSharingUsersQuery>
{
  constructor(
    private readonly context: RequestContext,
    private readonly recipientItems: RecipientSharedItemService,
    private readonly sharingItemsClient: SharingItemsClient,
    private readonly carbonLegacyClient: CarbonLegacyClient,
    private readonly featureFlips: FeatureFlipsClient
  ) {}
  execute({
    body,
  }: GetSharingUsersQuery): QueryHandlerResponseOf<GetSharingUsersQuery> {
    const { spaceId, sortDirection } = body;
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
          ? this.executeWithGrapheneState$(spaceId, sortDirection)
          : this.executeWithCarbonState$(spaceId, sortDirection);
      })
    );
  }
  private executeWithCarbonState$(
    spaceId: string | null,
    sortDirection: SortDirection
  ) {
    const queryParam: SharingUserDataQuery = {
      sortToken: {
        sortCriteria: [
          {
            field: "id",
            direction: sortDirection,
          },
        ],
        uniqField: "id",
      },
      filterToken: { filterCriteria: [] },
    };
    const request = {
      dataQuery: queryParam,
      spaceId: spaceId,
    };
    return this.carbonLegacyClient.queries.getSharingUsers(request).pipe(
      map((carbonUsers) => {
        if (isFailure(carbonUsers)) {
          throw new Error("Unable to get carbon user data.");
        }
        const users = getSuccess(carbonUsers).items;
        return success(users);
      })
    );
  }
  private executeWithGrapheneState$(
    spaceId: string | null,
    sortDirection: SortDirection
  ) {
    const executeWithSpaceid = spaceId !== null;
    return executeWithSpaceid
      ? this.executeWithSpace(spaceId, sortDirection)
      : this.executeWithoutSpace(sortDirection);
  }
  private executeWithoutSpace(sortDirection: SortDirection) {
    return this.sharingItemsClient.queries.getSharedAccess().pipe(
      filter(isSuccess),
      map((sharedAccessResult) => {
        const sharedAccess = getSuccess(sharedAccessResult).sharedAccess;
        const userList = this.getSharingUsersFromSharedAccess(
          sharedAccess,
          sortDirection
        );
        return success(userList);
      })
    );
  }
  private executeWithSpace(spaceId: string, sortDirection: SortDirection) {
    return this.getVaultItemIdsInSpace(spaceId).pipe(
      switchMap((vaultItemIdsInSpace) => {
        return this.sharingItemsClient.queries.getSharedAccessForItemIds({
          itemIds: vaultItemIdsInSpace,
        });
      }),
      filter(isSuccess),
      map((sharedAccessInSpace) => {
        const sharedAccess = getSuccess(sharedAccessInSpace).sharedAccess;
        const userList = this.getSharingUsersFromSharedAccess(
          sharedAccess,
          sortDirection
        );
        return success(userList);
      })
    );
  }
  private getCurrentUserLogin(): string | undefined {
    return this.context.get<string>(FrameworkRequestContextValues.UserName);
  }
  private getVaultItemIdsInSpace(spaceId: string | null): Observable<string[]> {
    return this.recipientItems.getSharedVaultItemsForSpaceId(spaceId).pipe(
      filter(isSuccess),
      map((vaultItemsInSpaceResult) => {
        const vaultItemsInSpace = getSuccess(vaultItemsInSpaceResult);
        const vaultItemIdsInSpace = [
          ...vaultItemsInSpace.credentialsResult.items.map((item) => item.id),
          ...vaultItemsInSpace.secureNotesResult.items.map((item) => item.id),
          ...vaultItemsInSpace.secretsResult.items.map((item) => item.id),
        ];
        return vaultItemIdsInSpace;
      })
    );
  }
  private getSharingUsersFromSharedAccess(
    sharedAccess: SharedAccess[],
    sortDirection: SortDirection
  ) {
    const currentUserLogin = this.getCurrentUserLogin();
    const usersWithCountMap = new Map();
    sharedAccess.forEach((itemAccess) => {
      itemAccess.users.forEach((user: SharedAccessEntry) => {
        if (user.id === currentUserLogin || user.status !== "accepted") {
          return;
        }
        const previousCount = usersWithCountMap.has(user.id)
          ? usersWithCountMap.get(user.id).itemCount
          : 0;
        usersWithCountMap.set(user.id, {
          id: user.id,
          itemCount: previousCount + 1,
        });
      });
    });
    const userList = Array.from(usersWithCountMap.values());
    const sortedUserList = userList.sort((a, b) =>
      sortDirection === SortDirection.Ascend
        ? a.id.localeCompare(b.id)
        : b.id.localeCompare(a.id)
    );
    return sortedUserList;
  }
}
