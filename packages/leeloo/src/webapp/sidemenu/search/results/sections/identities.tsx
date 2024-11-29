import { ItemType } from "@dashlane/hermes";
import { Identity, VaultItemType } from "@dashlane/vault-contracts";
import { logSelectPersonalInfo } from "../../../../../libs/logs/events/vault/select-item";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { useRouterGlobalSettingsContext } from "../../../../../libs/router/RouterGlobalSettingsProvider";
import PersonalInfoIcon, {
  IconSize,
  IconType,
} from "../../../../personal-info-icon";
import {
  getIdentityItemFullName,
  getViewedIdentitySecondLine,
} from "../../../../personal-info/services";
import { PersonalInfoSearchItem } from "../../items";
import { useItemSearchData } from "../use-item-search-data";
import { SearchResultsSection } from "./search-results-section";
import SearchEventLogger from "../../search-event-logger";
const I18N_KEYS = {
  IDENTITIES_HEADER: "webapp_sidemenu_search_results_heading_identities",
};
export interface IdentitiesProps {
  query: string;
}
export const Identities = ({ query }: IdentitiesProps) => {
  const { routes } = useRouterGlobalSettingsContext();
  const { translate } = useTranslate();
  const { loadMore, result } = useItemSearchData<Identity>(
    query,
    VaultItemType.Identity
  );
  if (!result?.matchCount) {
    return null;
  }
  const { items, matchCount } = result;
  SearchEventLogger.updateSearchSubTypes("identites", matchCount);
  return (
    <SearchResultsSection
      i18nKey={I18N_KEYS.IDENTITIES_HEADER}
      loadMore={loadMore}
      matchCount={matchCount}
      loadedCount={items.length}
    >
      {items.map((identity: Identity, index: number) => (
        <PersonalInfoSearchItem
          icon={
            <PersonalInfoIcon
              iconType={IconType.identity}
              iconSize={IconSize.smallIcon}
            />
          }
          key={identity.id}
          text={getViewedIdentitySecondLine(
            identity.birthDate,
            identity.birthPlace,
            translate
          )}
          title={getIdentityItemFullName(identity)}
          detailRoute={routes.userPersonalInfoIdentity(identity.id)}
          onSelectPersonalInfo={() => {
            SearchEventLogger.logSearchEvent();
            logSelectPersonalInfo(
              identity.id,
              ItemType.Identity,
              index + 1,
              matchCount
            );
          }}
        />
      ))}
    </SearchResultsSection>
  );
};
