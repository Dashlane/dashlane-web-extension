import { firstValueFrom } from "rxjs";
import {
  CommandHandler,
  type CommandHandlerResponseOf,
  type ICommandHandler,
} from "@dashlane/framework-application";
import { ServerApiClient } from "@dashlane/framework-dashlane-application";
import { getSuccess, isFailure, success } from "@dashlane/framework-types";
import { RunSharingSyncCommand } from "@dashlane/sharing-contracts";
import { CurrentUserWithKeysGetterService } from "../../sharing-carbon-helpers";
import { SharingSyncUserGroupsService } from "./services/sharing-sync-user-groups.service";
import { SharingSyncCollectionsService } from "./services/sharing-sync-collections.service";
import { SharingSyncItemsService } from "./services/sharing-sync-items.service";
import { SharingSyncTeamAdminSharingDataService } from "./services/sharing-sync-team-admin-sharing-data.service";
@CommandHandler(RunSharingSyncCommand)
export class RunSharingSyncUseCase
  implements ICommandHandler<RunSharingSyncCommand>
{
  constructor(
    private readonly serverApiClient: ServerApiClient,
    private readonly currentUserGetter: CurrentUserWithKeysGetterService,
    private readonly itemsService: SharingSyncItemsService,
    private readonly userGroupsService: SharingSyncUserGroupsService,
    private readonly collectionsService: SharingSyncCollectionsService,
    private readonly teamAdminSharingDataService: SharingSyncTeamAdminSharingDataService
  ) {}
  async execute({
    body,
  }: RunSharingSyncCommand): CommandHandlerResponseOf<RunSharingSyncCommand> {
    const { summary } = body;
    const {
      collections: collectionsSummary,
      userGroups: userGroupsSummary,
      itemGroups: sharedItemsSummary,
      items: itemsSummary,
    } = summary;
    const currentUser = await this.currentUserGetter.getCurrentUserWithKeys();
    const {
      newUserGroupIds,
      updateUserGroupIds,
      unchangedUserGroups,
      isUserGroupsSyncNeeded,
    } = await this.userGroupsService.getUserGroupChangesFromSummary(
      userGroupsSummary
    );
    const {
      newCollectionIds,
      updatedCollectionIds,
      unchangedCollections,
      isCollectionsSyncNeeded,
    } = await this.collectionsService.getCollectionsChangesFromSummary(
      collectionsSummary
    );
    const {
      newItemGroupIds,
      updatedItemGroupIds,
      unchangedItemGroups,
      isSharedItemsSyncNeeded,
    } = await this.itemsService.getSharedItemsChangesFromSummary(
      sharedItemsSummary
    );
    const {
      newItemsIds,
      updatedItemsIds,
      unchangedItems,
      revokedIds,
      isItemsSyncNeeded,
    } = await this.itemsService.getItemsChangesFromSummary(
      itemsSummary,
      updatedItemGroupIds
    );
    const teamAdminSharingDataSummary =
      await this.teamAdminSharingDataService.getTeamAdminSharingDataSummary(
        userGroupsSummary,
        sharedItemsSummary,
        itemsSummary
      );
    let userGroupIds = newUserGroupIds.concat(updateUserGroupIds);
    let itemGroupIds = newItemGroupIds.concat(updatedItemGroupIds);
    let itemIds = newItemsIds.concat(updatedItemsIds);
    if (teamAdminSharingDataSummary) {
      const {
        itemGroupId,
        itemIds: itemIdsToExclude,
        userGroupId,
      } = teamAdminSharingDataSummary;
      if (itemGroupId) {
        itemGroupIds = itemGroupIds.filter((id) => id !== itemGroupId);
      }
      if (userGroupId) {
        userGroupIds = userGroupIds.filter((id) => id !== userGroupId);
      }
      if (itemIdsToExclude?.length) {
        itemIds = itemIds.filter((id) => !itemIdsToExclude.includes(id));
      }
    }
    const collectionIds = newCollectionIds.concat(updatedCollectionIds);
    const {
      updatedUserGroups,
      updatedCollectionDownloads,
      updatedItemGroups,
      updatedItems,
    } = await this.getSharingDetails({
      userGroupIds,
      collectionIds,
      itemGroupIds,
      itemIds,
    });
    if (isUserGroupsSyncNeeded) {
      await this.userGroupsService.syncUserGroups(
        updatedUserGroups,
        unchangedUserGroups,
        currentUser
      );
    }
    if (isCollectionsSyncNeeded) {
      await this.collectionsService.syncCollections(
        updatedCollectionDownloads,
        unchangedCollections,
        currentUser
      );
    }
    if (isSharedItemsSyncNeeded || isItemsSyncNeeded) {
      await this.itemsService.syncSharedItems(
        updatedItemGroups,
        unchangedItemGroups,
        updatedItems,
        unchangedItems,
        currentUser
      );
    }
    await this.teamAdminSharingDataService.syncTeamAdminSharingData(
      teamAdminSharingDataSummary,
      updatedUserGroups,
      updatedItemGroups,
      updatedItems,
      currentUser
    );
    await this.itemsService.deleteItems(revokedIds);
    return success(undefined);
  }
  private async getSharingDetails({
    userGroupIds,
    itemGroupIds,
    itemIds,
    collectionIds,
  }: {
    userGroupIds: string[];
    itemGroupIds: string[];
    itemIds: string[];
    collectionIds: string[];
  }) {
    if (
      userGroupIds.length ||
      itemGroupIds.length ||
      itemIds.length ||
      collectionIds.length
    ) {
      const result = await firstValueFrom(
        this.serverApiClient.v1.sharingUserdevice.postSharingUserdevice({
          collectionIds,
          userGroupIds,
          itemGroupIds,
          itemIds,
        })
      );
      if (isFailure(result)) {
        throw new Error("Error getting sharing updates");
      }
      const { data } = getSuccess(result);
      const {
        userGroups: updatedUserGroups,
        collections: updatedCollectionDownloads,
        itemGroups: updatedItemGroups,
        items: updatedItems,
      } = data;
      return {
        updatedUserGroups: updatedUserGroups ?? [],
        updatedCollectionDownloads: updatedCollectionDownloads ?? [],
        updatedItemGroups: updatedItemGroups ?? [],
        updatedItems: updatedItems ?? [],
      };
    }
    return {
      updatedUserGroups: [],
      updatedCollectionDownloads: [],
      updatedItemGroups: [],
      updatedItems: [],
    };
  }
}
