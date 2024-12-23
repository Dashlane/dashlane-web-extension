import {
  CancelAutoRenewResult,
  DownloadCustomerInvoiceRequest,
  DownloadCustomerInvoiceResult,
  GetInvoiceListResult,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type PaymentsCommands = {
  cancelAutoRenew: Command<void, CancelAutoRenewResult>;
  downloadCustomerInvoice: Command<
    DownloadCustomerInvoiceRequest,
    DownloadCustomerInvoiceResult
  >;
  fetchInvoiceList: Command<void, GetInvoiceListResult>;
};
