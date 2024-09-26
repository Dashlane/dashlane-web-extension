import { stringProp } from "DataManagement/Search/utils";
import { PaymentCard } from "@dashlane/communication";
import { match } from "DataManagement/Search/match";
export const searchGetters: ((p: PaymentCard) => string)[] = [
  stringProp<PaymentCard>("Name"),
  stringProp<PaymentCard>("OwnerName"),
];
export const paymentCardMatch = match(searchGetters);
