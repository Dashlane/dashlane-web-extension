import { TranslatorInterface } from 'libs/i18n/types';
import { CurrentLocationUpdated } from '@dashlane/communication';
import { Country, VaultItemType } from '@dashlane/vault-contracts';
import { IdVaultItemType } from './types';
const I18N_KEYS = {
    PASSPORTS_FALLBACK: 'webapp_sidemenu_search_results_ids_passports_fallback',
    PASSPORTS_FALLBACK_TYPE: 'webapp_sidemenu_search_results_ids_passports_fallback_type',
    ID_CARDS_FALLBACK: 'webapp_sidemenu_search_results_ids_id_cards_fallback',
    ID_CARDS_FALLBACK_TYPE: 'webapp_sidemenu_search_results_ids_id_cards_fallback_type',
    FISCAL_NUMBERS_FALLBACK: 'webapp_sidemenu_search_results_ids_fiscal_ids_fallback',
    FISCAL_NUMBERS_FALLBACK_TYPE: 'webapp_sidemenu_search_results_ids_fiscal_ids_fallback_type',
    DRIVER_LICENSES_FALLBACK: 'webapp_sidemenu_search_results_ids_driver_licences_fallback',
    DRIVER_LICENSES_FALLBACK_TYPE: 'webapp_sidemenu_search_results_ids_driver_licences_fallback_type',
    SOCIAL_SECURITY_IDS_FALLBACK: 'webapp_sidemenu_search_results_ids_social_security_ids_fallback',
    SOCIAL_SECURITY_IDS_FALLBACK_TYPE: 'webapp_sidemenu_search_results_ids_social_security_ids_fallback_type',
};
const FALLBACK_TEXT = {
    [VaultItemType.Passport]: {
        type: I18N_KEYS.PASSPORTS_FALLBACK_TYPE,
        default: I18N_KEYS.PASSPORTS_FALLBACK,
    },
    [VaultItemType.SocialSecurityId]: {
        type: I18N_KEYS.SOCIAL_SECURITY_IDS_FALLBACK_TYPE,
        default: I18N_KEYS.SOCIAL_SECURITY_IDS_FALLBACK,
    },
    [VaultItemType.FiscalId]: {
        type: I18N_KEYS.FISCAL_NUMBERS_FALLBACK_TYPE,
        default: I18N_KEYS.FISCAL_NUMBERS_FALLBACK,
    },
    [VaultItemType.DriversLicense]: {
        type: I18N_KEYS.DRIVER_LICENSES_FALLBACK_TYPE,
        default: I18N_KEYS.DRIVER_LICENSES_FALLBACK,
    },
    [VaultItemType.IdCard]: {
        type: I18N_KEYS.ID_CARDS_FALLBACK_TYPE,
        default: I18N_KEYS.ID_CARDS_FALLBACK,
    },
};
export const getFallbackIdTitle = (type: IdVaultItemType, country: string, translate: TranslatorInterface) => {
    if (country && country !== Country.UNIVERSAL && country !== Country.NO_TYPE) {
        return translate(FALLBACK_TEXT[type].default, {
            country: translate(`country_name_${Country[country]}`),
        });
    }
    return translate(FALLBACK_TEXT[type].type);
};
export const getCurrentCountry = (currentLocation: CurrentLocationUpdated): Country => {
    const currentCountry: string | null = currentLocation.country;
    const fallback = Country.US;
    if (currentCountry) {
        return Country[currentCountry] ?? fallback;
    }
    return fallback;
};
export const ADD_ID_QUERY_PARAM = 'add';
export const DRIVER_LICENSE_BRITISH_SPELLING_COUNTRIES = new Set([
    Country.AU,
    Country.GB,
    Country.IE,
    Country.NZ,
    Country.CA,
]);
export function getBritishSpellingLabel(label: string, locale: string, country: Country) {
    if (!DRIVER_LICENSE_BRITISH_SPELLING_COUNTRIES.has(country) ||
        locale !== 'en') {
        return label;
    }
    return label.replace('license', 'licence');
}
