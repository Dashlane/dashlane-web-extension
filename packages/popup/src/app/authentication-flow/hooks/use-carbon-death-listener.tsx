import { CarbonLifecycleEvent, useCarbonLifecycleEvents, } from '@dashlane/carbon-api-consumers';
export const useCarbonDeathListener = (callback: () => void) => {
    useCarbonLifecycleEvents((event: CarbonLifecycleEvent) => {
        if (event === CarbonLifecycleEvent.KILLED) {
            callback();
        }
    }, []);
};
