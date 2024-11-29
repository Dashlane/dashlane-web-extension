import { memo, useCallback, useEffect, useMemo } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { useModuleCommands } from "@dashlane/framework-react";
import { syncApi } from "@dashlane/sync-contracts";
import {
  Button,
  DSCSSObject,
  DSStyleObject,
  Heading,
  List,
  mergeSx,
} from "@dashlane/design-system";
import {
  CredentialItemView,
  ListResults,
  NoteItemView,
} from "@dashlane/communication";
import { Trigger } from "@dashlane/hermes";
import { useRouterGlobalSettingsContext } from "../../libs/router/RouterGlobalSettingsProvider";
import useTranslate from "../../libs/i18n/useTranslate";
import { Header } from "../components/header/header";
import { HeaderAccountMenu } from "../components/header/header-account-menu";
import { Connected as NotificationsDropdown } from "../bell-notifications/connected";
import {
  isGroupInviteNotification,
  isNotificationAcceptable,
  isNotificationAccepted,
  isNotificationPending,
  isNotificationPendingAccepted,
  isNotificationVisible,
  isSharedCollectionNotification,
  isSharedItemNotification,
  NotificationStatus,
  SharingNotification,
} from "./types";
import { useSharingNotifications } from "./use-sharing-notifications";
import { PendingGroupRow } from "./groups/pending-group-row";
import { PendingCollectionRow } from "./collections/pending-collection-row";
import { PendingItemRow } from "./items/pending-item-row";
import { SharingNotificationsEmpty } from "./sharing-notifications-empty";
import { useLiveItemSubscription } from "./use-live-item-subscription";
import { useNotificationHandlers } from "./use-notification-handlers";
type VaultLiveListResults =
  | ListResults<CredentialItemView>
  | ListResults<NoteItemView>;
const containerSx: DSStyleObject = {
  width: "100%",
};
const fullPageSx: DSStyleObject = {
  position: "relative",
  height: "100vh",
  overflowY: "scroll",
};
const notificationsWrapperSx: DSStyleObject = {
  maxHeight: "542px",
  minHeight: "176px",
  overflowY: "auto",
};
const I18N_KEYS = {
  ACCEPT_ALL: "webapp_sharing_notifications_accept_all",
  EMPTY_STATE_TEXT: "webapp_sharing_notifications_empty_state_text",
  HEADER: "webapp_sharing_notifications_header",
};
interface SharingNotificationsProps {
  fullPage: boolean;
  triggerSync: boolean;
}
interface PendingNotificationProps {
  notifications: SharingNotification[];
  acceptPendingItemGroup: (itemGroupId: string) => void;
  acceptPendingCollection: (userGroupId: string) => void;
  acceptPendingUserGroup: (userGroupId: string) => void;
  cancelDeclineNotification: (itemGroupId: string) => void;
  confirmRefusePendingItemGroup: (itemGroupId: string) => void;
  confirmRefusePendingUserGroup: (userGroupId: string) => void;
  softDeclineNotification: (itemGroupId: string) => void;
  removeNotification: (itemGroupId: string) => void;
  refusePendingCollection: (userGroupId: string) => void;
  routes: {
    userCredential: (id: string) => string;
    userSecureNote: (id: string) => string;
    userSecret: (id: string) => string;
    userCollection: (id: string) => string;
  };
}
const PendingNotificationRowComponent = ({
  data,
  index,
  style,
}: ListChildComponentProps<PendingNotificationProps>) => {
  const notification = data.notifications[index];
  if (notification.type === "item") {
    return (
      <PendingItemRow
        key={notification.id}
        notification={notification}
        acceptPendingItemGroup={data.acceptPendingItemGroup}
        cancelRefusePendingItemGroup={data.cancelDeclineNotification}
        confirmRefusePendingItemGroup={data.confirmRefusePendingItemGroup}
        refusePendingItemGroup={data.softDeclineNotification}
        removeUnsharedItem={data.removeNotification}
        routes={data.routes}
        sx={style as DSCSSObject}
      />
    );
  }
  if (notification.type === "collection") {
    return (
      <PendingCollectionRow
        key={notification.id}
        notification={notification}
        acceptPendingCollection={data.acceptPendingCollection}
        cancelRefusePendingCollection={data.cancelDeclineNotification}
        confirmRefusePendingCollection={data.refusePendingCollection}
        refusePendingCollection={data.softDeclineNotification}
        removeUnsharedCollection={data.removeNotification}
        routes={data.routes}
        sx={style as DSCSSObject}
      />
    );
  }
  if (notification.type === "group") {
    return (
      <PendingGroupRow
        key={notification.id}
        notification={notification}
        acceptPendingUserGroup={data.acceptPendingUserGroup}
        cancelRefusePendingUserGroup={data.cancelDeclineNotification}
        confirmRefusePendingUserGroup={data.confirmRefusePendingUserGroup}
        refusePendingUserGroup={data.softDeclineNotification}
        removeUnsharedUserGroup={data.removeNotification}
        sx={style as DSCSSObject}
      />
    );
  }
  return null;
};
const PendingNotificationRow = memo(PendingNotificationRowComponent);
export const SharingNotifications = (props: SharingNotificationsProps) => {
  const { triggerSync } = props;
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const {
    isLoading,
    notifications,
    updateNotificationStatus,
    removeSharingNotifications,
  } = useSharingNotifications();
  const {
    acceptPendingItemGroup,
    acceptPendingCollection,
    acceptPendingUserGroup,
    cancelDeclineNotification,
    confirmRefusePendingUserGroup,
    confirmRefusePendingItemGroup,
    softDeclineNotification,
    refusePendingCollection,
    removeNotification,
  } = useNotificationHandlers({
    isLoading,
    notifications,
    updateNotificationStatus,
    removeSharingNotifications,
  });
  const { sync } = useModuleCommands(syncApi);
  const itemNotifications = useMemo(
    () => notifications.filter(isSharedItemNotification),
    [notifications]
  );
  const pendingAcceptedItemNotifications = useMemo(
    () => itemNotifications.filter(isNotificationPendingAccepted),
    [itemNotifications]
  );
  const acceptedItemNotifications = useMemo(
    () => itemNotifications.filter(isNotificationAccepted),
    [itemNotifications]
  );
  useEffect(() => {
    if (triggerSync) {
      sync({ trigger: Trigger.Sharing });
    }
  }, [sync, triggerSync]);
  useLiveItemSubscription(
    pendingAcceptedItemNotifications,
    useCallback(
      (listResults: VaultLiveListResults) => {
        const itemIdsInVault = listResults.items.map(({ id }) => id);
        const anyItems =
          itemIdsInVault.length > 0 &&
          pendingAcceptedItemNotifications.length > 0;
        if (anyItems) {
          const notificationsConfirmedInVault =
            pendingAcceptedItemNotifications.filter(
              (notification) =>
                !itemIdsInVault.includes(notification.itemGroup.vaultItemId)
            );
          updateNotificationStatus(
            notificationsConfirmedInVault.map(({ id }) => id),
            NotificationStatus.Accepted
          );
        }
      },
      [pendingAcceptedItemNotifications, updateNotificationStatus]
    )
  );
  useLiveItemSubscription(
    acceptedItemNotifications,
    useCallback(
      (listResults: VaultLiveListResults) => {
        const noteIdsInVault = listResults.items.map(({ id }) => id);
        if (acceptedItemNotifications.length > 0) {
          const notificationsMissingInVault = acceptedItemNotifications.filter(
            (notification) =>
              !noteIdsInVault.includes(notification.itemGroup.vaultItemId)
          );
          removeSharingNotifications(
            notificationsMissingInVault.map(({ id }) => id)
          );
        }
      },
      [acceptedItemNotifications, removeSharingNotifications]
    )
  );
  const visibleNotifications = notifications.filter(isNotificationVisible);
  const anyVisibleNotifications = visibleNotifications.length > 0;
  const showAcceptAllButton = visibleNotifications.some(
    isNotificationAcceptable
  );
  const acceptAll = () => {
    const pendingNotifications = notifications.filter(isNotificationPending);
    const pendingNotificationIds = pendingNotifications.map(({ id }) => id);
    if (pendingNotificationIds.length === 0) {
      return;
    }
    updateNotificationStatus(
      pendingNotificationIds,
      NotificationStatus.AcceptInProgress
    );
    const pendingItemGroupNotifications = pendingNotifications.filter(
      isSharedItemNotification
    );
    for (const pendingItemGroupNotification of pendingItemGroupNotifications) {
      acceptPendingItemGroup(pendingItemGroupNotification.id);
    }
    const pendingUserGroupNotifications = pendingNotifications.filter(
      isGroupInviteNotification
    );
    for (const pendingUserGroupNotification of pendingUserGroupNotifications) {
      acceptPendingUserGroup(pendingUserGroupNotification.id);
    }
    const pendingCollectionNotifications = pendingNotifications.filter(
      isSharedCollectionNotification
    );
    for (const pendingCollectionNotification of pendingCollectionNotifications) {
      acceptPendingCollection(pendingCollectionNotification.id, false);
    }
  };
  const listHeight = useMemo(
    () =>
      visibleNotifications.length < 10
        ? 56 * visibleNotifications.length
        : 542 - 80,
    [visibleNotifications.length]
  );
  const itemData = useMemo(() => {
    return {
      acceptPendingItemGroup,
      acceptPendingCollection,
      acceptPendingUserGroup,
      cancelDeclineNotification,
      confirmRefusePendingItemGroup,
      confirmRefusePendingUserGroup,
      notifications: visibleNotifications,
      removeNotification,
      refusePendingCollection,
      routes,
      softDeclineNotification,
    };
  }, [
    acceptPendingCollection,
    acceptPendingItemGroup,
    acceptPendingUserGroup,
    cancelDeclineNotification,
    confirmRefusePendingItemGroup,
    confirmRefusePendingUserGroup,
    refusePendingCollection,
    removeNotification,
    routes,
    softDeclineNotification,
    visibleNotifications,
  ]);
  return (
    <div sx={{ backgroundColor: "ds.container.agnostic.neutral.standard" }}>
      {props.fullPage ? (
        <Header
          endWidget={
            <>
              <HeaderAccountMenu />
              <NotificationsDropdown />
            </>
          }
          data-testid="sharing-notifications-fullpage-header"
        />
      ) : null}
      <div
        sx={props.fullPage ? mergeSx([containerSx, fullPageSx]) : containerSx}
      >
        {anyVisibleNotifications ? (
          <div
            sx={!props.fullPage ? notificationsWrapperSx : undefined}
            data-testid="pending-invitations-list"
          >
            <div
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "32px 32px 16px",
              }}
            >
              <Heading
                as="h2"
                textStyle="ds.title.section.medium"
                color="ds.text.neutral.catchy"
                sx={{ marginBottom: "4px" }}
              >
                {translate(I18N_KEYS.HEADER)}
              </Heading>
              {showAcceptAllButton ? (
                <Button
                  mood="brand"
                  intensity="supershy"
                  size="small"
                  onClick={acceptAll}
                >
                  {translate(I18N_KEYS.ACCEPT_ALL)}
                </Button>
              ) : null}
            </div>
            <div
              sx={{
                height: listHeight,
                maxHeight: "542px",
                minHeight: "56px",
              }}
            >
              <AutoSizer>
                {({ height, width }) => {
                  return (
                    <FixedSizeList<PendingNotificationProps>
                      height={height}
                      width={width}
                      innerElementType={List}
                      itemSize={56}
                      overscanCount={50}
                      itemCount={visibleNotifications.length}
                      itemData={itemData}
                    >
                      {PendingNotificationRow}
                    </FixedSizeList>
                  );
                }}
              </AutoSizer>
            </div>
          </div>
        ) : (
          <SharingNotificationsEmpty
            isLoading={isLoading}
            fullPage={props.fullPage}
          />
        )}
      </div>
    </div>
  );
};
