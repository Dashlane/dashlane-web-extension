import { DisplayField, Paragraph } from "@dashlane/design-system";
import { FieldSpacer } from "../../../../../libs/dashlane-style/field-spacer/field-spacer";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { AccountSubPanel } from "../../../account-subpanel/account-subpanel";
import { ChangeEmailForm } from "./change-email-form";
import { useAccountContactInfo } from "../../../hooks/use-contact-info";
import { useUserLogin } from "../../../hooks/use-user-login";
import { AccountManagementSection } from "../account-management-section";
export enum ChangeEmailFlow {
  CONTACT_EMAIL,
  LOGIN_EMAIL,
}
const I18N_KEYS = {
  [ChangeEmailFlow.CONTACT_EMAIL]: {
    HEADING: "webapp_change_contact_email_section_title",
    DESCRIPTION: "webapp_change_contact_email_section_description",
    CURRENT_EMAIL: "webapp_change_contact_email_current_email_label",
    NEW_EMAIL: "webapp_change_contact_email_new_email_label",
    CONFIRM_CHANGE: "webapp_change_contact_email_confirm_change_button",
  },
  [ChangeEmailFlow.LOGIN_EMAIL]: {
    HEADING: "webapp_change_login_email_section_title",
    DESCRIPTION: "webapp_change_login_email_section_description",
    CURRENT_EMAIL: "webapp_change_login_email_current_email_label",
    NEW_EMAIL: "webapp_change_login_email_new_email_label",
    CONFIRM_CHANGE: "webapp_change_contact_email_confirm_change_button",
    ACCEPTED_DOMAINS: "webapp_change_login_email_accepted_domains_label",
  },
};
const CURRENT_EMAIL_INPUT_ID = "account-management-change-email-current-id";
interface Props {
  flow: ChangeEmailFlow;
  onNavigateOut: () => void;
}
export const ChangeEmail = ({ flow, onNavigateOut }: Props) => {
  const { translate } = useTranslate();
  const contactInfo = useAccountContactInfo();
  const userLoginEmail = useUserLogin();
  const currentEmail =
    flow === ChangeEmailFlow.CONTACT_EMAIL
      ? contactInfo?.email ?? userLoginEmail
      : userLoginEmail;
  return (
    <AccountSubPanel
      headingText={translate(I18N_KEYS[flow].HEADING)}
      onNavigateOut={onNavigateOut}
    >
      <AccountManagementSection showBorder={false}>
        <Paragraph
          color="ds.text.neutral.standard"
          textStyle="ds.body.standard.regular"
        >
          {translate(I18N_KEYS[flow].DESCRIPTION)}
        </Paragraph>

        <div
          sx={{ display: "flex", flexDirection: "column", marginTop: "18px" }}
        >
          <DisplayField
            id={CURRENT_EMAIL_INPUT_ID}
            label={translate(I18N_KEYS[flow].CURRENT_EMAIL)}
            value={currentEmail}
            sx={{
              backgroundColor: "ds.container.agnostic.neutral.quiet",
              borderRadius: "8px",
              padding: "8px 12px",
            }}
          />

          <FieldSpacer height={18} />
          {currentEmail ? (
            <ChangeEmailForm
              flow={flow}
              effectiveCurrentEmail={currentEmail}
              onNavigateOut={onNavigateOut}
            />
          ) : null}
        </div>
      </AccountManagementSection>
    </AccountSubPanel>
  );
};
