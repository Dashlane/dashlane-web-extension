import React from 'react';
import { IdVaultItemType } from 'webapp/ids/types';
import { VaultItemType } from '@dashlane/vault-contracts';
import { IdDocument } from './id-document';
interface Props {
    query: string;
}
const I18N_KEYS = {
    ID_CARDS: 'webapp_sidemenu_search_results_heading_id_cards',
    SOCIAL_SECURITY_IDS: 'webapp_sidemenu_search_results_heading_social_security_numbers',
    DRIVER_LICENSES: 'webapp_sidemenu_search_results_heading_driver_licenses',
    FISCAL_NUMBERS: 'webapp_sidemenu_search_results_heading_fiscal_numbers',
    PASSPORTS: 'webapp_sidemenu_search_results_heading_passports',
};
const Ids: {
    type: IdVaultItemType;
    title: string;
}[] = [
    { type: VaultItemType.DriversLicense, title: I18N_KEYS.ID_CARDS },
    { type: VaultItemType.FiscalId, title: I18N_KEYS.SOCIAL_SECURITY_IDS },
    { type: VaultItemType.IdCard, title: I18N_KEYS.DRIVER_LICENSES },
    { type: VaultItemType.Passport, title: I18N_KEYS.PASSPORTS },
    { type: VaultItemType.SocialSecurityId, title: I18N_KEYS.FISCAL_NUMBERS },
];
export const IdDocuments = ({ query }: Props) => {
    return (<>
      {Ids.map((id) => (<IdDocument key={`search_result_id_${id.type}`} idVaultItemType={id.type} title={id.title} query={query}/>))}
    </>);
};
