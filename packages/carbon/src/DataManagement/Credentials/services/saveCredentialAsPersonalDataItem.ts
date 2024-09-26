import { ApplicationModulesAccess, Credential } from "@dashlane/communication";
import { Trigger } from "@dashlane/hermes";
import { EventType } from "@dashlane/vault-contracts";
import { savePersonalDataItem } from "Session/Store/actions";
import { IconsEvent } from "DataManagement/Icons/EventStore/types";
import { getInstance as getEventStoreInstance } from "EventStore/event-store-instance";
import { getInstance as getEventStoreConsumerInstance } from "EventStore/event-store-consumer-instance";
import { platformInfoSelector } from "Authentication/selectors";
import { getUpdatedItemChangeHistory } from "DataManagement/ChangeHistory";
import { StoreService } from "Store";
import { makeUpdateChange } from "DataManagement/ChangeHistory/change";
import { getDebounceSync } from "DataManagement/utils";
import { SessionService } from "User/Services/types";
import { afterCredentialSaved, notifySharersCredentialUpdated } from "..";
import {
  logAddVaultItem,
  logEditVaultItem,
} from "DataManagement/PersonalData/logs";
import { EventLoggerService } from "Logs/EventLogger";
export interface UpdateCredentialServices {
  storeService: StoreService;
  sessionService: SessionService;
  eventLoggerService: EventLoggerService;
  applicationModulesAccess: ApplicationModulesAccess;
}
export async function saveCredentialAsPersonalDataItem(
  {
    storeService,
    sessionService,
    eventLoggerService,
    applicationModulesAccess,
  }: UpdateCredentialServices,
  credential: Credential,
  existingCredential?: Credential
) {
  if (existingCredential) {
    notifySharersCredentialUpdated(
      storeService,
      existingCredential,
      credential,
      applicationModulesAccess
    );
  }
  const personalData = storeService.getPersonalData();
  const historyChange = getUpdatedItemChangeHistory({
    deviceName: storeService.getLocalSettings().deviceName,
    personalData: personalData,
    change: makeUpdateChange(credential),
    userLogin: storeService.getUserLogin(),
    platformInfo: platformInfoSelector(storeService.getState()),
  });
  let iconsLockId: string | null = null;
  const eventStore = getEventStoreInstance();
  const eventStoreConsumer = getEventStoreConsumerInstance();
  try {
    iconsLockId = eventStoreConsumer.lockTopic("iconsUpdates");
    storeService.dispatch(
      savePersonalDataItem(credential, credential.kwType, historyChange)
    );
    await sessionService.getInstance().user.persistPersonalData();
    afterCredentialSaved(storeService, credential);
    const iconEvent: IconsEvent = {
      type: "credentialUpdates",
      credentialIds: [credential.Id],
    };
    await eventStore.add("iconsUpdates", iconEvent);
    if (existingCredential) {
      logEditVaultItem(
        storeService,
        eventLoggerService,
        credential,
        existingCredential
      );
    } else {
      logAddVaultItem(storeService, eventLoggerService, credential);
    }
    const { commands } =
      applicationModulesAccess.createClients().vaultItemsCrud;
    await commands.emitTemporaryVaultItemEvent({
      ids: [credential.Id],
      eventType: existingCredential ? EventType.Updated : EventType.Created,
    });
    const debounceSync = getDebounceSync(storeService, sessionService);
    debounceSync({ immediateCall: true }, Trigger.Save);
  } finally {
    if (iconsLockId) {
      eventStoreConsumer.releaseTopic("iconsUpdates", iconsLockId);
    }
  }
}
