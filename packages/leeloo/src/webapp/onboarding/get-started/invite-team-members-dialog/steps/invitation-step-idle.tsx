import { Paragraph } from "@dashlane/design-system";
import { EmailListComponent } from "../invite-team-members-email-list";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { UseInviteTeamMembersDialogData } from "../hooks/use-invite-team-members-dialog-data";
const I18N_KEYS = {
  DIALOG_SUBTITLE_ADD_MEMBER:
    "onb_vault_get_started_invite_members_dialog_step_idle_subtitle",
  FOOTER_INVITE_IDLE:
    "onb_vault_get_started_invite_members_dialog_step_idle_footer_markup",
};
interface InvitationStepIdleProps {
  isLoading: boolean;
  dialogData: UseInviteTeamMembersDialogData;
}
export const InvitationStepIdle = ({
  isLoading,
  dialogData,
}: InvitationStepIdleProps) => {
  const { translate } = useTranslate();
  return (
    <div
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <Paragraph
        textStyle="ds.body.standard.regular"
        color="ds.text.neutral.quiet"
      >
        {translate(I18N_KEYS.DIALOG_SUBTITLE_ADD_MEMBER)}
      </Paragraph>

      <EmailListComponent isLoading={isLoading} dialogData={dialogData} />
      <Paragraph
        textStyle="ds.body.reduced.regular"
        color="ds.text.neutral.quiet"
      >
        {translate.markup(I18N_KEYS.FOOTER_INVITE_IDLE, {
          link: `__REDACTED__`,
        })}
      </Paragraph>
    </div>
  );
};
