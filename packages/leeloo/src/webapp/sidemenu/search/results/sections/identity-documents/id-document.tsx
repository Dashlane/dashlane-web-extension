import React from 'react';
import { useRouterGlobalSettingsContext } from 'libs/router';
import { Country, VaultItemType } from '@dashlane/vault-contracts';
import useTranslate from 'libs/i18n/useTranslate';
import { TranslatorInterface } from 'libs/i18n/types';
import { idToItemType, logSelectId } from 'libs/logs/events/vault/select-item';
import { IdSearchItem } from 'webapp/sidemenu/search/items';
import SearchEventLogger from 'webapp/sidemenu/search/search-event-logger';
import { getFallbackIdTitle } from 'webapp/ids/helpers';
import { IdItem, IdVaultItemType } from 'webapp/ids/types';
import { useItemSearchData } from '../../use-item-search-data';
import { SearchResultsSection } from '../search-results-section';
interface Props {
    idVaultItemType: IdVaultItemType;
    query: string;
    title: string;
}
const primaryDataMapper: Record<IdVaultItemType, string> = {
    [VaultItemType.DriversLicense]: 'idName',
    [VaultItemType.FiscalId]: 'fiscalNumber',
    [VaultItemType.IdCard]: 'idName',
    [VaultItemType.Passport]: 'idName',
    [VaultItemType.SocialSecurityId]: 'idName',
};
const secondaryDataMapper: Record<IdVaultItemType, string> = {
    [VaultItemType.DriversLicense]: 'idNumber',
    [VaultItemType.FiscalId]: 'country',
    [VaultItemType.IdCard]: 'idNumber',
    [VaultItemType.Passport]: 'idNumber',
    [VaultItemType.SocialSecurityId]: 'idNumber',
};
const getData = (mapper: Record<IdVaultItemType, string>) => (type: IdVaultItemType, item: IdItem, translate: TranslatorInterface) => {
    const field = mapper[type];
    const fieldValue = item[field];
    if (field === 'country') {
        return fieldValue === undefined || fieldValue === Country.UNIVERSAL
            ? ''
            : translate(`country_name_${fieldValue}`);
    }
    else if (field === 'name' && !fieldValue) {
        return getFallbackIdTitle(type, item.country, translate);
    }
    return fieldValue;
};
const getPrimaryData = getData(primaryDataMapper);
const getSecondaryData = getData(secondaryDataMapper);
export const IdDocument = <T extends IdItem>({ idVaultItemType, query, title, }: Props) => {
    const { routes } = useRouterGlobalSettingsContext();
    const { translate } = useTranslate();
    const { loadMore, result } = useItemSearchData<T>(query, idVaultItemType);
    if (!result?.matchCount) {
        return null;
    }
    const { items, matchCount } = result;
    SearchEventLogger.updateSearchSubTypes('documents', matchCount);
    return (<SearchResultsSection i18nKey={title} loadMore={loadMore} matchCount={matchCount} loadedCount={items.length}>
      {items.map((item, index) => (<IdSearchItem key={item.id} itemId={item.id} type={idVaultItemType} country={item.country} primaryDisplayData={getPrimaryData(idVaultItemType, item, translate)} secondaryDisplayData={getSecondaryData(idVaultItemType, item, translate)} idNumber={item['idNumber'] || item['fiscalNumber']} route={routes.userEditIdDocument(idVaultItemType, item.id)} onSelectId={() => {
                SearchEventLogger.logSearchEvent();
                logSelectId(item.id, idToItemType[idVaultItemType], index + 1, matchCount);
            }}/>))}
    </SearchResultsSection>);
};
