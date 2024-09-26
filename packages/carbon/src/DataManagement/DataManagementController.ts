import type {
  ApplicationModulesAccess,
  DataModelType,
  RemovePersonalDataItemResponse,
  SavePaymentCardEvent,
  SavePersonalDataItemEvent,
  SavePersonalDataItemResponse,
} from "@dashlane/communication";
import { Trigger } from "@dashlane/hermes";
import { StoreService } from "Store";
import { SessionService } from "User/Services/types";
import { savePaymentCard } from "DataManagement/PaymentCards";
import {
  addPersonalDataItem,
  updatePersonalDataUsageMetadata,
} from "DataManagement/PersonalData/personal-data";
import { deletePersonalDataItem } from "DataManagement/Deletion";
import { WSService } from "Libs/WS/index";
import { DataEncryptorService } from "Libs/CryptoCenter/DataEncryptorService";
import { EventLoggerService } from "Logs/EventLogger";
import { SyncDebounceFunction } from "DataManagement/types";
import { getDebounceSync } from "DataManagement/utils";
import { isSharedSelector } from "Sharing/2/Services/selectors";
export interface DataManagementController {
  savePaymentCardFromClient: (newPaymentCard: SavePaymentCardEvent) => void;
  savePersonalDataItem: (
    item: SavePersonalDataItemEvent
  ) => Promise<SavePersonalDataItemResponse>;
  removePersonalDataItem: (
    id: string,
    ignoreSharing?: boolean
  ) => Promise<RemovePersonalDataItemResponse>;
  updateMetadataItemFilledOnPage: (
    id: string,
    url: string,
    kwType: DataModelType
  ) => void;
}
export interface DataManagementControllerServices {
  masterPasswordEncryptorService: DataEncryptorService;
  sessionService: SessionService;
  wsService: WSService;
  storeService: StoreService;
  eventLoggerService: EventLoggerService;
  applicationModulesAccess: ApplicationModulesAccess;
}
const DEBOUNCE_SYNC_IMMEDIATE = {
  immediateCall: true,
};
export const makeDataManagementController = (
  services: DataManagementControllerServices
): DataManagementController => {
  const debounceSync: SyncDebounceFunction = getDebounceSync(
    services.storeService,
    services.sessionService
  );
  return {
    savePaymentCardFromClient: (newPaymentCard: SavePaymentCardEvent) =>
      savePaymentCardFromClient(
        {
          storeService: services.storeService,
          sessionService: services.sessionService,
          eventLoggerService: services.eventLoggerService,
        },
        debounceSync,
        newPaymentCard
      ),
    savePersonalDataItem: (item) =>
      savePersonalDataItem(
        {
          storeService: services.storeService,
          sessionService: services.sessionService,
          eventLoggerService: services.eventLoggerService,
          applicationModulesAccess: services.applicationModulesAccess,
        },
        debounceSync,
        item
      ),
    removePersonalDataItem: (id: string, ignoreSharing?: boolean) => {
      const {
        storeService,
        wsService,
        eventLoggerService,
        applicationModulesAccess,
      } = services;
      const { sharingItems: sharingItemsApi } =
        applicationModulesAccess.createClients();
      const deletePersonalDataServices = {
        storeService,
        wsService,
        eventLoggerService,
        sharingItemsApi,
        applicationModulesAccess,
      };
      return deletePersonalDataItem(deletePersonalDataServices, id, {
        ignoreSharing: !!ignoreSharing,
      });
    },
    updateMetadataItemFilledOnPage: (
      id: string,
      url: string,
      kwType: DataModelType
    ) =>
      updateMetadataItemFilledOnPage(
        services.storeService,
        debounceSync,
        id,
        url,
        kwType
      ),
  };
};
interface SavePersonalDataServices {
  storeService: StoreService;
  sessionService: SessionService;
  eventLoggerService: EventLoggerService;
  applicationModulesAccess: ApplicationModulesAccess;
}
function savePaymentCardFromClient(
  services: Omit<SavePersonalDataServices, "applicationModulesAccess">,
  debounceSync: SyncDebounceFunction,
  newPaymentCard: SavePaymentCardEvent
): void {
  savePaymentCard(services, newPaymentCard);
  debounceSync(DEBOUNCE_SYNC_IMMEDIATE, Trigger.Save);
}
async function savePersonalDataItem(
  services: SavePersonalDataServices,
  debounceSync: SyncDebounceFunction,
  item: SavePersonalDataItemEvent
): Promise<SavePersonalDataItemResponse> {
  const {
    storeService,
    sessionService,
    eventLoggerService,
    applicationModulesAccess,
  } = services;
  if (item.kwType === "KWPaymentMean_creditCard") {
    savePaymentCard(
      {
        storeService,
        sessionService,
        eventLoggerService,
      },
      item.content
    );
    debounceSync(DEBOUNCE_SYNC_IMMEDIATE, Trigger.Save);
    return Promise.resolve({ success: true, itemId: "" });
  } else {
    const savePersonalDataItemResponse = await addPersonalDataItem(
      {
        storeService,
        sessionService,
        eventLoggerService,
        applicationModulesAccess,
      },
      item
    );
    const state = storeService.getState();
    const isItemShared = isSharedSelector(state, item.content.id);
    if (item.kwType !== "KWAuthentifiant" || !item.shouldSkipSync) {
      if (isItemShared) {
        await services.sessionService
          .getInstance()
          .user.attemptSync(Trigger.SettingsChange);
      } else {
        debounceSync(DEBOUNCE_SYNC_IMMEDIATE, Trigger.Save);
      }
    }
    return savePersonalDataItemResponse;
  }
}
function updateMetadataItemFilledOnPage(
  storeService: StoreService,
  debounceSync: SyncDebounceFunction,
  id: string,
  url: string,
  kwType: DataModelType
) {
  updatePersonalDataUsageMetadata(storeService, id, url, kwType);
  debounceSync({}, Trigger.SaveMeta);
}
