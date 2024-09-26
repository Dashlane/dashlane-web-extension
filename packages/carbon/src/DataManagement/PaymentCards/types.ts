import {
  Mappers,
  PaymentCard,
  PaymentCardFilterField,
  PaymentCardSortField,
} from "@dashlane/communication";
export type PaymentCardMappers = Mappers<
  PaymentCard,
  PaymentCardSortField,
  PaymentCardFilterField
>;
