export enum PostTrialCheckoutState {
  FORM = "form",
  SUCCESS = "success",
}
export enum PaymentMethodTypeEnum {
  CREDIT_CARD = "credit-card",
  INVOICE = "invoice",
}
export type PaymentMethodType = PaymentMethodTypeEnum;
export interface CheckoutOrderSummaryOutput {
  numberOfSeats: number;
  planPrice: number;
  promoPrice: number | undefined;
  subtotal: number;
  tax: number;
  total: number | undefined;
}
