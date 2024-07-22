import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { success } from "@dashlane/framework-types";
import { DeleteSharedCollectionCommand } from "@dashlane/sharing-contracts";
import { SharingSyncService } from "../../../sharing-common";
import { SharingCollectionsGateway } from "../common/sharing-collections.gateway";
import { SharedCollectionsRepository } from "../common/shared-collections.repository";
@CommandHandler(DeleteSharedCollectionCommand)
export class DeleteSharedCollectionCommandHandler
  implements ICommandHandler<DeleteSharedCollectionCommand>
{
  constructor(
    private sharingSync: SharingSyncService,
    private collectionsRepository: SharedCollectionsRepository,
    private sharingCollectionsApi: SharingCollectionsGateway
  ) {}
  async execute({ body }: DeleteSharedCollectionCommand) {
    const { id } = body;
    const collection = await this.collectionsRepository.getCollection(id);
    if (!collection) {
      throw new Error("Failed to find collection revision");
    }
    await this.sharingCollectionsApi.deleteCollection(
      collection.uuid,
      collection.revision
    );
    await this.sharingSync.scheduleSync();
    return success(undefined);
  }
}
