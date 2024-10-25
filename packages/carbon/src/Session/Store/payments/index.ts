import {
  RECEIVED_INVOICE_LIST,
  SessionPaymentsAction,
} from "Session/Store/payments/actions";
import { PaymentsState } from "Session/Store/payments/types";
export function getEmptyPaymentsState(): PaymentsState {
  return { invoicesList: [] };
}
export default (
  state = getEmptyPaymentsState(),
  action: SessionPaymentsAction
) => {
  switch (action.type) {
    case RECEIVED_INVOICE_LIST:
      return {
        ...state,
        invoicesList: action.invoicesList,
      };
    default:
      return state;
  }
};
