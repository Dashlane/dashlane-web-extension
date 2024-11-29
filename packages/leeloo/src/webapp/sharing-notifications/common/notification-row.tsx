import { memo, useMemo } from "react";
import {
  Flex,
  ItemHeader,
  ListItem,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
import { ShareableItemType } from "@dashlane/sharing-contracts";
import useTranslate from "../../../libs/i18n/useTranslate";
import {
  isNotificationDisabled,
  NotificationStatus,
  SharingNotification,
} from "../types";
import { ItemLogo } from "../items/item-logo";
const I18N_KEYS = {
  CONFIRM_REFUSE_TEXT: "webapp_sharing_notifications_confirm_refuse_text",
  GROUPS: "webapp_sharing_notifications_groups",
  COLLECTIONS: "webapp_sharing_notifications_collections",
  LOGINS: "webapp_sharing_notifications_logins",
  SECURE_NOTES: "webapp_sharing_notifications_secure_notes",
  SECRETS: "webapp_sharing_notifications_secrets",
};
interface NotificationRowProps {
  actions: JSX.Element | null;
  name: string;
  sharedBy: string;
  notification: SharingNotification;
  type: "item" | "group" | "collection" | ShareableItemType;
  itemType?: ShareableItemType;
  icon?: JSX.Element;
  url?: string;
  color?: string;
  className?: string;
}
export const NotificationRow = memo((props: NotificationRowProps) => {
  const {
    notification,
    actions,
    icon,
    name,
    sharedBy,
    type,
    itemType,
    url,
    color,
    className,
  } = props;
  const { translate } = useTranslate();
  const { status } = notification;
  const disabled = isNotificationDisabled(notification);
  const rowStyles: ThemeUIStyleObject = {
    padding: "0 32px",
  };
  const description = useMemo(() => {
    const sharedStatus =
      status === NotificationStatus.ConfirmRefusal ? "" : sharedBy;
    if (type === "collection") {
      return `${translate(I18N_KEYS.COLLECTIONS)} • ${sharedStatus}`;
    }
    if (type === "group") {
      return `${translate(I18N_KEYS.GROUPS)} • ${sharedStatus}`;
    }
    if (itemType === ShareableItemType.Secret) {
      return `${translate(I18N_KEYS.SECRETS)} • ${sharedStatus}`;
    }
    if (itemType === ShareableItemType.SecureNote) {
      return `${translate(I18N_KEYS.SECURE_NOTES)} • ${sharedStatus}`;
    }
    return `${translate(I18N_KEYS.LOGINS)} • ${sharedStatus}`;
  }, [itemType, sharedBy, status, translate, type]);
  return (
    <ListItem sx={rowStyles} className={className}>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        sx={{
          overflow: "hidden",
          position: "relative",
          height: "56px",
          flex: "1",
          flexWrap: "nowrap",
        }}
      >
        <Flex
          alignItems="center"
          justifyContent="flex-start"
          flexWrap="nowrap"
          sx={{ minWidth: "0" }}
        >
          <ItemHeader
            thumbnail={
              icon ? (
                icon
              ) : (
                <ItemLogo
                  itemType={itemType as ShareableItemType}
                  url={url}
                  color={color}
                />
              )
            }
            title={
              status === NotificationStatus.ConfirmRefusal
                ? translate(I18N_KEYS.CONFIRM_REFUSE_TEXT)
                : name
            }
            description={description}
            sx={{ opacity: disabled ? 0.5 : 1, overflow: "hidden" }}
          />
        </Flex>
        <div sx={{ marginRight: "5px" }}>{actions}</div>
      </Flex>
    </ListItem>
  );
});
NotificationRow.displayName = "NotificationRow";
