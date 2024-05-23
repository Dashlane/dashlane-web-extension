import { useMemo } from 'react';
import { Infobox } from '@dashlane/design-system';
import { colors, jsx } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { CredentialPreferenceSetting } from '../components/credential-preference-setting';
import { useProtectPasswordsSetting } from 'libs/carbon/hooks/useProtectPasswordsSetting';
import { useIsSSOUser } from 'webapp/account/security-settings/hooks/useIsSSOUser';
import { useIsMPlessUser } from 'webapp/account/security-settings/hooks/use-is-mpless-user';
interface CredentialPreferenceModel {
    useAutoLogin: boolean;
    onlyAutofillExactDomain: boolean;
    requireMasterPassword: boolean;
}
interface CredentialPreferencesProps {
    credentialPreferences: CredentialPreferenceModel;
    isNewCredential: boolean;
    url: string;
    isPreferenceDisabled?: boolean;
    update: (newPreferences: CredentialPreferenceModel) => Promise<void>;
}
const I18N_KEYS = {
    PREFERENCES_TITLE: 'webapp_credential_edition_field_options',
    NO_URL_WARNING: 'webapp_credential_edition_field_options_no_url_warning',
    AUTOLOG: {
        TITLE: 'webapp_credential_edition_field_options_always_log_me',
        DETAILS: 'webapp_credential_edition_field_options_always_log_me_details',
    },
    SUBDOMAIN_ONLY: {
        TITLE: 'webapp_credential_edition_field_options_added_by_user_only',
        NEW_DETAILS: 'webapp_credential_edition_field_options_added_by_user_only_details',
    },
    REQUIRE_MP: {
        TITLE: 'webapp_credential_edition_field_options_always_require_master_password',
        DETAILS: 'webapp_credential_edition_field_options_always_require_master_password_details',
        FEEDBACK: 'webapp_credential_edition_field_options_always_require_master_password_disable_feedback_markup',
    },
};
export const CredentialPreferences = ({ credentialPreferences, isNewCredential, url: credentialUrl, isPreferenceDisabled = false, update, }: CredentialPreferencesProps) => {
    const protectPasswordsSetting = useProtectPasswordsSetting();
    const isUrlValid = useMemo(() => {
        if (!credentialUrl) {
            return false;
        }
        try {
            new URL(credentialUrl);
            return true;
        }
        catch (e) {
            try {
                new URL('*****' + credentialUrl);
                return true;
            }
            catch (f) {
                return false;
            }
        }
    }, [credentialUrl]);
    const { translate } = useTranslate();
    const isSSOUser = useIsSSOUser();
    const isMPlessUser = useIsMPlessUser();
    const isRequireMPAvailable = !isSSOUser && !isMPlessUser.isMPLessUser;
    const setUseAutoLogin = (value: boolean) => {
        return update({ ...credentialPreferences, useAutoLogin: value });
    };
    const setOnlyAutofillExactDomain = (value: boolean) => {
        return update({ ...credentialPreferences, onlyAutofillExactDomain: value });
    };
    const setRequireMasterPassword = (value: boolean) => {
        return update({ ...credentialPreferences, requireMasterPassword: value });
    };
    return (<div>
      {!isUrlValid ? (<Infobox mood="warning" size="small" title={translate(I18N_KEYS.NO_URL_WARNING)} sx={{ marginBottom: '8px' }}/>) : null}
      <CredentialPreferenceSetting name="useAutoLogin" description={translate(I18N_KEYS.AUTOLOG.DETAILS)} isMpProtected={false} title={translate(I18N_KEYS.AUTOLOG.TITLE)} setValue={setUseAutoLogin} value={credentialPreferences.useAutoLogin} disabled={!isUrlValid || isPreferenceDisabled}/>
      <CredentialPreferenceSetting name="onlyAutofillExactDomain" isMpProtected={false} title={translate(I18N_KEYS.SUBDOMAIN_ONLY.TITLE)} description={translate(I18N_KEYS.SUBDOMAIN_ONLY.NEW_DETAILS)} setValue={setOnlyAutofillExactDomain} value={credentialPreferences.onlyAutofillExactDomain} disabled={!isUrlValid || isPreferenceDisabled}/>
      {isRequireMPAvailable ? (protectPasswordsSetting.status === DataStatus.Success ? (<CredentialPreferenceSetting name="requireMasterPassword" isMpProtected={!isNewCredential} title={translate(I18N_KEYS.REQUIRE_MP.TITLE)} description={<div>
                {protectPasswordsSetting.data ? (<div sx={{ marginBottom: '8px', color: colors.midGreen00 }}>
                    {translate.markup(I18N_KEYS.REQUIRE_MP.FEEDBACK)}
                  </div>) : null}
                <span>{translate(I18N_KEYS.REQUIRE_MP.DETAILS)}</span>
              </div>} setValue={setRequireMasterPassword} value={protectPasswordsSetting.data
                ? true
                : credentialPreferences.requireMasterPassword} disabled={!isUrlValid ||
                protectPasswordsSetting.data ||
                isPreferenceDisabled}/>) : (<CredentialPreferenceSetting name="requireMasterPassword" isMpProtected={!isNewCredential} title={translate(I18N_KEYS.REQUIRE_MP.TITLE)} description={translate(I18N_KEYS.REQUIRE_MP.DETAILS)} setValue={setRequireMasterPassword} value={credentialPreferences.requireMasterPassword} disabled={!isUrlValid || isPreferenceDisabled}/>)) : null}
    </div>);
};
