import { fromUnixTime } from "date-fns";
import {
  Invoice,
  InvoiceDataQuery,
  ListResults,
  Match,
} from "@dashlane/communication";
import { getQuerySelector } from "DataManagement/query-selector";
import { match } from "DataManagement/Search/match";
import { stringProp } from "DataManagement/Search/utils";
import { getInvoiceMappers } from "Payments/mappers";
import { State } from "Store";
export const allInvoicesSelector = (state: State): Invoice[] => {
  return state.userSession.paymentsState.invoicesList;
};
export const allInvoicesLengthSelector = (state: State): number => {
  return state.userSession.paymentsState.invoicesList.length;
};
export const invoiceListYearsSelector = (state: State): string[] => {
  const invoicesList = state.userSession.paymentsState.invoicesList;
  if (invoicesList.length) {
    const yearsOfInvoices = invoicesList.map((invoice) =>
      fromUnixTime(invoice.startDate).getFullYear().toString()
    );
    return [...new Set(yearsOfInvoices)];
  }
  return [];
};
export const invoiceMappersSelector = (_state: State) => getInvoiceMappers();
interface FilterableInvoice {
  startDate: string;
  amountPaid: string;
  planName?: string;
  invoiceId?: string;
  startYear?: string;
}
export const searchGetters: ((invoice: Invoice) => string)[] = [
  stringProp<FilterableInvoice>("amountPaid"),
  stringProp<FilterableInvoice>("planName"),
  stringProp<FilterableInvoice>("startDate"),
  stringProp<FilterableInvoice>("invoiceId"),
  stringProp<FilterableInvoice>("startYear"),
];
type InvoiceMatch = Match<Invoice>;
const invoiceMatch: InvoiceMatch = match(searchGetters);
const invoiceMatchSelector = () => invoiceMatch;
const querySelector = getQuerySelector(
  allInvoicesSelector,
  invoiceMatchSelector,
  invoiceMappersSelector
);
export const viewedQueriedInvoicesSelector = (
  state: State,
  query: InvoiceDataQuery
): ListResults<Invoice> => {
  const queryResults = querySelector(state, query);
  return queryResults;
};
