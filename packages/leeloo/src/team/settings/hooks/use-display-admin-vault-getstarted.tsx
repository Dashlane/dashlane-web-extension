import { DataStatus, useFeatureFlips } from '@dashlane/framework-react';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import { useIsTeamCreator } from 'team/get-started/hooks/use-is-team-creator';
import { useHasDismissedGetStarted } from 'webapp/onboarding/get-started/hooks/use-get-started-dismissed';
import { useTeamCreationDate } from '../../hooks/use-team-creation-date-unix';
const TEAM_CREATION_DATE_LIMIT = 1669034116;
export type UseShouldDisplayAdminVaultGetStartedGuide = {
    status: DataStatus.Error | DataStatus.Loading;
} | {
    status: DataStatus.Success;
    shouldDisplayAdminVaultGetStartedGuide: boolean;
};
export const useShouldDisplayAdminVaultGetStartedGuide = (): UseShouldDisplayAdminVaultGetStartedGuide => {
    const featuresResponse = useFeatureFlips();
    const featuresNotReady = featuresResponse.status !== DataStatus.Success;
    const { [FEATURE_FLIPS_WITHOUT_MODULE.OnboardingWebAdminVaultGetStartedGuide]: hasVaultGetStartedPageFF = false, } = featuresNotReady ? {} : featuresResponse.data;
    const hasDismissedGetStarted = useHasDismissedGetStarted();
    const teamCreationDate = useTeamCreationDate();
    const isTeamCreator = useIsTeamCreator();
    if (featuresResponse.status === DataStatus.Error ||
        hasDismissedGetStarted.status === DataStatus.Error ||
        teamCreationDate.status === DataStatus.Error ||
        isTeamCreator.status === DataStatus.Error) {
        return {
            status: DataStatus.Success,
            shouldDisplayAdminVaultGetStartedGuide: false,
        };
    }
    if (featuresResponse.status !== DataStatus.Success ||
        hasDismissedGetStarted.status !== DataStatus.Success ||
        teamCreationDate.status !== DataStatus.Success ||
        isTeamCreator.status !== DataStatus.Success) {
        return { status: DataStatus.Loading };
    }
    const shouldDisplayAdminVaultGetStartedGuide = hasVaultGetStartedPageFF &&
        !hasDismissedGetStarted.isGetStartedDismissed &&
        teamCreationDate.teamCreationDate >= TEAM_CREATION_DATE_LIMIT &&
        (isTeamCreator.isTeamCreator ?? false);
    return {
        status: DataStatus.Success,
        shouldDisplayAdminVaultGetStartedGuide,
    };
};
