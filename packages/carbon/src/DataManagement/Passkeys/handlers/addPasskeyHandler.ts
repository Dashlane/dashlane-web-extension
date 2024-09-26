import { Trigger } from "@dashlane/hermes";
import {
  AddPasskeyRequest,
  AddPasskeyResult,
  Country,
  Passkey,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { getDebounceSync, getDefaultSpaceId } from "DataManagement/utils";
import { savePersonalDataItem } from "Session/Store/actions";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
import { generateItemUuid } from "Utils/generateItemUuid";
import { sendExceptionLog } from "Logs/Exception";
import { sanitizeInputPersonalData } from "DataManagement/PersonalData/sanitize";
export function getNewPasskey(newPasskeyData: AddPasskeyRequest): Passkey {
  const passkeyCreationDate = getUnixTimestamp();
  return {
    kwType: "KWPasskey",
    Id: generateItemUuid(),
    LastBackupTime: 0,
    LastUse: passkeyCreationDate,
    LocaleFormat: Country.UNIVERSAL,
    SpaceId: newPasskeyData.spaceId,
    CreationDatetime: passkeyCreationDate,
    UserModificationDatetime: passkeyCreationDate,
    Counter: 0,
    CredentialId: newPasskeyData.credentialId,
    ItemName: newPasskeyData.itemName,
    KeyAlgorithm: newPasskeyData.keyAlgorithm,
    Note: newPasskeyData.note,
    PrivateKey: newPasskeyData.privateKey,
    RpId: newPasskeyData.rpId,
    RpName: newPasskeyData.rpName,
    UserDisplayName: newPasskeyData.userDisplayName,
    UserHandle: newPasskeyData.userHandle,
  };
}
async function addPasskey(
  { storeService, sessionService }: CoreServices,
  newPasskeyData: AddPasskeyRequest
): Promise<string> {
  if (!storeService.isAuthenticated()) {
    throw new Error("No session available to savePasskey");
  }
  const sanitizedNewPasskeyData = sanitizeInputPersonalData(newPasskeyData);
  const passkeyToSave = getNewPasskey(sanitizedNewPasskeyData);
  if (!passkeyToSave.SpaceId) {
    const defaultSpaceId = await getDefaultSpaceId(storeService);
    passkeyToSave.SpaceId = defaultSpaceId;
  }
  storeService.dispatch(
    savePersonalDataItem(passkeyToSave, passkeyToSave.kwType)
  );
  sessionService.getInstance().user.persistPersonalData();
  return passkeyToSave.Id;
}
export async function addPasskeyHandler(
  services: CoreServices,
  passkeyData: AddPasskeyRequest
): Promise<AddPasskeyResult> {
  try {
    const createdPasskeyId = await addPasskey(services, passkeyData);
    const debounceSync = getDebounceSync(
      services.storeService,
      services.sessionService
    );
    debounceSync({ immediateCall: true }, Trigger.Save);
    return {
      success: true,
      id: createdPasskeyId,
    };
  } catch (error) {
    sendExceptionLog({
      error,
    });
    return { success: false };
  }
}