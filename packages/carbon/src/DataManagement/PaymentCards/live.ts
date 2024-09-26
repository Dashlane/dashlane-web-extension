import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { PaymentCardDetailView } from "@dashlane/communication";
import { StateOperator } from "Shared/Live";
import { getLivePersonalInfo } from "DataManagement/PersonalInfo/live";
import {
  getLivePaymentCardsSelector,
  getViewedPaymentCardSelector,
} from "DataManagement/PaymentCards/selectors";
export const paymentCards$ = getLivePersonalInfo(getLivePaymentCardsSelector);
export const getPaymentCard$ = (
  id: string
): StateOperator<PaymentCardDetailView | undefined> => {
  const selector = getViewedPaymentCardSelector(id);
  return pipe(map(selector), distinctUntilChanged());
};
