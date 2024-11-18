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
  SharingSyncFeatureFlips,
} from "@dashlane/sharing-contracts";
import {
  failure,
  getSuccess,
  isFailure,
  isSuccess,
  success,
} from "@dashlane/framework-types";
import { PendingCollectionsStore } from "../../store/pending-collections.store";
import { SharedCollectionsNewRepository } from "../../../sharing-collections/handlers/common/shared-collections-new.repository";
import { SharingSyncService } from "../../../sharing-common";
import { FeatureFlipsClient } from "@dashlane/framework-contracts";
@CommandHandler(RefuseCollectionInviteCommand)
export class RefuseCollectionInviteCommandHandler
  implements ICommandHandler<RefuseCollectionInviteCommand>
{
  constructor(
    private readonly serverApiClient: ServerApiClient,
    private readonly oldpendingCollectionsStore: PendingCollectionsStore,
    private readonly collectionsRepository: SharedCollectionsNewRepository,
    private readonly sharingSync: SharingSyncService,
    private readonly featureFlips: FeatureFlipsClient
  ) {}
  async execute(
    command: RefuseCollectionInviteCommand
  ): CommandHandlerResponseOf<RefuseCollectionInviteCommand> {
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
    const revision = isNewSharingSyncEnabled
      ? await this.getCollectionRevision(collectionId)
      : await this.getCollectionRevisionLegacy(collectionId);
    const response = await firstValueFrom(
      this.serverApiClient.v1.sharingUserdevice.refuseCollection({
        collectionUUID: collectionId,
        revision: revision,
      })
    );
    if (isFailure(response)) {
      return failure(new RefuseCollectionInviteFailedError());
    }
    await this.sharingSync.scheduleSync();
    return success(undefined);
  }
  private async getCollectionRevision(collectionId: string) {
    const pendingCollections =
      await this.collectionsRepository.getCollectionsById([collectionId]);
    if (!pendingCollections.length) {
      throw new Error("Pending Collection not found new path");
    }
    return pendingCollections[0].revision;
  }
  private async getCollectionRevisionLegacy(collectionId: string) {
    const pendingCollectionsState =
      await this.oldpendingCollectionsStore.getState();
    const pendingCollection = pendingCollectionsState.pendingCollections.find(
      ({ uuid }) => uuid === collectionId
    );
    if (!pendingCollection) {
      throw new Error("Pending Collection not found legacy path");
    }
    return pendingCollection.revision;
  }
}
