import { GetInvoiceListResult } from "@dashlane/communication";
import { CoreServices } from "Services";
import { isApiError } from "Libs/DashlaneApi";
import { listInvoices } from "Libs/DashlaneApi/services/payments/list-invoices";
import { receivedInvoiceList } from "Session/Store/payments/actions";
export async function fetchInvoiceList(
  services: CoreServices
): Promise<GetInvoiceListResult> {
  const { storeService } = services;
  const login = storeService.getUserLogin();
  if (!storeService.isAuthenticated()) {
    return { success: false };
  }
  try {
    const response = await listInvoices(storeService, login);
    if (isApiError(response)) {
      return { success: false };
    }
    storeService.dispatch(receivedInvoiceList(response.invoices));
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
