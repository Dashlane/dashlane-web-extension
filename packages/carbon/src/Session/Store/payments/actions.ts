import { Invoice } from "@dashlane/communication";
import { Action } from "Store";
export const RECEIVED_INVOICE_LIST = "RECEIVED_USER_LIST";
type ActionType = typeof RECEIVED_INVOICE_LIST;
interface ReceivedInvoiceListAction extends Action {
  type: ActionType;
  invoicesList: Invoice[];
}
export const receivedInvoiceList = (
  invoicesList: Invoice[]
): ReceivedInvoiceListAction => {
  return {
    type: RECEIVED_INVOICE_LIST,
    invoicesList: invoicesList,
  };
};
export type SessionPaymentsAction = ReceivedInvoiceListAction | Action;
