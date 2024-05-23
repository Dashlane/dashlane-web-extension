import { DataStatus } from '@dashlane/carbon-api-consumers';
import { Feature } from '@dashlane/communication';
import { useFeatureFlips } from '@dashlane/framework-react';
export const useHasFeatureEnabled = (feature: Feature): boolean => {
    const retrievedFFStatus = useFeatureFlips();
    return retrievedFFStatus.status === DataStatus.Success
        ? !!retrievedFFStatus.data[feature]
        : false;
};
