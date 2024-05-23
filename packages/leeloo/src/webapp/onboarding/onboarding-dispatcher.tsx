import { jsx } from '@dashlane/design-system';
import { DataStatus } from '@dashlane/framework-react';
import { Lee } from 'lee';
import { useShouldDisplayAdminVaultGetStartedGuide } from 'team/settings/hooks/use-display-admin-vault-getstarted';
import { Loader } from 'team/components/loader';
import { GetStarted } from './get-started/get-started';
import { OnboardingSteps } from './onboarding-steps/onboarding-steps';
export const OnboardingDispatcher = ({ lee }: {
    lee: Lee;
}) => {
    const shouldDisplayAdminGuide = useShouldDisplayAdminVaultGetStartedGuide();
    if (shouldDisplayAdminGuide.status !== DataStatus.Success) {
        return <Loader />;
    }
    return shouldDisplayAdminGuide.shouldDisplayAdminVaultGetStartedGuide ? (<GetStarted />) : (<OnboardingSteps lee={lee}/>);
};
