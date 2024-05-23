import * as React from 'react';
import { Lee } from 'lee';
import useTranslate from 'libs/i18n/useTranslate';
import { Addresses } from './sections/addresses';
import { BankAccounts } from './sections/bank-accounts';
import { Companies } from './sections/companies';
import { Credentials } from './sections/credentials';
import { Emails } from './sections/emails';
import { IdDocuments } from './sections/identity-documents';
import { Identities } from './sections/identities';
import { Notes } from './sections/notes';
import { PaymentCards } from './sections/payment-cards';
import { PersonalWebsites } from './sections/personal-websites';
import { Phones } from './sections/phones';
import styles from '../styles.css';
export interface Props {
    lee: Lee;
    query: string;
}
export const SearchResults = (props: Props) => {
    const { lee, query } = props;
    const { translate } = useTranslate();
    return (<>
      <div className={styles.searchResultsList} id="search-results">
        <Credentials lee={lee} query={query}/>
        <Notes query={query}/>
        <Identities query={query}/>
        <Emails query={query}/>
        <Phones query={query}/>
        <Addresses query={query}/>
        <Companies query={query}/>
        <PersonalWebsites query={query}/>
        <PaymentCards query={query}/>
        <BankAccounts query={query}/>
        <IdDocuments query={query}/>
      </div>
      
      <div className={styles.noResults}>
        {translate('webapp_sidemenu_search_results_empty')}
      </div>
    </>);
};
