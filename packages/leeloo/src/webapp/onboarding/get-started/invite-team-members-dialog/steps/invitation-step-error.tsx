import { Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  DIALOG_SUBTITLE_ERROR:
    "onb_vault_get_started_invite_members_dialog_step_failure_subtitle",
  FOOTER_ERROR:
    "onb_vault_get_started_invite_members_dialog_step_failure_footer",
};
export const InvitationStepError = () => {
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
        {translate(I18N_KEYS.DIALOG_SUBTITLE_ERROR)}
      </Paragraph>
      <Paragraph
        textStyle="ds.body.standard.regular"
        color="ds.text.neutral.quiet"
      >
        {translate(I18N_KEYS.FOOTER_ERROR)}
      </Paragraph>
    </div>
  );
};
