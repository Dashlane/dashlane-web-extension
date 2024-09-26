import type { GetCustomerInvoicePayload } from "@dashlane/server-sdk/v1";
import { StoreService } from "Store";
import { prepareApiEndpoint } from "Libs/DashlaneApi/endpoint";
import {
  ApiAuthType,
  ApiEndpointGroups,
  ApiRequestMethod,
  ApiResponse,
  ApiVersion,
} from "Libs/DashlaneApi/types";
export interface GetCustomerInvoiceSuccess {
  data: ArrayBuffer;
}
export type GetCustomerInvoiceResponse = ApiResponse<GetCustomerInvoiceSuccess>;
const endpointConfig = {
  group: ApiEndpointGroups.payments,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "GetCustomerInvoice",
  accept: "application/pdf",
  responseType: "arraybuffer" as const,
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function getCustomerInvoice(
  storeService: StoreService,
  login: string,
  payload: GetCustomerInvoicePayload
): Promise<GetCustomerInvoiceResponse> {
  return makeRequest<GetCustomerInvoicePayload, GetCustomerInvoiceSuccess>(
    storeService,
    { login, payload }
  );
}
