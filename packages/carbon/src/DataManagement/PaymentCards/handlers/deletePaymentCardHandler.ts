import { Trigger } from "@dashlane/hermes";
import {
  DeletePaymentCardErrorCode,
  DeletePaymentCardRequest,
  DeletePaymentCardResult,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { getDebounceSync } from "DataManagement/utils";
import { paymentCardSelector } from "DataManagement/PaymentCards/selectors";
import { sendExceptionLog } from "Logs/Exception";
import { removePersonalItem } from "Session/Store/personalData/actions";
import { logDeleteVaultItem } from "DataManagement/PersonalData/logs";
const deletePaymentCard = (
  { storeService, eventLoggerService }: CoreServices,
  paymentCardId: string
): DeletePaymentCardResult => {
  const state = storeService.getState();
  const context = `[PaymentCards] - deletePaymentCard`;
  try {
    if (!storeService.isAuthenticated()) {
      return {
        success: false,
        error: {
          code: DeletePaymentCardErrorCode.NOT_AUTHORIZED,
        },
      };
    }
    const existingPaymentCard = paymentCardSelector(state, paymentCardId);
    if (!existingPaymentCard) {
      return {
        success: false,
        error: {
          code: DeletePaymentCardErrorCode.NOT_FOUND,
        },
      };
    }
    const removePersonalItemAction = removePersonalItem(
      existingPaymentCard.kwType,
      existingPaymentCard.Id,
      null
    );
    storeService.dispatch(removePersonalItemAction);
    logDeleteVaultItem(storeService, eventLoggerService, existingPaymentCard);
    return { success: true };
  } catch (error) {
    const message = `${context}: ${error}`;
    const augmentedError = new Error(message);
    sendExceptionLog({ error: augmentedError });
    return {
      success: false,
      error: {
        code: DeletePaymentCardErrorCode.INTERNAL_ERROR,
      },
    };
  }
};
export function deletePaymentCardHandler(
  services: CoreServices,
  { id }: DeletePaymentCardRequest
): Promise<DeletePaymentCardResult> {
  const result = deletePaymentCard(services, id);
  if (result.success) {
    const debounceSync = getDebounceSync(
      services.storeService,
      services.sessionService
    );
    debounceSync({ immediateCall: true }, Trigger.Save);
  }
  return Promise.resolve(result);
}
