import { firstValueFrom } from "rxjs";
import {
  CommandHandler,
  CommandHandlerResponseOf,
  ICommandHandler,
} from "@dashlane/framework-application";
import { ServerApiClient } from "@dashlane/framework-dashlane-application";
import {
  failure,
  getSuccess,
  isFailure,
  isSuccess,
  success,
} from "@dashlane/framework-types";
import { FeatureFlipsClient } from "@dashlane/framework-contracts";
import {
  AcceptCollectionInviteCommand,
  AcceptCollectionInviteFailedError,
  SharingSyncFeatureFlips,
} from "@dashlane/sharing-contracts";
import {
  SharingCryptographyService,
  SharingDecryptionService,
} from "../../../sharing-crypto";
import { PendingCollectionsStore } from "../../store/pending-collections.store";
import { SharingSyncService } from "../../../sharing-common";
import {
  CurrentUserWithKeyPair,
  CurrentUserWithKeysGetterService,
} from "../../../sharing-carbon-helpers";
import { SharedCollectionsNewRepository } from "../../../sharing-collections/handlers/common/shared-collections-new.repository";
import { Status } from "@dashlane/server-sdk/v1";
@CommandHandler(AcceptCollectionInviteCommand)
export class AcceptCollectionInviteCommandHandler
  implements ICommandHandler<AcceptCollectionInviteCommand>
{
  constructor(
    private readonly serverApiClient: ServerApiClient,
    private readonly sharingCrypto: SharingCryptographyService,
    private readonly sharingDecryption: SharingDecryptionService,
    private readonly oldStore: PendingCollectionsStore,
    private readonly collectionsRepository: SharedCollectionsNewRepository,
    private readonly sharingSync: SharingSyncService,
    private readonly currentUserGetter: CurrentUserWithKeysGetterService,
    private readonly featureFlips: FeatureFlipsClient
  ) {}
  async execute(
    command: AcceptCollectionInviteCommand
  ): CommandHandlerResponseOf<AcceptCollectionInviteCommand> {
    const {
      body: { collectionId },
    } = command;
    const { userFeatureFlip } = this.featureFlips.queries;
    const isNewSharingSyncEnabledResult = await firstValueFrom(
      userFeatureFlip({
        featureFlip: SharingSyncFeatureFlips.SharingSyncGrapheneMigrationDev,
      })
    );
    const isNewSharingSyncEnabled = isSuccess(isNewSharingSyncEnabledResult)
      ? !!getSuccess(isNewSharingSyncEnabledResult)
      : false;
    const currentUser = await this.currentUserGetter.getCurrentUserWithKeys();
    const { collectionKey, revision } = isNewSharingSyncEnabled
      ? await this.getCollectionKeyAndRevisionNew(collectionId, currentUser)
      : await this.getCollectionKeyAndRevisionLegacy(collectionId);
    const acceptSignatureBuffer =
      await this.sharingCrypto.createAcceptSignature(
        currentUser.privateKey,
        collectionId,
        collectionKey
      );
    const response = await firstValueFrom(
      this.serverApiClient.v1.sharingUserdevice.acceptCollection({
        collectionUUID: collectionId,
        revision,
        acceptSignature: acceptSignatureBuffer,
      })
    );
    if (isFailure(response)) {
      return failure(new AcceptCollectionInviteFailedError());
    }
    await this.sharingSync.scheduleSync();
    return success(undefined);
  }
  private async getCollectionKeyAndRevisionNew(
    collectionId: string,
    currentUser: CurrentUserWithKeyPair
  ) {
    const pendingCollections =
      await this.collectionsRepository.getCollectionsById([collectionId]);
    if (!pendingCollections.length) {
      throw new Error("Pending Collection not found new path");
    }
    const collectionKey =
      await this.sharingDecryption.decryptSharedCollectionKey(
        pendingCollections[0],
        currentUser
      );
    if (!collectionKey) {
      throw new Error(
        "Unable to decrypt Collection Key for pending collection new path"
      );
    }
    return { collectionKey, revision: pendingCollections[0].revision };
  }
  private async getCollectionKeyAndRevisionLegacy(collectionId: string) {
    const pendingCollectionsState = await this.oldStore.getState();
    const pendingCollection = pendingCollectionsState.pendingCollections.find(
      ({ uuid }) => uuid === collectionId
    );
    if (!pendingCollection) {
      throw new Error("Pending Collection not found legacy path");
    }
    const collectionKey = await this.sharingDecryption.decryptCollectionKey(
      pendingCollection,
      Status.Pending
    );
    if (!collectionKey) {
      throw new Error(
        "Unable to decrypt Collection Key for pending collection legacy path"
      );
    }
    return { collectionKey, revision: pendingCollection.revision };
  }
}
