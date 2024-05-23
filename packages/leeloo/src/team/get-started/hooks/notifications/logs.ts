import { OnboardingTask, UserCompleteOnboardingTaskEvent, } from '@dashlane/hermes';
import { logEvent } from 'libs/logs/logEvent';
export { OnboardingTask };
export const logTACGetStartedTaskCompletion = (task: OnboardingTask) => {
    logEvent(new UserCompleteOnboardingTaskEvent({
        onboardingTask: task,
    }));
};
