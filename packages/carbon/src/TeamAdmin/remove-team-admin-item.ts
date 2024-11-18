import { CoreServices } from "Services";
import { makeSharingService } from "Sharing/2/Services";
import { getCurrentUserInfo } from "Session/utils";
import { AdminData } from "Session/Store/teamAdminData";
import { updateDataAfterSpecialItemRemoved } from "./update-data-after-special-item-removed";
import {
  adminDataForTeamSelector,
  currentTeamIdSelector,
} from "TeamAdmin/Services/selectors";
type SupportedRemovals = Extract<
  keyof AdminData,
  "adminProvisioningKey" | "encryptionServiceData" | "ssoConnectorKey"
>;
export const removeTeamAdminItem = async (
  { storeService, localStorageService, wsService }: CoreServices,
  itemPropertyKey: SupportedRemovals
): Promise<{
  success: true;
}> => {
  const sharingService = makeSharingService(storeService, wsService);
  const currentUserInfo = getCurrentUserInfo(storeService);
  const currentTeamId = currentTeamIdSelector(storeService.getState());
  const adminData = adminDataForTeamSelector(
    storeService.getState(),
    currentTeamId
  );
  const { specialItemGroup } = adminData;
  const { item, ws } = sharingService;
  if (!specialItemGroup) {
    throw new Error("Cannot find specialItemGroup in adminData");
  }
  const { revision, groupId } = specialItemGroup;
  const itemToRemove = adminData[itemPropertyKey];
  if (!itemToRemove) {
    return {
      success: true,
    };
  }
  const { itemId } = itemToRemove;
  const removeItemsEvent = await item.makeRemoveItemsEvent(groupId, revision, [
    itemId,
  ]);
  const itemGroupResponse = await item.removeItems(
    ws,
    currentUserInfo.login,
    currentUserInfo.uki,
    removeItemsEvent
  );
  await updateDataAfterSpecialItemRemoved(
    storeService,
    localStorageService,
    sharingService.ws,
    currentUserInfo,
    itemGroupResponse,
    removeItemsEvent
  );
  return {
    success: true,
  };
};
