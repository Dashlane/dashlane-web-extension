import { firstValueFrom } from "rxjs";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { FeatureFlipsClient } from "@dashlane/framework-contracts";
import {
  getSuccess,
  isFailure,
  isSuccess,
  success,
} from "@dashlane/framework-types";
import {
  InviteCollectionMembersCommand,
  SharedCollectionUserGroupRecipient,
  SharedCollectionUserRecipient,
} from "@dashlane/sharing-contracts";
import { SharedCollectionsRepository } from "../common/shared-collections.repository";
import { SharingCollectionsService } from "../common/sharing-collections.service";
import { userGroupRecipientMapper, userRecipientMapper } from "../common/utils";
import { SharedCollectionsStore } from "../../store/shared-collections.store";
import { CurrentUserWithKeysGetterService } from "../../../sharing-carbon-helpers";
import { SharingDecryptionService } from "../../../sharing-crypto";
import { SharingSyncService } from "../../../sharing-common";
@CommandHandler(InviteCollectionMembersCommand)
export class InviteCollectionMembersCommandHandler
  implements ICommandHandler<InviteCollectionMembersCommand>
{
  constructor(
    private readonly collectionsRepository: SharedCollectionsRepository,
    private readonly sharingCollectionsService: SharingCollectionsService,
    private readonly featureFlips: FeatureFlipsClient,
    private readonly store: SharedCollectionsStore,
    private readonly currentUserGetter: CurrentUserWithKeysGetterService,
    private readonly sharingDecryption: SharingDecryptionService,
    private readonly syncService: SharingSyncService
  ) {}
  async execute({ body }: InviteCollectionMembersCommand) {
    const { collectionId, userRecipients, userGroupRecipients } = body;
    const { userFeatureFlip } = this.featureFlips.queries;
    const isNewSharingSyncEnabledResult = await firstValueFrom(
      userFeatureFlip({
        featureFlip: "sharingVault_web_sharingSyncGrapheneMigration_dev",
      })
    );
    if (isFailure(isNewSharingSyncEnabledResult)) {
      throw new Error(
        "Cannot retrieve FF for invite collection member command"
      );
    }
    const isNewSharingSyncEnabled = isSuccess(isNewSharingSyncEnabledResult)
      ? !!getSuccess(isNewSharingSyncEnabledResult)
      : false;
    return isNewSharingSyncEnabled
      ? this.executeWithGrapheneState$(
          collectionId,
          userRecipients,
          userGroupRecipients
        )
      : this.executeWithCarbonState$(
          collectionId,
          userRecipients,
          userGroupRecipients
        );
  }
  async executeWithGrapheneState$(
    collectionId: string,
    userRecipients?: SharedCollectionUserRecipient[],
    userGroupRecipients?: SharedCollectionUserGroupRecipient[]
  ) {
    const {
      sharedCollectionsAccess: originalSharedCollectionAccess,
      collections,
    } = await this.store.getState();
    const collection = collections[collectionId];
    const collectionAccess = originalSharedCollectionAccess[collectionId];
    if (!collection || !collectionAccess) {
      throw new Error(
        `Collection ${collectionId} not found when inviting collection member`
      );
    }
    const { revision, id } = collection;
    const currentUser = await this.currentUserGetter.getCurrentUserWithKeys();
    const collectionKeyClear =
      await this.sharingDecryption.decryptSharedCollectionKey(
        collection,
        currentUser
      );
    if (!collectionKeyClear) {
      throw new Error("Cannot decrypt collection key.");
    }
    const userRecipientsMapped = userRecipients?.map(userRecipientMapper);
    const userGroupRecipientsMapped = userGroupRecipients?.map(
      userGroupRecipientMapper
    );
    await this.sharingCollectionsService.inviteCollectionMembers(
      id,
      revision,
      collectionKeyClear,
      userRecipientsMapped || [],
      userGroupRecipientsMapped || []
    );
    await this.syncService.scheduleSync();
    return success(undefined);
  }
  async executeWithCarbonState$(
    collectionId: string,
    userRecipients?: SharedCollectionUserRecipient[],
    userGroupRecipients?: SharedCollectionUserGroupRecipient[]
  ) {
    const collection = await this.collectionsRepository.getCollection(
      collectionId
    );
    if (!collection) {
      throw new Error("Collection not found");
    }
    const userRecipientsMapped = userRecipients?.map(userRecipientMapper);
    const userGroupRecipientsMapped = userGroupRecipients?.map(
      userGroupRecipientMapper
    );
    const collectionKeyClear =
      await this.sharingDecryption.decryptCollectionKey(collection);
    if (!collectionKeyClear) {
      throw new Error("Cannot decrypt collection key.");
    }
    const inviteCollectionMembersResult =
      await this.sharingCollectionsService.inviteCollectionMembers(
        collection.uuid,
        collection.revision,
        collectionKeyClear,
        userRecipientsMapped || [],
        userGroupRecipientsMapped || []
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
