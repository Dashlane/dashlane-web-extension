import { firstValueFrom } from "rxjs";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { success } from "@dashlane/framework-types";
import { ServerApiClient } from "@dashlane/framework-dashlane-application";
import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
} from "@dashlane/framework-encoding";
import { UpdateSharedItemContentCommand } from "@dashlane/sharing-contracts";
import { SharedItemsRepository } from "../common/shared-items-repository";
import { SharingCryptographyService, SharingDecryptionService } from "../../..";
import { compressDashlaneXml } from "../../../utils/compress-dashlane-xml";
@CommandHandler(UpdateSharedItemContentCommand)
export class UpdateSharedItemContentCommandHandler
  implements ICommandHandler<UpdateSharedItemContentCommand>
{
  constructor(
    private readonly sharedItemsRepository: SharedItemsRepository,
    private readonly sharingCrypto: SharingCryptographyService,
    private readonly sharingDecryption: SharingDecryptionService,
    private readonly serverApi: ServerApiClient
  ) {}
  async execute({ body }: UpdateSharedItemContentCommand) {
    const { itemContent, itemId } = body;
    const vaultIndex = await this.sharedItemsRepository.getVaultItemsIndex();
    const sharedItem = await firstValueFrom(
      this.sharedItemsRepository.sharedItemForId$(itemId)
    );
    if (!sharedItem) {
      throw new Error(
        "Shared item not found when trying to update its content"
      );
    }
    const timestamp = vaultIndex[sharedItem.itemId].revision;
    const decryptedItemGroupKey =
      await this.sharingDecryption.decryptItemGroupKey(sharedItem);
    if (!decryptedItemGroupKey) {
      throw new Error(
        "Shared item key cannot be decrypted when trying to update its content"
      );
    }
    const decryptedItemKey = await this.sharingCrypto.decryptSecureData(
      decryptedItemGroupKey,
      base64ToArrayBuffer(sharedItem.itemKey)
    );
    const compressedXml = compressDashlaneXml(itemContent);
    const encryptedSharingItem = await this.sharingCrypto.encryptSecureData(
      decryptedItemKey,
      compressedXml
    );
    await firstValueFrom(
      this.serverApi.v1.sharingUserdevice.updateItem({
        content: arrayBufferToBase64(encryptedSharingItem),
        itemId,
        timestamp,
      })
    );
    return success(undefined);
  }
}
