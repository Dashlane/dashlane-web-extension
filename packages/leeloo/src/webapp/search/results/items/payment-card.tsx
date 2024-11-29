import { VaultItemThumbnail } from "@dashlane/design-system";
import { PaymentCard as Item } from "@dashlane/vault-contracts";
import { logSelectCreditCard } from "../../../../libs/logs/events/vault/select-item";
import {
  redirect,
  useRouterGlobalSettingsContext,
} from "../../../../libs/router";
import { getDisplayedCardNumber } from "../../../payments/payment-cards/utils";
import SearchEventLogger from "../../../sidemenu/search/search-event-logger";
import { useSearchContext } from "../../search-context";
import { getPaymentCardMatchingColor } from "../helpers/get-payment-card-matching-color";
import { BaseResultItem } from "../shared/base-result-item";
import { SearchResultVaultItemProps } from "../shared/types";
export const PaymentCardItem = ({
  item,
  index,
  matchCount,
}: SearchResultVaultItemProps) => {
  const paymentCard = item as Item;
  const { routes } = useRouterGlobalSettingsContext();
  const { closeSearch } = useSearchContext();
  const description = getDisplayedCardNumber(paymentCard.cardNumber);
  const onClick = () => {
    SearchEventLogger.logSearchEvent();
    logSelectCreditCard(paymentCard.id, index + 1, matchCount);
    closeSearch();
    redirect(routes.userPaymentCard(paymentCard.id));
  };
  return (
    <BaseResultItem
      id={paymentCard.id}
      title={paymentCard.itemName}
      description={description}
      onClick={onClick}
      thumbnail={
        <VaultItemThumbnail
          type="payment-card"
          color={getPaymentCardMatchingColor(paymentCard.color)}
        />
      }
    />
  );
};
