import { slot } from "ts-event-bus";
import { ListResults } from "../CarbonApi";
import { Invoice } from "../OpenSession";
import {
  CancelAutoRenewResult,
  DownloadCustomerInvoiceRequest,
  DownloadCustomerInvoiceResult,
  GetInvoiceListResult,
  InvoiceDataQuery,
  RequestRefundRequest,
  RequestRefundResult,
} from "./types";
export const paymentsCommandsSlots = {
  cancelAutoRenew: slot<void, CancelAutoRenewResult>(),
  downloadCustomerInvoice: slot<
    DownloadCustomerInvoiceRequest,
    DownloadCustomerInvoiceResult
  >(),
  fetchInvoiceList: slot<void, GetInvoiceListResult>(),
  requestRefund: slot<RequestRefundRequest, RequestRefundResult>(),
};
export const paymentsQueriesSlots = {
  getInvoicesCount: slot<void, number>(),
  getInvoiceList: slot<InvoiceDataQuery, ListResults<Invoice>>(),
  getInvoiceListYears: slot<void, string[]>(),
};
