import { jsx, Paragraph } from '@dashlane/design-system';
import { InfoBox } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { SettingsSection } from 'webapp/account/security-settings/security-settings-root/settings-section/settings-section';
const I18N_KEYS = {
    TWO_FACTOR_AUTHENTICATION_TITLE: 'webapp_account_security_settings_two_factor_authentication_title',
};
interface SectionNotAvailableProps {
    error: boolean | undefined;
    message: string;
}
export const TwoFactorAuthenticationNotAvailableSection = ({ error, message, }: SectionNotAvailableProps) => {
    const { translate } = useTranslate();
    const unavailableContent = (<Paragraph color="ds.text.neutral.standard" sx={{
            marginTop: '5px',
        }} textStyle="ds.body.standard.regular">
      {translate(message)}
    </Paragraph>);
    const errorContent = (<div style={{ marginTop: '20px', maxWidth: '300px' }}>
      <InfoBox severity="alert" size="small" title={translate(message)}/>
    </div>);
    const content = error ? errorContent : unavailableContent;
    return (<SettingsSection sectionTitle={translate(I18N_KEYS.TWO_FACTOR_AUTHENTICATION_TITLE)}>
      {content}
    </SettingsSection>);
};
