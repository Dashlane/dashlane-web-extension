export enum PlanType {
  FREE = "free",
  BUSINESS = "business",
  TEAM = "team",
}
export enum ChangePlanState {
  FORM = "form",
  SUCCESS = "success",
}
export interface OrderSummaryDataOutput {
  seatPrice: number;
  totalSeats: number;
  addedSeats: number;
  removedSeats: number;
  currentSeats: number;
  currentActiveSeats: number;
  upgradedSeatsPrice: number;
  addedSeatsPrice: number;
  subtotal: number;
  proratedDiscount: number | undefined;
  tax: number | undefined;
  pretaxTotal: number | undefined;
  promoPrice: number | undefined;
  total: number | undefined;
  renewalPrice: number;
  renewalDate: Date;
}
