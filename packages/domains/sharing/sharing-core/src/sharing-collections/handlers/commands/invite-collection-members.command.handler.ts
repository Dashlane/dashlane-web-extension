import { success } from "@dashlane/framework-types";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { InviteCollectionMembersCommand } from "@dashlane/sharing-contracts";
import { SharingCollectionsService } from "../common/sharing-collections.service";
import { userGroupRecipientMapper, userRecipientMapper } from "../common/utils";
import { SharedCollectionsRepository } from "../common/shared-collections.repository";
@CommandHandler(InviteCollectionMembersCommand)
export class InviteCollectionMembersCommandHandler
  implements ICommandHandler<InviteCollectionMembersCommand>
{
  constructor(
    private sharingCollectionsService: SharingCollectionsService,
    private collectionsRepository: SharedCollectionsRepository
  ) {}
  async execute({ body }: InviteCollectionMembersCommand) {
    const { collectionId, userRecipients, userGroupRecipients } = body;
    const collection = await this.collectionsRepository.getCollection(
      collectionId
    );
    if (!collection) {
      throw new Error("Collection not found");
    }
    const inviteCollectionMembersResult =
      await this.sharingCollectionsService.inviteCollectionMembers(
        collection,
        userRecipients?.map(userRecipientMapper) || [],
        userGroupRecipients?.map(userGroupRecipientMapper) || []
      );
    const originalCollections =
      await this.collectionsRepository.getCollections();
    const newCollectionsList = originalCollections.filter(
      (coll) => coll.uuid !== inviteCollectionMembersResult.uuid
    );
    await this.collectionsRepository.updateCollections([
      ...newCollectionsList,
      inviteCollectionMembersResult,
    ]);
    return success(undefined);
  }
}
