import { ReactNode } from "react";
import { useHistory } from "react-router-dom";
import { Paragraph, Tooltip } from "@dashlane/ui-components";
import { Button, Flex } from "@dashlane/design-system";
import { NotificationName } from "@dashlane/communication";
import { DataStatus } from "@dashlane/framework-react";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useNotificationSeen } from "../../../../libs/carbon/hooks/useNotificationStatus";
import { useIsAccountRecoveryEnabled } from "../../../../webapp/account/security-settings/hooks/useIsAccountRecoveryEnabled";
const I18N_KEYS = {
  POPOVER_TITLE: "team_account_recovery_popover_title",
  POPOVER_DESC: "team_account_recovery_popover_description",
  POPOVER_DISMISS: "team_account_recovery_popover_dismiss",
  POPOVER_GO_TO_SETTINGS_BUTTON: "team_account_recovery_popover_go_to_settings",
};
interface Props {
  settingsRoute: string;
  children: ReactNode;
}
export const AccountRecoveryTooltip = ({ settingsRoute, children }: Props) => {
  const { translate } = useTranslate();
  const history = useHistory();
  const isAccountRecoveryEnabled = useIsAccountRecoveryEnabled();
  const { unseen, setAsSeen } = useNotificationSeen(
    NotificationName.AccountRecoveryAvailableAdminTooltip
  );
  if (
    !unseen ||
    isAccountRecoveryEnabled.status !== DataStatus.Success ||
    isAccountRecoveryEnabled.data
  ) {
    return <div>{children}</div>;
  }
  return (
    <Tooltip
      sx={{
        width: "312px",
        minWidth: "312px",
        textAlign: "left",
      }}
      trigger="persist"
      placement="left"
      offset={[0, 30]}
      arrowSize={12}
      content={
        <Flex gap="8px" sx={{ padding: "8px" }}>
          <Paragraph
            size="large"
            as="h3"
            sx={{
              fontWeight: 600,
              color: "ds.text.inverse.catchy",
            }}
          >
            {translate(I18N_KEYS.POPOVER_TITLE)}
          </Paragraph>
          <Paragraph color="white" size="x-small">
            {translate(I18N_KEYS.POPOVER_DESC)}
          </Paragraph>
          <Flex
            gap="8px"
            justifyContent="flex-end"
            sx={{ width: "100%", marginTop: "8px" }}
          >
            <Button
              type="button"
              mood="neutral"
              size="small"
              data-testid="ar-tooltip-dismiss"
              onClick={() => setAsSeen()}
            >
              {translate(I18N_KEYS.POPOVER_DISMISS)}
            </Button>
            <Button
              type="button"
              mood="brand"
              size="small"
              data-testid="ar-tooltip-go-to-settings"
              onClick={() => {
                setAsSeen();
                history.push(settingsRoute);
              }}
            >
              {translate(I18N_KEYS.POPOVER_GO_TO_SETTINGS_BUTTON)}
            </Button>
          </Flex>
        </Flex>
      }
    >
      <div>{children}</div>
    </Tooltip>
  );
};
