import { fromUnixTime } from "date-fns";
import {
  Invoice,
  InvoiceMappers,
  InvoicePlanName,
} from "@dashlane/communication";
const convertPlanName = (invoice: Invoice): InvoicePlanName => {
  if (invoice.planFeature === "advanced") {
    return "ADVANCED";
  }
  if (invoice.planFeature === "essentials") {
    return "ESSENTIALS";
  }
  if (["family_created", "family_renewed"].includes(invoice.eventType)) {
    return "FAMILY";
  }
  if (invoice.planFeature === "sync") {
    return "PREMIUM";
  }
  return "OTHER";
};
const convertStartDateToYear = (invoice: Invoice) =>
  fromUnixTime(invoice.startDate).getFullYear().toString();
export const getInvoiceMappers = (): InvoiceMappers => ({
  amountPaid: (invoice: Invoice) => invoice.amountPaid,
  invoiceId: (invoice: Invoice) => invoice.invoiceId,
  planName: (invoice: Invoice) => convertPlanName(invoice),
  startDate: (invoice: Invoice) => invoice.startDate,
  startYear: (invoice: Invoice) => convertStartDateToYear(invoice),
});
