import { Injectable } from "@dashlane/framework-application";
import { arrayBufferToBase64 } from "@dashlane/framework-encoding";
import { Credential, Note, Secret } from "@dashlane/communication";
import {
  Permission,
  SharedItem,
  SharedItemAccessLinkTypes,
} from "@dashlane/sharing-contracts";
import { generateUuid } from "../../utils/generate-uuid";
import { SharingCryptographyService } from "../../sharing-crypto/services/sharing-cryptography.service";
import { SharingUsersService } from "./sharing-users.service";
import { SharingCommonGateway } from "./sharing.gateway";
import { ItemGroup, ItemGroupCreateModel } from "../sharing.types";
import { getSharingItemTypeFromKW } from "../../utils/get-sharing-item-type";
@Injectable()
export class SharingItemGroupsService {
  public constructor(
    private sharingApi: SharingCommonGateway,
    private sharingCrypto: SharingCryptographyService,
    private sharingUsers: SharingUsersService
  ) {}
  private async prepareCreateItemGroupModel(
    item: Credential | Note | Secret
  ): Promise<ItemGroupCreateModel> {
    const itemGroupId = generateUuid();
    const itemGroupKey = await this.sharingCrypto.createResourceKey();
    const users = await this.sharingUsers.createSignedUserInvites([], {
      resourceKey: itemGroupKey,
      uuid: itemGroupId,
    });
    const itemKey = await this.sharingCrypto.createResourceKey();
    const encryptedItemKey = await this.sharingCrypto.encryptSecureData(
      itemGroupKey,
      itemKey
    );
    const encryptedItemContent = await this.sharingCrypto.encryptSharingItem(
      itemKey,
      item
    );
    return {
      groupId: itemGroupId,
      item: {
        itemId: item.Id,
        itemType: getSharingItemTypeFromKW(item),
        itemKey: arrayBufferToBase64(encryptedItemKey),
        content: arrayBufferToBase64(encryptedItemContent),
      },
      itemTitle: item.Title,
      users,
    };
  }
  private convertToSharedItem(itemGroup: ItemGroup): SharedItem {
    const item = itemGroup.items?.[0];
    if (!item) {
      throw new Error("Newly created item group is missing an item");
    }
    const user = itemGroup.users?.[0];
    if (!user) {
      throw new Error("Newly created item group is missing an admin");
    }
    const { itemKey, itemId } = item;
    if (!user.groupKey) {
      throw new Error("Newly created item group is missing a resource key");
    }
    return {
      isLastAdmin: true,
      sharedItemId: itemGroup.groupId,
      itemKey,
      itemId,
      accessLink: {
        accessType: SharedItemAccessLinkTypes.User,
        encryptedResourceKey: user.groupKey,
        permission: Permission.Admin,
      },
      permission: Permission.Admin,
      recipientIds: {
        userIds: [user.userId],
        collectionIds: null,
        userGroupIds: null,
      },
      revision: itemGroup.revision,
    };
  }
  public async createItemGroup(items: Credential | Note | Secret) {
    const createItemGroupModel = await this.prepareCreateItemGroupModel(items);
    return this.sharingApi.createItemGroup(createItemGroupModel);
  }
  public async createMultipleItemGroups(items: (Credential | Note | Secret)[]) {
    const createItemGroupModels = await Promise.all(
      items.map((item) => this.prepareCreateItemGroupModel(item))
    );
    const itemGroups = await this.sharingApi.createMultipleItemGroups(
      createItemGroupModels
    );
    return itemGroups.map(this.convertToSharedItem);
  }
}
