import {
  ListResults,
  PaymentCardDetailView,
  PaymentCardItemView,
} from "@dashlane/communication";
import { LiveQuery } from "Shared/Api";
export type PaymentCardLiveQueries = {
  livePaymentCard: LiveQuery<string, PaymentCardDetailView | undefined>;
  livePaymentCards: LiveQuery<string, ListResults<PaymentCardItemView>>;
};
