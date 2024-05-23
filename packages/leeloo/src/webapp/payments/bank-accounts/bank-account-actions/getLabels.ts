import { Country } from '@dashlane/communication';
import { BankAccountActionsMode } from './types';
export interface Labels {
    BIC: string;
    BIC_ALERT: string;
    IBAN: string;
    IBAN_ALERT: string;
}
const SEARCH_I18N_KEYS = {
    COPY_ACCOUNT_LABEL: 'webapp_sidemenu_search_actions_bank_account_copy_account',
    COPY_ACCOUNT_ALERT: 'webapp_sidemenu_search_actions_bank_account_copy_account_alert',
    COPY_BIC_LABEL: 'webapp_sidemenu_search_actions_bank_account_copy_BIC',
    COPY_BIC_ALERT: 'webapp_sidemenu_search_actions_bank_account_copy_BIC_alert',
    COPY_CLABE_LABEL: 'webapp_sidemenu_search_actions_bank_account_copy_CLABE',
    COPY_CLABE_ALERT: 'webapp_sidemenu_search_actions_bank_account_copy_CLABE_alert',
    COPY_IBAN_LABEL: 'webapp_sidemenu_search_actions_bank_account_copy_IBAN',
    COPY_IBAN_ALERT: 'webapp_sidemenu_search_actions_bank_account_copy_IBAN_alert',
    COPY_ROUTING_LABEL: 'webapp_sidemenu_search_actions_bank_account_copy_routing',
    COPY_ROUTING_ALERT: 'webapp_sidemenu_search_actions_bank_account_copy_routing_alert',
    COPY_SORT_CODE_LABEL: 'webapp_sidemenu_search_actions_bank_account_copy_sort_code',
    COPY_SORT_CODE_ALERT: 'webapp_sidemenu_search_actions_bank_account_copy_sort_code_alert',
};
const LIST_I18N_KEYS = {
    COPY_ACCOUNT_LABEL: 'webapp_payment_bankaccount_list_item_copy_account',
    COPY_ACCOUNT_ALERT: 'webapp_payment_bankaccount_list_item_copy_account_alert',
    COPY_BIC_LABEL: 'webapp_payment_bankaccount_list_item_copy_BIC',
    COPY_BIC_ALERT: 'webapp_payment_bankaccount_list_item_copy_BIC_alert',
    COPY_CLABE_LABEL: 'webapp_payment_bankaccount_list_item_copy_CLABE',
    COPY_CLABE_ALERT: 'webapp_payment_bankaccount_list_item_copy_CLABE_alert',
    COPY_IBAN_LABEL: 'webapp_payment_bankaccount_list_item_copy_IBAN',
    COPY_IBAN_ALERT: 'webapp_payment_bankaccount_list_item_copy_IBAN_alert',
    COPY_ROUTING_LABEL: 'webapp_payment_bankaccount_list_item_copy_routing',
    COPY_ROUTING_ALERT: 'webapp_payment_bankaccount_list_item_copy_routing_alert',
    COPY_SORT_CODE_LABEL: 'webapp_payment_bankaccount_list_item_copy_sort_code',
    COPY_SORT_CODE_ALERT: 'webapp_payment_bankaccount_list_item_copy_sort_code_alert',
};
export const getLabelsKey = (country: Country, mode: BankAccountActionsMode): Labels => {
    const keys = mode === BankAccountActionsMode.SEARCH ? SEARCH_I18N_KEYS : LIST_I18N_KEYS;
    switch (country) {
        case Country.MX:
            return {
                BIC: keys.COPY_BIC_LABEL,
                BIC_ALERT: keys.COPY_BIC_ALERT,
                IBAN: keys.COPY_CLABE_LABEL,
                IBAN_ALERT: keys.COPY_CLABE_ALERT,
            };
        case Country.GB:
            return {
                BIC: keys.COPY_SORT_CODE_LABEL,
                BIC_ALERT: keys.COPY_SORT_CODE_ALERT,
                IBAN: keys.COPY_ACCOUNT_LABEL,
                IBAN_ALERT: keys.COPY_ACCOUNT_ALERT,
            };
        case Country.US:
            return {
                BIC: keys.COPY_ROUTING_LABEL,
                BIC_ALERT: keys.COPY_ROUTING_ALERT,
                IBAN: keys.COPY_ACCOUNT_LABEL,
                IBAN_ALERT: keys.COPY_ACCOUNT_ALERT,
            };
        default:
            return {
                BIC: keys.COPY_BIC_LABEL,
                BIC_ALERT: keys.COPY_BIC_ALERT,
                IBAN: keys.COPY_IBAN_LABEL,
                IBAN_ALERT: keys.COPY_IBAN_ALERT,
            };
    }
};
