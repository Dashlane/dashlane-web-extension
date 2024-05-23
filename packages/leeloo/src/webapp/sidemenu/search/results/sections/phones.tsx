import React from 'react';
import { ItemType } from '@dashlane/hermes';
import { Phone, VaultItemType } from '@dashlane/vault-contracts';
import { logSelectPersonalInfo } from 'libs/logs/events/vault/select-item';
import useTranslate from 'libs/i18n/useTranslate';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import PersonalInfoIcon, { IconSize, IconType, } from 'webapp/personal-info-icon';
import { getPhoneItemName } from 'webapp/personal-info/services';
import { PersonalInfoSearchItem } from 'webapp/sidemenu/search/items';
import { useItemSearchData } from 'webapp/sidemenu/search/results/use-item-search-data';
import SearchEventLogger from '../../search-event-logger';
import { SearchResultsSection } from './search-results-section';
const I18N_KEYS = {
    PHONES_HEADER: 'webapp_sidemenu_search_results_heading_phones',
};
export interface PhonesProps {
    query: string;
}
export const Phones = ({ query }: PhonesProps) => {
    const { routes } = useRouterGlobalSettingsContext();
    const { translate } = useTranslate();
    const { loadMore, result } = useItemSearchData<Phone>(query, VaultItemType.Phone);
    if (!result?.matchCount) {
        return null;
    }
    const { items, matchCount } = result;
    SearchEventLogger.updateSearchSubTypes('phones', matchCount);
    return (<SearchResultsSection i18nKey={I18N_KEYS.PHONES_HEADER} loadMore={loadMore} matchCount={matchCount} loadedCount={items.length}>
      {items.map((phone, index) => (<PersonalInfoSearchItem icon={<PersonalInfoIcon iconType={IconType.phone} iconSize={IconSize.smallIcon}/>} key={phone.id} text={phone.phoneNumber} title={getPhoneItemName(phone, translate)} detailRoute={routes.userPersonalInfoPhone(phone.id)} onSelectPersonalInfo={() => {
                SearchEventLogger.logSearchEvent();
                logSelectPersonalInfo(phone.id, ItemType.Phone, index + 1, matchCount);
            }}/>))}
    </SearchResultsSection>);
};
