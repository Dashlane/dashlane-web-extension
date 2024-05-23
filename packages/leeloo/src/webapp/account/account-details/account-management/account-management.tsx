import { Button, EmailField, jsx, Paragraph } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { redirect, useRouterGlobalSettingsContext } from 'libs/router';
import { AccountSubPanel } from 'webapp/account/account-subpanel/account-subpanel';
import { ActivePanel } from 'webapp/account/account-details/types';
import { useAccountContactInfo } from 'webapp/account/hooks/use-contact-info';
import { useUserLogin } from 'webapp/account/hooks/use-user-login';
import { logChangeContactEmailStartEvent } from 'webapp/account/account-details/account-management/change-contact-email/logs';
import { AccountManagementSection } from './account-management-section';
interface Props {
    onNavigateOut: () => void;
    changeActivePanel: (panel: ActivePanel) => void;
}
const I18N_KEYS = {
    PANEL_HEADING: 'webapp_account_management_panel_heading',
    LOGIN_EMAIL_LABEL: 'webapp_account_management_label_login_email',
    LOGIN_EMAIL_DESCRIPTION: 'webapp_account_management_description_login_email_markup',
    PRIVACY_SECTION_HEADING: 'webapp_account_management_privacy_section_heading',
    PRIVACY_EDIT_BUTTON: 'webapp_account_management_privacy_edit_button',
    PRIVACY_EDIT_A11Y_LABEL: 'webapp_account_management_privacy_edit_a11y_label',
    VERIFICATION_SECTION_HEADING: 'webapp_account_management_verification_section_heading',
    CONTACT_EMAIL_DESCRIPTION: 'webapp_account_management_contact_email_description',
    CONTACT_EMAIL_LABEL: 'webapp_account_management_label_contact_email',
    CHANGE_CONTACT_EMAIL_A11Y_LABEL: 'webapp_account_management_change_contact_email_a11y_label',
    CHANGE_CONTACT_EMAIL_BUTTON: 'webapp_account_management_change_contact_email_button',
};
export const AccountManagement = ({ onNavigateOut, changeActivePanel, }: Props) => {
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const handleChangeContactEmailClick = () => {
        logChangeContactEmailStartEvent();
        changeActivePanel(ActivePanel.ChangeContactEmail);
    };
    const contactInfo = useAccountContactInfo();
    const userLogin = useUserLogin();
    return (<AccountSubPanel headingText={translate(I18N_KEYS.PANEL_HEADING)} onNavigateOut={onNavigateOut}>
      <AccountManagementSection showBorder={false}>
        <EmailField label={translate(I18N_KEYS.LOGIN_EMAIL_LABEL)} readOnly id="account-login-email" value={userLogin}/>
        <Paragraph color="ds.text.neutral.quiet">
          {translate.markup(I18N_KEYS.LOGIN_EMAIL_DESCRIPTION, {}, { linkTarget: '_blank' })}
        </Paragraph>
      </AccountManagementSection>
      <AccountManagementSection showBorder={true} sectionTitle={translate(I18N_KEYS.PRIVACY_SECTION_HEADING)}>
        <Button mood="neutral" intensity="quiet" size="small" role="link" aria-label={translate(I18N_KEYS.PRIVACY_EDIT_A11Y_LABEL)} onClick={() => redirect(routes.privacySettings)}>
          {translate(I18N_KEYS.PRIVACY_EDIT_BUTTON)}
        </Button>
      </AccountManagementSection>
      <AccountManagementSection showBorder={true} sectionTitle={translate(I18N_KEYS.VERIFICATION_SECTION_HEADING)}>
        <EmailField label={translate(I18N_KEYS.CONTACT_EMAIL_LABEL)} readOnly id="account-contact-email" value={contactInfo?.email ?? userLogin}/>
        <Paragraph color="ds.text.neutral.quiet" sx={{ marginBottom: '16px' }}>
          {translate(I18N_KEYS.CONTACT_EMAIL_DESCRIPTION)}
        </Paragraph>
        <Button mood="neutral" intensity="quiet" onClick={handleChangeContactEmailClick} sx={{
            marginBottom: '32px',
        }} aria-label={translate(I18N_KEYS.CHANGE_CONTACT_EMAIL_A11Y_LABEL)}>
          {translate(I18N_KEYS.CHANGE_CONTACT_EMAIL_BUTTON)}
        </Button>
      </AccountManagementSection>
    </AccountSubPanel>);
};
