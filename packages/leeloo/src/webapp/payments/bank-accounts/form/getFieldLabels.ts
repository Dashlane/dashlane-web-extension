import { Country } from "@dashlane/communication";
const I18N_KEYS = {
  FIELD_BIC: "webapp_payment_edition_field_bank_account_BIC",
  FIELD_IBAN: "webapp_payment_edition_field_bank_account_IBAN",
  FIELD_PLACEHOLDER_NO_BIC:
    "webapp_payment_edition_field_bank_account_no_BIC_placeholder",
  FIELD_PLACEHOLDER_NO_IBAN:
    "webapp_payment_edition_field_bank_account_no_IBAN_placeholder",
  FIELD_ROUTING_NUMBER:
    "webapp_payment_edition_field_bank_account_routing_number",
  FIELD_ACCOUNT_NUMBER:
    "webapp_payment_edition_field_bank_account_account_number",
  FIELD_CLABE: "webapp_payment_edition_field_bank_account_CLABE",
  FIELD_SORT_CODE: "webapp_payment_edition_field_bank_account_sort_code",
  FIELD_PLACEHOLDER_NO_ROUTING_NUMBER:
    "webapp_payment_edition_field_bank_account_no_routing_number_placeholder",
  FIELD_PLACEHOLDER_NO_ACCOUNT_NUMBER:
    "webapp_payment_edition_field_bank_account_no_account_number_placeholder",
  FIELD_PLACEHOLDER_NO_CLABE:
    "webapp_payment_edition_field_bank_account_no_CLABE_placeholder",
  FIELD_PLACEHOLDER_NO_SORT_CODE:
    "webapp_payment_edition_field_bank_account_no_sort_code_placeholder",
  BIC_COPIED: "webapp_payment_alert_bank_account_BIC_copied",
  IBAN_COPIED: "webapp_payment_alert_bank_account_IBAN_copied",
  CLABE_COPIED: "webapp_payment_alert_bank_account_CLABE_copied",
  SORT_CODE_COPIED: "webapp_payment_alert_bank_account_sort_code_copied",
  ROUTING_NUMBER_COPIED:
    "webapp_payment_alert_bank_account_routing_number_copied",
  ACCOUNT_NUMBER_COPIED:
    "webapp_payment_alert_bank_account_account_number_copied",
};
export interface Labels {
  IBAN: string;
  BIC: string;
  IBAN_PLACEHOLDER: string;
  BIC_PLACEHOLDER: string;
  IBAN_COPIED: string;
  BIC_COPIED: string;
}
export const getFieldLabels = (country: Country): Labels => {
  switch (country) {
    case Country.MX:
      return {
        IBAN: I18N_KEYS.FIELD_CLABE,
        BIC: I18N_KEYS.FIELD_BIC,
        IBAN_PLACEHOLDER: I18N_KEYS.FIELD_PLACEHOLDER_NO_CLABE,
        BIC_PLACEHOLDER: I18N_KEYS.FIELD_PLACEHOLDER_NO_BIC,
        IBAN_COPIED: I18N_KEYS.CLABE_COPIED,
        BIC_COPIED: I18N_KEYS.BIC_COPIED,
      };
    case Country.GB:
      return {
        IBAN: I18N_KEYS.FIELD_ACCOUNT_NUMBER,
        BIC: I18N_KEYS.FIELD_SORT_CODE,
        IBAN_PLACEHOLDER: I18N_KEYS.FIELD_PLACEHOLDER_NO_ACCOUNT_NUMBER,
        BIC_PLACEHOLDER: I18N_KEYS.FIELD_PLACEHOLDER_NO_SORT_CODE,
        IBAN_COPIED: I18N_KEYS.ACCOUNT_NUMBER_COPIED,
        BIC_COPIED: I18N_KEYS.SORT_CODE_COPIED,
      };
    case Country.US:
      return {
        IBAN: I18N_KEYS.FIELD_ACCOUNT_NUMBER,
        BIC: I18N_KEYS.FIELD_ROUTING_NUMBER,
        IBAN_PLACEHOLDER: I18N_KEYS.FIELD_PLACEHOLDER_NO_ACCOUNT_NUMBER,
        BIC_PLACEHOLDER: I18N_KEYS.FIELD_PLACEHOLDER_NO_ROUTING_NUMBER,
        IBAN_COPIED: I18N_KEYS.ACCOUNT_NUMBER_COPIED,
        BIC_COPIED: I18N_KEYS.ROUTING_NUMBER_COPIED,
      };
    default:
      return {
        IBAN: I18N_KEYS.FIELD_IBAN,
        BIC: I18N_KEYS.FIELD_BIC,
        IBAN_PLACEHOLDER: I18N_KEYS.FIELD_PLACEHOLDER_NO_IBAN,
        BIC_PLACEHOLDER: I18N_KEYS.FIELD_PLACEHOLDER_NO_BIC,
        IBAN_COPIED: I18N_KEYS.IBAN_COPIED,
        BIC_COPIED: I18N_KEYS.BIC_COPIED,
      };
  }
};
