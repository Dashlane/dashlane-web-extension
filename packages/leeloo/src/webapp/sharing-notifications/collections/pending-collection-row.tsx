import { GroupThumbnail } from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
import { SharedCollectionNotification } from "../types";
import { NotificationRow } from "../common/notification-row";
import { PendingCollectionActions } from "./pending-collection-actions";
const I18N_KEYS = {
  CANCEL: "webapp_sharing_notifications_cancel",
  CONFIRM_REFUSE_TEXT: "webapp_sharing_notifications_confirm_refuse_text",
  INVITED_BY: "webapp_sharing_notifications_invited_by",
  REFUSE: "webapp_sharing_notifications_refuse",
};
interface PendingCollectionRowProps {
  notification: SharedCollectionNotification;
  acceptPendingCollection: (userGroupId: string) => void;
  refusePendingCollection: (userGroupId: string) => void;
  removeUnsharedCollection: (userGroupId: string) => void;
  cancelRefusePendingCollection: (userGroupId: string) => void;
  confirmRefusePendingCollection: (userGroupId: string) => void;
  routes: {
    userCollection: (id: string) => string;
  };
  className?: string;
}
export const PendingCollectionRow = (props: PendingCollectionRowProps) => {
  const { className, notification } = props;
  const { translate } = useTranslate();
  const { collection } = notification;
  const { name, referrer } = collection;
  const referrerLabel = translate(I18N_KEYS.INVITED_BY, { referrer });
  return (
    <NotificationRow
      name={name}
      sharedBy={referrerLabel}
      icon={<GroupThumbnail type="collection" />}
      actions={<PendingCollectionActions {...props} />}
      notification={notification}
      type="collection"
      className={className}
    />
  );
};
