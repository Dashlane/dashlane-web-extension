import { GroupThumbnail } from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
import { GroupInviteNotification } from "../types";
import { NotificationRow } from "../common/notification-row";
import { PendingGroupActions } from "./pending-group-actions";
const I18N_KEYS = {
  CANCEL: "webapp_sharing_notifications_cancel",
  CONFIRM_REFUSE_TEXT: "webapp_sharing_notifications_confirm_refuse_text",
  INVITED_BY: "webapp_sharing_notifications_invited_by",
  REFUSE: "webapp_sharing_notifications_refuse",
};
interface PendingGroupRowProps {
  notification: GroupInviteNotification;
  acceptPendingUserGroup: (userGroupId: string) => void;
  refusePendingUserGroup: (userGroupId: string) => void;
  removeUnsharedUserGroup: (userGroupId: string) => void;
  cancelRefusePendingUserGroup: (userGroupId: string) => void;
  confirmRefusePendingUserGroup: (userGroupId: string) => void;
  className?: string;
}
export const PendingGroupRow = (props: PendingGroupRowProps) => {
  const { className, notification } = props;
  const { translate } = useTranslate();
  const { userGroup } = notification;
  const { name, referrer } = userGroup;
  const referrerLabel = translate(I18N_KEYS.INVITED_BY, { referrer });
  return (
    <NotificationRow
      name={name}
      sharedBy={referrerLabel}
      icon={<GroupThumbnail type="user" />}
      actions={<PendingGroupActions {...props} />}
      notification={notification}
      type="group"
      className={className}
    />
  );
};
