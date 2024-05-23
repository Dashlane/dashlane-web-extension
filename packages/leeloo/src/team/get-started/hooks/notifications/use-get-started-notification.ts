import { useCallback } from 'react';
import { useToast } from '@dashlane/design-system';
import { NotificationName } from '@dashlane/communication';
import { DataStatus, useFeatureFlips } from '@dashlane/framework-react';
import { useNotificationInteracted } from 'libs/carbon/hooks/useNotificationStatus';
import useTranslate from 'libs/i18n/useTranslate';
import { useHistory, useRouterGlobalSettingsContext } from 'libs/router';
import { useIsTeamAdmin } from '../use-is-team-admin';
const I18N_KEYS = {
    NOTIFICATION_ACTION_GO_TO_GET_STARTED: 'team_get_started_notification_action_go_to_get_started',
    NOTIFICATION_CLOSE_LABEL: 'team_get_started_notification_close_label',
};
export const useGetStartedNotification = (lokaliseDescriptionKey: string, showGetStartedAction = false) => {
    const history = useHistory();
    const routeContext = useRouterGlobalSettingsContext();
    const { translate } = useTranslate();
    const { showToast, closeToast } = useToast();
    const featuresResponse = useFeatureFlips();
    const featuresNotReady = featuresResponse.status !== DataStatus.Success;
    const { onboarding_web_tacgetstarted: hasTacOnboardingFF = false } = featuresNotReady ? {} : featuresResponse.data;
    const { interacted: isGetStartedDismissed, status: getStartedDismissedStatus, } = useNotificationInteracted(NotificationName.TacGetStartedDismissPage);
    const { isTeamAdmin, status: isTeamAdminStatus } = useIsTeamAdmin();
    const hasDataLoaded = isTeamAdminStatus === DataStatus.Success &&
        getStartedDismissedStatus === DataStatus.Success &&
        !featuresNotReady;
    const showNotification = useCallback(() => {
        if (hasDataLoaded &&
            isTeamAdmin &&
            !isGetStartedDismissed &&
            hasTacOnboardingFF) {
            showToast({
                isManualDismiss: true,
                description: translate.markup(lokaliseDescriptionKey),
                closeActionLabel: translate(I18N_KEYS.NOTIFICATION_CLOSE_LABEL),
                action: showGetStartedAction
                    ? {
                        label: translate(I18N_KEYS.NOTIFICATION_ACTION_GO_TO_GET_STARTED),
                        onClick: (id) => {
                            closeToast(id);
                            history.push(routeContext.routes.teamGetStartedRoutePath);
                        },
                    }
                    : undefined,
            });
        }
    }, [hasDataLoaded, isTeamAdmin, isGetStartedDismissed, hasTacOnboardingFF]);
    return {
        showNotification,
        hasDataLoaded,
    };
};
