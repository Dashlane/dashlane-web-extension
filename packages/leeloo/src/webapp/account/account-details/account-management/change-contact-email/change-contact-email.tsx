import { colors, FlexContainer, Paragraph } from '@dashlane/ui-components';
import { EmailField, jsx } from '@dashlane/design-system';
import { FieldSpacer } from 'libs/dashlane-style/field-spacer/field-spacer';
import useTranslate from 'libs/i18n/useTranslate';
import { AccountSubPanel } from 'webapp/account/account-subpanel/account-subpanel';
import { ChangeContactEmailForm } from './change-contact-form';
import { useAccountContactInfo } from '../../../hooks/use-contact-info';
import { useUserLogin } from 'webapp/account/hooks/use-user-login';
const I18N_KEYS = {
    HEADING: 'webapp_change_contact_email_section_title',
    DESCRIPTION: 'webapp_change_contact_email_section_description',
    CURRENT_EMAIL: 'webapp_change_contact_email_current_email_label',
    NEW_EMAIL: 'webapp_change_contact_email_new_email_label',
    CONFIRM_CHANGE: 'webapp_change_contact_email_confirm_change_button',
};
const SX_STYLES = {
    DESCRIPTION: {
        borderTop: `1px solid ${colors.grey05}`,
        paddingTop: '15px',
    },
    FORM_CONTAINER: {
        marginTop: '18px',
    },
    SECTION_CONTAINER: { padding: '0 32px' },
    CONFIRM_BUTTON: {
        marginTop: '48px',
    },
};
const CURRENT_CONTACT_EMAIL_INPUT_ID = 'account-management-change-contact-email-current-id';
interface Props {
    onNavigateOut: () => void;
}
export const ChangeContactEmail = ({ onNavigateOut }: Props) => {
    const { translate } = useTranslate();
    const contactInfo = useAccountContactInfo();
    const defaultContactEmail = useUserLogin();
    const contactEmail = contactInfo?.email ?? defaultContactEmail;
    return (<AccountSubPanel headingText={translate(I18N_KEYS.HEADING)} onNavigateOut={onNavigateOut}>
      <FlexContainer flexDirection="column" sx={SX_STYLES.SECTION_CONTAINER}>
        <div sx={SX_STYLES.DESCRIPTION}>
          <Paragraph size="small">{translate(I18N_KEYS.DESCRIPTION)}</Paragraph>
        </div>

        <FlexContainer flexDirection="column" sx={SX_STYLES.FORM_CONTAINER}>
          <EmailField id={CURRENT_CONTACT_EMAIL_INPUT_ID} readOnly label={translate(I18N_KEYS.CURRENT_EMAIL)} value={contactEmail}/>
          <FieldSpacer height={18}/>
          {contactEmail ? (<ChangeContactEmailForm effectiveContactEmail={contactEmail} onNavigateOut={onNavigateOut}/>) : null}
        </FlexContainer>
      </FlexContainer>
    </AccountSubPanel>);
};
