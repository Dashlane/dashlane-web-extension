import { Country } from '@dashlane/vault-contracts';
const I18N_KEYS = {
    FIELD_BIC: 'tab/all_items/bankAccount/view/label/BIC',
    FIELD_IBAN: 'tab/all_items/bankAccount/view/label/IBAN',
    FIELD_ROUTING_NUMBER: 'tab/all_items/bankAccount/view/label/routing_number',
    FIELD_ACCOUNT_NUMBER: 'tab/all_items/bankAccount/view/label/account_number',
    FIELD_CLABE: 'tab/all_items/bankAccount/view/label/CLABE',
    FIELD_SORT_CODE: 'tab/all_items/bankAccount/view/label/sort_code',
    BIC_COPY: 'tab/all_items/bankAccount/actions/BIC_copy',
    BIC_COPIED: 'tab/all_items/bankAccount/actions/BIC_copied',
    IBAN_COPY: 'tab/all_items/bankAccount/actions/IBAN_copy',
    IBAN_COPIED: 'tab/all_items/bankAccount/actions/IBAN_copied',
    CLABE_COPY: 'tab/all_items/bankAccount/actions/CLABE_copy',
    CLABE_COPIED: 'tab/all_items/bankAccount/actions/CLABE_copied',
    SORT_CODE_COPY: 'tab/all_items/bankAccount/actions/sort_code_copy',
    SORT_CODE_COPIED: 'tab/all_items/bankAccount/actions/sort_code_copied',
    ROUTING_NUMBER_COPY: 'tab/all_items/bankAccount/actions/routing_number_copy',
    ROUTING_NUMBER_COPIED: 'tab/all_items/bankAccount/actions/routing_number_copied',
    ACCOUNT_NUMBER_COPY: 'tab/all_items/bankAccount/actions/account_number_copy',
    ACCOUNT_NUMBER_COPIED: 'tab/all_items/bankAccount/actions/account_number_copied'
};
export interface Labels {
    IBAN: string;
    BIC: string;
    IBAN_COPY: string;
    IBAN_COPIED: string;
    BIC_COPY: string;
    BIC_COPIED: string;
}
export const getBankFieldLabels = (country: Country): Labels => {
    switch (country) {
        case Country.MX:
            return {
                IBAN: I18N_KEYS.FIELD_CLABE,
                BIC: I18N_KEYS.FIELD_BIC,
                IBAN_COPY: I18N_KEYS.CLABE_COPY,
                IBAN_COPIED: I18N_KEYS.CLABE_COPIED,
                BIC_COPY: I18N_KEYS.BIC_COPY,
                BIC_COPIED: I18N_KEYS.BIC_COPIED,
            };
        case Country.GB:
            return {
                IBAN: I18N_KEYS.FIELD_ACCOUNT_NUMBER,
                BIC: I18N_KEYS.FIELD_SORT_CODE,
                IBAN_COPY: I18N_KEYS.ACCOUNT_NUMBER_COPY,
                IBAN_COPIED: I18N_KEYS.ACCOUNT_NUMBER_COPIED,
                BIC_COPY: I18N_KEYS.SORT_CODE_COPY,
                BIC_COPIED: I18N_KEYS.SORT_CODE_COPIED,
            };
        case Country.US:
            return {
                IBAN: I18N_KEYS.FIELD_ACCOUNT_NUMBER,
                BIC: I18N_KEYS.FIELD_ROUTING_NUMBER,
                IBAN_COPY: I18N_KEYS.ACCOUNT_NUMBER_COPY,
                IBAN_COPIED: I18N_KEYS.ACCOUNT_NUMBER_COPIED,
                BIC_COPY: I18N_KEYS.ROUTING_NUMBER_COPY,
                BIC_COPIED: I18N_KEYS.ROUTING_NUMBER_COPIED,
            };
        default:
            return {
                IBAN: I18N_KEYS.FIELD_IBAN,
                BIC: I18N_KEYS.FIELD_BIC,
                IBAN_COPY: I18N_KEYS.IBAN_COPY,
                IBAN_COPIED: I18N_KEYS.IBAN_COPIED,
                BIC_COPY: I18N_KEYS.BIC_COPY,
                BIC_COPIED: I18N_KEYS.BIC_COPIED,
            };
    }
};
