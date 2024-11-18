import { Invoice, UpdatePaymentCardTokenResult } from "@dashlane/communication";
import { StoreService } from "Store/index";
import { WSService } from "Libs/WS/index";
import { ukiSelector } from "Authentication";
import { listInvoices } from "Libs/DashlaneApi/services/payments/list-invoices";
import { isApiError } from "Libs/DashlaneApi";
export interface UserPaymentService {
  cancelPremiumSubscription: () => Promise<void>;
  fetchInvoices: () => Promise<Invoice[]>;
  updatePaymentCard: (
    tokenId: string,
    stripeAccount: string
  ) => Promise<UpdatePaymentCardTokenResult>;
}
export const makeUserPaymentService = (
  storeService: StoreService,
  wsService: WSService
): UserPaymentService => {
  return {
    fetchInvoices: () => fetchInvoices(storeService),
    updatePaymentCard: (tokenId: string, stripeAccount: string) =>
      updatePaymentCard(storeService, wsService, tokenId, stripeAccount),
    cancelPremiumSubscription: () =>
      cancelPremiumSubscription(storeService, wsService),
  };
};
const fetchInvoices = async (
  storeService: StoreService
): Promise<Invoice[]> => {
  const login = storeService.getAccountInfo().login;
  const result = await listInvoices(storeService, login);
  if (isApiError(result)) {
    return [];
  }
  return result.invoices;
};
const updatePaymentCard = (
  storeService: StoreService,
  wsService: WSService,
  tokenId: string,
  stripeAccount: string
): Promise<UpdatePaymentCardTokenResult> => {
  const login = storeService.getAccountInfo().login;
  const uki = ukiSelector(storeService.getState());
  return wsService.premium
    .updateCardToken({ login, uki, tokenId, stripeAccount })
    .then((response) => {
      return {
        success: response.success && !response.error,
        reason: response.error ? response.error.message : null,
      };
    });
};
const cancelPremiumSubscription = (
  storeService: StoreService,
  wsService: WSService
): Promise<void> => {
  const login = storeService.getAccountInfo().login;
  const uki = ukiSelector(storeService.getState());
  return wsService.premium
    .setAutoRenewal({ login, uki, enabled: false })
    .then(() => {});
};
