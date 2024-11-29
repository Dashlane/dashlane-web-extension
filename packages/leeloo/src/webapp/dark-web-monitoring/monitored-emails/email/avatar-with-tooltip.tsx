import { Button, colors, Paragraph, Tooltip } from "@dashlane/ui-components";
import { NotificationName } from "@dashlane/communication";
import { Avatar } from "../../../../libs/dashlane-style/avatar/avatar";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useNotificationSeen } from "../../../../libs/carbon/hooks/useNotificationStatus";
const I18N_KEYS = {
  BUSINESS_EMAIL_TOOLTIP_DESCRIPTION:
    "webapp_darkweb_bussiness_email_monitoring_description_markup",
  BUSINESS_EMAIL_TOOLTIP_TITLE:
    "webapp_darkweb_bussiness_email_monitoring_title",
  BUTTON_OK_GOT_IT: "webapp_darkweb_bussiness_email_notification_ok",
};
export interface AvatarWithTooltipProps {
  email: string;
}
export const AvatarWithTooltip = ({ email }: AvatarWithTooltipProps) => {
  const { translate } = useTranslate();
  const { setAsSeen } = useNotificationSeen(
    NotificationName.DWMb2bAutoEnrollTooltip
  );
  return (
    <Tooltip
      placement="left"
      trigger="persist"
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        zIndex: 1,
      }}
      content={
        <>
          <Paragraph
            size="large"
            color={colors.white}
            sx={{
              textAlign: "left",
              fontWeight: "bold",
            }}
          >
            {translate(I18N_KEYS.BUSINESS_EMAIL_TOOLTIP_TITLE)}
          </Paragraph>
          <Paragraph
            size="x-small"
            color={colors.white}
            sx={{
              textAlign: "left",
              padding: "8px 0px 16px 0px",
            }}
          >
            {translate.markup(I18N_KEYS.BUSINESS_EMAIL_TOOLTIP_DESCRIPTION, {
              email,
            })}
          </Paragraph>
          <Button
            size="small"
            sx={{ alignSelf: "flex-end" }}
            type="button"
            onClick={setAsSeen}
          >
            {translate(I18N_KEYS.BUTTON_OK_GOT_IT)}
          </Button>
        </>
      }
    >
      <div>
        <Avatar email={email} size={36} />
      </div>
    </Tooltip>
  );
};
