import { isCredential } from "@dashlane/communication";
import { StoreService } from "Store";
import { savePersonalDataItem } from "Session/Store/actions";
import { generateItemUuid } from "Utils/generateItemUuid";
import { findDataModelObject } from "DataManagement/PersonalData/utils";
import { getInstance as getEventStoreInstance } from "EventStore/event-store-instance";
import { getInstance as getEventStoreConsumerInstance } from "EventStore/event-store-consumer-instance";
import { IconsEvent } from "DataManagement/Icons/EventStore/types";
export async function duplicateSharedElements(
  storeService: StoreService,
  itemId: string
): Promise<string | null> {
  let iconsLockId: string | null = null;
  const eventStore = getEventStoreInstance();
  const eventStoreConsumer = getEventStoreConsumerInstance();
  const { notes, credentials, changeHistories, secrets } =
    storeService.getPersonalData();
  const items = [...notes, ...credentials, ...secrets];
  const item = findDataModelObject(itemId, items);
  if (!item) {
    return null;
  }
  const newId = generateItemUuid();
  const itemToSave = { ...item, Id: newId };
  const changeHistory = changeHistories.find(
    (changeHistory) =>
      changeHistory.ObjectId.toUpperCase() === itemId.toUpperCase()
  );
  if (isCredential(item)) {
    iconsLockId = eventStoreConsumer.lockTopic("iconsUpdates");
    const iconEvent: IconsEvent = {
      credentialIds: [newId],
      type: "credentialUpdates",
    };
    await eventStore.add("iconsUpdates", iconEvent);
  }
  const saveAction = savePersonalDataItem(
    itemToSave,
    itemToSave.kwType,
    changeHistory
  );
  storeService.dispatch(saveAction);
  if (iconsLockId) {
    eventStoreConsumer.releaseTopic("iconsUpdates", iconsLockId);
  }
  return newId;
}
