import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { success } from "@dashlane/framework-types";
import { RevokeCollectionMembersCommand } from "@dashlane/sharing-contracts";
import { SharingCollectionsGateway } from "../common/sharing-collections.gateway";
import { SharedCollectionsRepository } from "../common/shared-collections.repository";
@CommandHandler(RevokeCollectionMembersCommand)
export class RevokeCollectionMembersCommandHandler
  implements ICommandHandler<RevokeCollectionMembersCommand>
{
  constructor(
    private collectionsRepository: SharedCollectionsRepository,
    private sharingCollectionsGateway: SharingCollectionsGateway
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
    const revokeCollectionMembersResult =
      await this.sharingCollectionsGateway.revokeCollectionMembers({
        collectionId,
        revision,
        userGroupIds,
        userLogins,
      });
    const originalCollections =
      await this.collectionsRepository.getCollections();
    const newCollectionsList = originalCollections.filter(
      (coll) => coll.uuid !== revokeCollectionMembersResult.uuid
    );
    await this.collectionsRepository.updateCollections([
      ...newCollectionsList,
      revokeCollectionMembersResult,
    ]);
    return success(undefined);
  }
}
