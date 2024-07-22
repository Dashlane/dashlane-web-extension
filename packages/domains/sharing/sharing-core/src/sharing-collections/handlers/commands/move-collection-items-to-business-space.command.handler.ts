import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import {
  MoveCollectionItemsToBusinessSpaceCommand,
  Status,
} from "@dashlane/sharing-contracts";
import { firstValueFrom } from "rxjs";
import {
  failure,
  getSuccess,
  isFailure,
  success,
} from "@dashlane/framework-types";
import { VaultItemsCrudClient, VaultItemType } from "@dashlane/vault-contracts";
import {
  CurrentSpaceGetterService,
  ItemGroupsGetterService,
} from "../../../sharing-carbon-helpers";
@CommandHandler(MoveCollectionItemsToBusinessSpaceCommand)
export class MoveCollectionItemsToBusinessSpaceCommandHandler
  implements ICommandHandler<MoveCollectionItemsToBusinessSpaceCommand>
{
  constructor(
    private itemGroupsGetter: ItemGroupsGetterService,
    private vaultItemsCrudClient: VaultItemsCrudClient,
    private currentSpaceGetter: CurrentSpaceGetterService
  ) {}
  async execute() {
    const currentSpaceResult = await firstValueFrom(
      this.currentSpaceGetter.get()
    );
    if (isFailure(currentSpaceResult)) {
      throw new Error(
        "Error fetching current space when moving shared collection items to business space"
      );
    }
    const spaceId = getSuccess(currentSpaceResult).teamId;
    if (!spaceId) {
      return success(undefined);
    }
    const sharedItemsResult = await firstValueFrom(this.itemGroupsGetter.get());
    if (isFailure(sharedItemsResult)) {
      throw new Error(
        "Error fetching shared collection items to move to business space"
      );
    }
    const itemIdsToMove = getSuccess(sharedItemsResult).reduce(
      (acc, sharedItem) =>
        sharedItem.collections?.some(
          (coll) => coll.status === Status.Accepted
        ) && sharedItem.items?.[0].itemId
          ? [...acc, sharedItem.items[0].itemId]
          : acc,
      [] as string[]
    );
    if (itemIdsToMove.length) {
      const results = await Promise.all(
        itemIdsToMove.map((itemId) =>
          this.moveItemToBusinessSpace(itemId, spaceId)
        )
      );
      if (results.some(isFailure)) {
        throw new Error(
          "Error when moving shared collection items to business space"
        );
      }
    }
    return success(undefined);
  }
  private async moveItemToBusinessSpace(itemId: string, spaceId: string) {
    const { commands } = this.vaultItemsCrudClient;
    const existingItemResults = await firstValueFrom(
      this.vaultItemsCrudClient.queries.query({
        vaultItemTypes: [VaultItemType.Credential, VaultItemType.SecureNote],
        ids: [itemId],
      })
    );
    if (isFailure(existingItemResults)) {
      return Promise.resolve(failure(undefined));
    }
    const existingCredentials =
      getSuccess(existingItemResults).credentialsResult;
    const existingSecureNotes =
      getSuccess(existingItemResults).secureNotesResult;
    const credentialFound = existingCredentials.matchCount > 0;
    const secureNoteFound = existingSecureNotes.matchCount > 0;
    if (!(credentialFound || secureNoteFound)) {
      return Promise.resolve(success(undefined));
    }
    const itemToUpdate = credentialFound
      ? existingCredentials.items[0]
      : existingSecureNotes.items[0];
    if (itemToUpdate.spaceId === spaceId) {
      return Promise.resolve(success(undefined));
    }
    return commands.updateVaultItem({
      vaultItemType: credentialFound
        ? VaultItemType.Credential
        : VaultItemType.SecureNote,
      id: itemId,
      content: { spaceId },
      shouldSkipSync: true,
    });
  }
}
