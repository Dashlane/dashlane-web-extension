import { EmailField } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { UseInviteTeamMembersDialogData } from "./hooks/use-invite-team-members-dialog-data";
const I18N_KEYS = {
  EMAIL_PLACEHOLDER:
    "onb_vault_get_started_invite_members_dialog_step_idle_email",
  INVALID_EMAIL:
    "onb_vault_get_started_invite_members_dialog_step_idle_email_error",
};
interface EmailListComponentProps {
  isLoading: boolean;
  dialogData: UseInviteTeamMembersDialogData;
}
export const EmailListComponent = ({
  isLoading,
  dialogData: { emailFields, handleEmailChange },
}: EmailListComponentProps) => {
  const { translate } = useTranslate();
  return (
    <div
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {emailFields.map((email, index) => (
        <EmailField
          key={email.id}
          label={translate(I18N_KEYS.EMAIL_PLACEHOLDER)}
          type="email"
          value={email.value}
          onChange={(event) =>
            handleEmailChange(index, event.currentTarget.value)
          }
          disabled={isLoading}
          error={email.valid === false}
          feedback={
            email.valid === false
              ? translate(I18N_KEYS.INVALID_EMAIL)
              : undefined
          }
        />
      ))}
    </div>
  );
};
