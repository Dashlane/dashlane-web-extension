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
@CommandHandler(RunSharingSyncCommand)
export class RunSharingSyncUseCase
  implements ICommandHandler<RunSharingSyncCommand>
{
  constructor(
    private serverApiClient: ServerApiClient,
    private currentUserGetter: CurrentUserWithKeysGetterService,
    private itemsService: SharingSyncItemsService,
    private userGroupsService: SharingSyncUserGroupsService,
    private collectionsService: SharingSyncCollectionsService
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
    const { newUserGroupIds, updateUserGroupIds, unchangedUserGroups } =
      await this.userGroupsService.getUserGroupChangesFromSummary(
        userGroupsSummary
      );
    const { newCollectionIds, updatedCollectionIds, unchangedCollections } =
      await this.collectionsService.getCollectionsChangesFromSummary(
        collectionsSummary
      );
    const { newItemsIds, updatedItemsIds, unchangedItems } =
      await this.itemsService.getItemsChangesFromSummary(itemsSummary);
    const { newItemGroupIds, updatedItemGroupIds, unchangedItemGroups } =
      await this.itemsService.getSharedItemsChangesFromSummary(
        sharedItemsSummary
      );
    const changedItemIds = newItemsIds.concat(updatedItemsIds);
    const result = await firstValueFrom(
      this.serverApiClient.v1.sharingUserdevice.postSharingUserdevice({
        collectionIds: newCollectionIds.concat(updatedCollectionIds),
        userGroupIds: newUserGroupIds.concat(updateUserGroupIds),
        itemGroupIds: newItemGroupIds.concat(updatedItemGroupIds),
        itemIds: changedItemIds,
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
    if (updatedUserGroups?.length) {
      await this.userGroupsService.syncUserGroups(
        updatedUserGroups,
        unchangedUserGroups,
        currentUser
      );
    }
    if (updatedCollectionDownloads?.length) {
      await this.collectionsService.syncCollections(
        updatedCollectionDownloads,
        unchangedCollections,
        currentUser
      );
    }
    if (updatedItemGroups || updatedItems) {
      await this.itemsService.syncSharedItems(
        updatedItemGroups ?? [],
        unchangedItemGroups,
        updatedItems ?? [],
        unchangedItems,
        currentUser
      );
    }
    await this.itemsService.deleteItems(itemsSummary);
    return success(undefined);
  }
}
