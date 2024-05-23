import { Fragment, useCallback, useEffect, useMemo, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useFeatureFlips, useModuleCommands } from '@dashlane/framework-react';
import { syncApi } from '@dashlane/sync-contracts';
import { Button } from '@dashlane/design-system';
import { Eyebrow, FlexContainer, Heading, jsx, mergeSx, ThemeUIStyleObject, } from '@dashlane/ui-components';
import { CredentialItemView, ListResults, NoteItemView, SharingResponseResult, SharingResponseStatus, } from '@dashlane/communication';
import { sharingInvitesApi } from '@dashlane/sharing-contracts';
import { isFailure, isSuccess } from '@dashlane/framework-types';
import { Trigger } from '@dashlane/hermes';
import { sendSharingResponse } from 'libs/carbon/triggers';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { carbonConnector } from 'libs/carbon/connector';
import useTranslate from 'libs/i18n/useTranslate';
import { Header } from 'webapp/components/header/header';
import { HeaderAccountMenu } from 'webapp/components/header/header-account-menu';
import { Connected as NotificationsDropdown } from 'webapp/bell-notifications/connected';
import { PendingItemRow } from './items/pending-item-row';
import { isGroupInviteNotification, isNotificationAcceptable, isNotificationAccepted, isNotificationNew, isNotificationPending, isNotificationPendingAccepted, isNotificationVisible, isSharedCollectionNotification, isSharedItemNotification, NotificationStatus, SharedItemNotification, } from './types';
import { useSharingNotifications } from './use-sharing-notifications';
import { PendingGroupRow } from './groups/pending-group-row';
import { PendingCollectionRow } from './collections/pending-collection-row';
import { getItemGroupSharingResponseData, getItemIdsByKwType, } from './helpers/helpers';
import { SharingNotificationsEmpty } from './sharing-notifications-empty';
import disappear from './disappear.css';
import { useLiveItemSubscription } from './use-live-item-subscription';
type CarbonUnsubscribe = () => void;
type VaultLiveListResults = ListResults<CredentialItemView> | ListResults<NoteItemView>;
const containerSx: ThemeUIStyleObject = {
    width: '100%',
};
const fullPageSx: ThemeUIStyleObject = {
    position: 'relative',
    height: '100vh',
    overflowY: 'scroll',
};
const notificationsWrapperSx: ThemeUIStyleObject = {
    maxHeight: '542px',
    minHeight: '176px',
    overflowY: 'auto',
};
const TEMPORARY_STATUS_TIMEOUT = 2000;
const I18N_KEYS = {
    ACCEPT_ALL: 'webapp_sharing_notifications_accept_all',
    EMPTY_STATE_TEXT: 'webapp_sharing_notifications_empty_state_text',
    GROUPS: 'webapp_sharing_notifications_groups',
    HEADER: 'webapp_sharing_notifications_header',
    PASSWORDS_AND_SECURE_NOTES: 'webapp_sharing_notifications_passwords_and_secure_notes',
    COLLECTIONS: 'webapp_sharing_notifications_collections'
};
interface SharingNotificationsProps {
    fullPage: boolean;
    triggerSync: boolean;
}
export const SharingNotifications = (props: SharingNotificationsProps) => {
    const { triggerSync } = props;
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const { isLoading, notifications, updateNotificationStatus, removeSharingNotifications, } = useSharingNotifications();
    const { sync } = useModuleCommands(syncApi);
    const { acceptCollectionInvite, refuseCollectionInvite, refuseItemGroupInvite, refuseUserGroupInvite, } = useModuleCommands(sharingInvitesApi);
    const retrievedFeatureFlips = useFeatureFlips();
    const shouldShowCollections = Boolean(retrievedFeatureFlips.data?.['sharing_web_collectionsSharing']);
    const itemNotifications = useMemo(() => notifications.filter(isSharedItemNotification), [notifications]);
    const pendingAcceptedItemNotifications = useMemo(() => itemNotifications.filter(isNotificationPendingAccepted), [itemNotifications]);
    const acceptedItemNotifications = useMemo(() => itemNotifications.filter(isNotificationAccepted), [itemNotifications]);
    const delayTimers = useRef<number[]>([]);
    useEffect(() => {
        if (triggerSync) {
            sync({ trigger: Trigger.Sharing });
        }
    }, [sync, triggerSync]);
    useEffect(() => {
        const newNotifications = notifications.filter(isNotificationNew);
        const unseenItemGroupIds = newNotifications
            .filter(isSharedItemNotification)
            .filter((notification) => !notification.itemGroup.seen)
            .map((notification) => notification.itemGroup.itemGroupId);
        const unseenUserGroupIds = newNotifications
            .filter(isGroupInviteNotification)
            .filter((notification) => !notification.userGroup.seen)
            .map((notification) => notification.userGroup.groupId);
        const unseenCollectionIds = shouldShowCollections
            ? newNotifications
                .filter(isSharedCollectionNotification)
                .filter((notification) => !notification.collection.seen)
                .map((notification) => notification.collection.uuid)
            : [];
        if (unseenItemGroupIds.length > 0 ||
            unseenUserGroupIds.length > 0 ||
            unseenCollectionIds.length > 0) {
            carbonConnector.setPendingElementsAsSeen({
                pendingItemGroupIds: unseenItemGroupIds,
                pendingUserGroupIds: unseenUserGroupIds,
            });
            const unseenIds = [
                ...unseenItemGroupIds,
                ...unseenUserGroupIds,
                ...unseenCollectionIds,
            ];
            delayTimers.current.push(window.setTimeout(() => {
                updateNotificationStatus(unseenIds, NotificationStatus.Pending, NotificationStatus.New);
            }, TEMPORARY_STATUS_TIMEOUT));
        }
    }, [notifications, updateNotificationStatus, shouldShowCollections]);
    useEffect(() => {
        return () => {
            delayTimers.current.forEach((timer) => window.clearTimeout(timer));
        };
    }, []);
    useLiveItemSubscription(pendingAcceptedItemNotifications, useCallback((listResults: VaultLiveListResults) => {
        const itemIdsInVault = listResults.items.map(({ id }) => id);
        const anyItems = itemIdsInVault.length > 0 &&
            pendingAcceptedItemNotifications.length > 0;
        if (anyItems) {
            const notificationsConfirmedInVault = pendingAcceptedItemNotifications.filter((notification) => notification.itemGroup.items.some((item) => itemIdsInVault.includes(item.Id)));
            updateNotificationStatus(notificationsConfirmedInVault.map(({ id }) => id), NotificationStatus.Accepted);
        }
    }, [pendingAcceptedItemNotifications, updateNotificationStatus]));
    useLiveItemSubscription(acceptedItemNotifications, useCallback((listResults: VaultLiveListResults) => {
        const noteIdsInVault = listResults.items.map(({ id }) => id);
        if (acceptedItemNotifications.length > 0) {
            const notificationsMissingInVault = acceptedItemNotifications.filter((notification) => !notification.itemGroup.items.some((item) => noteIdsInVault.includes(item.Id)));
            removeSharingNotifications(notificationsMissingInVault.map(({ id }) => id));
        }
    }, [acceptedItemNotifications, removeSharingNotifications]));
    const markExistingItemsAsAccepted = useCallback(async (itemGroupIds: string[], allItemNotifications: SharedItemNotification[]) => {
        const justSucceededNotifications = allItemNotifications.filter(({ id }) => itemGroupIds.includes(id));
        const itemIds = getItemIdsByKwType(justSucceededNotifications, 'KWAuthentifiant');
        const matchedCredentialsInVault = await Promise.all(itemIds.map((id) => carbonConnector.getCredential(id)));
        const existingItemsIdsInVault = matchedCredentialsInVault
            .filter((credential) => credential)
            .map(({ id }) => id);
        if (existingItemsIdsInVault.length === 0) {
            return;
        }
        const confirmedNotifications = allItemNotifications.filter((notification) => notification.itemGroup.items.some((item) => existingItemsIdsInVault.includes(item.Id)));
        if (confirmedNotifications.length === 0) {
            return;
        }
        const confirmedIds = confirmedNotifications.map(({ id }) => id);
        delayTimers.current.push(window.setTimeout(() => {
            updateNotificationStatus(confirmedIds, NotificationStatus.Accepted);
        }, TEMPORARY_STATUS_TIMEOUT));
    }, [updateNotificationStatus]);
    const handleSharingResponse = useCallback((result: SharingResponseResult) => {
        const { status, itemGroups, userGroups } = result;
        const allSuccessIds = [...itemGroups.successes, ...userGroups.successes];
        const allFailureIds = [...itemGroups.failures, ...userGroups.failures];
        switch (status) {
            case SharingResponseStatus.Accept:
                updateNotificationStatus(allSuccessIds, NotificationStatus.AcceptJustSucceeded);
                updateNotificationStatus(allFailureIds, NotificationStatus.AcceptFailed);
                if (itemGroups.successes.length > 0) {
                    markExistingItemsAsAccepted(itemGroups.successes, itemNotifications);
                }
                break;
            case SharingResponseStatus.Refuse:
                updateNotificationStatus(allSuccessIds, NotificationStatus.Refused);
                updateNotificationStatus(allFailureIds, NotificationStatus.RefusalFailed);
                break;
        }
        if (allFailureIds.length > 0) {
            delayTimers.current.push(window.setTimeout(() => {
                updateNotificationStatus(allFailureIds, NotificationStatus.Pending);
            }, TEMPORARY_STATUS_TIMEOUT));
        }
    }, [markExistingItemsAsAccepted, itemNotifications, updateNotificationStatus]);
    const updateNotificationWithFailureTransition = useCallback((failedNotificationIds: string[], status: NotificationStatus.AcceptFailed | NotificationStatus.RefusalFailed) => {
        updateNotificationStatus(failedNotificationIds, status);
        if (failedNotificationIds.length > 0) {
            delayTimers.current.push(window.setTimeout(() => {
                updateNotificationStatus(failedNotificationIds, NotificationStatus.Pending);
            }, TEMPORARY_STATUS_TIMEOUT));
        }
    }, [updateNotificationStatus]);
    const handleSharingAccept = (notificationId: string, responseIsSuccessful: boolean) => {
        if (responseIsSuccessful) {
            updateNotificationStatus([notificationId], NotificationStatus.AcceptJustSucceeded);
            delayTimers.current.push(window.setTimeout(() => {
                updateNotificationStatus([notificationId], NotificationStatus.Accepted);
            }, TEMPORARY_STATUS_TIMEOUT));
        }
        else {
            updateNotificationWithFailureTransition([notificationId], NotificationStatus.AcceptFailed);
        }
    };
    const handleSharingRefuse = (notificationId: string, responseIsSuccessful: boolean) => {
        if (responseIsSuccessful) {
            updateNotificationStatus([notificationId], NotificationStatus.Refused);
        }
        else {
            updateNotificationWithFailureTransition([notificationId], NotificationStatus.RefusalFailed);
        }
    };
    const sharingResponseRef = useRef<CarbonUnsubscribe>();
    useEffect(() => {
        sharingResponseRef.current = carbonConnector.sendSharingResponseResult.on(handleSharingResponse);
        return () => {
            sharingResponseRef.current?.();
        };
    }, [handleSharingResponse]);
    const softDeclineNotification = (notificationId: string) => {
        updateNotificationStatus([notificationId], NotificationStatus.ConfirmRefusal);
    };
    const cancelDeclineNotification = (notificationId: string) => {
        updateNotificationStatus([notificationId], NotificationStatus.Pending);
    };
    const removeNotification = (notificationId: string) => {
        removeSharingNotifications([notificationId]);
    };
    const acceptPendingItemGroup = (itemGroupId: string) => {
        const itemNotificationsToAccept = itemNotifications.filter((notification) => notification.itemGroup.itemGroupId === itemGroupId);
        updateNotificationStatus([itemGroupId], NotificationStatus.AcceptInProgress);
        sendSharingResponse(SharingResponseStatus.Accept, getItemGroupSharingResponseData(itemNotificationsToAccept), []);
    };
    const confirmRefusePendingItemGroup = async (itemGroupId: string) => {
        updateNotificationStatus([itemGroupId], NotificationStatus.RefusalInProgress);
        const itemNotificationToRefuse = itemNotifications.find((notification) => notification.itemGroup.itemGroupId === itemGroupId);
        if (itemNotificationToRefuse === undefined) {
            return;
        }
        try {
            const response = await refuseItemGroupInvite({
                itemGroupId,
            });
            if (isSuccess(response)) {
                updateNotificationStatus([itemGroupId], NotificationStatus.Refused);
            }
            else {
                updateNotificationWithFailureTransition([itemGroupId], NotificationStatus.RefusalFailed);
            }
        }
        catch (error) {
            updateNotificationWithFailureTransition([itemGroupId], NotificationStatus.RefusalFailed);
        }
    };
    const acceptPendingUserGroup = (userGroupId: string) => {
        updateNotificationStatus([userGroupId], NotificationStatus.AcceptInProgress);
        sendSharingResponse(SharingResponseStatus.Accept, [], [userGroupId]);
    };
    const confirmRefusePendingUserGroup = async (userGroupId: string) => {
        updateNotificationStatus([userGroupId], NotificationStatus.RefusalInProgress);
        try {
            const response = await refuseUserGroupInvite({
                userGroupId: userGroupId,
            });
            if (isSuccess(response)) {
                updateNotificationStatus([userGroupId], NotificationStatus.Refused);
            }
            else {
                updateNotificationWithFailureTransition([userGroupId], NotificationStatus.RefusalFailed);
            }
        }
        catch (error) {
            updateNotificationWithFailureTransition([userGroupId], NotificationStatus.RefusalFailed);
        }
    };
    const acceptPendingCollection = async (collectionId: string, setToInProgress = true) => {
        if (setToInProgress) {
            updateNotificationStatus([collectionId], NotificationStatus.AcceptInProgress);
        }
        const result = await acceptCollectionInvite({
            collectionId,
        });
        if (isFailure(result)) {
            handleSharingAccept(collectionId, false);
        }
        else {
            handleSharingAccept(collectionId, true);
        }
    };
    const refusePendingCollection = async (collectionId: string) => {
        updateNotificationStatus([collectionId], NotificationStatus.RefusalInProgress);
        const result = await refuseCollectionInvite({
            collectionId,
        });
        if (isFailure(result)) {
            handleSharingRefuse(collectionId, false);
        }
        else {
            handleSharingRefuse(collectionId, true);
        }
        sync({
            trigger: Trigger.Sharing,
        });
    };
    const enabledNotifications = shouldShowCollections
        ? notifications
        : notifications.filter((notification) => !isSharedCollectionNotification(notification));
    const acceptAll = () => {
        const pendingNotifications = enabledNotifications.filter(isNotificationPending);
        const pendingNotificationIds = pendingNotifications.map(({ id }) => id);
        if (pendingNotificationIds.length === 0) {
            return;
        }
        updateNotificationStatus(pendingNotificationIds, NotificationStatus.AcceptInProgress);
        const pendingItemGroupNotifications = pendingNotifications.filter(isSharedItemNotification);
        const pendingUserGroupNotifications = pendingNotifications.filter(isGroupInviteNotification);
        sendSharingResponse(SharingResponseStatus.Accept, getItemGroupSharingResponseData(pendingItemGroupNotifications), pendingUserGroupNotifications.map(({ id }) => id));
        if (shouldShowCollections) {
            const pendingCollectionNotifications = pendingNotifications.filter(isSharedCollectionNotification);
            for (const pendingCollectionNotification of pendingCollectionNotifications) {
                acceptPendingCollection(pendingCollectionNotification.id, false);
            }
        }
    };
    const visibleNotifications = enabledNotifications.filter(isNotificationVisible);
    const anyVisibleNotifications = visibleNotifications.length > 0;
    const visibleItemNotifications = visibleNotifications.filter(isSharedItemNotification);
    const anyVisibleItemNotifications = visibleItemNotifications.length > 0;
    const visibleGroupNotifications = visibleNotifications.filter(isGroupInviteNotification);
    const anyVisibleGroupNotifications = visibleGroupNotifications.length > 0;
    const visibleCollectionNotifications = visibleNotifications.filter(isSharedCollectionNotification);
    const anyVisibleCollectionNotifications = visibleCollectionNotifications.length > 0;
    const showSectionHeaders = [
        anyVisibleItemNotifications,
        anyVisibleGroupNotifications,
        anyVisibleCollectionNotifications,
    ].filter(Boolean).length >= 2;
    const showAcceptAllButton = visibleNotifications.some(isNotificationAcceptable);
    return (<>
      {props.fullPage ? (<Header endWidget={<>
              <HeaderAccountMenu />
              <NotificationsDropdown />
            </>} data-testid="sharing-notifications-fullpage-header"/>) : null}
      <div sx={props.fullPage ? mergeSx([containerSx, fullPageSx]) : containerSx}>
        {anyVisibleNotifications ? (<div sx={!props.fullPage ? notificationsWrapperSx : undefined} data-testid="pending-invitations-list">
            <FlexContainer flexDirection="row" justifyContent="space-between" alignItems="center" sx={{ padding: '32px 32px 16px' }}>
              <Heading size="small" color="black" sx={{ marginBottom: 4, fontWeight: 'bold' }}>
                {translate(I18N_KEYS.HEADER)}
              </Heading>
              {showAcceptAllButton ? (<Button mood="brand" size="small" onClick={acceptAll}>
                  {translate(I18N_KEYS.ACCEPT_ALL)}
                </Button>) : null}
            </FlexContainer>
            {anyVisibleGroupNotifications ? (<div>
                {showSectionHeaders ? (<div sx={{ paddingLeft: '32px', marginBottom: 2 }}>
                    <Eyebrow color="ds.text.neutral.quiet">
                      {translate(I18N_KEYS.GROUPS)}
                    </Eyebrow>
                  </div>) : null}
                <ul sx={{ marginBottom: 6 }}>
                  <TransitionGroup>
                    {visibleGroupNotifications.map((groupNotification) => (<CSSTransition key={groupNotification.userGroup.groupId} classNames={{ ...disappear }} timeout={150} enter={false} unmountOnExit={true}>
                        <PendingGroupRow key={groupNotification.userGroup.groupId} notification={groupNotification} acceptPendingUserGroup={acceptPendingUserGroup} refusePendingUserGroup={softDeclineNotification} cancelRefusePendingUserGroup={cancelDeclineNotification} confirmRefusePendingUserGroup={confirmRefusePendingUserGroup} removeUnsharedUserGroup={removeNotification}/>
                      </CSSTransition>))}
                  </TransitionGroup>
                </ul>
              </div>) : null}
            {anyVisibleCollectionNotifications ? (<div>
                {showSectionHeaders ? (<div sx={{ paddingLeft: '32px', marginBottom: 2 }}>
                    <Eyebrow color="ds.text.neutral.quiet">
                      {translate(I18N_KEYS.COLLECTIONS)}
                    </Eyebrow>
                  </div>) : null}
                <ul sx={{ marginBottom: 6 }}>
                  <TransitionGroup>
                    {visibleCollectionNotifications.map((collectionNotification) => (<CSSTransition key={collectionNotification.collection.uuid} classNames={{ ...disappear }} timeout={150} enter={false} unmountOnExit={true}>
                          <PendingCollectionRow key={collectionNotification.collection.uuid} notification={collectionNotification} acceptPendingCollection={acceptPendingCollection} refusePendingCollection={softDeclineNotification} cancelRefusePendingCollection={cancelDeclineNotification} confirmRefusePendingCollection={refusePendingCollection} removeUnsharedCollection={removeNotification} routes={routes}/>
                        </CSSTransition>))}
                  </TransitionGroup>
                </ul>
              </div>) : null}
            {anyVisibleItemNotifications ? (<div>
                {showSectionHeaders ? (<div sx={{ paddingLeft: '32px', marginBottom: 2 }}>
                    <Eyebrow color="ds.text.neutral.quiet">
                      {translate(I18N_KEYS.PASSWORDS_AND_SECURE_NOTES)}
                    </Eyebrow>
                  </div>) : null}
                <ul sx={{ marginBottom: 6 }}>
                  <TransitionGroup>
                    {visibleItemNotifications.map((itemNotification) => (<CSSTransition key={itemNotification.itemGroup.itemGroupId} classNames={{ ...disappear }} timeout={150} enter={false} unmountOnExit={true}>
                        <PendingItemRow key={itemNotification.itemGroup.itemGroupId} notification={itemNotification} acceptPendingItemGroup={acceptPendingItemGroup} refusePendingItemGroup={softDeclineNotification} cancelRefusePendingItemGroup={cancelDeclineNotification} confirmRefusePendingItemGroup={confirmRefusePendingItemGroup} removeUnsharedItem={removeNotification} routes={routes}/>
                      </CSSTransition>))}
                  </TransitionGroup>
                </ul>
              </div>) : null}
          </div>) : (<SharingNotificationsEmpty isLoading={isLoading} fullPage={props.fullPage}/>)}
      </div>
    </>);
};
