import {
  Action,
  AnonymousUpdateCredentialEvent,
  DomainType,
  hashDomain,
  Space,
  UpdateCredentialOrigin,
  UserUpdateVaultItemEvent,
} from "@dashlane/hermes";
import {
  Credential,
  DataModelObject,
  DataModelType,
} from "@dashlane/communication";
import { ParsedURL } from "@dashlane/url-parser";
import { PERSONAL_SPACE_ID } from "DataManagement/Spaces/constants";
import {
  dataModelTypeToItemType,
  getHermesFieldFromProperty,
  getUpdatedProperties,
  VaultItemProperty,
} from "./logsHelpers";
import { getCollectionNamesContainingVaultItemId } from "DataManagement/Collections";
import { collectionsSelector } from "DataManagement/Collections/selectors";
import { EventLoggerService } from "Logs/EventLogger";
import { StoreService } from "Store";
const logUpdateVaultItem = (
  storeService: StoreService,
  eventLoggerService: EventLoggerService,
  action: Action,
  item: DataModelObject,
  credentialActionOrigin?: UpdateCredentialOrigin,
  updatedProperties?: VaultItemProperty[],
  multiSelectId?: string
) => {
  const state = storeService.getState();
  const collections = collectionsSelector(state);
  const space =
    item.SpaceId === PERSONAL_SPACE_ID ? Space.Personal : Space.Professional;
  const fieldsEdited =
    updatedProperties !== undefined
      ? updatedProperties
          .map((property) => getHermesFieldFromProperty(item, property))
          .filter((property) => property)
      : undefined;
  const itemType = dataModelTypeToItemType[item.kwType];
  const collectionCount = getCollectionNamesContainingVaultItemId(
    item.Id,
    collections
  ).length;
  eventLoggerService.logEvent(
    new UserUpdateVaultItemEvent({
      action,
      itemId: item.Id,
      itemType,
      fieldsEdited,
      space,
      collectionCount,
      multiSelectId: multiSelectId ?? undefined,
      updateCredentialOrigin: credentialActionOrigin,
    })
  );
  if (item.kwType === DataModelType.KWAuthentifiant) {
    const credential = item as Credential;
    const rootDomain = new ParsedURL(credential.Url).getRootDomain();
    const sanitizedRootDomain =
      typeof rootDomain === "string" ? rootDomain : "";
    hashDomain(sanitizedRootDomain).then((id) => {
      eventLoggerService.logEvent(
        new AnonymousUpdateCredentialEvent({
          action,
          domain: {
            id: id,
            type: DomainType.Web,
          },
          fieldList: fieldsEdited,
          space,
        })
      );
    });
  }
};
export const logEditVaultItem = (
  storeService: StoreService,
  eventLoggerService: EventLoggerService,
  item: DataModelObject,
  originalItem: DataModelObject,
  credentialActionOrigin?: UpdateCredentialOrigin
) => {
  const updatedProperties = getUpdatedProperties(item, originalItem);
  logUpdateVaultItem(
    storeService,
    eventLoggerService,
    Action.Edit,
    item,
    credentialActionOrigin,
    updatedProperties
  );
};
export const logAddVaultItem = (
  storeService: StoreService,
  eventLoggerService: EventLoggerService,
  item: DataModelObject,
  credentialActionOrigin?: UpdateCredentialOrigin
) =>
  logUpdateVaultItem(
    storeService,
    eventLoggerService,
    Action.Add,
    item,
    credentialActionOrigin
  );
export const logDeleteVaultItem = (
  storeService: StoreService,
  eventLoggerService: EventLoggerService,
  item: DataModelObject,
  credentialActionOrigin?: UpdateCredentialOrigin,
  multiSelectId?: string
) =>
  logUpdateVaultItem(
    storeService,
    eventLoggerService,
    Action.Delete,
    item,
    credentialActionOrigin,
    undefined,
    multiSelectId
  );
