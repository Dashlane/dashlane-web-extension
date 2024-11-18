import { firstValueFrom } from "rxjs";
import {
  CommandHandler,
  FrameworkRequestContextValues,
  ICommandHandler,
  RequestContext,
} from "@dashlane/framework-application";
import {
  getSuccess,
  isFailure,
  isSuccess,
  success,
} from "@dashlane/framework-types";
import { FeatureFlipsClient } from "@dashlane/framework-contracts";
import {
  AddItemsToCollectionsCommand,
  CollectionItemPermission,
  SharingSyncFeatureFlips,
} from "@dashlane/sharing-contracts";
import { SharingCollectionItemsService } from "../common/sharing-collection-items.service";
import { isNotUndefined } from "../../../utils/is-not-undefined";
import { SharingSyncService } from "../../../sharing-common";
import { SharedCollectionsRepository } from "../common/shared-collections.repository";
import { SharedCollectionsNewRepository } from "../common/shared-collections-new.repository";
import { SharingUserGroupsRepository } from "../../../sharing-recipients/services/user-groups.repository";
import { toSharedCollection } from "../../../utils/mappers/collection-download-mapper";
@CommandHandler(AddItemsToCollectionsCommand)
export class AddItemsToCollectionsCommandHandler
  implements ICommandHandler<AddItemsToCollectionsCommand>
{
  constructor(
    private readonly sharingCollectionItems: SharingCollectionItemsService,
    private readonly sharingSync: SharingSyncService,
    private readonly collectionsRepository: SharedCollectionsRepository,
    private readonly collectionsNewRepository: SharedCollectionsNewRepository,
    private readonly userGroupsRepository: SharingUserGroupsRepository,
    private readonly featureFlips: FeatureFlipsClient,
    private readonly context: RequestContext
  ) {}
  async execute({ body }: AddItemsToCollectionsCommand) {
    const { collectionPermissions, itemIds, shouldSkipSync } = body;
    const { userFeatureFlip } = this.featureFlips.queries;
    const isNewSharingSyncEnabledResult = await firstValueFrom(
      userFeatureFlip({
        featureFlip: SharingSyncFeatureFlips.SharingSyncGrapheneMigrationDev,
      })
    );
    const isNewSharingSyncEnabled = isSuccess(isNewSharingSyncEnabledResult)
      ? !!getSuccess(isNewSharingSyncEnabledResult)
      : false;
    const collections = isNewSharingSyncEnabled
      ? await this.collectionsNewRepository.getCollectionsById(
          collectionPermissions.map(({ collectionId }) => collectionId)
        )
      : await this.getCollectionLegacy(collectionPermissions);
    const collectionIdResult =
      await this.sharingCollectionItems.addItemsToCollections(
        collections.filter(isNotUndefined),
        itemIds,
        collectionPermissions
      );
    if (isFailure(collectionIdResult)) {
      throw new Error("Failed adding an item to a list of collections");
    }
    if (!shouldSkipSync) {
      await this.sharingSync.scheduleSync();
    }
    return success(undefined);
  }
  private async getCollectionLegacy(
    collectionPermissions: CollectionItemPermission[]
  ) {
    const collections = await this.collectionsRepository.getCollectionsByIds(
      collectionPermissions.map((collection) => collection.collectionId)
    );
    if (collections.length !== collectionPermissions.length) {
      throw new Error("Unable to find some of the collections in the list");
    }
    const userGroups = Object.values(
      await this.userGroupsRepository.getUserGroups()
    );
    const login = this.getCurrentUserLogin();
    if (!login) {
      throw new Error(
        "No loged in user available when adding items to collections"
      );
    }
    return collections.map((collection) =>
      toSharedCollection(collection, userGroups, login)
    );
  }
  getCurrentUserLogin(): string | undefined {
    return this.context.get<string>(FrameworkRequestContextValues.UserName);
  }
}
