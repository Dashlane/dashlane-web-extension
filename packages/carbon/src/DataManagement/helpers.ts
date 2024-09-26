import { firstValueFrom } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import {
  ApplicationModulesAccess,
  Country,
  Credential,
  DataModelObject,
  DataModelType,
  Note,
  SaveOrigin,
  SavePersonalDataItemEvent,
  Secret,
} from "@dashlane/communication";
import { getSuccess, isSuccess } from "@dashlane/framework-types";
import {
  ActivityLogCategory,
  ActivityLogType,
  ClientGeneratedActivityLog,
} from "@dashlane/risk-monitoring-contracts";
import { ServerResponse } from "@dashlane/sharing/types/serverResponse";
import { ParsedURL } from "@dashlane/url-parser";
import { SharingSyncFeatureFlips } from "@dashlane/sharing-contracts";
import { makeItemService } from "Sharing/2/Services/ItemService";
import { makeItemWS } from "Libs/WS/Sharing/2/PerformItemAction";
import { getItemGroupKey } from "Sharing/2/Services/SharingHelpers";
import { makeSymmetricEncryption } from "Libs/CryptoCenter/SharingCryptoService";
import { StoreService } from "Store";
import { ukiSelector } from "Authentication/selectors";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
import { generateItemUuid } from "Utils/generateItemUuid";
import { getLocaleFormat } from "DataManagement/services";
import { currentTeamIdSelector } from "TeamAdmin/Services/selectors";
import { isItemToForceCategorize } from "./SmartTeamSpaces/forced-categorization.domain";
import { activeSpacesSelector } from "Session/selectors";
import { convertItemToDashlaneXml } from "Sharing/2/handlers/convert-item-to-dashlane-xml";
export interface MakeUpdatedPersonalDataResult
  extends Partial<DataModelObject> {
  LocaleFormat: Country;
  SpaceId: string;
  UserModificationDatetime?: number;
}
export interface MakeUpdatedPersonalDataItemBaseOptions {
  existingItem?: DataModelObject;
  updatedItem: SavePersonalDataItemEvent;
  itemUpdateDate: number;
}
export function makeUpdatedPersonalDataItemBase(
  options: MakeUpdatedPersonalDataItemBaseOptions
): MakeUpdatedPersonalDataResult {
  const userModificationDatetime =
    options.updatedItem.origin === "MANUAL"
      ? { UserModificationDatetime: options.itemUpdateDate }
      : {};
  return {
    LocaleFormat: getLocaleFormat(options.existingItem, options.updatedItem),
    SpaceId:
      options.updatedItem.content.spaceId !== undefined
        ? options.updatedItem.content.spaceId
        : options.existingItem?.SpaceId ?? "",
    Attachments: options.updatedItem.content.attachments,
    ...userModificationDatetime,
  };
}
export interface MakeNewPersonalDataResult
  extends MakeUpdatedPersonalDataResult {
  kwType: DataModelType;
  Id: string;
  CreationDatetime: number;
  LocaleFormat: Country;
  LastBackupTime: number;
  LastUse: number;
}
export function makeNewPersonalDataItemBase(
  newItem: SavePersonalDataItemEvent,
  itemCreationDate: number = getUnixTimestamp()
): MakeNewPersonalDataResult {
  return {
    kwType: newItem.kwType,
    Id: generateItemUuid(),
    CreationDatetime: itemCreationDate,
    LastBackupTime: 0,
    LastUse: itemCreationDate,
    ...makeUpdatedPersonalDataItemBase({
      updatedItem: newItem,
      itemUpdateDate: itemCreationDate,
    }),
  };
}
export async function notifySharersOnUpdate<
  T extends Credential | Note | Secret
>(
  storeService: StoreService,
  itemToSave: T,
  applicationModulesAccess: ApplicationModulesAccess
): Promise<ServerResponse | undefined> {
  const { userFeatureFlip } =
    applicationModulesAccess.createClients().featureFlips.queries;
  const featureFlipResult = await firstValueFrom(
    userFeatureFlip({
      featureFlip: SharingSyncFeatureFlips.SharingSyncGrapheneMigrationDev,
    })
  );
  const sharingSyncInGrapheneEnabled =
    isSuccess(featureFlipResult) && getSuccess(featureFlipResult);
  if (sharingSyncInGrapheneEnabled) {
    const xmlResult = await convertItemToDashlaneXml(storeService, itemToSave);
    if (xmlResult.success) {
      applicationModulesAccess
        .createClients()
        .sharingItems.commands.updateSharedItemContent({
          itemContent: xmlResult.xml,
          itemId: itemToSave.Id,
        });
    }
    return;
  }
  const itemService = makeItemService();
  const itemWS = makeItemWS();
  const sharingData = storeService.getSharingData();
  const login = storeService.getUserLogin();
  const uki = ukiSelector(storeService.getState());
  const sharingItem = (sharingData.items || []).find(
    (item) => item.itemId === itemToSave.Id
  );
  if (!sharingItem) {
    return undefined;
  }
  const sharingItemGroup = (sharingData.itemGroups || []).find((itemGroup) =>
    (itemGroup.items || []).map((item) => item.itemId).includes(itemToSave.Id)
  );
  if (!sharingItemGroup) {
    throw new Error("ItemGroup containing item not found in sharingData");
  }
  const { timestamp } = sharingItem;
  const { privateKey } = storeService.getUserSession().keyPair;
  const itemGroupKey = await getItemGroupKey(
    sharingItemGroup,
    sharingData.userGroups,
    privateKey,
    login,
    sharingData.collections
  );
  if (!itemGroupKey) {
    throw new Error("Could not decipher itemGroupKey for itemGroup");
  }
  const itemGroupItemKey = sharingItemGroup.items.find(
    (item) => item.itemId === itemToSave.Id
  );
  if (!itemGroupItemKey) {
    throw new Error("Could not find itemKey for item in itemGroup");
  }
  const itemKey = await makeSymmetricEncryption().decryptAES256(
    itemGroupKey,
    itemGroupItemKey.itemKey
  );
  const updateItemEvent = await itemService.makeUpdateItemEvent(
    timestamp,
    itemKey,
    { item: itemToSave }
  );
  const result = await itemWS.updateItem(login, uki, updateItemEvent);
  if (!result.items?.length) {
    throw new Error(`Shared item update failed`);
  }
  return result;
}
export function shouldSendCreateOrModifiedCredentialActivityLog(
  storeService: StoreService,
  item: Credential,
  origin?: SaveOrigin
): boolean {
  const teamId = currentTeamIdSelector(storeService.getState());
  const activeSpace = activeSpacesSelector(storeService.getState())[0];
  const isForceCategorizable = isItemToForceCategorize(item, activeSpace);
  return (
    origin !== SaveOrigin.IMPORT &&
    (item.SpaceId === teamId || isForceCategorizable)
  );
}
function computeAndSendActivityLog(
  logType:
    | ActivityLogType.UserCreatedCredential
    | ActivityLogType.UserDeletedCredential
    | ActivityLogType.UserModifiedCredential
    | ActivityLogType.UserImportedCredentials
    | ActivityLogType.UserImportedCollection
) {
  return async (
    applicationModulesAccess: ApplicationModulesAccess,
    logOptions: {
      domainUrl?: string;
      importCount?: number;
      collectionName?: string;
      itemCount?: number;
    }
  ): Promise<void> => {
    const domainUrl = {
      domain_url: new ParsedURL(logOptions.domainUrl).getRootDomain() ?? "",
    };
    const importCount = {
      import_count: logOptions.importCount ?? 0,
    };
    let logProperties;
    if (logType === ActivityLogType.UserImportedCredentials) {
      logProperties = importCount;
    } else if (logType === ActivityLogType.UserImportedCollection) {
      logProperties = {
        collection_name: logOptions.collectionName,
        credential_count: logOptions.itemCount,
      };
    } else {
      logProperties = domainUrl;
    }
    const log = {
      category: ActivityLogCategory.VaultPasswords,
      log_type: logType,
      properties: logProperties,
      is_sensitive:
        logType === ActivityLogType.UserImportedCredentials ? undefined : true,
      date_time: new Date().getTime(),
      schema_version: "1.0.0",
      uuid: uuidv4().toUpperCase(),
    } as ClientGeneratedActivityLog;
    await applicationModulesAccess
      .createClients()
      .activityLogs.commands.storeActivityLogs({
        activityLogs: [log],
      });
  };
}
export const computeAndSendCreatedCredentialActivityLog =
  computeAndSendActivityLog(ActivityLogType.UserCreatedCredential);
export const computeAndSendModifiedCredentialActivityLog =
  computeAndSendActivityLog(ActivityLogType.UserModifiedCredential);
export const computeAndSendDeletedCredentialActivityLog =
  computeAndSendActivityLog(ActivityLogType.UserDeletedCredential);
export const computeAndSendCSVImportActivityLog = computeAndSendActivityLog(
  ActivityLogType.UserImportedCredentials
);
export const computeAndSendCollectionImportActivityLog =
  computeAndSendActivityLog(ActivityLogType.UserImportedCollection);
