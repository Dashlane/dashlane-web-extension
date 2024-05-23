import { DataStatus } from '@dashlane/carbon-api-consumers';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import { useFeatureFlips } from '@dashlane/framework-react';
export const useIsChangeMasterPasswordEnabled = () => {
    const isChangeMPEnabled = useFeatureFlips();
    return (isChangeMPEnabled.status === DataStatus.Success &&
        isChangeMPEnabled.data[FEATURE_FLIPS_WITHOUT_MODULE
            .WebproductExtensionActivateChangeMasterPasswordRelease]);
};
