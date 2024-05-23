import React from 'react';
import { ItemType } from '@dashlane/hermes';
import { VaultItemType, Website } from '@dashlane/vault-contracts';
import { logSelectPersonalInfo } from 'libs/logs/events/vault/select-item';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import PersonalInfoIcon, { IconSize, IconType, } from 'webapp/personal-info-icon';
import { PersonalInfoSearchItem } from 'webapp/sidemenu/search/items';
import { useItemSearchData } from 'webapp/sidemenu/search/results/use-item-search-data';
import SearchEventLogger from '../../search-event-logger';
import { SearchResultsSection } from './search-results-section';
const I18N_KEYS = {
    WEBSITES_HEADER: 'webapp_sidemenu_search_results_heading_websites',
};
export interface PersonalWebsitesProps {
    query: string;
}
export const PersonalWebsites = ({ query }: PersonalWebsitesProps) => {
    const { routes } = useRouterGlobalSettingsContext();
    const { loadMore, result } = useItemSearchData<Website>(query, VaultItemType.Website);
    if (!result?.matchCount) {
        return null;
    }
    const { items, matchCount } = result;
    SearchEventLogger.updateSearchSubTypes('personalWebsites', matchCount);
    return (<SearchResultsSection i18nKey={I18N_KEYS.WEBSITES_HEADER} loadMore={loadMore} matchCount={matchCount} loadedCount={items.length}>
      {items.map((website, index) => (<PersonalInfoSearchItem icon={<PersonalInfoIcon iconType={IconType.website} iconSize={IconSize.smallIcon}/>} key={website.id} text={website.URL} title={website.itemName} detailRoute={routes.userPersonalInfoWebsite(website.id)} onSelectPersonalInfo={() => {
                SearchEventLogger.logSearchEvent();
                logSelectPersonalInfo(website.id, ItemType.Website, index + 1, matchCount);
            }}/>))}
    </SearchResultsSection>);
};
