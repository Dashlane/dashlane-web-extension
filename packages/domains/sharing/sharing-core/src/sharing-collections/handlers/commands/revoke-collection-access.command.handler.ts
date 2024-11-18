import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { success } from "@dashlane/framework-types";
import { RevokeCollectionMembersCommand } from "@dashlane/sharing-contracts";
import { SharingSyncService } from "../../../sharing-common";
import { SharingCollectionsGateway } from "../common/sharing-collections.gateway";
import { SharedCollectionsRepository } from "../common/shared-collections.repository";
@CommandHandler(RevokeCollectionMembersCommand)
export class RevokeCollectionMembersCommandHandler
  implements ICommandHandler<RevokeCollectionMembersCommand>
{
  constructor(
    private readonly collectionsRepository: SharedCollectionsRepository,
    private readonly sharingCollectionsGateway: SharingCollectionsGateway,
    private readonly sharingSync: SharingSyncService
  ) {}
  async execute({ body }: RevokeCollectionMembersCommand) {
    const { collectionId, userGroupIds, userLogins } = body;
    const collection = await this.collectionsRepository.getCollection(
      collectionId
    );
    if (!collection) {
      throw new Error("Cannot access the requested collection.");
    }
    const { revision } = collection;
    await this.sharingCollectionsGateway.revokeCollectionMembers({
      collectionId,
      revision,
      userGroupIds,
      userLogins,
    });
    await this.sharingSync.scheduleSync();
    return success(undefined);
  }
}
