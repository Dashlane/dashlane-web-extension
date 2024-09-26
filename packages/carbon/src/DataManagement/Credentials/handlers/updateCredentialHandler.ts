import {
  UpdateCredentialRequest,
  UpdateCredentialResult,
} from "@dashlane/communication";
import { logError } from "Logs/Debugger";
import { sendExceptionLog } from "Logs/Exception";
import { CoreServices } from "Services";
import { updateCredential } from "../services/updateCredential";
export async function updateCredentialHandler(
  coreServices: CoreServices,
  request: UpdateCredentialRequest
): Promise<UpdateCredentialResult> {
  const {
    storeService,
    sessionService,
    eventLoggerService,
    applicationModulesAccess,
  } = coreServices;
  try {
    await updateCredential(
      {
        storeService,
        sessionService,
        eventLoggerService,
        applicationModulesAccess,
      },
      request
    );
    return {
      success: true,
    };
  } catch (error) {
    logError(error);
    sendExceptionLog({
      error,
    });
    return { success: false };
  }
}
