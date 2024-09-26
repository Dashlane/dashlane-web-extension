import {
  ApplicationModulesAccess,
  BaseDataModelObject,
  Country,
  Credential,
  DataModelObject,
  DataModelType,
  isCredential,
  Note,
  NoteTypes,
} from "@dashlane/communication";
import { EventType } from "@dashlane/vault-contracts";
import { savePersonalDataItems } from "Session/Store/actions";
import { platformInfoSelector } from "Authentication/selectors";
import {
  ChangeHistory,
  getUpdatedItemChangeHistory,
  isChangeHistoryCandidate,
} from "DataManagement/ChangeHistory";
import { StoreService } from "Store";
import { makeUpdateChange } from "DataManagement/ChangeHistory/change";
import { SessionService } from "User/Services/types";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
import { evaluatePasswordStrength } from "Health/Strength/evaluatePasswordStrength";
import { generateItemUuid } from "Utils/generateItemUuid";
import { carbonEventHooks } from "EventStore/carbon-hooks";
import { LocalStorageService } from "Libs/Storage/Local/types";
import { sendExceptionLog } from "Logs/Exception";
export const convertImportable = (
  base: BaseDataModelObject
): DataModelObject => {
  return {
    ...base,
    Id: base.Id ? base.Id : generateItemUuid(),
    SpaceId: base["SpaceId"] ?? "",
    LocaleFormat: base["LocaleFormat"] ?? Country.UNIVERSAL,
  };
};
export const prepareCredentialForImport = async (base: Credential) => {
  return {
    ...base,
    Category: "",
    Strength: base.Password ? await evaluatePasswordStrength(base.Password) : 0,
  };
};
export const prepareSecureNoteForImport = (base: Note): Note => {
  const secureNoteCreationDate = getUnixTimestamp();
  return {
    ...base,
    CreationDatetime: secureNoteCreationDate,
    LocaleFormat: Country.US,
    UserModificationDatetime: secureNoteCreationDate,
    LastBackupTime: 0,
    Title:
      base.Title ?? `Untitled - ${secureNoteCreationDate.toLocaleString()}`,
    Content: base.Content ?? "",
    Category: base.Category ?? "noCategory",
    Secured: base.Secured ?? false,
    Type: NoteTypes.includes(base.Type) ? base.Type : "GRAY",
    Attachments: base.Attachments ?? [],
  };
};
export const groupByType = (
  objects: DataModelObject[]
): Map<DataModelType, DataModelObject[]> => {
  const map = new Map<DataModelType, DataModelObject[]>();
  for (const obj of objects) {
    const existingGroup = map.get(obj.kwType);
    if (existingGroup) {
      existingGroup.push(obj);
    } else {
      map.set(obj.kwType, [obj]);
    }
  }
  return map;
};
export interface Services {
  storeService: StoreService;
  sessionService: SessionService;
  localStorageService: LocalStorageService;
  applicationModulesAccess: ApplicationModulesAccess;
}
const dispatchIconAndHealthUpdates = async (
  applicationModulesAccess: ApplicationModulesAccess,
  credentialIds: string[]
) => {
  if (!credentialIds.length) {
    return;
  }
  try {
    const { commands } =
      applicationModulesAccess.createClients().vaultItemsCrud;
    await commands.emitTemporaryVaultItemEvent({
      ids: [...credentialIds],
      eventType: EventType.Created,
    });
    carbonEventHooks.iconsUpdates({
      type: "credentialUpdates",
      credentialIds,
    });
  } catch (error) {
    const message = `Failed to handle health & credential health updates with ${error}`;
    const augmentedError = new Error(message);
    sendExceptionLog({ error: augmentedError });
    return;
  }
};
export const savePersonalDataItemsForImport = (
  { storeService, sessionService, applicationModulesAccess }: Services,
  kwType: DataModelType,
  dataModelObjects: DataModelObject[]
) => {
  if (!dataModelObjects.length) {
    return;
  }
  const personalData = storeService.getPersonalData();
  const dataModelMetaData = dataModelObjects.reduce(
    (
      metaData: {
        changeHistories: ChangeHistory[];
        credentialIds: string[];
      },
      dataModelObject
    ) => {
      let changeHistory: ChangeHistory | null = null;
      if (isChangeHistoryCandidate(dataModelObject)) {
        changeHistory = getUpdatedItemChangeHistory({
          deviceName: storeService.getLocalSettings().deviceName ?? "",
          personalData: personalData,
          change: makeUpdateChange(dataModelObject),
          userLogin: storeService.getUserLogin(),
          platformInfo: platformInfoSelector(storeService.getState()),
        });
      }
      return {
        changeHistories: [
          ...metaData.changeHistories,
          ...(changeHistory ? [changeHistory] : []),
        ],
        credentialIds: [
          ...metaData.credentialIds,
          ...(isCredential(dataModelObject) ? [dataModelObject.Id] : []),
        ],
      };
    },
    {
      changeHistories: [],
      credentialIds: [],
    }
  );
  storeService.dispatch(
    savePersonalDataItems(
      dataModelObjects,
      kwType,
      dataModelMetaData.changeHistories
    )
  );
  sessionService.getInstance().user.persistPersonalData();
  dispatchIconAndHealthUpdates(
    applicationModulesAccess,
    dataModelMetaData.credentialIds
  );
};
