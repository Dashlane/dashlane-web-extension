import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { failure, isFailure, success } from "@dashlane/framework-types";
import {
  ATTACHMENT_IN_COLLECTION,
  createAttachmentInCollectionError,
  CreateSharedCollectionCommand,
  SharedCollectionUserGroupRecipient,
  SharedCollectionUserRecipient,
} from "@dashlane/sharing-contracts";
import { VaultOrganizationClient } from "@dashlane/vault-contracts";
import { SharingCollectionsService } from "../common/sharing-collections.service";
import { generateUuid } from "../../../utils/generate-uuid";
import { SharingCollectionItemsService } from "../common/sharing-collection-items.service";
import { SharingSyncService } from "../../../sharing-common";
import { SharingCollectionsGateway } from "../common/sharing-collections.gateway";
import { userGroupRecipientMapper, userRecipientMapper } from "../common/utils";
const userRecipientToIdMapper = (recipient: SharedCollectionUserRecipient) =>
  recipient.login;
const userGroupRecipientToIdMapper = (
  recipient: SharedCollectionUserGroupRecipient
) => recipient.groupId;
const userRecipientsToIdsMapper = (
  recipients: SharedCollectionUserRecipient[]
) =>
  recipients.length > 0 ? recipients.map(userRecipientToIdMapper) : undefined;
const userGroupRecipientsToIdsMapper = (
  recipients: SharedCollectionUserGroupRecipient[]
) =>
  recipients.length > 0
    ? recipients.map(userGroupRecipientToIdMapper)
    : undefined;
@CommandHandler(CreateSharedCollectionCommand)
export class CreateSharedCollectionCommandHandler
  implements ICommandHandler<CreateSharedCollectionCommand>
{
  constructor(
    private sharingCollections: SharingCollectionsService,
    private sharingCollectionsGateway: SharingCollectionsGateway,
    private sharingCollectionItems: SharingCollectionItemsService,
    private vaultClient: VaultOrganizationClient,
    private sharingSync: SharingSyncService
  ) {}
  async execute({ body }: CreateSharedCollectionCommand) {
    const {
      teamId,
      collectionName,
      privateCollectionId,
      users,
      groups,
      defaultItemPermissions,
      itemIds,
    } = body;
    const newCollectionUuid = generateUuid();
    const createdCollection = await this.sharingCollections.createCollection(
      newCollectionUuid,
      teamId,
      collectionName,
      defaultItemPermissions,
      users.map(userRecipientMapper),
      groups.map(userGroupRecipientMapper)
    );
    const collectionPermission = {
      collectionId: newCollectionUuid,
      permission: defaultItemPermissions,
    };
    if (itemIds.length > 0) {
      try {
        const itemsAddedResult =
          await this.sharingCollectionItems.addItemsToCollections(
            [createdCollection],
            itemIds,
            [collectionPermission]
          );
        if (isFailure(itemsAddedResult)) {
          throw new Error(itemsAddedResult.error.tag);
        }
      } catch (error) {
        const revokeCollectionMembersResult =
          await this.sharingCollectionsGateway.revokeCollectionMembers({
            collectionId: createdCollection.uuid,
            revision: createdCollection.revision,
            userGroupIds: userGroupRecipientsToIdsMapper(groups),
            userLogins: userRecipientsToIdsMapper(users),
          });
        await this.sharingCollectionsGateway.deleteCollection(
          revokeCollectionMembersResult.uuid,
          revokeCollectionMembersResult.revision
        );
        await this.sharingSync.scheduleSync();
        if (
          error instanceof Error &&
          error.message === ATTACHMENT_IN_COLLECTION
        ) {
          return failure(createAttachmentInCollectionError());
        } else {
          throw error;
        }
      }
    }
    const { commands: vaultCommands } = this.vaultClient;
    if (privateCollectionId) {
      await vaultCommands.deleteCollection({ id: privateCollectionId });
    } else {
      await this.sharingSync.scheduleSync();
    }
    return success(undefined);
  }
}
