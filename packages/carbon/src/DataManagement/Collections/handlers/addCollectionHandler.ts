import {
  AddCollectionRequest,
  Collection,
  Country,
  CreateCollectionCommandResult,
} from "@dashlane/communication";
import { Trigger } from "@dashlane/hermes";
import { CoreServices } from "Services";
import { getDebounceSync, getDefaultSpaceId } from "DataManagement/utils";
import { savePersonalDataItem } from "Session/Store/actions";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
import { generateItemUuid } from "Utils/generateItemUuid";
import { sendExceptionLog } from "Logs/Exception";
import { sanitizeInputPersonalData } from "DataManagement/PersonalData/sanitize";
export function getNewCollection(
  newCollectionData: AddCollectionRequest
): Collection {
  const collectionCreationDate = getUnixTimestamp();
  return {
    kwType: "KWCollection",
    Id: generateItemUuid(),
    LastBackupTime: 0,
    LastUse: collectionCreationDate,
    LocaleFormat: Country.UNIVERSAL,
    SpaceId: newCollectionData.spaceId,
    CreationDatetime: collectionCreationDate,
    UserModificationDatetime: collectionCreationDate,
    Name: newCollectionData.name,
    VaultItems: newCollectionData.vaultItems.map((item) => {
      return { Id: item.id, Type: item.type };
    }),
  };
}
async function addCollection(
  { storeService, sessionService }: CoreServices,
  newCollectionData: AddCollectionRequest
): Promise<string> {
  if (!storeService.isAuthenticated()) {
    throw new Error("No session available to addCollection");
  }
  const sanitizedNewCollectionData =
    sanitizeInputPersonalData(newCollectionData);
  const collectionToSave = getNewCollection(sanitizedNewCollectionData);
  if (!collectionToSave.SpaceId) {
    const defaultSpaceId = await getDefaultSpaceId(storeService);
    collectionToSave.SpaceId = defaultSpaceId;
  }
  storeService.dispatch(
    savePersonalDataItem(collectionToSave, collectionToSave.kwType)
  );
  sessionService.getInstance().user.persistPersonalData();
  return collectionToSave.Id;
}
export async function addCollectionHandler(
  services: CoreServices,
  collectionData: AddCollectionRequest
): Promise<CreateCollectionCommandResult> {
  try {
    const newCollectionId = await addCollection(services, collectionData);
    const debounceSync = getDebounceSync(
      services.storeService,
      services.sessionService
    );
    debounceSync({ immediateCall: true }, Trigger.Save);
    return {
      success: true,
      id: newCollectionId,
    };
  } catch (error) {
    sendExceptionLog({
      error,
    });
    return { success: false };
  }
}
