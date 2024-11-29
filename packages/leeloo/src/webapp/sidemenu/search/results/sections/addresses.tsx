import { ItemType } from "@dashlane/hermes";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { Address, VaultItemType } from "@dashlane/vault-contracts";
import { logSelectPersonalInfo } from "../../../../../libs/logs/events/vault/select-item";
import { useRouterGlobalSettingsContext } from "../../../../../libs/router/RouterGlobalSettingsProvider";
import { getViewedAddressSecondLine } from "../../../../personal-info/services";
import PersonalInfoIcon, {
  IconSize,
  IconType,
} from "../../../../personal-info-icon";
import { PersonalInfoSearchItem } from "../../items";
import { useItemSearchData } from "../use-item-search-data";
import SearchEventLogger from "../../search-event-logger";
import { SearchResultsSection } from "./search-results-section";
const I18N_KEYS = {
  ADDRESSES_HEADER: "webapp_sidemenu_search_results_heading_addresses",
};
export interface AddressesProps {
  query: string;
}
export const Addresses = ({ query }: AddressesProps) => {
  const { routes } = useRouterGlobalSettingsContext();
  const { translate } = useTranslate();
  const { loadMore, result } = useItemSearchData<Address>(
    query,
    VaultItemType.Address
  );
  if (!result?.matchCount) {
    return null;
  }
  const { items, matchCount } = result;
  SearchEventLogger.updateSearchSubTypes("addresses", matchCount);
  return (
    <SearchResultsSection
      i18nKey={I18N_KEYS.ADDRESSES_HEADER}
      loadMore={loadMore}
      matchCount={matchCount}
      loadedCount={items.length}
    >
      {items.map((address: Address, index: number) => (
        <PersonalInfoSearchItem
          icon={
            <PersonalInfoIcon
              iconType={IconType.address}
              iconSize={IconSize.smallIcon}
            />
          }
          key={address.id}
          text={getViewedAddressSecondLine(
            address.city,
            address.country,
            address.streetName,
            address.zipCode,
            translate
          )}
          title={address.itemName}
          detailRoute={routes.userPersonalInfoAddress(address.id)}
          onSelectPersonalInfo={() => {
            SearchEventLogger.logSearchEvent();
            logSelectPersonalInfo(
              address.id,
              ItemType.Address,
              index + 1,
              matchCount
            );
          }}
        />
      ))}
    </SearchResultsSection>
  );
};
