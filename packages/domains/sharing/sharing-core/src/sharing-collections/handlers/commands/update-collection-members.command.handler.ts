import { success } from "@dashlane/framework-types";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { UpdateCollectionMembersCommand } from "@dashlane/sharing-contracts";
import { SharingSyncService } from "../../../sharing-common";
import { SharingCollectionsService } from "../common/sharing-collections.service";
import { userGroupRecipientMapper, userRecipientMapper } from "../common/utils";
import { SharedCollectionsRepository } from "../common/shared-collections.repository";
@CommandHandler(UpdateCollectionMembersCommand)
export class UpdateCollectionMembersCommandHandler
  implements ICommandHandler<UpdateCollectionMembersCommand>
{
  constructor(
    private readonly sharingCollectionsService: SharingCollectionsService,
    private readonly collectionsRepository: SharedCollectionsRepository,
    private readonly sharingSync: SharingSyncService
  ) {}
  async execute({ body }: UpdateCollectionMembersCommand) {
    const { collectionId, userRecipients, userGroupRecipients } = body;
    const collection = await this.collectionsRepository.getCollection(
      collectionId
    );
    if (!collection) {
      throw new Error("Collection not found");
    }
    await this.sharingCollectionsService.updateCollectionMembers(
      collection,
      userRecipients?.map(userRecipientMapper),
      userGroupRecipients?.map(userGroupRecipientMapper)
    );
    await this.sharingSync.scheduleSync();
    return success(undefined);
  }
}
