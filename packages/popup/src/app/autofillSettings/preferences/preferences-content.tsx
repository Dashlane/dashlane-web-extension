import { memo, useEffect } from 'react';
import { jsx, Toggle } from '@dashlane/design-system';
import { autofillNotificationsApi, autofillSettingsApi, CREDENTIAL_DATA_MODELS, FORM_DATA_MODELS, } from '@dashlane/autofill-contracts';
import { DataStatus, useFeatureFlips, useModuleCommands, useModuleQuery, } from '@dashlane/framework-react';
import { isSuccess } from '@dashlane/framework-types';
import { BrowseComponent, PageView } from '@dashlane/hermes';
import { useIsUserDiscontinuedAfterTrial } from 'app/autofillSettings/hooks/use-is-user-discontinued-after-trial';
import useTranslate from 'src/libs/i18n/useTranslate';
import { logPageView } from 'src/libs/logs/logEvent';
import { ToggleSourceType } from './toggle-sourcetype';
import { WebcardsSettingsContent } from './webcardSettings';
import { SX_STYLES } from './preferences-content.styles';
import { logAutofillToggledForSourceTypes, logAutologinToggled } from '../logs';
const DISABLE_AUTOLOGIN_DEV_FF = 'autofill_web_disableAutologin';
const I18N_KEYS = {
    HEADER: 'tab/autofill_settings/preferences/preferences_header',
    SUBHEADER: 'tab/autofill_settings/preferences/preferences_subheader',
    AUTOFILL_LOGINS: 'tab/autofill_settings/preferences/autofill_logins',
    AUTOFILL_LOGINS_DISABLED: 'tab/autofill_settings/preferences/autofill_logins_disabled_description',
    AUTOFILL_FORMS: 'tab/autofill_settings/preferences/autofill_forms',
    AUTOFILL_FORMS_DISABLED: 'tab/autofill_settings/preferences/autofill_forms_disabled_description',
    AUTOLOGIN: 'tab/autofill_settings/preferences/autologin_label',
    AUTOLOGIN_ENABLED_DESCRIPTION: 'tab/autofill_settings/preferences/autologin_on_description',
    AUTOLOGIN_DISABLED_DESCRIPTION: 'tab/autofill_settings/preferences/autologin_off_description',
    NAMES_TOGGLE: 'tab/autofill_settings/preferences/checkbox_names',
    EMAILS_TOGGLE: 'tab/autofill_settings/preferences/checkbox_emails',
    ADDRESS_TOGGLE: 'tab/autofill_settings/preferences/checkbox_addresses',
    IDS_TOGGLE: 'tab/autofill_settings/preferences/checkbox_ids',
    PAYMENTS_TOGGLE: 'tab/autofill_settings/preferences/checkbox_payments',
    PHONES_TOGGLE: 'tab/autofill_settings/preferences/checkbox_phones',
};
export const AutofillPreferencesContent = memo(function AutofillPreferencesContent() {
    const { translate } = useTranslate();
    const { disableAnalysis, disableAutofillOnForms, disableAutofillOnLogins, disableAutologin, enableAnalysis, enableAutofillOnForms, enableAutofillOnLogins, enableAutologin, } = useModuleCommands(autofillSettingsApi);
    const { setAutofillDisabledOnLoginsAndFormsNotificationStatus } = useModuleCommands(autofillNotificationsApi);
    const getAutofillSettingsResult = useModuleQuery(autofillSettingsApi, 'getAutofillSettings');
    const retrievedFFStatus = useFeatureFlips();
    const isPreferenceReadOnly = useIsUserDiscontinuedAfterTrial();
    const hasDisableAutologinFF = retrievedFFStatus.status === DataStatus.Success
        ? retrievedFFStatus.data[DISABLE_AUTOLOGIN_DEV_FF]
        : false;
    const disabledSourceTypes = getAutofillSettingsResult.status === DataStatus.Success
        ? getAutofillSettingsResult.data.disabledSourceTypes
        : [];
    const autofillOnFormsEnabled = FORM_DATA_MODELS.some((sourceType) => !disabledSourceTypes.includes(sourceType));
    const autofillOnLoginsEnabled = CREDENTIAL_DATA_MODELS.some((sourceType) => !disabledSourceTypes.includes(sourceType));
    const autologinEnabled = getAutofillSettingsResult.status === DataStatus.Success
        ? !getAutofillSettingsResult.data.isAutologinDisabled
        : true;
    useEffect(() => {
        logPageView(PageView.SettingsAutofillPreferences, BrowseComponent.ExtensionPopup);
    }, []);
    const toggleAutofillOnLogins = () => {
        if (autofillOnLoginsEnabled) {
            void disableAutofillOnLogins().then((result) => {
                if (isSuccess(result) && !autofillOnFormsEnabled) {
                    void disableAnalysis();
                    void setAutofillDisabledOnLoginsAndFormsNotificationStatus({
                        status: true,
                    });
                }
            });
            logAutofillToggledForSourceTypes([...CREDENTIAL_DATA_MODELS], 'disabled');
        }
        else {
            void enableAutofillOnLogins().then((result) => {
                if (isSuccess(result)) {
                    void enableAnalysis();
                    void setAutofillDisabledOnLoginsAndFormsNotificationStatus({
                        status: false,
                    });
                }
            });
            logAutofillToggledForSourceTypes([...CREDENTIAL_DATA_MODELS], 'enabled');
        }
    };
    const toggleAutofillOnForms = () => {
        if (autofillOnFormsEnabled) {
            void disableAutofillOnForms().then((result) => {
                if (isSuccess(result) && !autofillOnLoginsEnabled) {
                    void disableAnalysis();
                    void setAutofillDisabledOnLoginsAndFormsNotificationStatus({
                        status: true,
                    });
                }
            });
            logAutofillToggledForSourceTypes([...FORM_DATA_MODELS], 'disabled');
        }
        else {
            void enableAutofillOnForms().then((result) => {
                if (isSuccess(result)) {
                    void enableAnalysis();
                    void setAutofillDisabledOnLoginsAndFormsNotificationStatus({
                        status: false,
                    });
                }
            });
            logAutofillToggledForSourceTypes([...FORM_DATA_MODELS], 'enabled');
        }
    };
    const toggleAutologin = () => {
        logAutologinToggled(!autologinEnabled);
        if (autologinEnabled) {
            void disableAutologin();
        }
        else {
            void enableAutologin();
        }
    };
    if (isPreferenceReadOnly === null || isPreferenceReadOnly === undefined) {
        return null;
    }
    return (<div sx={SX_STYLES.MAIN_CONTAINER}>
        <div sx={SX_STYLES.HEADER_CONTAINER}>
          <h3 sx={SX_STYLES.HEADER}>{translate(I18N_KEYS.HEADER)}</h3>
          <p sx={SX_STYLES.SUBHEADER}>{translate(I18N_KEYS.SUBHEADER)}</p>
        </div>
        {hasDisableAutologinFF ? (<div sx={SX_STYLES.TOGGLE_OPTION_CONTAINER}>
            <Toggle label={translate(I18N_KEYS.AUTOLOGIN)} description={autologinEnabled
                ? translate(I18N_KEYS.AUTOLOGIN_ENABLED_DESCRIPTION)
                : translate(I18N_KEYS.AUTOLOGIN_DISABLED_DESCRIPTION)} onChange={toggleAutologin} checked={autologinEnabled} sx={{ fontSize: '14px' }} readOnly={isPreferenceReadOnly}/>
          </div>) : null}
        <div sx={SX_STYLES.TOGGLE_OPTION_CONTAINER}>
          <Toggle label={translate(I18N_KEYS.AUTOFILL_LOGINS)} description={!autofillOnLoginsEnabled
            ? translate(I18N_KEYS.AUTOFILL_LOGINS_DISABLED)
            : null} onChange={toggleAutofillOnLogins} checked={autofillOnLoginsEnabled} sx={{ fontSize: '14px' }} readOnly={isPreferenceReadOnly}/>
        </div>
        <div sx={SX_STYLES.TOGGLE_OPTION_CONTAINER}>
          <Toggle label={translate(I18N_KEYS.AUTOFILL_FORMS)} description={!autofillOnFormsEnabled
            ? translate(I18N_KEYS.AUTOFILL_FORMS_DISABLED)
            : null} onChange={toggleAutofillOnForms} checked={autofillOnFormsEnabled} sx={{ fontSize: '14px' }} readOnly={isPreferenceReadOnly}/>
        </div>
        <div sx={SX_STYLES.TOGGLE_BY_SOURCETYPE_CONTAINER}>
          <ToggleSourceType label={translate(I18N_KEYS.NAMES_TOGGLE)} sourceTypes={['KWIdentity']} disabledSourceTypes={disabledSourceTypes} disabled={!autofillOnFormsEnabled} readOnly={isPreferenceReadOnly}/>
          <ToggleSourceType label={translate(I18N_KEYS.EMAILS_TOGGLE)} sourceTypes={['KWEmail']} disabledSourceTypes={disabledSourceTypes} disabled={!autofillOnFormsEnabled} readOnly={isPreferenceReadOnly}/>
          <ToggleSourceType label={translate(I18N_KEYS.IDS_TOGGLE)} sourceTypes={[
            'KWIDCard',
            'KWDriverLicence',
            'KWPassport',
            'KWSocialSecurityStatement',
        ]} disabledSourceTypes={disabledSourceTypes} disabled={!autofillOnFormsEnabled} readOnly={isPreferenceReadOnly}/>
          <ToggleSourceType label={translate(I18N_KEYS.PHONES_TOGGLE)} sourceTypes={['KWPhone']} disabledSourceTypes={disabledSourceTypes} disabled={!autofillOnFormsEnabled} readOnly={isPreferenceReadOnly}/>
          <ToggleSourceType label={translate(I18N_KEYS.ADDRESS_TOGGLE)} sourceTypes={['KWAddress']} disabledSourceTypes={disabledSourceTypes} disabled={!autofillOnFormsEnabled} readOnly={isPreferenceReadOnly}/>
          <ToggleSourceType label={translate(I18N_KEYS.PAYMENTS_TOGGLE)} sourceTypes={[
            'KWBankStatement',
            'KWPaymentMean_creditCard',
            'KWPaymentMean_paypal',
        ]} disabledSourceTypes={disabledSourceTypes} disabled={!autofillOnFormsEnabled} readOnly={isPreferenceReadOnly}/>
        </div>
        <WebcardsSettingsContent readOnly={isPreferenceReadOnly}/>
      </div>);
});
