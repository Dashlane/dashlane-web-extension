import { memo } from "react";
import { ShareableItemType } from "@dashlane/sharing-contracts";
import useTranslate from "../../../libs/i18n/useTranslate";
import { SharedItemNotification } from "../types";
import { NotificationRow } from "../common/notification-row";
import { PendingItemActions } from "./pending-item-actions";
const I18N_KEYS = {
  ACCEPT: "webapp_sharing_notifications_accept",
  CANCEL: "webapp_sharing_notifications_cancel",
  CONFIRM_REFUSE_TEXT: "webapp_sharing_notifications_confirm_refuse_text",
  SHARED_BY: "webapp_sharing_notifications_shared_by",
  REFUSE: "webapp_sharing_notifications_refuse",
};
interface PendingItemProps {
  notification: SharedItemNotification;
  acceptPendingItemGroup: (itemGroupId: string) => void;
  cancelRefusePendingItemGroup: (itemGroupId: string) => void;
  confirmRefusePendingItemGroup: (itemGroupId: string) => void;
  refusePendingItemGroup: (itemGroupId: string) => void;
  removeUnsharedItem: (itemGroupId: string) => void;
  routes: {
    userCredential: (id: string) => string;
    userSecureNote: (id: string) => string;
    userSecret: (id: string) => string;
  };
  className?: string;
}
const PendingItemRowComponent = (props: PendingItemProps) => {
  const { translate } = useTranslate();
  const { className, notification } = props;
  const { referrer, title, itemType } = notification.itemGroup;
  const sharedBy = translate(I18N_KEYS.SHARED_BY, { referrer });
  const url =
    itemType === ShareableItemType.Credential
      ? notification.itemGroup.url
      : undefined;
  const color =
    itemType === (ShareableItemType.SecureNote || ShareableItemType.Secret)
      ? notification.itemGroup.color
      : undefined;
  return (
    <NotificationRow
      key={notification.id}
      name={title}
      sharedBy={sharedBy}
      type="item"
      itemType={itemType}
      url={url}
      color={color}
      actions={<PendingItemActions {...props} />}
      notification={notification}
      className={className}
    />
  );
};
export const PendingItemRow = memo(PendingItemRowComponent);
