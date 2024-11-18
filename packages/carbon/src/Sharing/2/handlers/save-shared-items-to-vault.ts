import { mergeRight, pick } from "ramda";
import {
  Credential,
  DataModelType,
  isCredential,
  isNote,
  isSecret,
  Note,
  SaveSharedItemsToVaultRequest,
  Secret,
} from "@dashlane/communication";
import { platformInfoSelector } from "Authentication/selectors";
import { CoreServices } from "Services";
import { getInstance as getEventStoreInstance } from "EventStore/event-store-instance";
import { getInstance as getEventStoreConsumerInstance } from "EventStore/event-store-consumer-instance";
import { findDataModelObject } from "DataManagement/PersonalData/utils";
import { sharedFields as credentialSharedFields } from "DataManagement/Credentials";
import { sharedFields as secretSharedFields } from "DataManagement/Secrets";
import { sharedFields as noteSharedFields } from "DataManagement/SecureNotes";
import { IconsEvent } from "DataManagement/Icons/EventStore/types";
import {
  ChangeHistory,
  getUpdatedItemChangeHistory,
} from "DataManagement/ChangeHistory";
import { makeUpdateChange } from "DataManagement/ChangeHistory/change";
import { savePersonalDataItems } from "Session/Store/actions";
function updateItem<T extends Credential | Note | Secret>(
  fields: (keyof T)[],
  existingItem: T,
  itemUpdate: T
): T {
  const update = pick(fields, itemUpdate);
  return mergeRight(existingItem, update) as T;
}
export const saveSharedItemsToVault = async (
  services: CoreServices,
  payload: SaveSharedItemsToVaultRequest
) => {
  const { items } = payload;
  const { storeService } = services;
  const personalData = storeService.getPersonalData();
  const platformInfo = platformInfoSelector(storeService.getState());
  const eventStore = getEventStoreInstance();
  const eventStoreConsumer = getEventStoreConsumerInstance();
  const credentialIds = [];
  const credentials: Array<Credential> = [];
  const changeHistoryList: Array<ChangeHistory> = [];
  const notes: Array<Note> = [];
  const secrets: Array<Secret> = [];
  for (const item of items) {
    if (isCredential(item)) {
      const existingCredential = item.Id
        ? findDataModelObject(item.Id, personalData.credentials || [])
        : null;
      const credential = existingCredential
        ? updateItem(credentialSharedFields, existingCredential, item)
        : item;
      const changeHistory = getUpdatedItemChangeHistory({
        deviceName: storeService.getLocalSettings().deviceName,
        personalData,
        change: makeUpdateChange(credential),
        userLogin: storeService.getUserLogin(),
        platformInfo,
      });
      credentialIds.push(item.Id);
      credentials.push(credential);
      if (changeHistory) {
        changeHistoryList.push(changeHistory);
      }
    } else if (isNote(item)) {
      const existingNote = item.Id
        ? findDataModelObject(item.Id, personalData.notes || [])
        : null;
      const note = existingNote
        ? updateItem(noteSharedFields, existingNote, item)
        : item;
      notes.push(note);
    } else if (isSecret(item)) {
      const existingSecret = item.Id
        ? findDataModelObject(item.Id, personalData.secrets || [])
        : null;
      const secret = existingSecret
        ? updateItem(secretSharedFields, existingSecret, item)
        : item;
      secrets.push(secret);
    }
  }
  if (credentials.length) {
    const iconsLockId = eventStoreConsumer.lockTopic("iconsUpdates");
    const iconEvent: IconsEvent = {
      credentialIds,
      type: "credentialUpdates",
    };
    await eventStore.add("iconsUpdates", iconEvent);
    const action = savePersonalDataItems(
      credentials,
      DataModelType.KWAuthentifiant,
      changeHistoryList
    );
    storeService.dispatch(action);
    eventStoreConsumer.releaseTopic("iconsUpdates", iconsLockId);
  }
  if (notes.length) {
    const notesAction = savePersonalDataItems(
      notes,
      DataModelType.KWSecureNote,
      []
    );
    storeService.dispatch(notesAction);
  }
  if (secrets.length) {
    const secretsAction = savePersonalDataItems(
      secrets,
      DataModelType.KWSecret,
      []
    );
    storeService.dispatch(secretsAction);
  }
};
