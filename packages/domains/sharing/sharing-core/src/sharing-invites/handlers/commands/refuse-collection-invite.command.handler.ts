import { firstValueFrom } from "rxjs";
import {
  CommandHandler,
  CommandHandlerResponseOf,
  ICommandHandler,
} from "@dashlane/framework-application";
import { ServerApiClient } from "@dashlane/framework-dashlane-application";
import {
  RefuseCollectionInviteCommand,
  RefuseCollectionInviteFailedError,
} from "@dashlane/sharing-contracts";
import { failure, isFailure, success } from "@dashlane/framework-types";
import { PendingCollectionsStore } from "../../store/pending-collections.store";
@CommandHandler(RefuseCollectionInviteCommand)
export class RefuseCollectionInviteCommandHandler
  implements ICommandHandler<RefuseCollectionInviteCommand>
{
  constructor(
    private serverApiClient: ServerApiClient,
    private pendingCollectionsStore: PendingCollectionsStore
  ) {}
  async execute(
    command: RefuseCollectionInviteCommand
  ): CommandHandlerResponseOf<RefuseCollectionInviteCommand> {
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
    const response = await firstValueFrom(
      this.serverApiClient.v1.sharingUserdevice.refuseCollection({
        collectionUUID: collectionId,
        revision: pendingCollection.revision,
      })
    );
    if (isFailure(response)) {
      return failure(new RefuseCollectionInviteFailedError());
    }
    return success(undefined);
  }
}
