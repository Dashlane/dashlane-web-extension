import { UserGroupDownload } from "@dashlane/sharing/types/serverResponse";
import { ItemUpload } from "@dashlane/sharing/types/migrateItemGroup";
import { generateItemUuid } from "Utils/generateItemUuid";
import { ICryptoService } from "Libs/CryptoCenter/SharingCryptoService";
import { CurrentUserInfo } from "Session/utils";
import { UserGroupAdminItem } from "Session/Store/teamAdminData/types";
import { AdminData } from "Session/Store/teamAdminData/index";
const base64 = require("base-64");
async function getUserGroupKey(
  crypto: ICryptoService,
  currentUserInfo: CurrentUserInfo,
  userGroup: UserGroupDownload
): Promise<string> {
  const selfInUserGroup = userGroup.users.find(
    (user) => user.userId === currentUserInfo.login
  );
  if (!selfInUserGroup) {
    throw new Error("Couldnt find self in user group");
  }
  return await crypto.asymmetricEncryption.decrypt(
    currentUserInfo.privateKey,
    selfInUserGroup.groupKey
  );
}
async function createItemForOneUserGroup(
  crypto: ICryptoService,
  specialItemGroupKey: string,
  userGroupAdminItem: UserGroupAdminItem
): Promise<ItemUpload> {
  const rawItemKey = await crypto.symmetricEncryption.generateNewAESKey();
  const [content, itemKey] = await Promise.all([
    crypto.symmetricEncryption.encryptAES256(
      rawItemKey,
      base64.encode(JSON.stringify(userGroupAdminItem))
    ),
    crypto.symmetricEncryption.encryptAES256(
      specialItemGroupKey,
      base64.encode(rawItemKey)
    ),
  ]);
  return {
    itemId: userGroupAdminItem.itemId,
    itemKey,
    content,
  } as ItemUpload;
}
async function makeUserGroupAdminItem(
  crypto: ICryptoService,
  currentUserInfo: CurrentUserInfo,
  userGroup: UserGroupDownload
): Promise<UserGroupAdminItem> {
  return {
    itemId: generateItemUuid(),
    groupId: userGroup.groupId,
    groupKey: await getUserGroupKey(crypto, currentUserInfo, userGroup),
  };
}
export async function createItemsForUserGroups(
  crypto: ICryptoService,
  specialItemGroupKey: string,
  userGroupAdminItems: UserGroupAdminItem[]
): Promise<ItemUpload[]> {
  return await Promise.all(
    userGroupAdminItems.map((userGroupAdminItem) =>
      createItemForOneUserGroup(crypto, specialItemGroupKey, userGroupAdminItem)
    )
  );
}
export async function getUserGroupAdminItemsFromMigration(
  crypto: ICryptoService,
  currentUserInfo: CurrentUserInfo,
  currentAdminData: AdminData
): Promise<UserGroupAdminItem[]> {
  return await Promise.all(
    (currentAdminData.userGroups || []).map((userGroup) =>
      makeUserGroupAdminItem(crypto, currentUserInfo, userGroup)
    )
  );
}
