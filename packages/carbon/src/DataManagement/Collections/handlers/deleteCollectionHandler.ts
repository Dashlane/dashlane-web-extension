import {
  CollectionCommandResult,
  DataModelType,
  DeleteCollectionRequest,
} from "@dashlane/communication";
import { Trigger } from "@dashlane/hermes";
import { CoreServices } from "Services";
import { getDebounceSync } from "DataManagement/utils";
import { sendExceptionLog } from "Logs/Exception";
import { removePersonalItem } from "Session/Store/personalData/actions";
async function deleteCollection(
  { storeService, sessionService }: CoreServices,
  collectionId: string
): Promise<void> {
  if (!storeService.isAuthenticated()) {
    throw new Error("No session available to deleteCollection");
  }
  const removePersonalItemAction = removePersonalItem(
    DataModelType.KWCollection,
    collectionId,
    null
  );
  storeService.dispatch(removePersonalItemAction);
  sessionService.getInstance().user.persistPersonalData();
}
export async function deleteCollectionHandler(
  services: CoreServices,
  collectionData: DeleteCollectionRequest
): Promise<CollectionCommandResult> {
  try {
    await deleteCollection(services, collectionData.id);
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
