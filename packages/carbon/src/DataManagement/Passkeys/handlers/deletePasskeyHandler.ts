import { Trigger } from "@dashlane/hermes";
import {
  DeletePasskeyErrorCode,
  DeletePasskeyRequest,
  DeletePasskeyResult,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { passkeySelector } from "DataManagement/Passkeys/selectors";
import { getDebounceSync } from "DataManagement/utils";
import { removePersonalItem } from "Session/Store/personalData/actions";
import { sendExceptionLog } from "Logs/Exception";
const deletePasskey = (
  { storeService }: CoreServices,
  passkeyId: string
): DeletePasskeyResult => {
  const state = storeService.getState();
  const context = `[Passkeys] - deletePasskey`;
  try {
    if (!storeService.isAuthenticated()) {
      return {
        success: false,
        error: {
          code: DeletePasskeyErrorCode.NOT_AUTHORIZED,
        },
      };
    }
    const existingPasskey = passkeySelector(state, passkeyId);
    if (!existingPasskey) {
      return {
        success: false,
        error: {
          code: DeletePasskeyErrorCode.NOT_FOUND,
        },
      };
    }
    const removePersonalItemAction = removePersonalItem(
      existingPasskey.kwType,
      existingPasskey.Id,
      null
    );
    storeService.dispatch(removePersonalItemAction);
    return { success: true };
  } catch (error) {
    const message = `${context}: ${error}`;
    const augmentedError = new Error(message);
    sendExceptionLog({ error: augmentedError });
    return {
      success: false,
      error: {
        code: DeletePasskeyErrorCode.INTERNAL_ERROR,
      },
    };
  }
};
export function deletePasskeyHandler(
  services: CoreServices,
  { id }: DeletePasskeyRequest
): Promise<DeletePasskeyResult> {
  const result = deletePasskey(services, id);
  if (result.success) {
    const debounceSync = getDebounceSync(
      services.storeService,
      services.sessionService
    );
    debounceSync({ immediateCall: true }, Trigger.Save);
  }
  return Promise.resolve(result);
}
