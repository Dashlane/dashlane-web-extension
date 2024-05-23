import React from 'react';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { useModuleQuery } from '@dashlane/framework-react';
import { VaultItemType, vaultSearchApi } from '@dashlane/vault-contracts';
import SearchEventLogger from 'src/app/vault/search-event-logger';
import { useSearchContext } from 'src/app/vault/search-field/search-context';
import { VaultTabType } from '../../../types';
import { BaseListContainer } from '../common';
import { IdCardsList } from './id-cards-list';
import { SocialSecurityIdsList } from './social-security-ids-list';
import { DriverLicensesList } from './driver-licenses-list';
import { PassportsList } from './passports-list';
import { FiscalIdsList } from './fiscal-ids-list';
import styles from '../common/sharedListStyles.css';
export const IdsListContainer = () => {
    const { searchValue } = useSearchContext();
    const { status, data } = useModuleQuery(vaultSearchApi, 'search', {
        searchQuery: searchValue,
        vaultItemTypes: [
            VaultItemType.DriversLicense,
            VaultItemType.FiscalId,
            VaultItemType.IdCard,
            VaultItemType.Passport,
            VaultItemType.SocialSecurityId,
        ],
    });
    if (status !== DataStatus.Success) {
        return null;
    }
    const { driversLicensesResult, fiscalIdsResult, idCardsResult, passportsResult, socialSecurityIdsResult, } = data;
    const totalItemsCount = driversLicensesResult.matchCount +
        fiscalIdsResult.matchCount +
        idCardsResult.matchCount +
        passportsResult.matchCount +
        socialSecurityIdsResult.matchCount;
    SearchEventLogger.totalCount = totalItemsCount;
    return (<BaseListContainer hasItems={totalItemsCount > 0} vaultTabType={VaultTabType.Identities}>
      <div className={styles.listContent}>
        <IdCardsList idCardsResult={idCardsResult}/>
        <SocialSecurityIdsList socialSecurityIdsResult={socialSecurityIdsResult}/>
        <DriverLicensesList driversLicensesResult={driversLicensesResult}/>
        <PassportsList passportsResult={passportsResult}/>
        <FiscalIdsList fiscalIdsResult={fiscalIdsResult}/>
      </div>
    </BaseListContainer>);
};
