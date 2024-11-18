import {
  ApplicationModulesAccess,
  DataModelObject,
  DATAMODELOBJECT_TYPE_TO_CARBON_STORE_KEY,
  DataModelType,
  ExceptionCriticality,
  isCredential,
  SavePersonalDataItemEvent,
  SavePersonalDataItemResponse,
} from "@dashlane/communication";
import { StoreService } from "Store";
import { PersonalData } from "Session/Store/personalData/types";
import { SessionService } from "User/Services/types";
import {
  cleanUrlForPersonalData,
  getUpdatedTrustedUrlList,
} from "DataManagement/Credentials/url";
import {
  getUpdatedItemChangeHistory,
  isChangeHistoryCandidate,
} from "DataManagement/ChangeHistory";
import { makeUpdateChange } from "DataManagement/ChangeHistory/change";
import { getCurrentItems, getDefaultSpaceId } from "DataManagement/utils";
import * as ExceptionLog from "Logs/Exception";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
import Debugger, { logWarn } from "Logs/Debugger";
import { savePersonalDataItem } from "Session/Store/actions";
import {
  makeNewCompany,
  makeUpdatedCompany,
} from "DataManagement/PersonalInfo/Company";
import {
  makeNewEmail,
  makeUpdatedEmail,
} from "DataManagement/PersonalInfo/Email";
import {
  makeNewPersonalWebsite,
  makeUpdatedPersonalWebsite,
} from "DataManagement/PersonalInfo/PersonalWebsite";
import {
  makeNewIdentity,
  makeUpdatedIdentity,
} from "DataManagement/PersonalInfo/Identity";
import {
  makeNewPhone,
  makeUpdatedPhone,
} from "DataManagement/PersonalInfo/Phone";
import {
  makeNewAddress,
  makeUpdatedAddress,
} from "DataManagement/PersonalInfo/Address";
import {
  makeNewNote,
  makeUpdatedNote,
  notifySharersNoteUpdated,
} from "DataManagement/SecureNotes";
import {
  afterCredentialSaved,
  beforeCredentialChange,
  makeNewCredential,
  makeUpdatedCredential,
  notifySharersCredentialUpdated,
} from "DataManagement/Credentials";
import {
  makeNewBankAccount,
  makeUpdatedBankAccount,
} from "DataManagement/BankAccounts";
import { getInstance as getEventStoreInstance } from "EventStore/event-store-instance";
import { getInstance as getEventStoreConsumerInstance } from "EventStore/event-store-consumer-instance";
import { IconsEvent } from "DataManagement/Icons/EventStore/types";
import { sanitizeInputPersonalData } from "DataManagement/PersonalData/sanitize";
import { platformInfoSelector } from "Authentication/selectors";
import { logAddVaultItem, logEditVaultItem } from "./logs";
import { EventLoggerService } from "Logs/EventLogger";
import { findDataModelObject } from "./utils";
import {
  computeAndSendCreatedCredentialActivityLog,
  computeAndSendModifiedCredentialActivityLog,
  shouldSendCreateOrModifiedCredentialActivityLog,
} from "DataManagement/helpers";
import {
  makeNewSecret,
  makeUpdatedSecret,
  notifySharersSecretUpdated,
} from "DataManagement/Secrets";
type FactoryBeforeChange = (
  item: SavePersonalDataItemEvent,
  personalData: PersonalData
) => SavePersonalDataItemEvent;
type FactoryCreate = (
  item: SavePersonalDataItemEvent
) => Promise<DataModelObject>;
type FactoryUpdate = (
  item: SavePersonalDataItemEvent,
  existingItem: DataModelObject
) => Promise<DataModelObject>;
type FactoryNotifySharersOnUpdate = (
  storeService: StoreService,
  originalItem: DataModelObject,
  newItem: DataModelObject,
  applicationAccessModule: ApplicationModulesAccess
) => Promise<boolean>;
type FactoryAfterSave = (
  storeService: StoreService,
  savedItem: DataModelObject
) => void;
const PersonalDataFactory: {
  [s: string]: {
    beforeChange?: FactoryBeforeChange;
    create: FactoryCreate;
    update: FactoryUpdate;
    notifySharersOnUpdate?: FactoryNotifySharersOnUpdate;
    afterSave?: FactoryAfterSave;
  };
} = {
  [DataModelType.KWAddress]: {
    create: makeNewAddress,
    update: makeUpdatedAddress,
  },
  [DataModelType.KWAuthentifiant]: {
    beforeChange: beforeCredentialChange,
    create: makeNewCredential,
    update: makeUpdatedCredential,
    notifySharersOnUpdate: notifySharersCredentialUpdated,
    afterSave: afterCredentialSaved,
  },
  [DataModelType.KWBankStatement]: {
    create: makeNewBankAccount,
    update: makeUpdatedBankAccount,
  },
  [DataModelType.KWCompany]: {
    create: makeNewCompany,
    update: makeUpdatedCompany,
  },
  [DataModelType.KWEmail]: {
    create: makeNewEmail,
    update: makeUpdatedEmail,
  },
  [DataModelType.KWIdentity]: {
    create: makeNewIdentity,
    update: makeUpdatedIdentity,
  },
  [DataModelType.KWPersonalWebsite]: {
    create: makeNewPersonalWebsite,
    update: makeUpdatedPersonalWebsite,
  },
  [DataModelType.KWPhone]: {
    create: makeNewPhone,
    update: makeUpdatedPhone,
  },
  [DataModelType.KWSecureNote]: {
    create: makeNewNote,
    update: makeUpdatedNote,
    notifySharersOnUpdate: notifySharersNoteUpdated,
  },
  [DataModelType.KWSecret]: {
    create: makeNewSecret,
    update: makeUpdatedSecret,
    notifySharersOnUpdate: notifySharersSecretUpdated,
  },
};
interface SavePersonalDataServices {
  storeService: StoreService;
  sessionService: SessionService;
  eventLoggerService: EventLoggerService;
  applicationModulesAccess: ApplicationModulesAccess;
}
function sanitizeSavePersonalDataItemEvent(
  item: SavePersonalDataItemEvent
): SavePersonalDataItemEvent {
  return {
    ...item,
    content: sanitizeInputPersonalData(item.content),
  } as SavePersonalDataItemEvent;
}
export async function makePersonalDataItem(
  storeService: StoreService,
  item: SavePersonalDataItemEvent,
  personalData: PersonalData,
  applicationAccessModule: ApplicationModulesAccess
): Promise<DataModelObject | null> {
  if (!item.content) {
    Debugger.error(`[Data] PersonalInfoItem: ${item.kwType}, has no content`);
    ExceptionLog.sendExceptionLog({
      message: `[makePersonalDataItem] No content found for PersonalDataItem of kwType: ${item.kwType}`,
      code: ExceptionCriticality.WARNING,
    });
    item = { ...item, content: {} } as SavePersonalDataItemEvent;
  }
  let existingItem = null;
  if (item.content.id) {
    const currentItems = getCurrentItems(item.kwType, personalData);
    existingItem = findDataModelObject(item.content.id, currentItems);
  }
  const factoryModel = PersonalDataFactory[item.kwType];
  if (!factoryModel) {
    Debugger.error(
      `[Data] Could not make PersonalDataItem of kwType: ${item.kwType}`
    );
    return null;
  }
  item = sanitizeSavePersonalDataItemEvent(item);
  if (factoryModel.beforeChange) {
    item = factoryModel.beforeChange(item, personalData);
  }
  let newItem: DataModelObject;
  if (existingItem) {
    newItem = await factoryModel.update(item, existingItem);
    if (factoryModel.notifySharersOnUpdate) {
      const result = await factoryModel.notifySharersOnUpdate(
        storeService,
        existingItem,
        newItem,
        applicationAccessModule
      );
      if (!result) {
        return null;
      }
    }
  } else {
    newItem = await factoryModel.create(item);
  }
  return newItem;
}
export async function addPersonalDataItem(
  {
    storeService,
    sessionService,
    eventLoggerService,
    applicationModulesAccess,
  }: SavePersonalDataServices,
  item: SavePersonalDataItemEvent
): Promise<SavePersonalDataItemResponse> {
  if (!storeService.isAuthenticated()) {
    Debugger.log("No session available to addPersonalDataItem");
    return { success: false, itemId: "" };
  }
  const personalData = storeService.getPersonalData();
  const itemToSave = await makePersonalDataItem(
    storeService,
    item,
    personalData,
    applicationModulesAccess
  );
  if (!itemToSave) {
    return { success: false, itemId: "" };
  }
  if (!itemToSave.SpaceId) {
    const defaultSpaceId = await getDefaultSpaceId(storeService);
    itemToSave.SpaceId = defaultSpaceId;
  }
  const isUpdatingExistingItem = Boolean(item?.content.id);
  let iconsLockId: string | null = null;
  const eventStore = getEventStoreInstance();
  const eventStoreConsumer = getEventStoreConsumerInstance();
  if (isUpdatingExistingItem) {
    const dataTypeKeyInStore =
      DATAMODELOBJECT_TYPE_TO_CARBON_STORE_KEY[itemToSave.kwType];
    const storedItem = findDataModelObject<DataModelObject>(
      itemToSave.Id,
      personalData[dataTypeKeyInStore]
    );
    logEditVaultItem(storeService, eventLoggerService, itemToSave, storedItem);
  } else {
    logAddVaultItem(storeService, eventLoggerService, itemToSave);
  }
  const platformInfo = platformInfoSelector(storeService.getState());
  const changeHistory =
    isChangeHistoryCandidate(itemToSave) && isUpdatingExistingItem
      ? getUpdatedItemChangeHistory({
          deviceName: storeService.getLocalSettings().deviceName,
          personalData: personalData,
          change: makeUpdateChange(itemToSave),
          userLogin: storeService.getUserLogin(),
          platformInfo,
        })
      : null;
  storeService.dispatch(
    savePersonalDataItem(itemToSave, itemToSave.kwType, changeHistory)
  );
  if (isCredential(itemToSave)) {
    iconsLockId = eventStoreConsumer.lockTopic("iconsUpdates");
    const iconEvent: IconsEvent = {
      credentialIds: [itemToSave.Id],
      type: "credentialUpdates",
    };
    await eventStore.add("iconsUpdates", iconEvent);
    if (itemToSave?.Password === "************") {
      logWarn({
        message: "Saving credentials using a placeholder",
        tag: "Credentials",
      });
    }
    if (
      shouldSendCreateOrModifiedCredentialActivityLog(
        storeService,
        itemToSave,
        item.origin
      )
    ) {
      if (item.content.id?.length) {
        await computeAndSendModifiedCredentialActivityLog(
          applicationModulesAccess,
          { domainUrl: item.content.url }
        );
      } else {
        await computeAndSendCreatedCredentialActivityLog(
          applicationModulesAccess,
          { domainUrl: item.content.url }
        );
      }
    }
  }
  if (PersonalDataFactory[item.kwType]?.afterSave) {
    PersonalDataFactory[item.kwType].afterSave(storeService, itemToSave);
  }
  if (iconsLockId) {
    eventStoreConsumer.releaseTopic("iconsUpdates", iconsLockId);
  }
  sessionService.getInstance().user.persistPersonalData();
  return { success: true, itemId: itemToSave.Id };
}
export function updatePersonalDataUsageMetadata(
  storeService: StoreService,
  id: string,
  url: string,
  kwType: DataModelType
): void {
  const dataType = DATAMODELOBJECT_TYPE_TO_CARBON_STORE_KEY[kwType];
  const cleanUrl = cleanUrlForPersonalData(url);
  const storedDataType = storeService.getPersonalData()[dataType];
  const dataModelObject = Array.isArray(storedDataType)
    ? findDataModelObject<any>(id, storedDataType)
    : null;
  if (!dataModelObject) {
    ExceptionLog.sendExceptionLog({
      message: `[PersonalData] - updatePersonalDataUsageMetadata: No ${dataType} found for provided ID to update usage metadata`,
      code: ExceptionCriticality.WARNING,
    });
    return;
  }
  Debugger.log(`[Data] Updating ${dataType} ${id} usage metadata`);
  const updatedDataModelObject: DataModelObject = {
    ...dataModelObject,
    LastUse: getUnixTimestamp(),
  };
  if (isCredential(updatedDataModelObject)) {
    const { NumberUse, TrustedUrlGroup } = updatedDataModelObject;
    updatedDataModelObject.NumberUse =
      (typeof NumberUse === "number" ? NumberUse : 0) + 1;
    updatedDataModelObject.TrustedUrlGroup = getUpdatedTrustedUrlList(
      TrustedUrlGroup,
      cleanUrl
    );
  }
  storeService.dispatch(savePersonalDataItem(updatedDataModelObject, kwType));
}
