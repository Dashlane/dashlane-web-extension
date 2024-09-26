import { DataQuery, Mappers } from "../data-management";
import { Invoice } from "../OpenSession";
export interface CancelAutoRenewFailure {
  success: false;
  error?: {
    code: string;
  };
}
export interface CancelAutoRenewSuccess {
  success: true;
}
export type CancelAutoRenewResult =
  | CancelAutoRenewFailure
  | CancelAutoRenewSuccess;
export type DownloadCustomerInvoiceRequest = {
  invoiceId: number;
  recipient?: string;
  company?: string;
  address?: string;
  vatNumber?: string;
  lang?: string;
};
export interface DownloadCustomerInvoiceFailure {
  success: false;
}
export interface DownloadCustomerInvoiceSuccess {
  success: true;
  data: string;
}
export type DownloadCustomerInvoiceResult =
  | DownloadCustomerInvoiceFailure
  | DownloadCustomerInvoiceSuccess;
export interface GetInvoiceListFailure {
  success: false;
  error?: {
    code: string;
  };
}
export interface GetInvoiceListSuccess {
  success: true;
}
export type GetInvoiceListRequest = {
  currentPlanFilter?: string;
  currentYearFilter?: string;
  sortDirection?: string;
  sortField?: InvoiceSortField;
};
export type GetInvoiceListResult =
  | GetInvoiceListFailure
  | GetInvoiceListSuccess;
export interface RequestRefundFailure {
  success: false;
  reason?: string;
}
export type RequestRefundRequest = {
  dryRun: boolean;
};
export interface RequestRefundSuccess {
  success: true;
}
export type RequestRefundResult = RequestRefundFailure | RequestRefundSuccess;
export enum OrderDir {
  ascending = "ascending",
  descending = "descending",
}
export type InvoiceFilterField = "planName" | "startYear";
export type InvoiceSortField = "amountPaid" | "invoiceId" | "startDate";
export type InvoicePlanName =
  | "ADVANCED"
  | "ESSENTIALS"
  | "FAMILY"
  | "PREMIUM"
  | "OTHER";
export type InvoiceDataQuery = DataQuery<InvoiceSortField, InvoiceFilterField>;
export type InvoiceMappers = Mappers<
  Invoice,
  InvoiceSortField,
  InvoiceFilterField
>;
