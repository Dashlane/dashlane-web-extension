import { useEffect } from 'react';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { GetStartedTaskName } from '../../tasks/types';
import { useTeamTasksCompletion } from '../use-team-tasks-completion';
import { useHasSeenNotification } from '../use-has-seen-notification';
import { useGetStartedNotification } from './use-get-started-notification';
import { logTACGetStartedTaskCompletion, OnboardingTask } from './logs';
export const useInviteMembersNotification = () => {
    const name = GetStartedTaskName.INVITE_MEMBERS;
    const { showNotification, hasDataLoaded: notificationDataLoaded } = useGetStartedNotification('team_get_started_notification_content_invite_members_markup', true);
    const { status: hasSeenNotificationStatus, hasSeenNotification, markNotificationAsSeen, } = useHasSeenNotification(name);
    const { hasMinimumMemberCount, status: teamTasksCompletionStatus } = useTeamTasksCompletion();
    const hasDataLoaded = notificationDataLoaded &&
        teamTasksCompletionStatus === DataStatus.Success &&
        hasSeenNotificationStatus === DataStatus.Success;
    useEffect(() => {
        if (hasDataLoaded && !hasSeenNotification && hasMinimumMemberCount) {
            showNotification();
            markNotificationAsSeen();
            logTACGetStartedTaskCompletion(OnboardingTask.InvitePlanMembers);
        }
    }, [hasMinimumMemberCount, hasSeenNotification, hasDataLoaded]);
};
