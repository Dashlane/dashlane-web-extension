import { LocalStorageService } from "Libs/Storage/Local/types";
import { WSService } from "Libs/WS";
import { ItemGroupResponse } from "Libs/WS/Sharing/2/PerformItemGroupAction";
import { AdminData } from "Session/Store/teamAdminData";
import { teamAdminDataUpdated } from "Session/Store/teamAdminData/actions";
import { CurrentUserInfo } from "Session/utils";
import { mapToTeamAdminSharingData } from "Sharing/2/Services/team-admin-data-sync-helpers";
import { StoreService } from "Store";
import { syncAdminData } from "TeamAdmin/Services/UserGroupManagementSetupService/teamAdminData";
const makeUpdatedItemsOrGroups = <T>(
  storedItemsOrGroups: T[],
  itemOrGroupResponse: T | undefined,
  idKey: keyof T
): T[] => {
  return itemOrGroupResponse
    ? storedItemsOrGroups
        .filter(
          ({ [idKey]: storedItemId }) =>
            storedItemId !== itemOrGroupResponse[idKey]
        )
        .concat([itemOrGroupResponse])
    : storedItemsOrGroups;
};
export const updateAdminDataAfterItemAddedOrUpdated = async (
  storeService: StoreService,
  localStorageService: LocalStorageService,
  wsService: WSService,
  currentUserInfo: CurrentUserInfo,
  teamId: string | number,
  { itemGroups, items }: ItemGroupResponse
): Promise<AdminData> => {
  const sharingData = storeService.getSharingData();
  const {
    items: sharingDataItems,
    itemGroups: sharingDataItemGroups,
    userGroups: sharingDataUserGroups,
    ...restSharingData
  } = sharingData;
  const adminData = storeService.getTeamAdminData().teams[teamId];
  const [specialItemGroup] = itemGroups ?? [];
  const [addedOrUpdatedItem] = items ?? [];
  const { specialUserGroup } = adminData;
  const newItems = makeUpdatedItemsOrGroups(
    sharingDataItems,
    addedOrUpdatedItem,
    "itemId"
  );
  const newItemGroups = makeUpdatedItemsOrGroups(
    sharingDataItemGroups,
    specialItemGroup,
    "groupId"
  );
  const newUserGroups = makeUpdatedItemsOrGroups(
    sharingDataUserGroups,
    specialUserGroup,
    "groupId"
  );
  const augmentedSharingData = {
    ...restSharingData,
    items: newItems,
    itemGroups: newItemGroups,
    userGroups: newUserGroups,
  };
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
  return newAdminData;
};
