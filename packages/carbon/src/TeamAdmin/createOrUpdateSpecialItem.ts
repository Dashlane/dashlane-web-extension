import { generateItemUuid } from "Utils/generateItemUuid";
import { CoreServices } from "Services";
import { ISharingServices } from "Sharing/2/Services";
import { getCurrentUserInfo } from "Session/utils";
import { requireAdmin } from "TeamAdmin/Services/EncryptionService/requireAdmin";
import { getSpecialItemGroupKey } from "TeamAdmin/Services";
import {
  adminDataForTeamSelector,
  currentTeamIdSelector,
} from "TeamAdmin/Services/selectors";
import { updateAdminDataAfterItemAddedOrUpdated } from "./updateAdminDataAfterItemAddedOrUpdated";
import { updateSharingDataAfterItemAddedOrUpdated } from "./updateSharingDataAfterItemAddedOrUpdated";
export const createOrUpdateSpecialItem = async <T>(
  services: CoreServices,
  sharingService: ISharingServices,
  dataToPersist: T
): Promise<T> => {
  const { storeService, localStorageService } = services;
  requireAdmin(storeService);
  const teamId = currentTeamIdSelector(storeService.getState());
  const adminData = adminDataForTeamSelector(storeService.getState(), teamId);
  const currentUserInfo = getCurrentUserInfo(storeService);
  const { crypto, item, ws } = sharingService;
  const { specialItemGroup } = adminData;
  if (!specialItemGroup) {
    throw new Error("Cannot find specialItemGroup in adminData");
  }
  const specialItemGroupKey = await getSpecialItemGroupKey(
    crypto,
    currentUserInfo,
    adminData
  );
  const itemId = generateItemUuid();
  const rawItemKey = await crypto.symmetricEncryption.generateNewAESKey();
  const itemKey = await crypto.symmetricEncryption.encryptAES256(
    specialItemGroupKey,
    btoa(rawItemKey)
  );
  const encryptedContent = await crypto.symmetricEncryption.encryptAES256(
    rawItemKey,
    btoa(JSON.stringify(dataToPersist))
  );
  const itemUpload = await item.makeItemUpload(
    itemId,
    itemKey,
    encryptedContent
  );
  const addItemsEvent = await item.makeAddItemsEvent(
    specialItemGroup.groupId,
    specialItemGroup.revision,
    [itemUpload]
  );
  const itemAddedOrUpdatedResponse = await item.addItems(
    ws,
    currentUserInfo.login,
    currentUserInfo.uki,
    addItemsEvent
  );
  const addedOrUpdatedItem = itemAddedOrUpdatedResponse?.items?.find(
    ({ itemId: persistedItemId }) => persistedItemId === itemId
  );
  if (!addedOrUpdatedItem) {
    throw new Error("unable to persist item");
  }
  await updateAdminDataAfterItemAddedOrUpdated(
    storeService,
    localStorageService,
    sharingService.ws,
    currentUserInfo,
    teamId,
    itemAddedOrUpdatedResponse
  );
  await updateSharingDataAfterItemAddedOrUpdated(
    services.storeService,
    services.localStorageService,
    addedOrUpdatedItem,
    itemAddedOrUpdatedResponse.itemGroups[0]
  );
  return dataToPersist;
};
