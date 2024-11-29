import { VaultItemThumbnail } from "@dashlane/design-system";
import { ItemType } from "@dashlane/hermes";
import { Address as Item } from "@dashlane/vault-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { logSelectPersonalInfo } from "../../../../libs/logs/events/vault/select-item";
import {
  redirect,
  useRouterGlobalSettingsContext,
} from "../../../../libs/router";
import { getViewedAddressSecondLine } from "../../../personal-info/services";
import SearchEventLogger from "../../../sidemenu/search/search-event-logger";
import { useSearchContext } from "../../search-context";
import { BaseResultItem } from "../shared/base-result-item";
import { SearchResultVaultItemProps } from "../shared/types";
export const AddressItem = ({
  item,
  index,
  matchCount,
}: SearchResultVaultItemProps) => {
  const address = item as Item;
  const { routes } = useRouterGlobalSettingsContext();
  const { translate } = useTranslate();
  const { closeSearch } = useSearchContext();
  const description = getViewedAddressSecondLine(
    address.city,
    address.country,
    address.streetName,
    address.zipCode,
    translate
  );
  const onClick = () => {
    SearchEventLogger.logSearchEvent();
    logSelectPersonalInfo(address.id, ItemType.Address, index + 1, matchCount);
    closeSearch();
    redirect(routes.userPersonalInfoAddress(address.id));
  };
  return (
    <BaseResultItem
      id={address.id}
      title={address.itemName}
      onClick={onClick}
      description={description}
      thumbnail={<VaultItemThumbnail type="address" />}
    />
  );
};
