import {
  Invoice,
  InvoiceDataQuery,
  ListResults,
} from "@dashlane/communication";
import { Query } from "Shared/Api";
export type PaymentsQueries = {
  getInvoicesCount: Query<void, number>;
  getInvoiceList: Query<InvoiceDataQuery, ListResults<Invoice>>;
  getInvoiceListYears: Query<void, string[]>;
};
