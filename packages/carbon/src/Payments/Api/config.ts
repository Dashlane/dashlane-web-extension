import { CommandQueryBusConfig } from "Shared/Infrastructure";
import {
  allInvoicesLengthSelector,
  invoiceListYearsSelector,
  viewedQueriedInvoicesSelector,
} from "Session/Store/payments/selector";
import { downloadCustomerInvoice } from "Payments/handlers/download-customer-invoice";
import { cancelAutoRenew } from "Payments/handlers/cancel-auto-renew";
import { fetchInvoiceList } from "Payments/handlers/fetch-invoice-list";
import { PaymentsCommands } from "Payments/Api/commands";
import { PaymentsQueries } from "Payments/Api/queries";
import { requestRefund } from "Payments/handlers/request-refund";
export const config: CommandQueryBusConfig<PaymentsCommands, PaymentsQueries> =
  {
    commands: {
      cancelAutoRenew: {
        handler: cancelAutoRenew,
      },
      downloadCustomerInvoice: {
        handler: downloadCustomerInvoice,
      },
      fetchInvoiceList: {
        handler: fetchInvoiceList,
      },
      requestRefund: {
        handler: requestRefund,
      },
    },
    queries: {
      getInvoicesCount: { selector: allInvoicesLengthSelector },
      getInvoiceList: { selector: viewedQueriedInvoicesSelector },
      getInvoiceListYears: { selector: invoiceListYearsSelector },
    },
    liveQueries: {},
  };
