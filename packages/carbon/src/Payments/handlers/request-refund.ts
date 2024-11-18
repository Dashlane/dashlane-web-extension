import {
  RequestRefundRequest,
  RequestRefundResult,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { isApiError } from "Libs/DashlaneApi";
import { grantFullRefundAndCancelSubscription } from "Libs/DashlaneApi/services/payments/request-refund";
import { refeshAccountInfo } from "Session/SessionController";
export async function requestRefund(
  services: CoreServices,
  payload: RequestRefundRequest
): Promise<RequestRefundResult> {
  const { sessionService, storeService, wsService } = services;
  const login = storeService.getUserLogin();
  if (!storeService.isAuthenticated()) {
    return { success: false };
  }
  try {
    const response = await grantFullRefundAndCancelSubscription(
      storeService,
      login,
      payload
    );
    if (isApiError(response)) {
      return {
        success: false,
      };
    }
    if (payload && !payload.dryRun) {
      refeshAccountInfo(storeService, sessionService, wsService);
    }
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
