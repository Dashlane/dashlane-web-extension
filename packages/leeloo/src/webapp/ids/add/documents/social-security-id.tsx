import React from 'react';
import { Country, VaultItemType } from '@dashlane/vault-contracts';
import { Lee } from 'lee';
import useTranslate from 'libs/i18n/useTranslate';
import { getCurrentSpaceId } from 'libs/webapp';
import { AddPanel } from 'webapp/ids/add/add-panel';
import { getCurrentCountry } from 'webapp/ids/helpers';
import { Header } from 'webapp/ids/form/header';
import { SocialSecurityIdFormFields } from 'webapp/ids/types';
import { SocialSecurityIdForm } from 'webapp/ids/form/documents/social-security-id-form';
interface Props {
    lee: Lee;
    listRoute: string;
}
const I18N_KEYS = {
    SUCCESS_DEFAULT: "webapp_id_creation_socialsecurity_alert_add_success_default",
    SUCCESS_BR: "webapp_id_creation_socialsecurity_alert_add_success_br",
    SUCCESS_CA: "webapp_id_creation_socialsecurity_alert_add_success_ca",
    SUCCESS_GB: "webapp_id_creation_socialsecurity_alert_add_success_gb",
    SUCCESS_IE: "webapp_id_creation_socialsecurity_alert_add_success_ie",
    SUCCESS_IT: "webapp_id_creation_socialsecurity_alert_add_success_it",
    SUCCESS_JP: "webapp_id_creation_socialsecurity_alert_add_success_jp",
    SUCCESS_NL: "webapp_id_creation_socialsecurity_alert_add_success_nl",
    SUCCESS_NO: "webapp_id_creation_socialsecurity_alert_add_success_no",
    SUCCESS_PT: "webapp_id_creation_socialsecurity_alert_add_success_pt",
    SUCCESS_SE: "webapp_id_creation_socialsecurity_alert_add_success_se",
    TITLE_DEFAULT: "webapp_id_creation_socialsecurity_title_default",
    TITLE_BR: "webapp_id_creation_socialsecurity_title_br",
    TITLE_CA: "webapp_id_creation_socialsecurity_title_ca",
    TITLE_GB: "webapp_id_creation_socialsecurity_title_gb",
    TITLE_IE: "webapp_id_creation_socialsecurity_title_ie",
    TITLE_IT: "webapp_id_creation_socialsecurity_title_it",
    TITLE_JP: "webapp_id_creation_socialsecurity_title_jp",
    TITLE_NL: "webapp_id_creation_socialsecurity_title_nl",
    TITLE_NO: "webapp_id_creation_socialsecurity_title_no",
    TITLE_PT: "webapp_id_creation_socialsecurity_title_pt",
    TITLE_SE: "webapp_id_creation_socialsecurity_title_se",
};
const COUNTRIES_I18N_KEYS = {
    [Country.BR]: {
        title: I18N_KEYS.TITLE_BR,
        success: I18N_KEYS.SUCCESS_BR,
    },
    [Country.CA]: {
        title: I18N_KEYS.TITLE_CA,
        success: I18N_KEYS.SUCCESS_CA,
    },
    [Country.GB]: {
        title: I18N_KEYS.TITLE_GB,
        success: I18N_KEYS.SUCCESS_GB,
    },
    [Country.IE]: {
        title: I18N_KEYS.TITLE_IE,
        success: I18N_KEYS.SUCCESS_IE,
    },
    [Country.IT]: {
        title: I18N_KEYS.TITLE_IT,
        success: I18N_KEYS.SUCCESS_IT,
    },
    [Country.JP]: {
        title: I18N_KEYS.TITLE_JP,
        success: I18N_KEYS.SUCCESS_JP,
    },
    [Country.NL]: {
        title: I18N_KEYS.TITLE_NL,
        success: I18N_KEYS.SUCCESS_NL,
    },
    [Country.NO]: {
        title: I18N_KEYS.TITLE_NO,
        success: I18N_KEYS.SUCCESS_NO,
    },
    [Country.PT]: {
        title: I18N_KEYS.TITLE_PT,
        success: I18N_KEYS.SUCCESS_PT,
    },
    [Country.SE]: {
        title: I18N_KEYS.TITLE_SE,
        success: I18N_KEYS.SUCCESS_SE,
    },
};
const countryToKeys = (country: Country) => COUNTRIES_I18N_KEYS[country] ?? {
    title: I18N_KEYS.TITLE_DEFAULT,
    success: I18N_KEYS.SUCCESS_DEFAULT,
};
export const SocialSecurityIdAddPanel = ({ lee, listRoute }: Props) => {
    const { translate } = useTranslate();
    const currentCountry = getCurrentCountry(lee.carbon.currentLocation);
    const currentSpaceId = getCurrentSpaceId(lee.globalState) ?? '';
    const initialValues: SocialSecurityIdFormFields = {
        idName: '',
        idNumber: '',
        country: currentCountry,
        spaceId: currentSpaceId,
    };
    return (<AddPanel<SocialSecurityIdFormFields> initialValues={initialValues} listRoute={listRoute} reportError={lee.reportError} countryToKeys={countryToKeys} header={(country) => (<Header title={translate(countryToKeys(country).title)} country={country} type={VaultItemType.SocialSecurityId}/>)} type={VaultItemType.SocialSecurityId}>
      {() => <SocialSecurityIdForm variant="add"/>}
    </AddPanel>);
};
