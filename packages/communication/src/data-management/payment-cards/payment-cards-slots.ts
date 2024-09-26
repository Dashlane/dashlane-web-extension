import { slot } from "ts-event-bus";
import { ListResults, liveSlot } from "../../CarbonApi";
import {
  AddPaymentCardRequest,
  DeletePaymentCardRequest,
  DeletePaymentCardResult,
  PaymentCardDataQuery,
  PaymentCardDetailView,
  PaymentCardItemView,
  PaymentCardSaveResult,
  UpdatePaymentCardRequest,
} from "./types";
export const paymentCardQueriesSlots = {
  getPaymentCard: slot<string, PaymentCardDetailView | undefined>(),
  getPaymentCards: slot<
    PaymentCardDataQuery,
    ListResults<PaymentCardItemView>
  >(),
};
export const paymentCardLiveQueriesSlots = {
  livePaymentCard: liveSlot<PaymentCardDetailView | undefined>(),
  livePaymentCards: liveSlot<ListResults<PaymentCardItemView>>(),
};
export const paymentCardCommandsSlots = {
  addPaymentCard: slot<AddPaymentCardRequest, PaymentCardSaveResult>(),
  updatePaymentCard: slot<UpdatePaymentCardRequest, PaymentCardSaveResult>(),
  deletePaymentCard: slot<DeletePaymentCardRequest, DeletePaymentCardResult>(),
};
