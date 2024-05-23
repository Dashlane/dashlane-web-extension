import React from 'react';
import { ItemType } from '@dashlane/hermes';
import { Email, VaultItemType } from '@dashlane/vault-contracts';
import { logSelectPersonalInfo } from 'libs/logs/events/vault/select-item';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { PersonalInfoSearchItem } from 'webapp/sidemenu/search/items';
import PersonalInfoIcon, { IconSize, IconType, } from 'webapp/personal-info-icon';
import { useItemSearchData } from 'webapp/sidemenu/search/results/use-item-search-data';
import SearchEventLogger from '../../search-event-logger';
import { SearchResultsSection } from './search-results-section';
const I18N_KEYS = {
    EMAILS_HEADER: 'webapp_sidemenu_search_results_heading_emails',
};
export interface EmailProps {
    query: string;
}
export const Emails = ({ query }: EmailProps) => {
    const { routes } = useRouterGlobalSettingsContext();
    const { loadMore, result } = useItemSearchData<Email>(query, VaultItemType.Email);
    if (!result?.matchCount) {
        return null;
    }
    const { items, matchCount } = result;
    SearchEventLogger.updateSearchSubTypes('emails', matchCount);
    return (<SearchResultsSection i18nKey={I18N_KEYS.EMAILS_HEADER} loadMore={loadMore} matchCount={matchCount} loadedCount={items.length}>
      {items.map((email, index) => (<PersonalInfoSearchItem icon={<PersonalInfoIcon iconType={email.type === 'PRO' ? IconType.emailPro : IconType.email} iconSize={IconSize.smallIcon}/>} key={email.id} text={email.emailAddress} title={email.itemName} detailRoute={routes.userPersonalInfoEmail(email.id)} onSelectPersonalInfo={() => {
                SearchEventLogger.logSearchEvent();
                logSelectPersonalInfo(email.id, ItemType.Email, index + 1, matchCount);
            }}/>))}
    </SearchResultsSection>);
};
