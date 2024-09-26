import { Trigger } from "@dashlane/hermes";
import {
  UpdateBreachStatusRequest,
  UpdateBreachStatusResult,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { StoreService } from "Store";
import { savePersonalDataItem } from "Session/Store/actions";
import { getDebounceSync } from "DataManagement/utils";
import { sendExceptionLog } from "Logs/Exception";
import { Breach } from "DataManagement/Breaches/types";
import { Debugger } from "Logs/Debugger";
import { breachSelector } from "DataManagement/Breaches/selectors";
export async function updateBreachStatusHandler(
  coreServices: CoreServices,
  request: UpdateBreachStatusRequest
): Promise<UpdateBreachStatusResult> {
  const { storeService, sessionService } = coreServices;
  try {
    updateBreachStatus(storeService, request);
    const debounceSync = getDebounceSync(storeService, sessionService);
    debounceSync({ immediateCall: true }, Trigger.Save);
    return {
      success: true,
    };
  } catch (error) {
    Debugger.error(error);
    sendExceptionLog({ error });
    return { success: false };
  }
}
export function updateBreachStatus(
  storeService: StoreService,
  request: UpdateBreachStatusRequest
): void {
  if (!storeService.isAuthenticated()) {
    throw new Error("No session available to update Breach");
  }
  const state = storeService.getState();
  const existingItem = breachSelector(state, request.id);
  if (!existingItem) {
    throw new Error("Breach does not exist, cant update");
  }
  const itemToSave: Breach = {
    ...existingItem,
    Status: request.status,
  };
  storeService.dispatch(savePersonalDataItem(itemToSave, itemToSave.kwType));
}
