import { compose } from "ramda";
import { PaymentCard, PaymentCardDetailView } from "@dashlane/communication";
import { State } from "Store";
import { paymentCardMatch } from "DataManagement/PaymentCards/search";
import { listView, maybeDetailView } from "DataManagement/PaymentCards/views";
import { getQuerySelector } from "DataManagement/query-selector";
import { viewListResults } from "DataManagement/Search/views";
import { makeLiveSelectorGetter } from "DataManagement/live-selector-getter";
import { findDataModelObject } from "DataManagement/PersonalData/utils";
import { createSelector } from "reselect";
import { getPaymentCardMappers } from "DataManagement/PaymentCards/mappers";
import { filterOutQuarantinedItems } from "DataManagement/quarantined-filter";
import { quarantinedSpacesSelector } from "DataManagement/SmartTeamSpaces/forced-categorization.selectors";
const allUnsafePaymentCardsSelector = (state: State): PaymentCard[] =>
  state.userSession.personalData.paymentCards;
export const paymentCardsSelector = createSelector(
  allUnsafePaymentCardsSelector,
  quarantinedSpacesSelector,
  filterOutQuarantinedItems
);
export const paymentCardSelector = (
  state: State,
  paymentCardId: string
): PaymentCard | undefined => {
  const paymentCards = paymentCardsSelector(state);
  return findDataModelObject(paymentCardId, paymentCards);
};
export const paymentCardMappersSelector = (_state: State) =>
  getPaymentCardMappers();
const paymentCardMatchSelector = () => paymentCardMatch;
export const queryPaymentCardsSelector = getQuerySelector(
  paymentCardsSelector,
  paymentCardMatchSelector,
  paymentCardMappersSelector
);
export const viewedQueriedPaymentCardsSelector = compose(
  viewListResults(listView),
  queryPaymentCardsSelector
);
export const getLivePaymentCardsSelector = makeLiveSelectorGetter(
  paymentCardsSelector,
  () => listView,
  paymentCardMatchSelector,
  paymentCardMappersSelector
);
export const viewedPaymentCardSelector = (
  state: State,
  paymentCardId: string
): PaymentCardDetailView | undefined => {
  const paymentCard = paymentCardSelector(state, paymentCardId);
  return maybeDetailView(paymentCard);
};
export const getViewedPaymentCardSelector = (paymentCardId: string) => {
  const paymentCardSelector = createSelector(
    paymentCardsSelector,
    (paymentCards) => findDataModelObject(paymentCardId, paymentCards)
  );
  return createSelector(paymentCardSelector, maybeDetailView);
};
