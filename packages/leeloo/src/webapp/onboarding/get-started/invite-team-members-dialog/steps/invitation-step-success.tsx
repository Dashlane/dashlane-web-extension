import illustration from "@dashlane/design-system/assets/illustrations/easy-secure-sharing@2x-light.webp";
import { Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  FOOTER_COMPLETED:
    "onb_vault_get_started_invite_members_dialog_step_success_footer",
  DIALOG_SUBTITLE_MESSAGE_SENT:
    "onb_vault_get_started_invite_members_dialog_step_success_message",
};
export const InvitationStepSuccess = () => {
  const { translate } = useTranslate();
  return (
    <div
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <div
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "ds.container.expressive.positive.quiet.disabled",
          borderRadius: "12px",
          height: "200px",
        }}
      >
        <img
          sx={{
            userSelect: "none",
            pointerEvents: "none",
            width: "300px",
            height: "200px",
            maxWidth: "100%",
            margin: "0 auto",
          }}
          alt=""
          aria-hidden={true}
          src={illustration}
        />
      </div>
      <Paragraph
        textStyle="ds.body.standard.regular"
        color="ds.text.neutral.standard"
      >
        {translate(I18N_KEYS.DIALOG_SUBTITLE_MESSAGE_SENT)}
      </Paragraph>
      <Paragraph
        textStyle="ds.body.standard.regular"
        color="ds.text.neutral.standard"
      >
        {translate(I18N_KEYS.FOOTER_COMPLETED)}
      </Paragraph>
    </div>
  );
};
