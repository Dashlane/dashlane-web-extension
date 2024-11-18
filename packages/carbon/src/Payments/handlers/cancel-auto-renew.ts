import { CancelAutoRenewResult } from "@dashlane/communication";
import { CoreServices } from "Services";
import { sendExceptionLog } from "Logs/Exception";
export async function cancelAutoRenew(
  services: CoreServices
): Promise<CancelAutoRenewResult> {
  const { sessionService, storeService } = services;
  if (!storeService.isAuthenticated()) {
    return { success: false };
  }
  try {
    await sessionService.getInstance().payment.cancelPremiumSubscription();
    return { success: true };
  } catch (error) {
    const code = `[SessionController] - cancelPremiumSubscription: ${error}`;
    const augmentedError = new Error(code);
    sendExceptionLog({ error: augmentedError });
    return {
      success: false,
      error: { code },
    };
  }
}
