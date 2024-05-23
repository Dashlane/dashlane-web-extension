import { ChangeEvent, useState } from 'react';
import { managementUninstallSelf } from '@dashlane/webextensions-apis';
import { Button, Checkbox, FlexContainer, GridContainer, Heading, jsx, Paragraph, } from '@dashlane/ui-components';
import { ExtensionSettings, RequiredExtensionSettings, } from '@dashlane/communication';
import useTranslate from 'libs/i18n/useTranslate';
import authStyles from '../styles.css';
const I18N_KEYS = {
    TITLE: 'account_creation_user_consent_title',
    DESCRIPTION: 'account_creation_user_consent_description_markup',
    USAGE_DATA_LABEL: 'account_creation_user_consent_usage_data_label',
    DISCLAIMER: 'account_creation_user_consent_disclaimer_markup',
    AGREE_BUTTON: 'account_creation_user_consent_agree',
    DECLINE_BUTTON: 'account_creation_user_consent_decline'
};
interface GlobalExtensionConsentProps {
    handleConsentSet: (consents: RequiredExtensionSettings) => Promise<void>;
}
export const GlobalExtensionConsent = ({ handleConsentSet, }: GlobalExtensionConsentProps) => {
    const [consentSettings, setConsentSettings] = useState<RequiredExtensionSettings>({
        interactionDataConsent: true,
        personalDataConsent: true,
    });
    const { translate } = useTranslate();
    const setConsentField = (consentField: keyof ExtensionSettings, consentValue: ExtensionSettings[keyof ExtensionSettings]) => {
        setConsentSettings((currentConsent) => ({
            ...currentConsent,
            [consentField]: consentValue,
        }));
    };
    const agreeConsent = async () => {
        await handleConsentSet(consentSettings);
    };
    const declineConsentAndUninstall = async () => {
        await managementUninstallSelf();
    };
    return (<FlexContainer as="form" className={authStyles.accountCreationPanel}>
      <Heading size="large" sx={{ mb: '16px' }}>
        {translate(I18N_KEYS.TITLE)}
      </Heading>
      
      <Paragraph as="div" sx={{ p: { mb: '24px' }, 'p:last-of-type': { mb: '16px' } }}>
        {translate.markup(I18N_KEYS.DESCRIPTION)}
      </Paragraph>
      <Checkbox label={translate(I18N_KEYS.USAGE_DATA_LABEL)} checked={consentSettings.interactionDataConsent} onChange={(e: ChangeEvent<HTMLInputElement>) => setConsentField('interactionDataConsent', e.currentTarget.checked)} sx={{ mb: '40px' }}/>
      <GridContainer gridTemplateColumns="auto auto" gap="8px" justifyContent="end" fullWidth sx={{ mb: '40px' }}>
        <Button type="button" nature="secondary" onClick={declineConsentAndUninstall}>
          {translate(I18N_KEYS.DECLINE_BUTTON)}
        </Button>
        <Button type="button" nature="primary" onClick={agreeConsent}>
          {translate(I18N_KEYS.AGREE_BUTTON)}
        </Button>
      </GridContainer>
      <Paragraph size="x-small">
        {translate.markup(I18N_KEYS.DISCLAIMER, {}, { linkTarget: '_blank' })}
      </Paragraph>
    </FlexContainer>);
};
