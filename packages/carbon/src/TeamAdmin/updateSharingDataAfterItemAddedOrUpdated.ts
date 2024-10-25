import {
  ItemContent,
  ItemGroupDownload,
} from "@dashlane/sharing/types/serverResponse";
import { LocalStorageService } from "Libs/Storage/Local/types";
import { StoreService } from "Store";
import { SharingData } from "Session/Store/sharingData/types";
import { sharingDataUpdated } from "Session/Store/sharingData/actions";
export const updateSharingDataAfterItemAddedOrUpdated = async (
  storeService: StoreService,
  localStorageService: LocalStorageService,
  addedOrUpdatedItem: ItemContent,
  updatedGroupResponse?: ItemGroupDownload
) => {
  const localStorageServiceInstance = localStorageService.getInstance();
  const {
    items: sharingDataItems,
    itemGroups,
    ...restSharingData
  } = await localStorageServiceInstance.getSharingData();
  const newItems = sharingDataItems
    .filter(
      ({ itemId: storedItemId }) => storedItemId !== addedOrUpdatedItem.itemId
    )
    .concat([addedOrUpdatedItem]);
  const updatedGroups = updatedGroupResponse
    ? itemGroups
        .filter(
          ({ groupId: storedGroupId }) =>
            storedGroupId !== updatedGroupResponse.groupId
        )
        .concat([updatedGroupResponse])
    : itemGroups;
  const data: SharingData = {
    ...restSharingData,
    itemGroups: updatedGroups,
    items: newItems,
  };
  storeService.dispatch(sharingDataUpdated(data));
  await localStorageServiceInstance.storeSharingData(data);
};
