import { useEffect } from 'react';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { useTeamTasksCompletion } from '../use-team-tasks-completion';
import { useHasSeenNotification } from '../use-has-seen-notification';
import { useGetStartedNotification } from './use-get-started-notification';
import { GetStartedTaskName } from '../../tasks/types';
import { logTACGetStartedTaskCompletion, OnboardingTask } from './logs';
export const useAssignAdminNotification = () => {
    const name = GetStartedTaskName.ASSIGN_ADMIN;
    const { showNotification, hasDataLoaded: notificationDataLoaded } = useGetStartedNotification('team_get_started_notification_content_assign_admin_markup', true);
    const { status: hasSeenNotificationStatus, hasSeenNotification, markNotificationAsSeen, } = useHasSeenNotification(name);
    const { hasMoreThanOneAdmin, status: teamTasksCompletionStatus } = useTeamTasksCompletion();
    const hasDataLoaded = notificationDataLoaded &&
        teamTasksCompletionStatus === DataStatus.Success &&
        hasSeenNotificationStatus === DataStatus.Success;
    useEffect(() => {
        if (hasDataLoaded && !hasSeenNotification && hasMoreThanOneAdmin) {
            showNotification();
            markNotificationAsSeen();
            logTACGetStartedTaskCompletion(OnboardingTask.AssignNewAdmin);
        }
    }, [hasMoreThanOneAdmin, hasSeenNotification, hasDataLoaded]);
};
