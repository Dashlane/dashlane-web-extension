import {
  ListResults,
  PaymentCardDataQuery,
  PaymentCardDetailView,
  PaymentCardItemView,
} from "@dashlane/communication";
import { Query } from "Shared/Api";
export type PaymentCardQueries = {
  getPaymentCard: Query<string, PaymentCardDetailView | undefined>;
  getPaymentCards: Query<
    PaymentCardDataQuery,
    ListResults<PaymentCardItemView>
  >;
};
