import { mergeRight, pick } from "ramda";
import { firstValueFrom } from "rxjs";
import {
  ItemContent,
  ItemGroupDownload,
  UserDownload,
} from "@dashlane/sharing/types/serverResponse";
import {
  Credential,
  DataModelType,
  isCredential,
  isNote,
  isSecret,
  MemberPermission,
  Note,
  PendingItemGroup,
  Secret,
} from "@dashlane/communication";
import { isSuccess } from "@dashlane/framework-types";
import { OperationType } from "@dashlane/vault-contracts";
import { makeCryptoService } from "Libs/CryptoCenter/SharingCryptoService";
import { StoreService } from "Store";
import { savePersonalDataItem as savePersonalDataItemAction } from "Session/Store/actions";
import Debugger from "Logs/Debugger";
import {
  DeletePersonalDataServices,
  findPersonalDataItemToDelete,
} from "DataManagement/Deletion/";
import { removePersonalItem } from "Session/Store/personalData/actions";
import { reportDataUpdate } from "Session/SessionCommunication";
import { sharingDataUpdated } from "Session/Store/sharingData/actions";
import { SharingData } from "Session/Store/sharingData/types";
import { makeItemGroupService } from "Sharing/2/Services/ItemGroupService";
import { makeItemGroupWS } from "Libs/WS/Sharing/2/PerformItemGroupAction";
import { makeWSService, WSService } from "Libs/WS/index";
import { sendExceptionLog } from "Logs/Exception";
import { sharedFields as credentialSharedFields } from "DataManagement/Credentials";
import { sharedFields as secretSharedFields } from "DataManagement/Secrets";
import { sharedFields as noteSharedFields } from "DataManagement/SecureNotes";
import { duplicateSharedElements } from "DataManagement/Duplication";
import { deletePersonalDataItem } from "DataManagement/Deletion";
import { makeWSUserAlias } from "Libs/WS/UserAlias";
import { isLastActiveUserInItemGroupAndAdmin } from "Sharing/2/Services/SharingHelpers";
import { findDataModelObject } from "DataManagement/PersonalData/utils";
import { fixCredentialWithMissingTitle } from "DataManagement/Credentials/content";
import { ukiSelector } from "Authentication/selectors";
import { getInstance as getEventStoreInstance } from "EventStore/event-store-instance";
import { getInstance as getEventStoreConsumerInstance } from "EventStore/event-store-consumer-instance";
import { IconsEvent } from "DataManagement/Icons/EventStore/types";
import { getUpdatedItemChangeHistory } from "DataManagement/ChangeHistory";
import { platformInfoSelector } from "Authentication/selectors";
import { makeUpdateChange } from "DataManagement/ChangeHistory/change";
import { validateItemGroupResponse } from "./utils";
export async function deleteItemEffect(
  storeService: StoreService,
  itemId: string
): Promise<boolean> {
  try {
    const itemToDelete = findPersonalDataItemToDelete(storeService, itemId);
    if (!itemToDelete) {
      return true;
    }
    const deleteAction = removePersonalItem(
      itemToDelete.kwType,
      itemToDelete.Id,
      null
    );
    storeService.dispatch(deleteAction);
    return true;
  } catch (error) {
    Debugger.log(`[SharingSync]: deleteItemEffect: ${error}`);
    return false;
  }
}
export async function createOrUpdateItemEffect(
  storeService: StoreService,
  item: ItemContent,
  itemKey: string
): Promise<boolean> {
  let iconsLockId: string | null = null;
  const eventStore = getEventStoreInstance();
  const eventStoreConsumer = getEventStoreConsumerInstance();
  try {
    const itemContent =
      await makeCryptoService().symmetricEncryption.decryptSharingItem(
        itemKey,
        item.content
      );
    const { Id: itemId } = itemContent;
    const personalData = storeService.getPersonalData();
    const platformInfo = platformInfoSelector(storeService.getState());
    if (isCredential(itemContent)) {
      iconsLockId = eventStoreConsumer.lockTopic("iconsUpdates");
      const existingCredential = itemId
        ? findDataModelObject(itemId, personalData.credentials || [])
        : null;
      const credential = existingCredential
        ? updateItem(credentialSharedFields, existingCredential, itemContent)
        : itemContent;
      const iconEvent: IconsEvent = {
        credentialIds: [credential.Id],
        type: "credentialUpdates",
      };
      await eventStore.add("iconsUpdates", iconEvent);
      const changeHistory = getUpdatedItemChangeHistory({
        deviceName: storeService.getLocalSettings().deviceName,
        personalData,
        change: makeUpdateChange(credential),
        userLogin: storeService.getUserLogin(),
        platformInfo,
      });
      const action = savePersonalDataItemAction(
        credential,
        DataModelType.KWAuthentifiant,
        changeHistory
      );
      storeService.dispatch(action);
      eventStoreConsumer.releaseTopic("iconsUpdates", iconsLockId);
    } else if (isNote(itemContent)) {
      const existingNote = itemId
        ? findDataModelObject(itemId, personalData.notes || [])
        : null;
      const note = existingNote
        ? updateItem(noteSharedFields, existingNote, itemContent)
        : itemContent;
      const action = savePersonalDataItemAction(
        note,
        DataModelType.KWSecureNote
      );
      storeService.dispatch(action);
    } else if (isSecret(itemContent)) {
      const existingSecret = itemId
        ? findDataModelObject(itemId, personalData.secrets || [])
        : null;
      const secret = existingSecret
        ? updateItem(secretSharedFields, existingSecret, itemContent)
        : itemContent;
      const action = savePersonalDataItemAction(secret, DataModelType.KWSecret);
      storeService.dispatch(action);
    }
    return true;
  } catch (error) {
    Debugger.log(`[SharingSync] - createOrUpdateItemEffect: ${error}`);
    if (iconsLockId) {
      eventStoreConsumer.releaseTopic("iconsUpdates", iconsLockId);
    }
    return false;
  }
}
function updateItem<T extends Credential | Note | Secret>(
  fields: (keyof T)[],
  existingItem: T,
  itemUpdate: T
): T {
  const update = pick(fields, itemUpdate);
  return mergeRight(existingItem, update) as T;
}
export async function getPendingItemGroup(
  item: ItemContent,
  itemKey: string,
  itemGroupId: string,
  referrer: string,
  permission: MemberPermission,
  personalDataById: Record<string, Credential | Note | Secret>
): Promise<PendingItemGroup> {
  let sharedItemContent;
  if (item.content) {
    const crypto = makeCryptoService().symmetricEncryption;
    sharedItemContent = await crypto.decryptSharingItem(itemKey, item.content);
  } else {
    sharedItemContent = personalDataById[item.itemId];
  }
  const isC = isCredential(sharedItemContent);
  const isN = isNote(sharedItemContent);
  const isS = isSecret(sharedItemContent);
  if (!isC && !isN && !isS) {
    throw new Error("item is neither credential, secret nor note");
  }
  let sharedItemContentWithIconAndTitle = sharedItemContent;
  if (isC) {
    sharedItemContentWithIconAndTitle =
      fixCredentialWithMissingTitle(sharedItemContent);
  }
  return {
    itemGroupId,
    items: [sharedItemContentWithIconAndTitle],
    permission,
    referrer,
  };
}
export function updateSharingData(
  storeService: StoreService,
  sharingData: SharingData
): void {
  const action = sharingDataUpdated(sharingData);
  storeService.dispatch(action);
  reportDataUpdate(storeService);
}
export async function resendPublicKeyInvite(
  storeService: StoreService,
  user: UserDownload,
  itemGroup: ItemGroupDownload
): Promise<void> {
  const context = `[SharingEffectsService] - resendPublicKeyInvite`;
  try {
    const login = storeService.getUserLogin();
    const uki = ukiSelector(storeService.getState());
    const { groupId, revision } = itemGroup;
    const { privateKey } = storeService.getUserSession().keyPair;
    const crypto = makeCryptoService();
    const wsService = makeWSService();
    const { findUsersByAliases } = makeWSUserAlias();
    const { makeUserUpdate, makeUpdateItemGroupMembers } = makeItemGroupService(
      wsService,
      crypto
    );
    const { updateItemGroupMembers } = makeItemGroupWS();
    const jsonAliases = JSON.stringify([user.userId]);
    const foundUsers = await findUsersByAliases({
      login,
      uki,
      aliases: jsonAliases,
    });
    const foundUser = foundUsers[user.userId];
    if (!foundUser) {
      const message = `${context}: couldn't find the user by alias, aborting.`;
      sendExceptionLog({ message });
      return;
    }
    const meInItemGroup = (itemGroup.users || []).find(
      (u) => u.userId === login
    );
    if (!meInItemGroup) {
      const message = `${context}: couldn't find myself in "itemGroup.users", aborting.`;
      sendExceptionLog({ message });
      return;
    }
    const rawItemGroupKey = await crypto.asymmetricEncryption.decrypt(
      privateKey,
      meInItemGroup.groupKey
    );
    const { publicKey: userPublicKey } = foundUser;
    const { permission, userId } = user;
    const userUpdate = await makeUserUpdate(userId, permission, {
      rawItemGroupKey,
      userPublicKey,
    });
    const update = makeUpdateItemGroupMembers(
      groupId,
      revision,
      [userUpdate],
      null
    );
    const res = await updateItemGroupMembers(login, uki, update);
    if (res && res.itemGroups && res.itemGroups.length === 1) {
      const { userGroups: sharingUserGroups } = storeService.getSharingData();
      await validateItemGroupResponse(
        "[SharingSyncJobsService] - resendPublicKeyInvite",
        crypto,
        res,
        userPublicKey,
        privateKey,
        rawItemGroupKey,
        login,
        [userUpdate],
        sharingUserGroups,
        true
      );
    }
  } catch (error) {
    const augmentedError = new Error(`${context}: ${error}`);
    sendExceptionLog({ error: augmentedError });
  }
}
export async function deleteSingleUserItemGroup(
  {
    storeService,
    wsService,
    eventLoggerService,
    applicationModulesAccess,
    sharingItemsApi,
  }: DeletePersonalDataServices & {
    wsService: WSService;
  },
  itemGroup: ItemGroupDownload
): Promise<boolean> {
  const { login } = storeService.getAccountInfo();
  const uki = ukiSelector(storeService.getState());
  const {
    keyPair: { privateKey },
  } = storeService.getUserSession();
  const { groupId, revision } = itemGroup;
  const context = `[SharingEffectsService] - deleteSingleUserItemGroup`;
  const crypto = makeCryptoService();
  const { deleteItemGroup, makeDeleteItemGroupEvent } = makeItemGroupService(
    wsService,
    crypto
  );
  const alone = isLastActiveUserInItemGroupAndAdmin(itemGroup, login);
  if (!alone) {
    const message = `I'm not alone in the group, aborting.`;
    const error = new Error(`${context}: ${message}`);
    throw error;
  }
  if (!itemGroup.items || itemGroup.items.length === 0) {
    return true;
  }
  const itemIds = (itemGroup.items || []).map(({ itemId }) => itemId);
  const duplicationIds = {};
  for (const itemId of itemIds) {
    const duplicateId = await duplicateSharedElements(storeService, itemId);
    duplicationIds[itemId] = duplicateId;
  }
  try {
    const currentUserInfo = { login, uki, privateKey };
    const deleteItemGroupEvent = await makeDeleteItemGroupEvent(
      groupId,
      revision
    );
    await deleteItemGroup(currentUserInfo, deleteItemGroupEvent);
    Object.keys(duplicationIds)
      .filter((itemId) => duplicationIds[itemId])
      .forEach((itemId) => {
        deletePersonalDataItem(
          {
            storeService,
            eventLoggerService,
            sharingItemsApi,
          },
          itemId,
          { ignoreSharing: true }
        );
      });
  } catch (error) {
    const augmentedError = new Error(`${context}: ${error}`);
    sendExceptionLog({ error: augmentedError });
    Object.keys(duplicationIds)
      .map((itemId) => duplicationIds[itemId])
      .filter(Boolean)
      .forEach((itemId) =>
        deletePersonalDataItem(
          {
            storeService,
            eventLoggerService,
            sharingItemsApi,
          },
          itemId
        )
      );
    return false;
  }
  try {
    if (applicationModulesAccess) {
      const { commands, queries } =
        applicationModulesAccess.createClients().vaultOrganization;
      const collectionsResult = await firstValueFrom(
        queries.queryCollections({})
      );
      if (
        isSuccess(collectionsResult) &&
        collectionsResult.data.collections?.length > 0
      ) {
        const oldIds = Object.keys(duplicationIds).filter(
          (itemId) => duplicationIds[itemId]
        );
        const duplicatedIds = Object.keys(duplicationIds)
          .map((itemId) => duplicationIds[itemId])
          .filter(Boolean);
        const collectionsToUpdate = collectionsResult.data.collections.filter(
          (collection) =>
            collection.vaultItems.some((vaultItem) =>
              oldIds.includes(vaultItem.id)
            )
        );
        const collectionRemovals = {
          vaultItems: oldIds.map((itemId) => ({
            id: itemId,
            type: DataModelType.KWAuthentifiant,
          })),
        };
        const collectionAdditions = {
          vaultItems: duplicatedIds.map((itemId) => ({
            id: itemId,
            type: DataModelType.KWAuthentifiant,
          })),
        };
        for (const collectionToUpdate of collectionsToUpdate) {
          await commands.updateCollection({
            id: collectionToUpdate.id,
            collection: collectionRemovals,
            operationType: OperationType.SUBSTRACT_VAULT_ITEMS,
          });
          await commands.updateCollection({
            id: collectionToUpdate.id,
            collection: collectionAdditions,
            operationType: OperationType.APPEND_VAULT_ITEMS,
          });
        }
      }
    }
    return true;
  } catch (error) {
    const augmentedError = new Error(
      `${context}: failure cleaning up collections ${error}`
    );
    sendExceptionLog({ error: augmentedError });
    Object.keys(duplicationIds)
      .map((itemId) => duplicationIds[itemId])
      .filter(Boolean)
      .forEach((itemId) =>
        deletePersonalDataItem(
          {
            storeService,
            eventLoggerService,
            sharingItemsApi,
          },
          itemId
        )
      );
    return false;
  }
}
