import { useFeatureFlip } from "@dashlane/framework-react";
import { AccountManagementFeatureFlips } from "@dashlane/account-contracts";
import { Button, DisplayField, Icon, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import {
  redirect,
  useRouterGlobalSettingsContext,
} from "../../../../libs/router";
import { AccountSubPanel } from "../../account-subpanel/account-subpanel";
import { ActivePanel } from "../types";
import { useAccountContactInfo } from "../../hooks/use-contact-info";
import { useUserLogin } from "../../hooks/use-user-login";
import { logChangeContactEmailStartEvent } from "./change-email/logs";
import { AccountManagementSection } from "./account-management-section";
import { SettingTab } from "../../../settings/types";
interface Props {
  onNavigateOut: () => void;
  changeActivePanel: (panel: ActivePanel) => void;
}
const I18N_KEYS = {
  PANEL_HEADING: "webapp_account_management_panel_heading",
  LOGIN_EMAIL_LABEL: "webapp_account_management_label_login_email",
  LOGIN_EMAIL_DESCRIPTION:
    "webapp_account_management_description_login_email_markup",
  PRIVACY_SECTION_HEADING: "webapp_account_management_privacy_section_heading",
  PRIVACY_EDIT_BUTTON: "webapp_account_management_privacy_edit_button",
  PRIVACY_EDIT_A11Y_LABEL: "webapp_account_management_privacy_edit_a11y_label",
  VERIFICATION_SECTION_HEADING:
    "webapp_account_management_verification_section_heading",
  CONTACT_EMAIL_DESCRIPTION:
    "webapp_account_management_contact_email_description",
  CONTACT_EMAIL_LABEL: "webapp_account_management_label_contact_email",
  CHANGE_CONTACT_EMAIL_A11Y_LABEL:
    "webapp_account_management_change_contact_email_a11y_label",
  CHANGE_CONTACT_EMAIL_BUTTON:
    "webapp_account_management_change_contact_email_button",
  CHANGE_LOGIN_EMAIL_LABEL: "webapp_change_login_email_section_title",
};
export const AccountManagement = ({
  onNavigateOut,
  changeActivePanel,
}: Props) => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const hasChangeLoginEmailFeatureFlip = useFeatureFlip(
    AccountManagementFeatureFlips.ChangeLoginEmailWebDev
  );
  const handleChangeContactEmailClick = () => {
    logChangeContactEmailStartEvent();
    changeActivePanel(ActivePanel.ChangeContactEmail);
  };
  const handleChangeLoginEmailClick = () => {
    changeActivePanel(ActivePanel.ChangeLoginEmail);
  };
  const contactInfo = useAccountContactInfo();
  const userLogin = useUserLogin();
  return (
    <AccountSubPanel
      headingText={translate(I18N_KEYS.PANEL_HEADING)}
      onNavigateOut={onNavigateOut}
    >
      <AccountManagementSection
        sectionTitle={translate(I18N_KEYS.LOGIN_EMAIL_LABEL)}
        showBorder={false}
      >
        <DisplayField
          label={translate(I18N_KEYS.LOGIN_EMAIL_LABEL)}
          labelPersists={false}
          id="account-login-email"
          value={userLogin}
          actions={[
            <Button
              onClick={handleChangeLoginEmailClick}
              disabled={!hasChangeLoginEmailFeatureFlip}
              key="edit-login-email"
              aria-label={translate(I18N_KEYS.CHANGE_LOGIN_EMAIL_LABEL)}
              icon={<Icon name="ActionEditOutlined" />}
              intensity="supershy"
              layout="iconOnly"
            />,
          ]}
          sx={{
            backgroundColor: "ds.container.agnostic.neutral.quiet",
            borderRadius: "8px",
            padding: "8px 12px",
          }}
        />
        {!hasChangeLoginEmailFeatureFlip ? (
          <Paragraph color="ds.text.neutral.quiet">
            {translate.markup(
              I18N_KEYS.LOGIN_EMAIL_DESCRIPTION,
              {},
              { linkTarget: "_blank" }
            )}
          </Paragraph>
        ) : null}
      </AccountManagementSection>
      <AccountManagementSection
        showBorder={true}
        sectionTitle={translate(I18N_KEYS.PRIVACY_SECTION_HEADING)}
      >
        <Button
          mood="neutral"
          intensity="quiet"
          size="small"
          role="link"
          aria-label={translate(I18N_KEYS.PRIVACY_EDIT_A11Y_LABEL)}
          onClick={() => redirect(routes.userSettingsTab(SettingTab.Privacy))}
        >
          {translate(I18N_KEYS.PRIVACY_EDIT_BUTTON)}
        </Button>
      </AccountManagementSection>
      <AccountManagementSection
        showBorder={true}
        sectionTitle={translate(I18N_KEYS.VERIFICATION_SECTION_HEADING)}
      >
        <DisplayField
          label={translate(I18N_KEYS.CONTACT_EMAIL_LABEL)}
          id="account-contact-email"
          value={contactInfo?.email ?? userLogin}
          actions={[
            <Button
              onClick={handleChangeContactEmailClick}
              key="edit-contact-email"
              aria-label={translate(I18N_KEYS.CHANGE_CONTACT_EMAIL_A11Y_LABEL)}
              icon={<Icon name="ActionEditOutlined" />}
              intensity="supershy"
              layout="iconOnly"
            />,
          ]}
          sx={{
            backgroundColor: "ds.container.agnostic.neutral.quiet",
            borderRadius: "8px",
            padding: "4px 12px",
          }}
        />
        <Paragraph color="ds.text.neutral.quiet">
          {translate(I18N_KEYS.CONTACT_EMAIL_DESCRIPTION)}
        </Paragraph>
      </AccountManagementSection>
    </AccountSubPanel>
  );
};
