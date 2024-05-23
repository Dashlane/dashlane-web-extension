import { useEffect } from 'react';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { useTeamTasksCompletion } from '../use-team-tasks-completion';
import { useHasSeenNotification } from '../use-has-seen-notification';
import { useGetStartedNotification } from './use-get-started-notification';
import { GetStartedTaskName } from '../../tasks/types';
import { logTACGetStartedTaskCompletion, OnboardingTask } from './logs';
export const useCheckPasswordHealthNotification = () => {
    const name = GetStartedTaskName.CHECK_PASSWORD_HEALTH;
    const { showNotification, hasDataLoaded: notificationDataLoaded } = useGetStartedNotification('team_get_started_notification_content_check_password_health_markup', true);
    const { status: hasSeenNotificationStatus, hasSeenNotification, markNotificationAsSeen, } = useHasSeenNotification(name);
    const { hasSecurityScore, status: teamTasksCompletionStatus } = useTeamTasksCompletion();
    const hasDataLoaded = notificationDataLoaded &&
        teamTasksCompletionStatus === DataStatus.Success &&
        hasSeenNotificationStatus === DataStatus.Success;
    useEffect(() => {
        if (hasDataLoaded && !hasSeenNotification && hasSecurityScore) {
            showNotification();
            markNotificationAsSeen();
            logTACGetStartedTaskCompletion(OnboardingTask.VisitDashboardPasswordHealth);
        }
    }, [hasSecurityScore, hasSeenNotification, hasDataLoaded]);
};
