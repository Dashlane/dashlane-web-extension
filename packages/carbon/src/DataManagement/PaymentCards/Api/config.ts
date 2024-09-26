import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { PaymentCardCommands } from "DataManagement/PaymentCards/Api/commands";
import { PaymentCardQueries } from "DataManagement/PaymentCards/Api/queries";
import { PaymentCardLiveQueries } from "DataManagement/PaymentCards/Api/live-queries";
import {
  viewedPaymentCardSelector,
  viewedQueriedPaymentCardsSelector,
} from "DataManagement/PaymentCards/selectors";
import {
  getPaymentCard$,
  paymentCards$,
} from "DataManagement/PaymentCards/live";
import {
  addPaymentCardHandler,
  deletePaymentCardHandler,
  updatePaymentCardHandler,
} from "DataManagement/PaymentCards/handlers";
export const config: CommandQueryBusConfig<
  PaymentCardCommands,
  PaymentCardQueries,
  PaymentCardLiveQueries
> = {
  commands: {
    addPaymentCard: { handler: addPaymentCardHandler },
    deletePaymentCard: { handler: deletePaymentCardHandler },
    updatePaymentCard: { handler: updatePaymentCardHandler },
  },
  queries: {
    getPaymentCard: { selector: viewedPaymentCardSelector },
    getPaymentCards: { selector: viewedQueriedPaymentCardsSelector },
  },
  liveQueries: {
    livePaymentCard: { operator: getPaymentCard$ },
    livePaymentCards: { operator: paymentCards$ },
  },
};
