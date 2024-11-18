import {
  DownloadCustomerInvoiceRequest,
  DownloadCustomerInvoiceResult,
} from "@dashlane/communication";
import { isApiError } from "Libs/DashlaneApi";
import { getCustomerInvoice } from "Libs/DashlaneApi/services/payments/get-customer-invoice";
import { CoreServices } from "Services";
export async function downloadCustomerInvoice(
  services: CoreServices,
  payload: DownloadCustomerInvoiceRequest
): Promise<DownloadCustomerInvoiceResult> {
  const { storeService } = services;
  const login = storeService.getUserLogin();
  const response = await getCustomerInvoice(storeService, login, payload);
  if (isApiError(response)) {
    return {
      success: false,
    };
  }
  const transportData = JSON.stringify({
    data: Array.apply(null, new Uint8Array(response.data)),
  });
  return {
    success: true,
    data: transportData,
  };
}
