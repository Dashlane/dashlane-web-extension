import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { isFailure, success } from "@dashlane/framework-types";
import { AddItemsToCollectionsCommand } from "@dashlane/sharing-contracts";
import { SharingCollectionItemsService } from "../common/sharing-collection-items.service";
import { isNotUndefined } from "../../../utils/is-not-undefined";
import { SharingSyncService } from "../../../sharing-common";
import { SharedCollectionsRepository } from "../common/shared-collections.repository";
@CommandHandler(AddItemsToCollectionsCommand)
export class AddItemsToCollectionsCommandHandler
  implements ICommandHandler<AddItemsToCollectionsCommand>
{
  constructor(
    private sharingCollectionItems: SharingCollectionItemsService,
    private sharingSync: SharingSyncService,
    private collectionsRepository: SharedCollectionsRepository
  ) {}
  async execute({ body }: AddItemsToCollectionsCommand) {
    const { collectionPermissions, itemIds, shouldSkipSync } = body;
    const collections = await this.collectionsRepository.getCollectionsByIds(
      collectionPermissions.map((collection) => collection.collectionId)
    );
    if (collections.length !== collectionPermissions.length) {
      throw new Error("Unable to find some of the collections in the list");
    }
    const collectionIdResult =
      await this.sharingCollectionItems.addItemsToCollections(
        collections.filter(isNotUndefined),
        itemIds,
        collectionPermissions
      );
    if (isFailure(collectionIdResult)) {
      throw new Error("Failed adding an item to a list of collections");
    }
    if (!shouldSkipSync) {
      await this.sharingSync.scheduleSync();
    }
    return success(undefined);
  }
}
