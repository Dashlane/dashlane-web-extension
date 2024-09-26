import { PaymentCardColor, PaymentCardType } from "../../DataModel";
import { DataModelDetailView, DataModelItemView, DataQuery } from "../types";
export type PaymentCardFilterField = "spaceId";
export type PaymentCardSortField = "lastUse" | "id" | "name";
export type PaymentCardDataQuery = DataQuery<
  PaymentCardSortField,
  PaymentCardFilterField
>;
export interface PaymentCardBaseModel {
  name: string;
  cardNumber: string;
  cardNumberLastDigits: string;
  ownerName: string;
  expireMonth: string;
  expireYear: string;
  color: PaymentCardColor;
  personalNote: string;
  type: PaymentCardType;
}
export interface PaymentCardDetailModel extends PaymentCardBaseModel {
  securityCode: string;
  startMonth: string;
  startYear: string;
  issueNumber: string;
  bank: string;
  personalNote: string;
}
export interface PaymentCardItemView
  extends DataModelItemView,
    PaymentCardBaseModel {}
export interface PaymentCardDetailView
  extends DataModelDetailView,
    PaymentCardDetailModel {}
export type PaymentCardSaveRequest = Omit<
  PaymentCardDetailModel,
  | "cardNumberLastDigits"
  | "type"
  | "bank"
  | "issueNumber"
  | "startYear"
  | "startMonth"
> & {
  spaceId: string;
};
export type AddPaymentCardRequest = PaymentCardSaveRequest;
export type UpdatePaymentCardRequest = {
  id: string;
} & Partial<PaymentCardSaveRequest>;
export enum PaymentCardSaveResultErrorCode {
  EMPTY_CARD_NUMBER_AND_SECURITY_CODE = "EMPTY_CARD_NUMBER_AND_SECURITY_CODE",
  NOT_FOUND = "NOT_FOUND",
}
export interface PaymentCardSaveResultSuccess {
  success: true;
}
export interface PaymentCardSaveResultError {
  success: false;
  error?: {
    code: PaymentCardSaveResultErrorCode;
  };
}
export type PaymentCardSaveResult =
  | PaymentCardSaveResultSuccess
  | PaymentCardSaveResultError;
export enum DeletePaymentCardErrorCode {
  NOT_AUTHORIZED = "NOT_AUTHORIZED",
  NOT_FOUND = "NOT_FOUND",
  INTERNAL_ERROR = "INTERNAL_ERROR",
}
export type DeletePaymentCardRequest = {
  id: string;
};
export type DeletePaymentCardResultSuccess = {
  success: true;
};
export type DeletePaymentCardResultError = {
  success: false;
  error: {
    code: DeletePaymentCardErrorCode;
  };
};
export type DeletePaymentCardResult =
  | DeletePaymentCardResultSuccess
  | DeletePaymentCardResultError;
