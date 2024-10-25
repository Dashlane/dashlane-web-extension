import { RemoveItems as RemoveItemsEvent } from "@dashlane/sharing/types/removeItems";
import { WSService } from "Libs/WS";
import { LocalStorageService } from "Libs/Storage/Local/types";
import { ItemGroupResponse } from "Libs/WS/Sharing/2/PerformItemGroupAction";
import { StoreService } from "Store";
import { CurrentUserInfo } from "Session/utils";
import { teamAdminDataUpdated } from "Session/Store/teamAdminData/actions";
import { SharingData } from "Session/Store/sharingData/types";
import { sharingDataUpdated } from "Session/Store/sharingData/actions";
import { syncAdminData } from "TeamAdmin/Services/UserGroupManagementSetupService/teamAdminData";
import { currentTeamIdSelector } from "TeamAdmin/Services/selectors";
import { UserLocalDataService } from "../Libs/Storage/User";
import { mapToTeamAdminSharingData } from "Sharing/2/Services/team-admin-data-sync-helpers";
const createAugmentedSharingData = async (
  localStorageServiceInstance: UserLocalDataService,
  itemGroupResponse: Pick<ItemGroupResponse, "itemGroups">,
  removedItemEvent: RemoveItemsEvent
): Promise<SharingData> => {
  const { items: sharingDataItems, ...restSharingData } =
    await localStorageServiceInstance.getSharingData();
  const itemsExcludingRemoved = sharingDataItems.filter(
    ({ itemId: storedItemId }) => storedItemId !== removedItemEvent.items[0]
  );
  const itemGroupsExcludingChanged = restSharingData.itemGroups.filter(
    ({ groupId: storedGroupId }) => storedGroupId !== removedItemEvent.groupId
  );
  const updatedGroup = itemGroupResponse.itemGroups.find(
    ({ groupId: storedGroupId }) => storedGroupId === removedItemEvent.groupId
  );
  const reconstructedItemGroups =
    itemGroupsExcludingChanged.concat(updatedGroup);
  return {
    ...restSharingData,
    itemGroups: reconstructedItemGroups,
    items: itemsExcludingRemoved,
  };
};
export const updateDataAfterSpecialItemRemoved = async (
  storeService: StoreService,
  localStorageService: LocalStorageService,
  wsService: WSService,
  currentUserInfo: CurrentUserInfo,
  itemGroupResponse: Pick<ItemGroupResponse, "itemGroups">,
  removedItemEvent: RemoveItemsEvent
): Promise<void> => {
  if (removedItemEvent.items.length !== 1) {
    throw new Error("Currently only supporting single item removal.");
  }
  const teamId = currentTeamIdSelector(storeService.getState());
  const adminData = storeService.getTeamAdminData().teams[teamId];
  const localStorageServiceInstance = localStorageService.getInstance();
  const augmentedSharingData = await createAugmentedSharingData(
    localStorageServiceInstance,
    itemGroupResponse,
    removedItemEvent
  );
  const newAdminData = await syncAdminData(
    wsService,
    currentUserInfo,
    adminData,
    mapToTeamAdminSharingData(augmentedSharingData)
  );
  const teamAdminDataUpdate = { teams: { [teamId]: newAdminData } };
  const action = teamAdminDataUpdated(teamAdminDataUpdate);
  const dispatched = storeService.dispatch(action);
  const storageService = localStorageService.getInstance();
  await storageService.storeTeamAdminData(dispatched.teamAdminData);
  storeService.dispatch(sharingDataUpdated(augmentedSharingData));
  await localStorageServiceInstance.storeSharingData(augmentedSharingData);
};
