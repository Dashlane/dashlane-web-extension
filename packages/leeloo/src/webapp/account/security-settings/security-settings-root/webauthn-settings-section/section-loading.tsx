import { colors, jsx, LoadingIcon } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { SettingsSection } from 'webapp/account/security-settings/security-settings-root/settings-section/settings-section';
const I18N_KEYS = {
    ALL_AUTHENTICATORS_DESC: 'webapp_account_security_settings_passwordless_all_authenticators_title',
    LOADING_DATA: 'webapp_loader_loading',
};
export const WebAuthnSettingsLoadingSection = () => {
    const { translate } = useTranslate();
    return (<SettingsSection sectionTitle={translate(I18N_KEYS.ALL_AUTHENTICATORS_DESC)}>
      <div id="biometricsLoading" sx={{ marginTop: '20px' }} title={translate(I18N_KEYS.LOADING_DATA)}>
        <LoadingIcon color={colors.midGreen01} size={40} aria-describedby="biometricsLoading"/>
      </div>
    </SettingsSection>);
};
