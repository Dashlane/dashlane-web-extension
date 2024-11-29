import { Flex } from "@dashlane/design-system";
import {
  ArrowDownIcon,
  Button,
  colors,
  Paragraph,
  ThemeUIStyleObject,
  Tooltip,
} from "@dashlane/ui-components";
import useTranslate from "../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  ACCOUNT_LABEL: "webapp_account_root_header",
  TOOLTIP: {
    CONFIRMATION_BUTTON: "manage_subscription_tooltip_confirmation_button",
    RECOVERY_DESCRTPTION:
      "manage_subscription_account_recovery_activation_tooltip_description_markup",
    RECOVERY_TITLE:
      "webapp_account_recovery_activation_sidemenu_notification_title",
  },
};
interface AccountButtonWithTooltipProps {
  accountButtonSx: ThemeUIStyleObject;
  color: string;
  hideRecoveryNotification: () => void;
}
export const AccountButtonWithTooltip = ({
  accountButtonSx,
  color,
  hideRecoveryNotification,
}: AccountButtonWithTooltipProps) => {
  const { translate } = useTranslate();
  return (
    <Tooltip
      placement="bottom"
      trigger="persist"
      portalTarget={document.body}
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "16px",
      }}
      content={
        <>
          <Paragraph
            color={colors.white}
            size="large"
            sx={{
              fontWeight: "18px",
              textAlign: "left",
            }}
          >
            {translate(I18N_KEYS.TOOLTIP.RECOVERY_TITLE)}
          </Paragraph>
          <Paragraph
            size="x-small"
            color={colors.white}
            sx={{
              textAlign: "left",
              padding: "8px 0px 16px 0px",
            }}
          >
            {translate.markup(I18N_KEYS.TOOLTIP.RECOVERY_DESCRTPTION)}
          </Paragraph>
          <Button
            size="small"
            sx={{ alignSelf: "flex-end" }}
            type="button"
            onClick={hideRecoveryNotification}
          >
            {translate(I18N_KEYS.TOOLTIP.CONFIRMATION_BUTTON)}
          </Button>
        </>
      }
    >
      <Button
        sx={{ ...accountButtonSx, color: color }}
        nature="ghost"
        onClick={hideRecoveryNotification}
        type="button"
      >
        <Flex sx={{ margin: "0 12px 0 0" }}>
          {translate(I18N_KEYS.ACCOUNT_LABEL)}
        </Flex>
        <ArrowDownIcon color={color} />
      </Button>
    </Tooltip>
  );
};
