import { slot } from "ts-event-bus";
import { ListResults } from "../CarbonApi";
import { Invoice } from "../OpenSession";
import {
  CancelAutoRenewResult,
  DownloadCustomerInvoiceRequest,
  DownloadCustomerInvoiceResult,
  GetInvoiceListResult,
  InvoiceDataQuery,
} from "./types";
export const paymentsCommandsSlots = {
  cancelAutoRenew: slot<void, CancelAutoRenewResult>(),
  downloadCustomerInvoice: slot<
    DownloadCustomerInvoiceRequest,
    DownloadCustomerInvoiceResult
  >(),
  fetchInvoiceList: slot<void, GetInvoiceListResult>(),
};
export const paymentsQueriesSlots = {
  getInvoicesCount: slot<void, number>(),
  getInvoiceList: slot<InvoiceDataQuery, ListResults<Invoice>>(),
  getInvoiceListYears: slot<void, string[]>(),
};
