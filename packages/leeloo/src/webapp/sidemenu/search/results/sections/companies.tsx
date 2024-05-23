import React from 'react';
import { ItemType } from '@dashlane/hermes';
import { Company, VaultItemType } from '@dashlane/vault-contracts';
import { logSelectPersonalInfo } from 'libs/logs/events/vault/select-item';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import PersonalInfoIcon, { IconSize, IconType, } from 'webapp/personal-info-icon';
import { PersonalInfoSearchItem } from 'webapp/sidemenu/search/items';
import { useItemSearchData } from 'webapp/sidemenu/search/results/use-item-search-data';
import SearchEventLogger from '../../search-event-logger';
import { SearchResultsSection } from './search-results-section';
const I18N_KEYS = {
    COMPANIES_HEADER: 'webapp_sidemenu_search_results_heading_companies',
};
export interface CompaniesProps {
    query: string;
}
export const Companies = ({ query }: CompaniesProps) => {
    const { routes } = useRouterGlobalSettingsContext();
    const { loadMore, result } = useItemSearchData<Company>(query, VaultItemType.Company);
    if (!result?.matchCount) {
        return null;
    }
    const { items, matchCount } = result;
    SearchEventLogger.updateSearchSubTypes('companies', matchCount);
    return (<SearchResultsSection i18nKey={I18N_KEYS.COMPANIES_HEADER} loadMore={loadMore} matchCount={matchCount} loadedCount={items.length}>
      {items.map((company, index) => (<PersonalInfoSearchItem icon={<PersonalInfoIcon iconType={IconType.company} iconSize={IconSize.smallIcon}/>} key={company.id} text={company.jobTitle} title={company.companyName} detailRoute={routes.userPersonalInfoCompany(company.id)} onSelectPersonalInfo={() => {
                SearchEventLogger.logSearchEvent();
                logSelectPersonalInfo(company.id, ItemType.Company, index + 1, matchCount);
            }}/>))}
    </SearchResultsSection>);
};
