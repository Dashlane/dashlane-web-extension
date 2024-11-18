import {
  Passkey,
  UpdatePasskeyRequest,
  UpdatePasskeyResult,
} from "@dashlane/communication";
import { Trigger } from "@dashlane/hermes";
import { passkeySelector } from "DataManagement/Passkeys/selectors";
import { getDebounceSync } from "DataManagement/utils";
import { CoreServices } from "Services";
import { State } from "Store";
import { savePersonalDataItem } from "Session/Store/actions";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
import { sendExceptionLog } from "Logs/Exception";
import { sanitizeInputPersonalData } from "DataManagement/PersonalData/sanitize";
export const getPasskeyModifiedProperties = (
  newPasskeyData: UpdatePasskeyRequest,
  existingPasskeyData: Partial<Passkey>
): Pick<Passkey, "Counter" | "Note" | "SpaceId" | "ItemName" | "LastUse"> => {
  const passkeyModificationDate = getUnixTimestamp();
  return {
    Counter: newPasskeyData.counter ?? existingPasskeyData.Counter,
    Note: newPasskeyData.note ?? existingPasskeyData.Note,
    SpaceId: newPasskeyData.spaceId ?? existingPasskeyData.SpaceId,
    ItemName: newPasskeyData.itemName ?? existingPasskeyData.ItemName,
    LastUse: passkeyModificationDate,
  };
};
export function getUpdatedPasskey(
  state: State,
  newPasskeyData: UpdatePasskeyRequest
): Passkey {
  const existingPasskey = passkeySelector(state, newPasskeyData.id);
  if (!existingPasskey) {
    throw new Error("[updatePasskey]: unable to find passkey to update.");
  }
  return {
    ...existingPasskey,
    ...getPasskeyModifiedProperties(newPasskeyData, existingPasskey),
  };
}
function updatePasskey(
  { storeService, sessionService }: CoreServices,
  newPasskeyData: UpdatePasskeyRequest
): UpdatePasskeyResult {
  if (!storeService.isAuthenticated()) {
    throw new Error("No session available to updatePasskey");
  }
  const state = storeService.getState();
  const sanitizedNewPasskeyData = sanitizeInputPersonalData(newPasskeyData);
  const passkeyToSave = getUpdatedPasskey(state, sanitizedNewPasskeyData);
  storeService.dispatch(
    savePersonalDataItem(passkeyToSave, passkeyToSave.kwType)
  );
  sessionService.getInstance().user.persistPersonalData();
  return { success: true };
}
export function updatePasskeyHandler(
  services: CoreServices,
  passkeyData: UpdatePasskeyRequest
): Promise<UpdatePasskeyResult> {
  try {
    const result = updatePasskey(services, passkeyData);
    if (!result.success) {
      return Promise.resolve(result);
    }
    const debounceSync = getDebounceSync(
      services.storeService,
      services.sessionService
    );
    debounceSync({ immediateCall: true }, Trigger.Save);
    return Promise.resolve({
      success: true,
    });
  } catch (error) {
    sendExceptionLog({
      error,
    });
    return Promise.resolve({ success: false });
  }
}
