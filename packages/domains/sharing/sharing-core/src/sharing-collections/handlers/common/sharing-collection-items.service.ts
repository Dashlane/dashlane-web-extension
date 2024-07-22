import { firstValueFrom } from "rxjs";
import {
  failure,
  getSuccess,
  isFailure,
  success,
} from "@dashlane/framework-types";
import { Injectable } from "@dashlane/framework-application";
import {
  CollectionItemPermission,
  createAttachmentInCollectionError,
  Permission,
  SharedCollection,
  SharingItemsClient,
} from "@dashlane/sharing-contracts";
import { SharingItemGroupsService } from "../../../sharing-common";
import { CredentialsGetterService } from "../../../sharing-carbon-helpers";
import { NotesGetterService } from "../../../sharing-carbon-helpers/services/notes-getter.service";
import { SharingCollectionsGateway } from "./sharing-collections.gateway";
import { SharingCollectionInvitesService } from "./sharing-collections-invites.service";
@Injectable()
export class SharingCollectionItemsService {
  constructor(
    private collectionInvitesService: SharingCollectionInvitesService,
    private sharingItemGroups: SharingItemGroupsService,
    private sharingCollectionsApi: SharingCollectionsGateway,
    private credentialsGetter: CredentialsGetterService,
    private notesGetter: NotesGetterService,
    private sharingItemsClient: SharingItemsClient
  ) {}
  async addItemsToCollections(
    collections: SharedCollection[],
    itemIds: string[],
    collectionPermissions: CollectionItemPermission[]
  ) {
    const existingItemGroupsResult = await firstValueFrom(
      this.sharingItemsClient.queries.getSharedItemsForItemIds({ itemIds })
    );
    if (isFailure(existingItemGroupsResult)) {
      throw new Error("Unable to find item groups for items");
    }
    const sharedItems = getSuccess(existingItemGroupsResult).sharedItems;
    const canShareAllExistingItemGroups = sharedItems.every(
      (sharedItem) => sharedItem.permission === Permission.Admin
    );
    if (!canShareAllExistingItemGroups) {
      throw new Error("User does not have access to share selected items");
    }
    const credentialsToAdd =
      await this.credentialsGetter.getCarbonCredentialsByItemIds(itemIds);
    const notesToAdd = await this.notesGetter.getCarbonNotesByItemIds(itemIds);
    const allItemsToAdd = [...credentialsToAdd, ...notesToAdd];
    const hasNotesWithAttachments = notesToAdd.some(
      (note) => note.Attachments?.length
    );
    if (hasNotesWithAttachments) {
      return failure(createAttachmentInCollectionError());
    }
    const itemsNotYetShared = [
      ...allItemsToAdd.filter(
        ({ Id }) => !sharedItems.some((sharedItem) => sharedItem.itemId === Id)
      ),
    ];
    const newItemGroups =
      itemsNotYetShared.length > 0
        ? await this.sharingItemGroups.createMultipleItemGroups(
            itemsNotYetShared
          )
        : [];
    await Promise.all(
      collections.map(async (collection) => {
        const invite =
          await this.collectionInvitesService.createCollectionInvites(
            collection,
            [...sharedItems, ...newItemGroups],
            collectionPermissions.find(
              (collectionPermission) =>
                collectionPermission.collectionId === collection.uuid
            )?.permission ?? Permission.Admin
          );
        await this.sharingCollectionsApi.addItemGroupsToCollection(invite);
      })
    );
    return success(undefined);
  }
}
