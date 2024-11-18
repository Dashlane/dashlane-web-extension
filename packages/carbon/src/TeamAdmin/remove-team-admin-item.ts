import { CoreServices } from "Services";
import { makeSharingService } from "Sharing/2/Services";
import { getCurrentUserInfo } from "Session/utils";
import { AdminData } from "Session/Store/teamAdminData";
import {
  adminDataForTeamSelector,
  currentTeamIdSelector,
} from "TeamAdmin/Services/selectors";
import { Trigger } from "@dashlane/hermes";
type SupportedRemovals = Extract<
  keyof AdminData,
  "adminProvisioningKey" | "encryptionServiceData" | "ssoConnectorKey"
>;
export const removeTeamAdminItem = async (
  { storeService, sessionService, wsService }: CoreServices,
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
  await item.removeItems(
    ws,
    currentUserInfo.login,
    currentUserInfo.uki,
    removeItemsEvent
  );
  await sessionService.getInstance().user.attemptSync(Trigger.SettingsChange);
  return {
    success: true,
  };
};
