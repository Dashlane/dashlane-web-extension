import React from 'react';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { useModuleQuery } from '@dashlane/framework-react';
import { VaultItemType, vaultSearchApi } from '@dashlane/vault-contracts';
import { useSearchContext } from 'src/app/vault/search-field/search-context';
import SearchEventLogger from 'src/app/vault/search-event-logger';
import { VaultTabType } from '../../../types';
import { BaseListContainer } from '../common';
import { IdentityList } from './identities/identity-list';
import { PhoneList } from './phones/phone-list';
import { AddressList } from './addresses/address-list';
import { CompanyList } from './companies/company-list';
import { WebsiteList } from './websites/website-list';
import { EmailList } from './emails/email-list';
import styles from '../common/sharedListStyles.css';
export const PersonalInfoListContainer = () => {
    const { searchValue } = useSearchContext();
    const { status, data } = useModuleQuery(vaultSearchApi, 'search', {
        searchQuery: searchValue,
        vaultItemTypes: [
            VaultItemType.Address,
            VaultItemType.Company,
            VaultItemType.Email,
            VaultItemType.Identity,
            VaultItemType.Phone,
            VaultItemType.Website,
        ],
    });
    if (status !== DataStatus.Success) {
        return null;
    }
    const { addressesResult, companiesResult, emailsResult, identitiesResult, phonesResult, websitesResult, } = data;
    const totalItemsCount = addressesResult.matchCount +
        companiesResult.matchCount +
        emailsResult.matchCount +
        identitiesResult.matchCount +
        phonesResult.matchCount +
        websitesResult.matchCount;
    SearchEventLogger.totalCount = totalItemsCount;
    return (<BaseListContainer hasItems={totalItemsCount > 0} vaultTabType={VaultTabType.PersonalInformation}>
      <div className={styles.listContent}>
        <IdentityList identitiesResult={identitiesResult}/>
        <EmailList emailsResult={emailsResult}/>
        <PhoneList phonesResult={phonesResult}/>
        <AddressList addressesResult={addressesResult}/>
        <CompanyList companiesResult={companiesResult}/>
        <WebsiteList websitesResult={websitesResult}/>
      </div>
    </BaseListContainer>);
};
