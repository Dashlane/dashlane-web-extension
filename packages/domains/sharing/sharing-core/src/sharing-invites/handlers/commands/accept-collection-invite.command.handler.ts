import { firstValueFrom } from "rxjs";
import {
  CommandHandler,
  CommandHandlerResponseOf,
  ICommandHandler,
} from "@dashlane/framework-application";
import { ServerApiClient } from "@dashlane/framework-dashlane-application";
import {
  AcceptCollectionInviteCommand,
  AcceptCollectionInviteFailedError,
} from "@dashlane/sharing-contracts";
import { Status } from "@dashlane/server-sdk/v1";
import { failure, isFailure, success } from "@dashlane/framework-types";
import {
  SharingCryptographyService,
  SharingDecryptionService,
} from "../../../sharing-crypto";
import { PendingCollectionsStore } from "../../store/pending-collections.store";
import { SharingSyncService } from "../../../sharing-common";
import { CurrentUserWithKeysGetterService } from "../../../sharing-carbon-helpers";
@CommandHandler(AcceptCollectionInviteCommand)
export class AcceptCollectionInviteCommandHandler
  implements ICommandHandler<AcceptCollectionInviteCommand>
{
  constructor(
    private serverApiClient: ServerApiClient,
    private sharingCrypto: SharingCryptographyService,
    private sharingDecryption: SharingDecryptionService,
    private pendingCollectionsStore: PendingCollectionsStore,
    private sharingSync: SharingSyncService,
    private currentUserGetter: CurrentUserWithKeysGetterService
  ) {}
  async execute(
    command: AcceptCollectionInviteCommand
  ): CommandHandlerResponseOf<AcceptCollectionInviteCommand> {
    const {
      body: { collectionId },
    } = command;
    const pendingCollectionsState =
      await this.pendingCollectionsStore.getState();
    const pendingCollection = pendingCollectionsState.pendingCollections.find(
      ({ uuid }) => uuid === collectionId
    );
    if (!pendingCollection) {
      throw new Error("Pending Collection not found");
    }
    const collectionKey = await this.sharingDecryption.decryptCollectionKey(
      pendingCollection,
      Status.Pending
    );
    if (!collectionKey) {
      throw new Error(
        "Unable to decrypt Collection Key for pending collection"
      );
    }
    const currentUser = await this.currentUserGetter.getCurrentUserWithKeys();
    const acceptSignatureBuffer =
      await this.sharingCrypto.createAcceptSignature(
        currentUser.privateKey,
        collectionId,
        collectionKey
      );
    const response = await firstValueFrom(
      this.serverApiClient.v1.sharingUserdevice.acceptCollection({
        collectionUUID: collectionId,
        revision: pendingCollection.revision,
        acceptSignature: acceptSignatureBuffer,
      })
    );
    if (isFailure(response)) {
      return failure(new AcceptCollectionInviteFailedError());
    }
    await this.sharingSync.scheduleSync();
    return success(undefined);
  }
}
