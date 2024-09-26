import { defaultTo } from "ramda";
import {
  PaymentCard,
  PaymentCardDetailView,
  PaymentCardItemView,
} from "@dashlane/communication";
import {
  dataModelDetailView,
  dataModelItemView,
  maybeDataModelDetailView,
} from "DataManagement/views";
import {
  defaultColor,
  getLastDigitsFromCardNumber,
} from "DataManagement/PaymentCards/helpers";
const defaultToEmptyString = defaultTo("");
export const detailView = (paymentCard: PaymentCard): PaymentCardDetailView => {
  return {
    ...dataModelDetailView(paymentCard),
    bank: defaultToEmptyString(paymentCard.Bank),
    cardNumber: defaultToEmptyString(paymentCard.CardNumber),
    cardNumberLastDigits: getLastDigitsFromCardNumber(paymentCard.CardNumber),
    color: paymentCard.Color || defaultColor,
    expireMonth: defaultToEmptyString(paymentCard.ExpireMonth),
    expireYear: defaultToEmptyString(paymentCard.ExpireYear),
    issueNumber: defaultToEmptyString(paymentCard.IssueNumber),
    name: defaultToEmptyString(paymentCard.Name),
    ownerName: defaultToEmptyString(paymentCard.OwnerName),
    personalNote: defaultToEmptyString(paymentCard.CCNote),
    securityCode: defaultToEmptyString(paymentCard.SecurityCode),
    startMonth: defaultToEmptyString(paymentCard.StartMonth),
    startYear: defaultToEmptyString(paymentCard.StartYear),
    type: paymentCard.Type,
  };
};
export const maybeDetailView = maybeDataModelDetailView(detailView);
export const itemView = (paymentCard: PaymentCard): PaymentCardItemView => {
  return {
    ...dataModelItemView(paymentCard),
    cardNumber: defaultToEmptyString(paymentCard.CardNumber),
    cardNumberLastDigits: getLastDigitsFromCardNumber(paymentCard.CardNumber),
    color: paymentCard.Color || defaultColor,
    expireMonth: defaultToEmptyString(paymentCard.ExpireMonth),
    expireYear: defaultToEmptyString(paymentCard.ExpireYear),
    name: defaultToEmptyString(paymentCard.Name),
    ownerName: defaultToEmptyString(paymentCard.OwnerName),
    personalNote: defaultToEmptyString(paymentCard.CCNote),
    type: paymentCard.Type,
  };
};
export const listView = (paymentCards: PaymentCard[]): PaymentCardItemView[] =>
  paymentCards.map(itemView);
