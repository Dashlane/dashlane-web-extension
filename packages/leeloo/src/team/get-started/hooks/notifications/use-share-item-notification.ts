import { useEffect } from 'react';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { useTeamTasksCompletion } from '../use-team-tasks-completion';
import { useHasSeenNotification } from '../use-has-seen-notification';
import { useHasSharedAnItemWithAGroup } from '../use-has-shared-an-item-with-a-group';
import { useGetStartedNotification } from './use-get-started-notification';
import { GetStartedTaskName } from '../../tasks/types';
import { logTACGetStartedTaskCompletion, OnboardingTask } from './logs';
export const useShareItemNotification = () => {
    const name = GetStartedTaskName.SHARE_ITEM;
    const { showNotification, hasDataLoaded: notificationDataLoaded } = useGetStartedNotification('team_get_started_notification_content_share_item_markup', true);
    const { status: hasSeenNotificationStatus, hasSeenNotification, markNotificationAsSeen, } = useHasSeenNotification(name);
    const { isSharingDisabled, status: teamTasksCompletionStatus } = useTeamTasksCompletion();
    const { hasSharedAnItemWithAGroup = false, status: hasSharedAnItemWithAGroupStatus, } = useHasSharedAnItemWithAGroup();
    const hasDataLoaded = notificationDataLoaded &&
        teamTasksCompletionStatus === DataStatus.Success &&
        hasSeenNotificationStatus === DataStatus.Success &&
        hasSharedAnItemWithAGroupStatus === DataStatus.Success;
    useEffect(() => {
        if (hasDataLoaded &&
            !hasSeenNotification &&
            !isSharingDisabled &&
            hasSharedAnItemWithAGroup) {
            showNotification();
            markNotificationAsSeen();
            logTACGetStartedTaskCompletion(OnboardingTask.ShareItem);
        }
    }, [
        isSharingDisabled,
        hasSeenNotification,
        hasSharedAnItemWithAGroup,
        hasDataLoaded,
    ]);
};
