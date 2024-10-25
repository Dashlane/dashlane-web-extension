import { ShareItemRequest, ShareItemResult } from "@dashlane/communication";
import { CoreServices } from "Services";
import { sendExceptionLog } from "Logs/Exception";
import { handleShareItemRequest } from "../SharingController";
export enum ShareItemErrorCode {
  NOT_AUTHENTICATED = "NOT_AUTHENTICATED",
}
export async function shareItem(
  services: CoreServices,
  payload: ShareItemRequest
): Promise<ShareItemResult> {
  const { storeService } = services;
  if (!storeService.isAuthenticated()) {
    return {
      success: false,
      error: { code: ShareItemErrorCode.NOT_AUTHENTICATED },
    };
  }
  try {
    const { itemId, permission, recipients } = payload;
    const result = await handleShareItemRequest(
      services,
      itemId,
      permission,
      recipients
    );
    return result;
  } catch (error) {
    const code = `[SessionController] - shareItem: ${error}`;
    const augmentedError = new Error(code);
    sendExceptionLog({ error: augmentedError });
    return {
      success: false,
      error: { code },
    };
  }
}
