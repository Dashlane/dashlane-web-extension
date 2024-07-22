import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { success } from "@dashlane/framework-types";
import { RenameCollectionCommand } from "@dashlane/sharing-contracts";
import { SharingCollectionsService } from "../common/sharing-collections.service";
import { SharingSyncService } from "../../../sharing-common";
import { SharedCollectionsRepository } from "../common/shared-collections.repository";
@CommandHandler(RenameCollectionCommand)
export class RenameCollectionCommandHandler
  implements ICommandHandler<RenameCollectionCommand>
{
  constructor(
    private sharingCollections: SharingCollectionsService,
    private collectionsRepository: SharedCollectionsRepository,
    private sharingSync: SharingSyncService
  ) {}
  async execute({ body }: RenameCollectionCommand) {
    const { collectionId, newName } = body;
    const collection = await this.collectionsRepository.getCollection(
      collectionId
    );
    if (!collection) {
      throw new Error("Failed to find collection revision");
    }
    await this.sharingCollections.renameCollection(collection, newName);
    await this.sharingSync.scheduleSync();
    return success(undefined);
  }
}
