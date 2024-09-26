import {
  Collection,
  CollectionCommandResult,
  UpdateCollectionRequest,
} from "@dashlane/communication";
import { Trigger } from "@dashlane/hermes";
import { CoreServices } from "Services";
import { getDebounceSync } from "DataManagement/utils";
import { savePersonalDataItem } from "Session/Store/actions";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
import { sendExceptionLog } from "Logs/Exception";
import { sanitizeInputPersonalData } from "DataManagement/PersonalData/sanitize";
import { State } from "Store/types";
import { StoreService } from "Store";
import { SessionService } from "User/Services/types";
import { collectionSelector } from "../selectors";
const getCollectionModifiedProperties = (
  newCollectionData: UpdateCollectionRequest
): Partial<Collection> => {
  const collectionModificationDate = getUnixTimestamp();
  return {
    LastUse: collectionModificationDate,
    Name: newCollectionData.name,
    SpaceId: newCollectionData.spaceId,
    VaultItems: newCollectionData.vaultItems.map((item) => {
      return { Id: item.id, Type: item.type };
    }),
  };
};
function getUpdatedCollection(
  state: State,
  newCollectionData: UpdateCollectionRequest
): Collection {
  const existingCollection = collectionSelector(state, newCollectionData.id);
  if (!existingCollection) {
    throw new Error("[updateCollection]: unable to find collection to update.");
  }
  return {
    ...existingCollection,
    ...getCollectionModifiedProperties(newCollectionData),
  };
}
async function updateCollection(
  storeService: StoreService,
  sessionService: SessionService,
  updateCollectionData: UpdateCollectionRequest
): Promise<void> {
  if (!storeService.isAuthenticated()) {
    throw new Error("No session available to updateCollection");
  }
  const state = storeService.getState();
  const sanitizedUpdateCollectionData =
    sanitizeInputPersonalData(updateCollectionData);
  const collectionToSave = getUpdatedCollection(
    state,
    sanitizedUpdateCollectionData
  );
  storeService.dispatch(
    savePersonalDataItem(collectionToSave, collectionToSave.kwType)
  );
  return sessionService.getInstance().user.persistPersonalData();
}
export async function updateCollectionHandler(
  services: Pick<CoreServices, "sessionService" | "storeService">,
  collectionData: UpdateCollectionRequest
): Promise<CollectionCommandResult> {
  try {
    await updateCollection(
      services.storeService,
      services.sessionService,
      collectionData
    );
    const debounceSync = getDebounceSync(
      services.storeService,
      services.sessionService
    );
    debounceSync({ immediateCall: true }, Trigger.Save);
    return {
      success: true,
    };
  } catch (error) {
    sendExceptionLog({
      error,
    });
    return { success: false };
  }
}
