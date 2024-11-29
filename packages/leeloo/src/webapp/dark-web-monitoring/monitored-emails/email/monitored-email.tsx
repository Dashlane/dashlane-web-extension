import { useCallback } from "react";
import {
  Button,
  Flex,
  Paragraph,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
import { UnlockFillIcon } from "@dashlane/ui-components";
import { DataLeaksEmailStatus } from "@dashlane/password-security-contracts";
import { NotificationName } from "@dashlane/communication";
import { useNotificationSeen } from "../../../../libs/carbon/hooks/useNotificationStatus";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { Avatar } from "../../../../libs/dashlane-style/avatar/avatar";
import { AvatarWithTooltip } from "./avatar-with-tooltip";
import { MonitoredEmailStatus } from "./monitored-email-status";
export interface MonitoredEmailProps {
  email: string;
  state: DataLeaksEmailStatus;
  handleOnRemoveClick: (email: string) => void;
  handleOnClosePendingNotification: () => void;
  showPendingTooltip: boolean;
  showPendingNotification: boolean;
  canEmailBeRemoved: boolean;
}
const I18N_KEYS = {
  REMOVE_EMAIL: "webapp_darkweb_email_remove_tooltip",
};
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  MONITORED_EMAIL: {
    display: "flex",
    alignItems: "center",
    boxShadow: "inset 0px -1px 0px ds.border.neutral.quiet.idle",
    padding: " 10px 0",
  },
  EMAIL_DATA: {
    display: "flex",
    flexDirection: "column",
    marginLeft: "16px",
    minWidth: 0,
    flex: "1 0 0",
    width: "100%",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
};
export const MonitoredEmail = ({
  email,
  state,
  handleOnRemoveClick,
  handleOnClosePendingNotification,
  showPendingTooltip,
  showPendingNotification,
  canEmailBeRemoved,
}: MonitoredEmailProps) => {
  const { translate } = useTranslate();
  const { unseen } = useNotificationSeen(
    NotificationName.DWMb2bAutoEnrollTooltip
  );
  const onRemoveClick = useCallback(
    () => handleOnRemoveClick(email),
    [handleOnRemoveClick, email]
  );
  return (
    <li sx={SX_STYLES.MONITORED_EMAIL}>
      {!canEmailBeRemoved && unseen ? (
        <AvatarWithTooltip email={email} />
      ) : (
        <Avatar email={email} size={36} />
      )}
      <div sx={SX_STYLES.EMAIL_DATA}>
        {canEmailBeRemoved ? (
          <Paragraph
            textStyle="ds.body.standard.regular"
            color="ds.text.neutral.catchy"
          >
            {email}
          </Paragraph>
        ) : (
          <Flex>
            <Paragraph
              textStyle="ds.body.standard.regular"
              color="ds.text.neutral.catchy"
            >
              {email}
            </Paragraph>
            <UnlockFillIcon size={16} sx={{ paddingTop: "3px" }} />
          </Flex>
        )}
        <MonitoredEmailStatus
          email={email}
          state={state}
          showPendingTooltip={showPendingTooltip}
          showPendingNotification={showPendingNotification}
          canEmailBeRemoved={canEmailBeRemoved}
          handleOnClosePendingNotification={handleOnClosePendingNotification}
        />
      </div>
      {canEmailBeRemoved ? (
        <Button
          size="small"
          mood="neutral"
          intensity="supershy"
          layout="iconOnly"
          icon="ActionCloseOutlined"
          tooltip={translate(I18N_KEYS.REMOVE_EMAIL)}
          aria-label={translate(I18N_KEYS.REMOVE_EMAIL)}
          onClick={onRemoveClick}
          disabled={!canEmailBeRemoved}
          data-testid={"tooltip-delete"}
        />
      ) : null}
    </li>
  );
};
