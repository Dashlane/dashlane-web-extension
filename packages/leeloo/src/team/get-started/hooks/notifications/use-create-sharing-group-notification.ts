import { useEffect } from 'react';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { useTeamTasksCompletion } from '../use-team-tasks-completion';
import { useHasSeenNotification } from '../use-has-seen-notification';
import { useGetStartedNotification } from './use-get-started-notification';
import { useHasSharedGroupWithMembers } from '../use-has-shared-group-with-members';
import { GetStartedTaskName } from '../../tasks/types';
import { logTACGetStartedTaskCompletion, OnboardingTask } from './logs';
export const useCreateSharingGroupNotification = () => {
    const name = GetStartedTaskName.CREATE_SHARING_GROUP;
    const { showNotification, hasDataLoaded: notificationDataLoaded } = useGetStartedNotification('team_get_started_notification_content_create_sharing_group_markup', true);
    const { status: hasSeenNotificationStatus, hasSeenNotification, markNotificationAsSeen, } = useHasSeenNotification(name);
    const { isSharingDisabled, status: teamTasksCompletionStatus } = useTeamTasksCompletion();
    const { hasSharedGroupWithMembers = false, status: hasSharedGroupWithMembersStatus, } = useHasSharedGroupWithMembers();
    const hasDataLoaded = notificationDataLoaded &&
        teamTasksCompletionStatus === DataStatus.Success &&
        hasSeenNotificationStatus === DataStatus.Success &&
        hasSharedGroupWithMembersStatus === DataStatus.Success;
    useEffect(() => {
        if (hasDataLoaded &&
            !hasSeenNotification &&
            !isSharingDisabled &&
            hasSharedGroupWithMembers) {
            showNotification();
            markNotificationAsSeen();
            logTACGetStartedTaskCompletion(OnboardingTask.CreateSharingGroup);
        }
    }, [
        isSharingDisabled,
        hasSeenNotification,
        hasSharedGroupWithMembers,
        hasDataLoaded,
    ]);
};
